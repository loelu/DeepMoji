<template>
  <div class="flex flex-col justify-center items-center w-screen h-screen">
    <u-button class="mb-4" @click="$router.push({ name: 'Receive' })">
      Receive
    </u-button>
    <u-button @click="$router.push({ name: 'Connect' })">
      Connect
    </u-button>
  </div>
</template>

<script>
import UButton from '@/components/Button'

export default {
  name: 'Home',
  components: { UButton }
}
</script>
