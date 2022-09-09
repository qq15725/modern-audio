export function createNoiseReduction(context: AudioContext | OfflineAudioContext) {
  let enable = false
  const filter = context.createBiquadFilter();
  filter.Q.value = 8.3;
  filter.frequency.value = 355;
  filter.gain.value = 3.0;
  filter.type = "bandpass";
  const compressor = context.createDynamicsCompressor();
  compressor.attack.value = 0;
  compressor.knee.value = 40;
  compressor.ratio.value = 12;
  compressor.release.value = 0.25;
  compressor.threshold.value = -50;

  return {
    node: filter,
    connect: (node: AudioNode) => filter.connect(compressor).connect(node),
    get: () => enable,
    set: (value: boolean) => enable = value,
  }
}
