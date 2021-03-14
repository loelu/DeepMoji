<template>
  <span ref="wrapper" :class="wrapperClasses"></span>
</template>

<script>
import { colorValidator, iconTypeValidator } from '@/validators'

export default {
  name: 'UIcon',
  props: {
    type: {
      type: String,
      default: 'help-circle',
      validator: iconTypeValidator
    },
    color: {
      type: String,
      validator: colorValidator
    },
    size: {
      type: String,
      default: 'base',
      validator: (value) => ['xs', 'sm', 'base', 'lg', 'xl', '2xl'].includes(value)
    },
    crispEdges: Boolean
  },
  computed: {
    wrapperClasses () {
      const classes = []
      switch (this.color) {
        case 'black':
          classes.push('text-black')
          break
        case 'white':
          classes.push('text-white')
          break
        case 'gray':
          classes.push('text-gray-500')
          break
        case 'red':
          classes.push('text-red-500')
          break
        case 'green':
          classes.push('text-green-500')
          break
      }
      if (this.$attrs.onClick) classes.push('cursor-pointer')
      return classes
    }
  },
  watch: {
    type: {
      handler (newType) {
        this.updateIcon(newType)
      },
      immediate: true
    }
  },
  methods: {
    async updateIcon (type) {
      const { icons } = await import('feather-icons')
      const rootFontSize = parseInt(getComputedStyle(document.querySelector(':root')).fontSize)
      const icon = icons[type]
      if (icon) {
        let pixelSize
        switch (this.size) {
          case 'xs':
            pixelSize = 0.75 * rootFontSize
            break
          case 'sm':
            pixelSize = 0.875 * rootFontSize
            break
          case 'base':
            pixelSize = rootFontSize
            break
          case 'lg':
            pixelSize = 1.125 * rootFontSize
            break
          case 'xl':
            pixelSize = 1.25 * rootFontSize
            break
          case '2xl':
            pixelSize = 1.5 * rootFontSize
            break
        }
        const options = {
          width: pixelSize,
          height: pixelSize
        }
        if (this.crispEdges) {
          options['shape-rendering'] = 'crispEdges'
        }
        this.$refs.wrapper.innerHTML = icon.toSvg(options)
      }
    }
  }
}
</script>
