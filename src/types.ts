export type AudioAnyContext = AudioContext | OfflineAudioContext

export type AudioSource = MediaElementAudioSourceNode | AudioScheduledSourceNode | AudioBufferSourceNode

export type AudioInput = string | AudioBuffer | HTMLMediaElement | AudioSource

export interface AudioEnv {
  source: AudioSource
  context: AudioAnyContext
  reconnect(): void
}

export interface InternalAudio<T extends BaseAudioContext = AudioAnyContext, D extends AudioSource = AudioSource> {
  context: T
  source: D
  processors: Processor[]
  props: Map<string, ProcessorPropType>
  setup(): void
  reconnect(): void
  renderBarChart(canvas: HTMLCanvasElement, color?: string): void
  renderTimeDomainBarChart(canvas: HTMLCanvasElement, color?: string): void
  get(): Record<string, any>
  get(name: string): any
  set(name: Record<string, any>): void
  set(name: string, value: any): void
}

export type BufferAudio<T extends BaseAudioContext = AudioAnyContext> = {
  src: string
  load(): Promise<void>
  reset(): void
  resetAndStart(when?: number, offset?: number, duration?: number): void
} & InternalAudio<T, AudioBufferSourceNode> & AudioBufferSourceNode

export type MediaElementAudio<T extends BaseAudioContext = AudioAnyContext> = {
  src: string
} & InternalAudio<T, MediaElementAudioSourceNode> & MediaElementAudioSourceNode

export type ScheduledAudio<T extends BaseAudioContext = AudioAnyContext> = InternalAudio<T, AudioScheduledSourceNode> & AudioScheduledSourceNode

export interface Processor {
  name: string
  node?: AudioNode | ProcessorNodeFunction
  connect?(target: AudioNode): void
  disconnect?(): void
  props?: Record<string, ProcessorPropType>
}

export interface ProcessorPropType<T = any, D = T> {
  value?: T
  getter?(): T
  setter?(value: D): void
}

export interface ProcessorNodeFunction {
  (): AudioNode | undefined
}

export interface ProcessorFactory {
  (env: AudioEnv): Processor
}
