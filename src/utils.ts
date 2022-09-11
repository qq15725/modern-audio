export function toCameCase(str: string): string {
  return str.replace(/-(\w)/g, (match: string, part: string) => part.toLocaleUpperCase())
}

export function getPlaybackRate(source: MediaElementAudioSourceNode | AudioBufferSourceNode) {
  return source instanceof MediaElementAudioSourceNode
    ? source.mediaElement.playbackRate
    : source.playbackRate.value
}

export function getDuration(source: MediaElementAudioSourceNode | AudioBufferSourceNode) {
  return source instanceof MediaElementAudioSourceNode
    ? source.mediaElement.duration
    : source.buffer?.duration ?? 0
}
