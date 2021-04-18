<template>
  <div class="bg-white overflow-hidden rounded-2xl">
    <canvas
      ref="canvas"
      :width="width"
      :height="height"
    />
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue'

export default {
  name: 'DrawingArea',
  props: {
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    facePredictions: Array
  },
  setup (props) {
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

    watch(() => [...props.facePredictions], (predictions) => {
      if (predictions?.length) {
        requestAnimationFrame(renderFrame)
      }
    })

    onMounted(async () => {
      ctx.value = canvas.value.getContext('2d')
      ctx.value.globalCompositeOperation = 'destination-over'
    })

    const renderFrame = async () => {
      ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)

      props.facePredictions.forEach(face => {
        Object.values(face).forEach(objectPoints => {
          drawObject(objectPoints)
        })
      })
    }

    return {
      canvas
    }
  }
}
</script>
