import { type GenerateContext, ContentBase, type GeneratorKey } from 'jsr:@skmtc/core@^0.0.732'

type ConstructorArgs = {
  context: GenerateContext
  generatorKey: GeneratorKey
  destinationPath: string
}

export class ZodVoid extends ContentBase {
  type = 'void' as const

  constructor({ context, generatorKey, destinationPath }: ConstructorArgs) {
    super({ context, generatorKey })

    context.register({ imports: { zod: ['z'] }, destinationPath })
  }

  override toString(): string {
    return `z.void()`
  }
}
