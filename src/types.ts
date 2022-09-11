export type AudioSource = MediaElementAudioSourceNode | AudioScheduledSourceNode | AudioBufferSourceNode

export interface AudioEnv {
  source: AudioSource
  context: AudioContext | OfflineAudioContext
  reconnect: () => void
}

export interface InternalAudio {
  processors: Processor[]
  setupProcessors: () => Promise<void>
  connectProcessors: () => void
  reconnectProcessors: () => void
  renderBarChart: (canvas: HTMLCanvasElement, color?: string) => void
  renderTimeDomainBarChart: (canvas: HTMLCanvasElement, color?: string) => void
  get: (name: string) => any
  set: (name: string, value: any) => any
}

export interface Processor {
  name: string
  node: AudioNode | ProcessorNodeFunction
  connect?: (target: AudioNode) => void
  disconnect?: () => void
  props?: Record<string, ProcessorPropType>
}

export interface ProcessorPropType<T = any, D = T> {
  getter?: () => T
  setter?: (value: D) => void
}

export interface ProcessorNodeFunction {
  (): AudioNode | undefined
}

export interface ProcessorFactory {
  (env: AudioEnv): Processor | Promise<Processor>
}
