import { capitalize, decapitalize, Identifier, toModelBase, camelCase } from 'jsr:@skmtc/core@^0.0.732'
import type { RefName } from 'jsr:@skmtc/core@^0.0.732'
import { join } from 'jsr:@std/path@^1.0.6'

export const TypescriptBase = toModelBase({
  id: '@skmtc/gen-typescript',

  toIdentifier(refName: RefName): Identifier {
    const name = capitalize(camelCase(refName))

    return Identifier.createType(name)
  },

  toExportPath(refName: RefName): string {
    const { name } = this.toIdentifier(refName)

    return join('@', 'types', `${decapitalize(name)}.generated.ts`)
  }
})
