import { Identifier, toOperationBase } from 'jsr:@skmtc/core@^0.0.732'
import { join } from 'jsr:@std/path@^1.0.6'

export const BasicSdkBase = toOperationBase({
  id: '@skmtc/gen-basic-sdk',

  toIdentifier(): Identifier {
    return Identifier.createVariable('YouTubeClient')
  },

  toExportPath(): string {
    return join('@', `YouTubeClient.generated.ts`)
  }
})
