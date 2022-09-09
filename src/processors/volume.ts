export function createVolume(context: AudioContext | OfflineAudioContext) {
  const volume = context.createGain();

  return {
    node: volume,
    connect: (node: AudioNode) => volume.connect(node),
    get: () => Math.log(volume.gain.value) / Math.LN10,
    set: (value: number) => volume.gain.value = Math.pow(10, (value || 0) / 20),
  }
}
