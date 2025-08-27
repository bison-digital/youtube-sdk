import { YouTubeOAuthCredentials, TokenRefreshResponse } from './types/oauth.js'
import { YouTubeAPIError } from './types/youtube-api.js'

export class SdkClientBase {
  credentials: YouTubeOAuthCredentials
  readonly clientId: string
  readonly clientSecret: string

  constructor(credentials: YouTubeOAuthCredentials, clientId: string, clientSecret: string) {
    this.credentials = credentials
    this.clientId = clientId
    this.clientSecret = clientSecret
  }

  /**
   * Check if the access token needs to be refreshed
   */
  isTokenExpired(): boolean {
    // Refresh if token expires in less than 5 minutes
    return Date.now() >= this.credentials.expires_at - 300000
  }

  /**
   * Refresh the access token using the refresh token
   */
  async refreshAccessToken(): Promise<YouTubeOAuthCredentials> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: this.credentials.refresh_token,
        grant_type: 'refresh_token'
      }).toString()
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to refresh token: ${error}`)
    }

    const data: TokenRefreshResponse = await response.json()

    // Update credentials with new access token and expiry
    this.credentials = {
      ...this.credentials,
      access_token: data.access_token,
      expires_at: Date.now() + data.expires_in * 1000
    }

    return this.credentials
  }

  /**
   * Make an authenticated request to the YouTube API
   */
  async makeRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
    // Check and refresh token if needed
    if (this.isTokenExpired()) {
      await this.refreshAccessToken()
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${this.credentials.access_token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.status === 401) {
      // Token might have been revoked, try refreshing once
      await this.refreshAccessToken()

      // Retry the request with new token
      const retryResponse = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${this.credentials.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!retryResponse.ok) {
        const error = await retryResponse.text()
        throw new Error(`YouTube API error (${retryResponse.status} ${retryResponse.statusText}): ${error}`)
      }

      return retryResponse.json()
    }

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`YouTube API error (${response.status} ${response.statusText}): ${error}`)
    }

    return response.json()
  }

  /**
   * Get updated credentials after potential refresh
   */
  getCredentials(): YouTubeOAuthCredentials {
    return this.credentials
  }

  toQuery(params?: Record<string, string | number | undefined>): string {
    if (!params || Object.keys(params).length === 0) {
      return ''
    }

    const entries = Object.entries(params)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => [key, `${value}`])

    const queryParams = new URLSearchParams(entries)

    return `?${queryParams.toString()}`
  }
}