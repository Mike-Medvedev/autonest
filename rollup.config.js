import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
	input: 'src/browser.js',
	output: {
		file: 'dist/browser.bundle.js',
		format: 'iife',
		name: 'AutoNest',
	},
	plugins: [resolve(), commonjs()],
};
