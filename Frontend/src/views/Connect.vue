<template>
  <div class="flex flex-col space-y-8 items-center p-8">
    <div class="w-96 bg-white rounded-2xl overflow-hidden bg-opacity-90 p-4">
      <u-input hint="Target peer ID" v-model="id"/>
      <u-button class="w-32 mx-auto mb-6" size="sm" :disabled="!id || isConnectionOpen" @click="connectPeer">Connect</u-button>
    </div>
    <div class="flex items-start space-x-4">
      <suspense>
        <video-capture
          :width="400"
          :height="400"
          @capture="onCapture"
        />
      </suspense>
      <drawing-area
        :width="400"
        :height="400"
        :face-predictions="remotePredictions"
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
      predictions: [],
      remotePredictions: []
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

      this.connection.on('data', this.handleData)

      this.mediaConnection.on('stream', (remoteStream) => {
        this.$refs.audio.srcObject = remoteStream
      })
    },
    sendData () {
      this.connection.send(this.text)
    },
    handleData (data) {
      if (Array.isArray(data)) {
        this.remotePredictions = data
      }
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
