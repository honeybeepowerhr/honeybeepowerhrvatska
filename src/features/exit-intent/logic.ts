/**
 * Pure helper function determining whether to display exit-intent popup.
 * Formula: shouldShowPopup = exitIntentDetected AND NOT hasClosedToday
 */
export function shouldShowPopup(exitIntentDetected: boolean, hasClosedToday: boolean): boolean {
  return exitIntentDetected && !hasClosedToday
}
