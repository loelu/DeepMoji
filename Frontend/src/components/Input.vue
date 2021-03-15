<template>
  <div class="flex flex-col">
    <label v-if="label" class="m-2">
        {{ label }}
    </label>
    <div class="flex relative items-center">
      <input
        ref="input"
        :type="computedType"
        :value="computedValue"
        :class="inputClasses"
        :disabled="disabled"
        :placeholder="hint"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
        @keyup.enter="$emit('enter', $event)"
        @input="onInput"
      />
      <u-icon
          v-if="type === 'password'"
          class="absolute right-4"
          :type="isVisible ? 'eye' : 'eye-off'"
          @click="isVisible = !isVisible"
        />
      </div>
    <span
      :class="['text-xs', 'm-2', 'text-red-500', warning ? 'h-4' : 'h-0']"
      :style="{ transition: 'height 0.3s ease' }"
    >
      {{ warning }}
    </span>
  </div>
</template>

<script>
import { inputTypeValidator } from '@/validators'
import UIcon from '@/components/Icon'

export default {
  name: 'UInput',
  components: { UIcon },
  props: {
    modelValue: { // v-model
      type: [String, Number],
      default: ''
    },
    disabled: Boolean,
    label: String,
    hint: String,
    warning: String,
    debounceInput: Boolean,
    type: {
      type: String,
      default: 'text',
      validator: inputTypeValidator
    }
  },
  emits: ['blur', 'enter', 'input', 'focus', 'update:modelValue'],
  data () {
    return {
      isVisible: false,
      debounceTimeout: null
    }
  },
  computed: {
    computedType () {
      if (this.type === 'password') {
        return this.isVisible ? 'text' : 'password'
      }
      return this.type
    },
    computedValue () {
      if (this.type === 'tel') {
        return this.modelValue.replace(
          /([0-9]{3}) ?([0-9]{3})? ?([0-9]{2})? ?([0-9]{2})?/,
          '$1 $2 $3 $4'
        )
      }
      return this.modelValue
    },
    inputClasses () {
      const classes = ['w-full', 'p-4', 'border', 'rounded', 'outline-none', 'flex-1']

      if (this.warning) {
        classes.push('border-red-300', 'focus:border-red-500')
      } else {
        classes.push('border-gray-300', 'focus:border-gray-500')
      }

      if (this.type === 'password') {
        classes.push('pr-8')
      }

      return classes
    }
  },
  methods: {
    onInput (event) {
      const inputValue = event.target.value
      if (this.debounceInput) {
        this.updateTimeout && clearTimeout(this.updateTimeout)
        this.updateTimeout = setTimeout(() => {
          this.emitInput(inputValue)
        }, 300)
      } else {
        this.emitInput(inputValue)
      }
    },
    emitInput (inputValue) {
      let formattedValue = inputValue
      if (this.type === 'tel') {
        formattedValue = inputValue.replace(/[ \D]/g, '')
      }
      this.$emit('input', formattedValue)
      this.$emit('update:modelValue', formattedValue)
    }
  },
  mounted () {
    if (this.type === 'tel') {
      this.$refs.input.maxLength = 13
    }
  }
}
</script>
