import {
  camelCase,
  ContentBase,
  decapitalize,
  toMethodVerb,
  List,
  toPathTemplate,
  capitalize,
  OasObject,
  Identifier
} from 'jsr:@skmtc/core@^0.0.732'
import type { GenerateContext, OasOperation, ListObject } from 'jsr:@skmtc/core@^0.0.732'
import { Response } from './Response.ts'
import { toTsValue, TsInsertable } from '@skmtc/gen-typescript'

type RouteArgs = {
  context: GenerateContext
  operation: OasOperation
  destinationPath: string
}

export class Route extends ContentBase {
  operation: OasOperation
  response: Response
  serviceName: string
  serviceArgs: ListObject<string>
  queryArgs: ListObject<string>
  hasBody: boolean = false
  argsTypeName: string

  constructor({ context, operation, destinationPath }: RouteArgs) {
    super({ context })

    this.operation = operation

    const pathName = camelCase(operation.path, { upperFirst: true })

    this.serviceName = decapitalize(`${toMethodVerb(operation.method)}${pathName}Api`)

    const responseSchema = operation.toSuccessResponse()?.resolve().toSchema()
    const pathEntries = operation.toParams(['path']).map(({ name, schema }) => [name, schema])
    const queryEntries = operation.toParams(['query']).map(({ name, schema }) => [name, schema])

    this.queryArgs = List.toObject(queryEntries.map(([name]) => name))

    const combinedParams = List.toObject(
      pathEntries.map(([name]) => name).concat(queryEntries.map(([name]) => name))
    )

    const requestBodySchema = operation.toRequestBody(({ schema }) => schema)

    const paramsType = Object.fromEntries([...pathEntries, ...queryEntries])

    const typeArgsSchema = new OasObject({
      properties: {
        params: new OasObject({ properties: paramsType })
      },
      required: ['params']
    })

    if (requestBodySchema) {
      this.hasBody = true

      context.insertNormalisedModel(TsInsertable, {
        schema: requestBodySchema,
        fallbackName: capitalize(`${this.serviceName}Request`),
        destinationPath
      })
    }

    const args = []

    if (requestBodySchema) {
      args.push(`body`)
      typeArgsSchema.properties!.body = requestBodySchema
      typeArgsSchema.required!.push('body')
    }

    if (combinedParams.values.length > 0) {
      args.push(`params: ${combinedParams}`)
    }

    const argsTypeValue = toTsValue({
      context,
      destinationPath,
      schema: typeArgsSchema,
      required: true
    })

    this.argsTypeName = capitalize(`${this.serviceName}Args`)

    context.defineAndRegister({
      identifier: Identifier.createType(this.argsTypeName),
      value: argsTypeValue,
      destinationPath
    })

    this.serviceArgs = List.toObject(args)

    this.response = new Response({
      context,
      serviceName: this.serviceName,
      serviceArgs: this.serviceArgs,
      responseSchema,
      destinationPath
    })
  }

  override toString(): string {
    const responseType = 'tsResponseName' in this.response ? this.response.tsResponseName : 'void'

    return `async ${this.serviceName}(${this.serviceArgs}: ${
      this.argsTypeName
    }): Promise<${responseType}> {
    const url = \`${toPathTemplate(this.operation.path)}\${this.toQuery(${this.queryArgs})}\`

		return this.makeRequest<${responseType}>(url, {
			method: '${this.operation.method.toUpperCase()}',
			${this.hasBody ? 'body: JSON.stringify(body)' : ''}
		});
	}`
  }
}
