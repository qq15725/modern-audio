import { defineProcessor } from '../processor'

export const PlaybackRate = defineProcessor(({ source }) => {
  return {
    name: 'playbackRate',
    props: {
      playbackRate: {
        value: 1,
        getter() {
          return this.value
        },
        setter(value: number) {
          this.value = value = Number(value)
          if (source instanceof MediaElementAudioSourceNode) {
            source.mediaElement.playbackRate = value
          } else if (source instanceof AudioBufferSourceNode) {
            source.playbackRate.value = value
          }
        },
      },
    },
  }
})
