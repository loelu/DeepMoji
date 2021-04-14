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
    <div class="flex justify-center space-x-4 mt-4">
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
  name: 'VideoCapture',
  components: {
    UButton
  },
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
  async setup (props, { emit }) {
    const isCapturing = ref(false)

    const webcam = ref(null)
    const video = ref(null)

    watch(isCapturing, (shouldCapture) => {
      console.log(isCapturing)
      if (shouldCapture) {
        requestAnimationFrame(emitPredictions)
      }
    })

    onMounted(async () => {
      webcam.value = await getWebcam(video.value)
    })

    onBeforeUnmount(() => {
      webcam.value.stop()
    })

    console.log('Fetching model...')
    const model = await getModel()
    console.log('Model is fetched')

    const emitPredictions = async () => {
      /**
       * @type {Tensor<Rank.R3>}
       */
      const inputImage = await webcam.value.capture()
      const facePredictions = await getFacePredictions(model, inputImage)
      inputImage.dispose()

      emit('capture', facePredictions)

      if (isCapturing.value) return requestAnimationFrame(emitPredictions)
    }

    return {
      isCapturing,
      video
    }
  }
}
</script>
