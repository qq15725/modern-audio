import { createProcessorFactories } from './processors'

import type { AudioEnv, Processor, ProcessorFactory, ProcessorPropType } from './types'

export function defineProcessor(processorFactory: ProcessorFactory) {
  return processorFactory
}

export async function createProcessors(env: AudioEnv, factories?: ProcessorFactory[]) {
  return await Promise.all(
    createProcessorFactories(factories)
      .map(factory => factory(env)),
  )
}

export function getProcessorNode(processor: Processor) {
  return typeof processor.node === 'function'
    ? processor.node()
    : processor.node
}

export function setupProcessors(processors: Processor[]) {
  processors.slice(1).reduce(
    (prev, next) => {
      const node = getProcessorNode(next)
      if (!node) return prev
      if (prev.connect) {
        prev.connect(node)
      } else {
        getProcessorNode(prev)?.connect(node)
      }
      return next
    },
    processors[0],
  )
}

export function resetProcessors(processors: Processor[]) {
  processors.forEach(processor => {
    if (processor.disconnect) {
      processor.disconnect()
    } else {
      getProcessorNode(processor)?.disconnect()
    }
  })
}

export function processorsToProps(processors: Processor[]): Map<string, ProcessorPropType> {
  const map = new Map<string, ProcessorPropType>()
  for (const processor of processors) {
    if (!processor.props) continue
    for (const propName in processor.props) {
      map.set(propName, processor.props[propName])
    }
  }
  return map
}
