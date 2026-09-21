import type { CryptoCostComponent, CryptoCostScenarioResult } from "./types";

function roundCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function combineCryptoCosts(
  components: CryptoCostComponent[]
): CryptoCostScenarioResult {
  const present = components.filter(
    (component) => component.calculation != null
  );
  const calculated = present.filter(
    (component) =>
      component.calculation?.status === "CALCULATED" &&
      component.calculation.amount != null
  );
  const unresolved = present.filter(
    (component) => component.calculation?.status !== "CALCULATED"
  );

  if (calculated.length === 0) {
    return {
      components,
      canTotal: false,
      message:
        "No calculator-ready cost components are available for this scenario.",
    };
  }

  if (unresolved.length > 0) {
    return {
      components,
      canTotal: false,
      message:
        "At least one selected cost is variable, stale, unverified or needs more information, so a combined total is not shown.",
    };
  }

  const currencies = new Set(
    calculated.map((component) => component.calculation?.currency ?? "AUD")
  );
  if (currencies.size !== 1) {
    return {
      components,
      canTotal: false,
      message:
        "Selected costs are charged in different currencies or crypto units. Trading Guide does not invent an exchange rate to combine them.",
    };
  }

  const currency = [...currencies][0];
  return {
    components,
    canTotal: true,
    totalAmount: roundCurrency(
      calculated.reduce(
        (sum, component) => sum + (component.calculation?.amount ?? 0),
        0
      )
    ),
    totalCurrency: currency,
  };
}
