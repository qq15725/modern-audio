import { defineProcessor } from '../processor'

export const Loop = defineProcessor(({ source }) => {
  let loop = false
  return {
    name: 'loop',
    props: {
      loop: {
        getter: () => loop,
        setter: (value: boolean) => {
          loop = Boolean(value)
          if (source instanceof MediaElementAudioSourceNode) {
            source.mediaElement.loop = loop
          } else if (source instanceof AudioBufferSourceNode) {
            source.loop = loop
          }
        },
      },
    },
  }
})
