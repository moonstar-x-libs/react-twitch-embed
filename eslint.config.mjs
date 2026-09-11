import {
  a11y,
  base,
  browser,
  ignores,
  react,
  sorted,
  stylistic,
  stylisticJsx,
  typescript
} from '@moonstar-x/eslint-config';
import storybook from 'eslint-plugin-storybook';

export default [
  ...ignores,
  {
    name: 'ignores/local',
    ignores: [
      'docs-build/**',
      'storybook-static/**'
    ]
  },
  ...base,
  ...typescript,
  ...browser,
  ...react,
  ...a11y(),
  ...stylistic,
  ...stylisticJsx,
  ...sorted,
  {
    name: 'overrides',
    rules: {
      '@eslint-react/dom-no-missing-iframe-sandbox': 'off',
      'unicorn/prefer-global-this': 'off',
      'import-x/no-extraneous-dependencies': 'off'
    }
  },
  {
    name: 'storybook',
    files: [
      'src/**/*.stories.tsx'
    ],
    ...storybook.configs.recommended
  }
];
