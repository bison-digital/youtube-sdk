import type { Stringable } from 'jsr:@skmtc/core@^0.0.732'
import type { Modifiers } from 'jsr:@skmtc/core@^0.0.732'

export const withOptional = (value: Stringable, { required }: Modifiers): string => {
  return required ? `${value}` : `(${value}) | undefined`
}
