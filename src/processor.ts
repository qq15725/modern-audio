import { createProcessorFactories } from './processors'

import type { InternalAudio, Processor, ProcessorFactory, ProcessorPropType } from './types'

export function defineProcessor(processorFactory: ProcessorFactory) {
  return processorFactory
}

export function createProcessors(audio: InternalAudio, factories?: ProcessorFactory[]) {
  return createProcessorFactories(factories)
    .map(factory => factory(audio))
}

export function getProcessorNode({ node }: Processor) {
  return typeof node === 'function' ? node() : node
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
