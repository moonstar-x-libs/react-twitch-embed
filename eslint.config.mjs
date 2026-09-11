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
  ...base,
  ...typescript,
  ...browser,
  ...react,
  ...a11y(),
  ...stylistic,
  ...stylisticJsx,
  ...sorted,
  {
    name: 'storybook',
    files: [
      'src/**/*.stories.tsx'
    ],
    ...storybook.configs.recommended
  }
];
