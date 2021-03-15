<template>
  <div v-if="isConnectionOpen">
    <div>Connected</div>
  </div>
  <div v-else>
    <div>waiting for connection...</div>
    <div>id: {{ peerId }}</div>
  </div>
</template>

<script>
import { peerJsServerConfig } from '@/config'
import Peer from 'peerjs'

export default {
  name: 'Receive',
  data () {
    return {
      peer: null,
      peerId: '',
      connection: null,
      isConnectionOpen: false
    }
  },
  methods: {
    initPeer () {
      this.peer = new Peer(peerJsServerConfig)
      this.peer.on('open', (id) => {
        this.peerId = id
      })
      this.peer.on('error', (error) => {
        console.error(error)
      })
      this.peer.on('connection', (connection) => {
        console.log('onConnection')
        if (!this.connection) {
          this.connection = connection
          this.connection.on('open', () => {
            console.log('onOpen')
            this.isConnectionOpen = true
          })
          this.connection.on('data', this.handleData)
        }
      })
    },
    handleData (data) {
      console.log(data)
    }
  },
  mounted () {
    this.initPeer()
  }
}
</script>
