const peerJsServerConfig = {}

if (process.env.VUE_APP_PEER_SERVER_HOST) {
  peerJsServerConfig.host = process.env.VUE_APP_PEER_SERVER_HOST
}

if (process.env.VUE_APP_PEER_SERVER_PATH) {
  peerJsServerConfig.path = process.env.VUE_APP_PEER_SERVER_PATH
}

if (process.env.VUE_APP_PEER_SERVER_PORT) {
  peerJsServerConfig.port = process.env.VUE_APP_PEER_SERVER_PORT
}

if (process.env.VUE_APP_PEER_SERVER_KEY) {
  peerJsServerConfig.key = process.env.VUE_APP_PEER_SERVER_KEY
}

export {
  peerJsServerConfig
}
