// Even without using prettier, vscode "format on paste" is using this

// https://prettier.io/docs/en/configuration#basic-configuration

/** @type {import("prettier").Config} */
const config = {
	// https://prettier.io/docs/en/options

	// we have an editorconfig, no need to duplicate it

	// extra prettier config
	arrowParens: 'avoid',
	trailingComma: 'es5',
	semi: true,
	singleQuote: true,
	jsxSingleQuote: true,
	plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
