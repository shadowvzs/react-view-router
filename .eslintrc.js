module.exports = {
	"root": true,
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"project": ["tsconfig.json"],
		"tsconfigRootDir": __dirname,
		"sourceType": "module"
	},
	"plugins": [
		"@typescript-eslint",
		"prettier",
		"react"
	],
	"extends": [
		"prettier",
		"plugin:prettier/recommended",
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking"
	],
	"rules": {
		'prettier/prettier': 'error',
		"no-unused-vars": "off",
		"semi": ["error"],
		"space-infix-ops": ["error", { "int32Hint": false }],
		"rest-spread-spacing": ["error"],
		"no-whitespace-before-property": ["error"],
		"no-trailing-spaces": ["error"],
		"no-multiple-empty-lines": ["error"],
		"no-multi-spaces": ["error"],
		"no-tabs": ["error"],
		"no-var": ["error"],
		"no-useless-return": ["error"],
		"no-useless-escape": ["error"],
		"no-useless-constructor": ["error"],
		"no-useless-rename": ["error"],
		"no-useless-concat": ["error"],
		"no-useless-catch": ["error"],
		"no-script-url": ["error"],
		"no-nested-ternary": ["error"],
		"no-lonely-if": ["error"],
		"no-empty-function": ["error"],
		"max-params": ["error", { "max": 4 }],
		"max-nested-callbacks": ["error"],
		"max-lines-per-function": ["error", { "max": 400 }], // recommended is 50
		"max-depth": ["error"],
		"max-classes-per-file": ["error", 1],
		"complexity": ["error", { "max": 20 }], // default is 20
		"no-constructor-return": ["error"],
		"quotes": [
			"error",
			"single",
			{
				"allowTemplateLiterals": true
			}
		],
		"@typescript-eslint/triple-slash-reference": "off",
		"prefer-const": [
			"warn"
		],
		"no-console": [
			"warn",
			{
				"allow": [
					"group",
					"groupEnd",
					"groupCollapsed",
					"info",
					"warn",
					"error"
				]
			}
		],
		"@typescript-eslint/no-unused-vars": [
			"warn",
			{
				"argsIgnorePattern": "^_",
				"varsIgnorePattern": "^_",
				"caughtErrorsIgnorePattern": "^_"
			}
		]
	},
	"settings": {
		"react": {
			"version": "detect"
		}
	},
	"env": {
		"browser": true,
		"node": true
	},
	"globals": {
		"JSX": true
	},
	"overrides": [
		{
			"files": [
				"*.tsx",
				"*.ts"
			],
			"rules": {
				"quotes": [
					"error",
					"single",
					{
						"allowTemplateLiterals": true
					}
				]
			}
		}
	]
}