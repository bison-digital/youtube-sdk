import type { Stringable, Modifiers } from 'jsr:@skmtc/core@^0.0.732'

export const withNullable = (value: Stringable, { nullable }: Modifiers): string => {
  return nullable ? `${value}.nullable()` : `${value}`
}
