import type { AudioAnyContext } from './types'

export function fetchAudioBuffer<T extends BaseAudioContext = AudioAnyContext>(url: string, context: T) {
  return fetch(url)
    .then((response) => response.arrayBuffer())
    .then((buffer) => context.decodeAudioData(buffer))
}
