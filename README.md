<h1 align="center">Modern Audio</h1>

<p align="center">
  <a href="https://github.com/qq15725/modern-audio/blob/master/LICENSE" class="mr-3">
    <img src="https://img.shields.io/npm/l/modern-audio.svg" alt="License">
  </a>
  <a href="https://www.npmjs.com/package/modern-audio">
    <img src="https://img.shields.io/npm/v/modern-audio.svg" alt="Version">
  </a>
  <a href="https://cdn.jsdelivr.net/npm/modern-audio/dist/modern-audio.js">
    <img src="https://img.shields.io/bundlephobia/minzip/modern-audio" alt="Minzip">
  </a>
</p>

## Feature

- Adjustment decibel
- Adjustment fade in
- Adjustment fade out
- Adjustment stereo
- Enable noise reduction
- Render bar chart from peaks data
- Render bar chart from peaks time domain data
- Export multiple audio as single wav file

## Installation

### pnpm

```sh
pnpm add modern-audio
```

### npm

```sh
npm i modern-audio
```

## Usage

### Basic

```ts
import { createModernAudio } from 'modern-audio'

const audio = createModernAudio('./test/assets/audio.mp3')

audio.set('db', 1)
audio.set('pan', 0.1)
audio.set('fadeIn', 3)
audio.set('fadeOut', 5)
audio.set('noiseReduction', true)

// onclick after call
audio.start()
```

### Export multiple audio as single wav file

```ts
import { createModernAudio, createOfflineAudioContext, downloadOfflineAudio } from 'modern-audio'

// 10s duration
const context = createOfflineAudioContext(10)
const audio = createModernAudio('./test/assets/audio.mp3', context)

audio.set('db', 1)
audio.set('pan', 0.1)
audio.set('fadeIn', 3)
audio.set('fadeOut', 5)
audio.set('noiseReduction', true)

const audio1 = createModernAudio('./test/assets/audio.mp3', context)

audio1.set('db', 0)
audio1.set('pan', 0)
audio1.set('fadeIn', 0)
audio1.set('fadeOut', 0)
audio1.set('noiseReduction', false)

// onclick after call
audio.start()
audio1.start()
downloadOfflineAudio(context)
```

### Web custom component

```ts
import { ModernAudio } from 'modern-audio'

ModernAudio.install()
```

html

```html
<audio
  is="modern-audio"
  src="./test/assets/audio.mp3"
  controls
  db="1"
  pan="0.1"
  fade-in="3"
  fade-out="5"
  noise-reduction
></audio>
```

### CDN of usage

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>modern-audio</title>
  <script src="https://cdn.jsdelivr.net/npm/modern-audio/dist/modern-audio.js"></script>
  <script>
    window['modern-audio'].ModernAudio.install()
  </script>
</head>
<body>
  <audio
    is="modern-audio"
    src="./test/assets/audio.mp3"
    controls
    db="1"
    pan="0.1"
    fade-in="3"
    fade-out="5"
    noise-reduction
  ></audio>
</body>
</html>
```
