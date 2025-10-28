module.exports = {
	root: true,

	env: {
		browser: true,
		es6: true,
		node: true,
	},

	parser: '@typescript-eslint/parser',

	parserOptions: {
		project: ['./tsconfig.json'],
		sourceType: 'module',
		extraFileExtensions: ['.json'],
	},

	ignorePatterns: [
		'.eslintrc.js',
		'**/*.js',
		'**/node_modules/**',
		'**/dist/**',
	],

	overrides: [
		{
			files: ['package.json'],
			plugins: ['eslint-plugin-n8n-nodes-base'],
			extends: ['plugin:n8n-nodes-base/community'],
			rules: {
				'n8n-nodes-base/community-package-json-name-still-default': 'off',
			},
		},
		{
			files: ['./credentials/**/*.ts'],
			plugins: ['eslint-plugin-n8n-nodes-base'],
			rules: {
				'n8n-nodes-base/cred-class-field-authenticate-type-assertion': 'error',
				'n8n-nodes-base/cred-class-field-display-name-missing-api': 'error',
				'n8n-nodes-base/cred-class-field-name-missing-oauth2': 'error',
				'n8n-nodes-base/cred-class-field-name-unsuffixed': 'error',
				'n8n-nodes-base/cred-class-name-missing-oauth2-suffix': 'error',
				'n8n-nodes-base/cred-class-name-unsuffixed': 'error',
				'n8n-nodes-base/cred-filename-against-convention': 'error',
			},
		},
		{
			files: ['./nodes/**/*.ts'],
			plugins: ['eslint-plugin-n8n-nodes-base'],
			rules: {
				'n8n-nodes-base/node-class-description-inputs-wrong-regular-node': 'error',
				'n8n-nodes-base/node-class-description-outputs-wrong': 'error',
				'n8n-nodes-base/node-dirname-against-convention': 'error',
				'n8n-nodes-base/node-filename-against-convention': 'error',
				'n8n-nodes-base/node-param-default-missing': 'error',
				'n8n-nodes-base/node-param-description-missing': 'error',
				'n8n-nodes-base/node-param-display-name-not-first-position': 'error',
				'n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options': 'error',
			},
		},
	],
};
