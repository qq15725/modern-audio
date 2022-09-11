export interface AudioEnv {
  source: MediaElementAudioSourceNode | AudioBufferSourceNode
  context: AudioContext | OfflineAudioContext
  reconnect: () => void
}

export interface ProcessorPropType<T = any, D = T> {
  getter?: () => T
  setter?: (value: D) => void
}

export interface ProcessorNodeFunction {
  (): AudioNode | undefined
}

export interface Processor {
  name: string
  node: AudioNode | ProcessorNodeFunction
  connect?: (target: AudioNode) => void
  disconnect?: () => void
  props?: Record<string, ProcessorPropType>
}

export interface ProcessorFactory {
  (env: AudioEnv): Processor | Promise<Processor>
}
