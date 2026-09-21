// eslint-config-next (this version) ships its own native flat-config array,
// so there's no need to route it through @eslint/eslintrc's FlatCompat
// bridge -- doing so crashed here with "Converting circular structure to
// JSON" while FlatCompat tried to re-serialize the `react` plugin object.
// Importing the flat config directly avoids the bridge entirely.
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import eslintConfigPrettier from "eslint-config-prettier";

const eslintConfig = [
  ...nextCoreWebVitals,
  // Append prettier last so it overrides any conflicting stylistic rules.
  eslintConfigPrettier,
];

export default eslintConfig;
