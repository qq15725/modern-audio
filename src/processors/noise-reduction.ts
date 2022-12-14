import { defineProcessor } from '../processor'

export const NoiseReduction = defineProcessor((audio) => {
  const { context } = audio

  let enable = false

  const filter = context.createBiquadFilter()
  filter.Q.value = 8.3
  filter.frequency.value = 355
  filter.gain.value = 3.0
  filter.type = 'bandpass'
  const compressor = context.createDynamicsCompressor()
  compressor.attack.value = 0
  compressor.knee.value = 40
  compressor.ratio.value = 12
  compressor.release.value = 0.25
  compressor.threshold.value = -50

  return {
    name: 'noise-reduction',
    node: () => enable ? filter : undefined,
    connect: (target) => filter.connect(compressor).connect(target),
    disconnect: () => {
      filter.disconnect()
      compressor.disconnect()
    },
    props: {
      noiseReduction: {
        value: enable,
        getter() {
          return this.value
        },
        setter(value: boolean) {
          // @ts-expect-error runtime
          if (value === '') value = true
          if (enable === value) return
          this.value = enable = value
          audio.reconnect()
        },
      },
    },
  }
})
