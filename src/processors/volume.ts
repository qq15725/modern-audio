import { defineProcessor } from '../processor'

export const Volume = defineProcessor(({ context }) => {
  const node = context.createGain()

  return {
    name: 'volume',
    node,
    props: {
      db: {
        getter: () => Math.log(node.gain.value) / Math.LN10,
        setter: (value: number) => node.gain.value = Math.pow(10, (value || 0) / 20),
      },
    },
  }
})
