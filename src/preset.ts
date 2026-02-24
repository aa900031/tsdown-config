import type { TsdownInputOption, UserConfig } from 'tsdown'
import { mergeConfig } from 'tsdown'
import { customExports } from './exports'

export interface BaseOptions {
	/**
	 * @default 'index'
	 */
	entry?: 'index' | 'shallow' | 'all' | Exclude<TsdownInputOption, string>
}

export function base(
	options: BaseOptions = {},
	overrides: UserConfig = {},
): UserConfig {
	const entry = options.entry === 'index' || options.entry == null
		? 'src/index.ts'
		: options.entry === 'shallow'
			? 'src/*.ts'
			: options.entry === 'all'
				? 'src/**/*.ts'
				: options.entry

	return mergeConfig({
		entry,
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
	}, overrides)
}

export function node(
	options: BaseOptions = {},
	overrides: UserConfig = {},
): UserConfig {
	return base(
		options,
		mergeConfig({
			platform: 'node',
		}, overrides),
	)
}

export function lib(
	options: BaseOptions = {},
	overrides: UserConfig = {},
): UserConfig {
	return base(
		options,
		mergeConfig({
			platform: 'neutral',
		}, overrides),
	)
}

export function vue(
	options: BaseOptions = {},
	overrides: UserConfig = {},
): UserConfig {
	return base(
		options,
		mergeConfig({
			platform: 'neutral',
			dts: {
				vue: true,
			},
		}, overrides),
	)
}
