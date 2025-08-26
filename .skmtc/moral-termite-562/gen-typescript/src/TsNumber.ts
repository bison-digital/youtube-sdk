import type { GeneratorKey, Modifiers, GenerateContext } from 'jsr:@skmtc/core@^0.0.732'
import { ContentBase } from 'jsr:@skmtc/core@^0.0.732'
import { applyModifiers } from './applyModifiers.ts'

type TsNumberArgs = {
  context: GenerateContext
  modifiers: Modifiers
  generatorKey: GeneratorKey
}

export class TsNumber extends ContentBase {
  type = 'number' as const
  modifiers: Modifiers

  constructor({ context, modifiers, generatorKey }: TsNumberArgs) {
    super({ context, generatorKey })

    this.modifiers = modifiers
  }

  override toString(): string {
    return applyModifiers(`number`, this.modifiers)
  }
}
