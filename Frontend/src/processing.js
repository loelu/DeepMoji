import { webcam as tfWebcam } from '@tensorflow/tfjs-data'
import { load, SupportedPackages } from '@tensorflow-models/face-landmarks-detection'

import '@tensorflow/tfjs-backend-cpu'
import '@tensorflow/tfjs-backend-webgl'

export async function getModel () {
  return await load(
    SupportedPackages.mediapipeFacemesh
  )
}

export async function getWebcam (videoElement) {
  return await tfWebcam(videoElement)
}

export async function getFacePredictions (model, inputImage) {
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
