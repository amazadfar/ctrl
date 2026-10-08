/**
 * A light tick, best effort. iOS Safari has no Vibration API, but toggling a native
 * `<input switch>` plays the system haptic on iOS 18+, so we click a hidden one.
 * Does nothing where neither works.
 */
export function haptic(): void {
  try {
    if ('vibrate' in navigator) {
      navigator.vibrate(8)
      return
    }
    const label = document.createElement('label')
    label.setAttribute('aria-hidden', 'true')
    label.style.display = 'none'
    const input = document.createElement('input')
    input.type = 'checkbox'
    input.setAttribute('switch', '')
    label.appendChild(input)
    document.body.appendChild(label)
    label.click()
    label.remove()
  } catch {
    // Haptics are a nicety.
  }
}
