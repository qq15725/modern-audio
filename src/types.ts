export type AudioSource = MediaElementAudioSourceNode | AudioScheduledSourceNode | AudioBufferSourceNode

export interface AudioEnv {
  source: AudioSource
  context: AudioContext | OfflineAudioContext
  reconnect: () => void
}

export interface InternalAudio {
  src?: string
  processors: Processor[]
  props: Map<string, ProcessorPropType>
  load: () => Promise<void>
  setupProcessors: () => Promise<void>
  connectProcessors: () => void
  reconnectProcessors: () => void
  renderBarChart: (canvas: HTMLCanvasElement, color?: string) => void
  renderTimeDomainBarChart: (canvas: HTMLCanvasElement, color?: string) => void
  get: (name: string) => any
  set: (name: string, value: any) => any
}

export type BufferAudio<T extends BaseAudioContext = AudioContext> = { src: string; context: T } & InternalAudio & AudioBufferSourceNode

export type MediaElementAudio<T extends BaseAudioContext = AudioContext> = { src: string; context: T } & InternalAudio & MediaElementAudioSourceNode

export type ScheduledAudio<T extends BaseAudioContext = AudioContext> = { context: T } & InternalAudio & AudioScheduledSourceNode

export interface Processor {
  name: string
  node?: AudioNode | ProcessorNodeFunction
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
