# @aa900031/tsdown-config

[![npm version](https://img.shields.io/npm/v/@aa900031/tsdown-config?style=flat&colorA=18181B&colorB=F0DB4F)](https://npmjs.com/package/@aa900031/tsdown-config)
[![npm downloads](https://img.shields.io/npm/dm/@aa900031/tsdown-config?style=flat&colorA=18181B&colorB=F0DB4F)](https://npmjs.com/package/@aa900031/tsdown-config)

## Usage

Install lib.

```shell
pnpm install -D @aa900031/tsdown-config
```

Use helper function in your `tsdown.config.ts` file.

```ts
import { customExports } from '@aa900031/tsdown-config'
import { defineConfig } from 'tsdown'

export default defineConfig({
	entry: [
		'src/index.ts',
	],
	exports: {
		customExports,
	},
})
```

## License

Made with ❤️

Published under the [MIT License](https://github.com/aa900031/ginjou/blob/main/LICENSE).
