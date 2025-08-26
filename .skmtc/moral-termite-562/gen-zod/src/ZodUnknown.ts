import { ContentBase, type GeneratorKey, type GenerateContext } from 'jsr:@skmtc/core@^0.0.732'

type ConstructorArgs = {
  context: GenerateContext
  destinationPath: string
  generatorKey: GeneratorKey
}

export class ZodUnknown extends ContentBase {
  type = 'unknown' as const

  constructor({ context, destinationPath, generatorKey }: ConstructorArgs) {
    super({ context, generatorKey })

    context.register({ imports: { zod: ['z'] }, destinationPath })
  }

  override toString(): string {
    return `z.unknown()`
  }
}
