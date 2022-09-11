import { defineProcessor } from '../processor'

export const Panner = defineProcessor(({ context }) => {
  const node = context.createStereoPanner()

  return {
    name: 'panner',
    node,
    props: {
      pan: {
        getter: () => node.pan.value,
        setter: (value: number) => node.pan.value = Number(value),
      },
    },
  }
})
