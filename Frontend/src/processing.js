import { webcam as tfWebcam } from '@tensorflow/tfjs-data'
import { load, SupportedPackages } from '@tensorflow-models/face-landmarks-detection'
import * as tf from '@tensorflow/tfjs'

import '@tensorflow/tfjs-backend-cpu'
import '@tensorflow/tfjs-backend-webgl'
import { chunk } from 'lodash'

export async function getMediaPipeModel () {
  return await load(
    SupportedPackages.mediapipeFacemesh
  )
}

export async function getModel () {
  const modelPath = `${window.location.origin}/deepmoji_tfjs_300w_lp/model.json`
  return await tf.loadLayersModel(modelPath)
}

export async function getWebcam (videoElement) {
  return await tfWebcam(videoElement)
}

export async function getFacePredictionsMediaPipe (model, inputImage) {
  /**
   * @type {[*]}
   */
  const predictions = await model.estimateFaces({ input: inputImage })
  return predictions.map(face => {
    const keyPoints = face.annotations
    return {
      silhouette: keyPoints.silhouette,
      leftEye: keyPoints.leftEyeLower0.concat(keyPoints.leftEyeUpper0.reverse()),
      leftEyeBrow: keyPoints.leftEyebrowLower.concat(keyPoints.leftEyebrowUpper.reverse()),
      rightEye: keyPoints.rightEyeLower0.concat(keyPoints.rightEyeUpper0.reverse()),
      rightEyeBrow: keyPoints.rightEyebrowLower.concat(keyPoints.rightEyebrowUpper.reverse()),
      lipsInner: keyPoints.lipsLowerInner.concat(keyPoints.lipsUpperInner.reverse()),
      lipsOuter: keyPoints.lipsLowerOuter.concat(keyPoints.lipsUpperOuter.reverse()),
      noseLine: keyPoints.midwayBetweenEyes.concat(keyPoints.noseTip),
      nose: keyPoints.noseLeftCorner.concat(keyPoints.noseBottom).concat(keyPoints.noseRightCorner)
    }
  })
}

export async function getFacePredictions (model, inputImage) {
  /**
   * @type {[*]}
   */
  const img = tf.tensor4d(Array.from(inputImage.dataSync()), [1, 450, 450, 3])
  const predictions = await model.predict(img)
  const keyPoints = chunk(Array.from(predictions.dataSync()), 2)
  return [{
    silhouette: keyPoints.slice(0, 17),
    leftEye: keyPoints.slice(36, 42),
    leftEyeBrow: keyPoints.slice(17, 22),
    rightEye: keyPoints.slice(42, 48),
    rightEyeBrow: keyPoints.slice(22, 27),
    lipsInner: keyPoints.slice(48, 60),
    lipsOuter: keyPoints.slice(60, 68),
    noseLine: keyPoints.slice(27, 31),
    nose: keyPoints.slice(31, 36)
  }]
}
