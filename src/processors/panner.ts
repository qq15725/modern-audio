export function createPanner(context: AudioContext | OfflineAudioContext) {
  const panner = context.createStereoPanner();

  return {
    node: panner,
    connect: (node: AudioNode) => panner.connect(node),
    get: () => panner.pan.value,
    set: (value: number) => panner.pan.value = value,
  }
}
