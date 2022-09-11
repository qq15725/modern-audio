import type { AudioSource } from './types'

export function getSourcePlaybackRate(source: AudioSource) {
  if (source instanceof MediaElementAudioSourceNode) {
    return source.mediaElement.playbackRate
  } else if (source instanceof AudioBufferSourceNode) {
    return source.playbackRate.value
  } else {
    return 0
  }
}

export function getSourceDuration(source: AudioSource) {
  if (source instanceof MediaElementAudioSourceNode) {
    return source.mediaElement.duration
  } else if (source instanceof AudioBufferSourceNode) {
    return source.buffer?.duration ?? 0
  } else {
    return 0
  }
}
