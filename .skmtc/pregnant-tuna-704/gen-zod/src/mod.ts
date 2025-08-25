import { toModelEntry } from 'jsr:@skmtc/core@^0.0.732'
import { ZodInsertable } from './ZodInsertable.ts'

export const zodEntry = toModelEntry({
  id: '@skmtc/gen-zod',
  transform({ context, refName }) {
    context.insertModel(ZodInsertable, refName)
  }
})
