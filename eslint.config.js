// Configuración de ESLint (formato flat config)
import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['node_modules/', '.lighthouseci/'] },
  js.configs.recommended,
  {
    files: ['js/**/*.js'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['tests/**/*.js', 'scripts/**/*.js', 'eslint.config.js'],
    languageOptions: { globals: globals.node },
  },
];
