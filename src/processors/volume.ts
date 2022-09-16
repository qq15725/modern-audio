import { defineProcessor } from '../processor'
import { getSourceDuration, getSourcePlaybackRate } from '../source'

export const Volume = defineProcessor(({ context, source }) => {
  const node = context.createGain()

  const props = {
    fadeIn: 0 as number | { at: number; duration: number },
    fadeOut: 0 as number | { at: number; duration: number },
  }

  return {
    name: 'volume',
    node,
    props: {
      db: {
        getter: () => Math.log(node.gain.value) / Math.LN10,
        setter: (value: number) => {
          value = Number(value)
          node.gain.value = Math.pow(10, value / 20)
        },
      },
      fadeIn: {
        getter: () => props.fadeIn,
        setter: (value: number | { at: number; duration: number }) => {
          props.fadeIn = value
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
        getter: () => props.fadeOut,
        setter: (value: number | { at: number; duration: number }) => {
          props.fadeOut = value
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
