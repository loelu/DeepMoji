<template>
  <div>
    <video
      ref="video"
      v-show="showVideo"
      autoplay
      playsinline
      muted
      :width="width"
      :height="height"
    />
    <canvas
      ref="canvas"
      :width="width"
      :height="height"
    />
    <div class="flex space-x-4">
      <u-button @click="isCapturing = true">Start</u-button>
      <u-button @click="isCapturing = false">Stop</u-button>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { getModel, getWebcam, getFacePredictions } from '@/processing'
import UButton from '@/components/Button'

export default {
  name: 'DrawingArea',
  components: { UButton },
  props: {
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    showVideo: Boolean
  },
  async setup () {
    const canvas = ref(null)
    const ctx = ref(null)

    const drawObject = objectPoints => {
      ctx.value.beginPath()
      objectPoints.forEach((point, index) => {
        if (index === 0) {
          ctx.value.moveTo(point[0], point[1])
        }
        ctx.value.lineTo(point[0], point[1])
      })
      ctx.value.closePath()
      ctx.value.stroke()
    }

    const isCapturing = ref(false)

    const webcam = ref(null)
    const video = ref(null)

    watch(isCapturing, (shouldCapture) => {
      if (shouldCapture) {
        requestAnimationFrame(renderFrame)
      }
    })

    onMounted(async () => {
      ctx.value = canvas.value.getContext('2d')
      ctx.value.globalCompositeOperation = 'destination-over'

      webcam.value = await getWebcam(video.value)
    })

    onBeforeUnmount(() => {
      webcam.value.stop()
    })

    const model = await getModel()

    const renderFrame = async () => {
      /**
       * @type {Tensor<Rank.R3>}
       */
      const inputImage = await webcam.value.capture()
      const facePredictions = await getFacePredictions(model, inputImage)
      inputImage.dispose()

      ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)

      facePredictions.forEach(face => {
        Object.values(face).forEach(objectPoints => {
          drawObject(objectPoints)
        })
      })

      if (isCapturing.value) return requestAnimationFrame(renderFrame)
    }

    return {
      canvas,
      isCapturing,
      video
    }
  }
}
</script>
