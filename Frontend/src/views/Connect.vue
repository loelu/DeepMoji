<template>
  <div class="flex flex-col space-y-8 items-center p-8">
    <div class="w-96 bg-white rounded-2xl overflow-hidden bg-opacity-90 p-4">
      <u-input hint="Target peer ID" v-model="id"/>
      <u-button class="w-32 mx-auto mb-6" size="sm" :disabled="!id || isConnectionOpen" @click="connectPeer">Connect</u-button>
    </div>
    <div class="flex items-start space-x-4">
      <suspense>
        <video-capture
          :width="450"
          :height="450"
          :show-video="true"
          @capture="onCapture"
        />
      </suspense>
      <drawing-area
        :width="450"
        :height="450"
        :face-predictions="predictions"
      />
      <audio ref="audio" autoplay/>
    </div>
  </div>
</template>

<script>
import { peerJsServerConfig } from '@/config'
import Peer from 'peerjs'

import DrawingArea from '@/components/DrawingArea'
import UInput from '@/components/Input'
import UButton from '@/components/Button'
import VideoCapture from '@/components/VideoCapture'

export default {
  name: 'Connect',
  components: { VideoCapture, DrawingArea, UButton, UInput },
  data () {
    return {
      peer: null,
      connection: null,
      mediaConnection: null,
      isConnectionOpen: false,
      id: '',
      text: '',
      predictions: []
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
    async connectPeer () {
      this.connection = this.peer.connect(this.id, { reliable: true })
      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      })
      console.log(localStream)
      this.mediaConnection = this.peer.call(this.id, localStream)

      this.connection.on('open', () => {
        console.log('connection open')
        this.isConnectionOpen = true
      })
      this.mediaConnection.on('stream', (remoteStream) => {
        this.$refs.audio.srcObject = remoteStream
      })
    },
    sendData () {
      this.connection.send(this.text)
    },
    onCapture (facePredictions) {
      this.predictions = facePredictions
      this.connection.send(facePredictions)
    }
  },
  mounted () {
    this.initPeer()
  }
}
</script>
