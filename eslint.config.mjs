// eslint-config-next (this version) ships native flat-config arrays, so
// there's no need to route it through @eslint/eslintrc's FlatCompat bridge --
// doing so crashed with "Converting circular structure to JSON" while
// FlatCompat tried to re-serialize the `react` plugin object.
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier";

const eslintConfig = [
  ...nextCoreWebVitals,
  // typescript-eslint's recommended rules (no-explicit-any, no-unused-vars,
  // ban-ts-comment, ...). Without this, TypeScript files were only being
  // checked by the React/Next rule sets.
  ...nextTypescript,
  // Belt-and-braces: these are also eslint-config-next's defaults.
  { ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"] },
  // Append prettier last so it overrides any conflicting stylistic rules.
  eslintConfigPrettier,
];

export default eslintConfig;
