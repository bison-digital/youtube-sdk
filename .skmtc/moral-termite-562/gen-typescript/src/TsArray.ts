import { ContentBase } from 'jsr:@skmtc/core@^0.0.732'
import type {
  TypeSystemValue,
  OasSchema,
  Modifiers,
  GeneratorKey,
  GenerateContext,
  OasRef,
  RefName
} from 'jsr:@skmtc/core@^0.0.732'
import { toTsValue } from './Ts.ts'
import { applyModifiers } from './applyModifiers.ts'

type TsArrayArgs = {
  context: GenerateContext
  destinationPath: string
  items: OasSchema | OasRef<'schema'>
  modifiers: Modifiers
  generatorKey: GeneratorKey
  rootRef?: RefName
}

export class TsArray extends ContentBase {
  type = 'array' as const
  items: TypeSystemValue
  modifiers: Modifiers

  constructor({ context, generatorKey, destinationPath, items, modifiers, rootRef }: TsArrayArgs) {
    super({ context, generatorKey })

    this.modifiers = modifiers

    this.items = toTsValue({ destinationPath, schema: items, required: true, context, rootRef })
  }

  override toString(): string {
    return applyModifiers(`Array<${this.items}>`, this.modifiers)
  }
}
