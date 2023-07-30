/*
 * File: .eslintrc.cjs
 * Project: bingo
 * Created Date: 30.07.2023 12:36:02
 * Author: 3urobeat
 *
 * Last Modified: 30.07.2023 12:41:28
 * Modified By: 3urobeat
 *
 * Copyright (c) 2023 3urobeat <https://github.com/3urobeat>
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


/* eslint-env node */
module.exports = {
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    parser: "@typescript-eslint/parser",
    root: true,
    env: {
        commonjs: true,
        es6: true,
        node: true
    },
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly"
    },
    parserOptions: {
        ecmaVersion: 11
    },
    plugins: [
        "@typescript-eslint",
        "jsdoc"
    ],
    rules: {
        "no-var": "error",
        "no-redeclare": "off",
        "no-unreachable": "error",
        "no-unexpected-multiline": "error",

        // Styling
        "camelcase": "warn",
        "capitalized-comments": ["warn", "always", { "ignoreConsecutiveComments": true }],
        "comma-spacing": ["warn", { "before": false, "after": true }],
        "func-call-spacing": ["error", "never"],
        "indent": ["error", 4, { "ignoredNodes": ["IfStatement"], "SwitchCase": 1 }], // TODO: This also ignores if statements with wrong indentation but I couldn't get it to only ignore else in if-else one-liner
        "no-tabs": "error",
        "no-trailing-spaces": "error",
        "no-extra-semi": "error",
        "semi": ["error", "always"],
        "semi-spacing": "error",
        "semi-style": ["error", "last"],
        "quotes": ["error", "double", { "avoidEscape": true }],
        "spaced-comment": "warn",

        // JsDoc - https://github.com/gajus/eslint-plugin-jsdoc
        "jsdoc/check-alignment": "warn",
        "jsdoc/check-indentation": "warn",
        "jsdoc/check-types": "warn",
        "jsdoc/informative-docs": "warn",
        "jsdoc/require-asterisk-prefix": "warn",
        "jsdoc/require-description": "warn",
        "jsdoc/require-jsdoc": "warn",
        "jsdoc/require-param": "warn",
        "jsdoc/require-param-name": "warn",
        "jsdoc/valid-types": "warn",
        "jsdoc/require-returns-description": "warn"
    }
};