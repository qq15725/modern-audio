import { defineProcessor } from '../processor'

export const Analyser = defineProcessor(({ context }) => {
  const node = context.createAnalyser()
  node.fftSize = 2048
  return {
    name: 'analyser',
    node,
  }
})
