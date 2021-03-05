<template>
  <div>waiting for connection...</div>
  <div>id: {{ peer.id }}</div>
</template>

<script>
import { ref } from 'vue'
import Peer from 'peerjs'

export default {
  name: 'Receive',
  setup () {
    const peer = new Peer()
    const connection = ref(null)

    peer.on('connection', (newConnection) => {
      connection.value = newConnection
    })

    return {
      peer,
      connection
    }
  }
}
</script>
