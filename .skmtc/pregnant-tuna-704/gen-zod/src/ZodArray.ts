import { ContentBase } from 'jsr:@skmtc/core@^0.0.732'
import type {
  OasRef,
  RefName,
  GenerateContext,
  GeneratorKey,
  OasSchema,
  Modifiers,
  TypeSystemValue
} from 'jsr:@skmtc/core@^0.0.732'
import { toZodValue } from './Zod.ts'
import { applyModifiers } from './applyModifiers.ts'

type ZodArrayArgs = {
  context: GenerateContext
  destinationPath: string
  items: OasSchema | OasRef<'schema'>
  modifiers: Modifiers
  generatorKey: GeneratorKey
  rootRef?: RefName
}

export class ZodArray extends ContentBase {
  type = 'array' as const
  items: TypeSystemValue
  modifiers: Modifiers

  constructor({ context, generatorKey, destinationPath, items, modifiers, rootRef }: ZodArrayArgs) {
    super({ context, generatorKey })

    this.modifiers = modifiers

    this.items = toZodValue({ destinationPath, schema: items, required: true, context, rootRef })

    context.register({ imports: { zod: ['z'] }, destinationPath })
  }

  override toString(): string {
    return applyModifiers(`z.array(${this.items})`, this.modifiers)
  }
}
