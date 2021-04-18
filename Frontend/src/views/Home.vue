<template>
  <div class="flex flex-col justify-center items-center w-screen h-screen p-8">
    <div class="w-128 h-72 max-w-full bg-white rounded-2xl overflow-hidden shadow-lg p-8 bg-opacity-90">
      <div class="text-center text-4xl text-semibold text-gray-700 tracking-wide my-8">
        DeepMoji
      </div>
      <div class="flex space-x-4 justify-center">
        <u-button @click="$router.push({ name: 'Receive' })">
          Receive
        </u-button>
        <u-button @click="$router.push({ name: 'Connect' })">
          Connect
        </u-button>
      </div>
    </div>
  </div>
</template>

<script>
import UButton from '@/components/Button'

export default {
  name: 'Home',
  components: { UButton }
}
</script>
