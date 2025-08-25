import { type GenerateContext, ContentBase, type GeneratorKey } from 'jsr:@skmtc/core@^0.0.732'

type ConstructorArgs = {
  context: GenerateContext
  generatorKey: GeneratorKey
}

export class TsVoid extends ContentBase {
  type = 'void' as const

  constructor({ context, generatorKey }: ConstructorArgs) {
    super({ context, generatorKey })
  }

  override toString(): string {
    return 'void'
  }
}
