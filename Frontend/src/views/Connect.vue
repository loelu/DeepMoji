<template>
  <div class="flex flex-col justify-center items-center w-screen h-screen">
    <div class="w-96">
      <u-input hint="Target peer ID" v-model="id"/>
      <u-button class="w-32 mx-auto mb-6" size="sm" :disabled="!id || isConnectionOpen" @click="connectPeer">Connect</u-button>
      <u-input hint="Add data" v-model="text"/>
      <u-button class="w-32 mx-auto" size="sm" :disabled="!text || !isConnectionOpen" @click="sendData">Send</u-button>
    </div>
  </div>
</template>

<script>
import { peerJsServerConfig } from '@/config'
import Peer from 'peerjs'

import UInput from '@/components/Input'
import UButton from '@/components/Button'

export default {
  name: 'Connect',
  components: { UButton, UInput },
  data () {
    return {
      peer: null,
      connection: null,
      isConnectionOpen: false,
      id: '',
      text: ''
    }
  },
  methods: {
    initPeer () {
      this.peer = new Peer(peerJsServerConfig)
      this.peer.on('open', (id) => {
        console.log('sender id:', id)
      })
      this.peer.on('error', (error) => {
        console.error(error)
      })
      this.peer.on('connection', (connection) => {
        console.log(connection)
      })
      console.log(this.id)
    },
    connectPeer () {
      this.connection = this.peer.connect(this.id, { reliable: true })
      console.log(this.connection)
      this.connection.on('open', () => {
        console.log('connection open')
        this.isConnectionOpen = true
      })
    },
    sendData () {
      this.connection.send(this.text)
    }
  },
  mounted () {
    this.initPeer()
  }
}
</script>
