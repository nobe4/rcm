module.exports = {
	"env": {
		"browser": true,
		"es6": true
	},
	"extends": "eslint:recommended",
	"parserOptions": {
		"sourceType": "module"
	},
	"rules": {
		"camelcase": [
			"error",
			{ properties: "always" }
		],
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"single"
		],
		"semi": [
			"error",
			"always"
		]
	}
};
