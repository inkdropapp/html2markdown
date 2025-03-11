import eslintTs from 'typescript-eslint'
import prettier from 'eslint-config-prettier'

export default eslintTs.config(
  eslintTs.configs.recommended,
  {
    ignores: ['lib', 'validators']
  },
  prettier,
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {}
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/no-explicit-any': 0,

      'no-useless-escape': 0,
      'prefer-const': 2,
      'no-unused-vars': 0
    }
  }
)
