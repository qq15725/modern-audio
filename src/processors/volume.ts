import { defineProcessor } from '../processor'
import { getSourceDuration, getSourcePlaybackRate } from '../source'

export const Volume = defineProcessor(({ context, source }) => {
  const node = context.createGain()

  return {
    name: 'volume',
    node,
    props: {
      db: {
        value: 1,
        getter() {
          return this.value
        },
        setter(value: number) {
          this.value = value = Number(value)
          node.gain.value = Math.pow(10, value / 20)
        },
      },
      fadeIn: {
        value: 0 as number | { at: number; duration: number },
        getter() {
          return this.value
        },
        setter(value: number | { at: number; duration: number }) {
          this.value = value
          const { at, duration } = typeof value === 'object'
            ? value
            : {
                at: context.currentTime,
                duration: Number(value),
              }
          node.gain.setValueAtTime(0.01, at)
          node.gain.exponentialRampToValueAtTime(node.gain.value, at + duration)
        },
      },
      fadeOut: {
        value: 0 as number | { at: number; duration: number },
        getter() {
          return this.value
        },
        setter(value: number | { at: number; duration: number }) {
          this.value = value
          const { at, duration } = typeof value === 'object'
            ? value
            : {
                at: context.currentTime + getSourceDuration(source) / getSourcePlaybackRate(source) - Number(value),
                duration: Number(value),
              }
          node.gain.setValueAtTime(node.gain.value, at)
          node.gain.exponentialRampToValueAtTime(0.01, at + duration)
        },
      },
    },
  }
})
