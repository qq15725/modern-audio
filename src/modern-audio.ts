import { createPanner, createVolume, createNoiseReduction } from './processors'

export class ModernAudio extends HTMLAudioElement {
  protected processors: {
    volume: ReturnType<typeof createVolume>
    panner: ReturnType<typeof createPanner>
    noiseReduction: ReturnType<typeof createNoiseReduction>
  }

  public get db() {
    return this.processors.volume.get()
  }

  public set db(value) {
    this.processors.volume.set(value)
  }

  public get pan() {
    return this.processors.panner.get()
  }

  public set pan(value) {
    this.processors.panner.set(value)
  }

  public set noiseReduction(value) {
    this.processors.noiseReduction.set(value)
  }

  public get noiseReduction() {
    return this.processors.noiseReduction.get()
  }

  constructor() {
    super();
    const context = new AudioContext()
    const source = context.createMediaElementSource(this)

    this.processors = {
      volume: createVolume(context),
      panner: createPanner(context),
      noiseReduction: createNoiseReduction(context),
    }

    Object.values(this.processors)
      .reduce((prev, next) => prev.connect(next.node), source)
      .connect(context.destination)

    this.pan = Number(this.getAttribute('pan') || 0)
    this.db = Number(this.getAttribute('db') || 0)
  }

  public static install() {
    customElements.define('modern-audio', ModernAudio, {
      extends: 'audio',
    })
  }
}
