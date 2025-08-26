import type { OperationInsertableArgs, OasOperation, ListLines } from 'jsr:@skmtc/core@^0.0.732'
import { List } from 'jsr:@skmtc/core@^0.0.732'
import { BasicSdkBase } from './base.ts'
import { Route } from './Route.ts'

export class BasicSdk extends BasicSdkBase {
  routes: ListLines<Route>
  constructor({ context, operation, settings }: OperationInsertableArgs) {
    super({ context, operation, settings })

    this.routes = List.toLines([])

    this.register({
      imports: {
        './SdkClientBase.ts': ['SdkClientBase']
      }
    })
  }

  append(operation: OasOperation) {
    this.routes.values.push(
      new Route({
        context: this.context,
        operation,
        destinationPath: this.settings.exportPath
      })
    )
  }

  override toString(): string {
    return `class YouTubeClient extends SdkClientBase {
${this.routes}
  }`
  }
}
