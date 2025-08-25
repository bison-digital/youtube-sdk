export interface YouTubeOAuthCredentials {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  scope: string;
  token_type: string;
}

export interface TokenRefreshResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}