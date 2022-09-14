import { defineProcessor } from '../processor'
import { getSourceDuration, getSourcePlaybackRate } from '../source'

export const Volume = defineProcessor(({ context, source }) => {
  const node = context.createGain()

  const props = {
    fadeIn: 0,
    fadeOut: 0,
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
        setter: (time: number) => {
          time = Number(time)
          props.fadeIn = time
          const now = context.currentTime
          node.gain.setValueAtTime(0.01, now)
          node.gain.exponentialRampToValueAtTime(node.gain.value, now + time)
        },
      },
      fadeOut: {
        getter: () => props.fadeOut,
        setter: (time: number) => {
          time = Number(time)
          props.fadeOut = time
          const duration = getSourceDuration(source) / getSourcePlaybackRate(source)
          const now = context.currentTime
          node.gain.setValueAtTime(node.gain.value, now + duration - time)
          node.gain.exponentialRampToValueAtTime(0.01, now + duration)
        },
      },
    },
  }
})
