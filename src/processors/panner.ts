import { defineProcessor } from '../processor'

export const Panner = defineProcessor(({ context }) => {
  const node = context.createStereoPanner()

  return {
    name: 'panner',
    node,
    props: {
      pan: {
        value: node.pan.value,
        getter() {
          return this.value
        },
        setter(value: number) {
          this.value = node.pan.value = Number(value)
        },
      },
    },
  }
})
