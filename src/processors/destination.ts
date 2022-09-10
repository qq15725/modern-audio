import { defineProcessor } from '../processor'

export const Destination = defineProcessor(({ context }) => {
  return {
    name: 'destination',
    node: context.destination,
  }
})
