import type { GeneratorKey, Modifiers, GenerateContext } from 'jsr:@skmtc/core@^0.0.732'
import { ContentBase } from 'jsr:@skmtc/core@^0.0.732'
import { applyModifiers } from './applyModifiers.ts'

type TsBooleanArgs = {
  context: GenerateContext
  modifiers: Modifiers
  generatorKey: GeneratorKey
}

export class TsBoolean extends ContentBase {
  type = 'boolean' as const
  modifiers: Modifiers

  constructor({ context, modifiers, generatorKey }: TsBooleanArgs) {
    super({ context, generatorKey })

    this.modifiers = modifiers
  }

  override toString(): string {
    return applyModifiers(`boolean`, this.modifiers)
  }
}
