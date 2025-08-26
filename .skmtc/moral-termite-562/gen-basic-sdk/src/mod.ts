import invariant from 'npm:tiny-invariant@^1.3.3'
import { BasicSdk } from './BasicSdk.ts'
import { toOperationEntry } from 'jsr:@skmtc/core@^0.0.732'

export const BasicSdkEntry = toOperationEntry({
  id: '@skmtc/gen-basic-sdk',
  transform: ({ context, operation }) => {
    const app =
      context.findDefinition({
        name: 'YouTubeClient',
        exportPath: BasicSdk.toExportPath(operation)
      }) ?? context.insertOperation(BasicSdk, operation).definition

    invariant(app?.value instanceof BasicSdk, 'YouTubeClient must be an instance of BasicSdk')

    app.value.append(operation)
  }
})
