/**
 * Pure helper function determining whether analytics scripts should execute.
 * Formula: shouldLoadAnalytics = consentGranted
 */
export function shouldLoadAnalytics(consentGranted: boolean): boolean {
  return consentGranted
}
