import { DataUnavailable } from "./DataUnavailable";
export function LiveEvidenceUnavailable() {
  return (
    <DataUnavailable
      title="Live provider evidence is temporarily unavailable"
      message="The educational guide remains available. We are not showing provider examples until the underlying verified research data can be loaded."
    />
  );
}
