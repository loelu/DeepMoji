<template>
  <button :class="computedClasses" @click="onClick">
    <slot/>
  </button>
</template>

<script>
export default {
  name: 'UButton',
  props: {
    type: {
      type: String,
      default: 'primary'
    },
    size: {
      type: String,
      default: 'base'
    },
    disabled: Boolean,
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click'],
  computed: {
    computedClasses () {
      const classes = ['flex', 'items-center', 'justify-center', 'focus:outline-none', 'rounded-2xl', 'border', 'transition-colors']

      if (this.disabled) {
        classes.push('cursor-not-allowed', 'opacity-50')
      } else {
        classes.push('cursor-pointer')
      }

      switch (this.type) {
        case 'primary':
          classes.push('bg-green-500', 'text-white', 'border-green-500')
          !this.disabled && classes.push('hover:bg-green-600', 'hover:bg-opacity-75')
          break
        case 'secondary':
          classes.push('bg-white', 'hover:bg-green-50', 'text-green-500', 'border-green-500')
          !this.disabled && classes.push('hover:bg-green-50')
          break
        case 'tertiary':
          classes.push('bg-white', 'hover:bg-gray-50', 'text-gray-400', 'border-transparent')
          !this.disabled && classes.push('hover:bg-gray-50')
          break
        default:
          classes.push('text-gray-400')
      }

      switch (this.size) {
        case 'sm':
          classes.push('text-sm', 'px-5', 'py-2.5')
          break
        case 'base':
          classes.push('text-base', 'px-6', 'py-4')
          break
        case 'lg':
          classes.push('text-lg', 'px-8', 'py-6')
          break
      }
      return classes
    }
  },
  methods: {
    onClick (event) {
      if (!this.disabled) {
        this.$emit('click', event)
      }
    }
  }
}
</script>
