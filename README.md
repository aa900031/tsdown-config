# @aa900031/tsdown-config

[![npm version](https://img.shields.io/npm/v/@aa900031/tsdown-config?style=flat&colorA=18181B&colorB=F0DB4F)](https://npmjs.com/package/@aa900031/tsdown-config)
[![npm downloads](https://img.shields.io/npm/dm/@aa900031/tsdown-config?style=flat&colorA=18181B&colorB=F0DB4F)](https://npmjs.com/package/@aa900031/tsdown-config)
[![coverage](https://img.shields.io/codecov/c/gh/aa900031/tsdown-config?logo=codecov&style=flat&colorA=18181B&colorB=F0DB4F)](https://codecov.io/gh/aa900031/tsdown-config)
![coderabbit](https://img.shields.io/coderabbit/prs/github/aa900031/tsdown-config?style=flat&logo=coderabbit&logoColor=FF570A&label=CodeRabbit%20Reviews&colorA=18181B&colorB=F0DB4F)

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

Published under the [MIT License](https://github.com/aa900031/tsdown-config/blob/main/LICENSE).
