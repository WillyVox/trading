import { DataUnavailable } from "./DataUnavailable";
export function CalculatorUnavailable() {
  return (
    <DataUnavailable
      title="Calculator data is temporarily unavailable"
      message="We can't produce an estimate without the verified pricing data this calculator depends on. No estimate has been calculated."
    />
  );
}
