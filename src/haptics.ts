/**
 * A light tick where the platform allows it. Android has the Vibration API. iOS Safari has none, and
 * Apple closed the hidden-switch workaround in iOS 26.5, so on iPhone this does nothing: real fader
 * detents need the native app. Tapes pulse their bug on each level instead.
 */
export function haptic(): void {
  if ('vibrate' in navigator) navigator.vibrate(8)
}
