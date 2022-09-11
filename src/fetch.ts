export function fetchAudioBuffer(url: string, context: AudioContext | OfflineAudioContext) {
  return fetch(url)
    .then((response) => response.arrayBuffer())
    .then((buffer) => context.decodeAudioData(buffer))
}
