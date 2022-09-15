import { defineProcessor } from '../processor'

export const PlaybackRate = defineProcessor(({ source }) => {
  let playbackRate = 1
  return {
    name: 'playbackRate',
    props: {
      playbackRate: {
        getter: () => playbackRate,
        setter: (value: number) => {
          playbackRate = Number(value)
          if (source instanceof MediaElementAudioSourceNode) {
            source.mediaElement.playbackRate = playbackRate
          } else if (source instanceof AudioBufferSourceNode) {
            source.playbackRate.value = playbackRate
          }
        },
      },
    },
  }
})
