import { defineProcessor } from '../processor'

export const Loop = defineProcessor(({ source }) => {
  return {
    name: 'loop',
    props: {
      loop: {
        value: false,
        getter() {
          return this.value
        },
        setter(value: boolean) {
          this.value = value = Boolean(value)
          if (source instanceof MediaElementAudioSourceNode) {
            source.mediaElement.loop = value
          } else if (source instanceof AudioBufferSourceNode) {
            source.loop = value
          }
        },
      },
    },
  }
})
