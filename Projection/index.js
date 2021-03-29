require("babel-core/register");
require("babel-polyfill");
require('@tensorflow/tfjs-backend-cpu');
const Plotly = require('plotly.js-dist');
const faceLandmarksDetection = require('@tensorflow-models/face-landmarks-detection');
const tfData = require('@tensorflow/tfjs-data');

// If you are using the WebGL backend:
require('@tensorflow/tfjs-backend-webgl');

let model;
let webcam
let webcamElement = document.getElementById("webcam")
let capturing = false

const canvas = document.getElementById('plottingCanvas');
const ctx = canvas.getContext('2d');

async function capture() {
    capturing = true

    while (capturing) {
        const img = await webcam.capture();
        const predictions = await model.estimateFaces({input: img});
        console.log(predictions)
        if (predictions.length > 0) {
            ctx.globalCompositeOperation = 'destination-over';
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < predictions.length; i++) {
                const keypoints = predictions[i].annotations;
                // silhouette
                drawObject(keypoints.silhouette);

                // left eye
                const leftEyeKeypoints = keypoints.leftEyeLower0.concat(keypoints.leftEyeUpper0.reverse())
                drawObject(leftEyeKeypoints);

                // left eyebrow
                const leftEyeBrowKeypoints = keypoints.leftEyebrowLower.concat(keypoints.leftEyebrowUpper.reverse())
                drawObject(leftEyeBrowKeypoints);

                // right eye
                const rightEyeKeypoints = keypoints.rightEyeLower0.concat(keypoints.rightEyeUpper0.reverse())
                drawObject(rightEyeKeypoints);

                // right eyebrow
                const rightEyeBrowKeypoints = keypoints.rightEyebrowLower.concat(keypoints.rightEyebrowUpper.reverse())
                drawObject(rightEyeBrowKeypoints);

                // lips inner
                const lipsInnerKeypoints = keypoints.lipsLowerInner.concat(keypoints.lipsUpperInner.reverse())
                drawObject(lipsInnerKeypoints);

                // lips outer
                const lipsOuterKeypoints = keypoints.lipsLowerOuter.concat(keypoints.lipsUpperOuter.reverse())
                drawObject(lipsOuterKeypoints);

                // nose line
                const noseLineKeypoints = keypoints.midwayBetweenEyes.concat(keypoints.noseTip)
                drawObject(noseLineKeypoints);

                // nose
                const noseKeypoints = keypoints.noseLeftCorner.concat(keypoints.noseBottom).concat(keypoints.noseRightCorner)
                drawObject(noseKeypoints);
            }
        }
    }
}

function drawObject(keypoints) {
    ctx.beginPath();
    for (let i = 0; i < keypoints.length; i++) { 
        keypoint = keypoints[i];
        if (i==0) {
            ctx.moveTo(keypoint[0], keypoint[1]);
        }
        ctx.lineTo(keypoint[0], keypoint[1]);
    }
    ctx.closePath();
    ctx.stroke();
}

async function main() {
    model = await faceLandmarksDetection.load(
        faceLandmarksDetection.SupportedPackages.mediapipeFacemesh);    

    webcam = await tfData.webcam(webcamElement);
    const imgtemp = await webcam.capture();
    imgtemp.dispose()

    document.getElementById("capture").addEventListener("click", function () {
        capture()
    })

    document.getElementById("stop").addEventListener("click", function () {
        capturing = false
    })
}


main();