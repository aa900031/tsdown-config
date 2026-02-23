import { defineConfig } from 'tsdown'
import { customExports } from './src'

export default defineConfig({
	platform: 'node',
	shims: true,
	entry: [
		'src/index.ts',
	],
	format: ['esm', 'cjs'],
	clean: true,
	exports: {
		devExports: true,
		customExports,
	},
	dts: {
		compilerOptions: {
			composite: false,
			preserveSymlinks: false,
		},
		tsconfig: './tsconfig.app.json',
	},
})
