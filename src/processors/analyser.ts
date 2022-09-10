import { defineProcessor } from '../processor'

export const Analyser = defineProcessor(({ context }) => {
  return {
    name: 'analyser',
    node: context.createAnalyser(),
  }
})
