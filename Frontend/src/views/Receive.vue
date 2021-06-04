<template>
  <div class="flex flex-col space-y-8 items-center p-8">
    <div class="w-96">
      <div v-if="isConnectionOpen">
        <div>Connected</div>
      </div>
      <div v-else>
        <div>waiting for connection...</div>
        <div>id: {{ peerId }}</div>
      </div>
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
import VideoCapture from '@/components/VideoCapture'

export default {
  name: 'Receive',
  components: {
    DrawingArea,
    VideoCapture
  },
  data () {
    return {
      peer: null,
      peerId: '',
      connection: null,
      isConnectionOpen: false,
      predictions: [],
      remotePredictions: []
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
      this.peer.on('call', async (mediaConnection) => {
        const localStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false
        })
        mediaConnection.answer(localStream)
        mediaConnection.on('stream', (stream) => {
          this.$refs.audio.srcObject = stream
        })
      })
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
