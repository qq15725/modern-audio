import { defineProcessor } from '../processor'

export const Source = defineProcessor(({ source }) => {
  return {
    name: 'source',
    node: source,
  }
})
