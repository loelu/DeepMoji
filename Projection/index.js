const Plotly = require('plotly.js-dist');
const faceLandmarksDetection = require('@tensorflow-models/face-landmarks-detection');

// If you are using the WebGL backend:
require('@tensorflow/tfjs-backend-webgl');

let model;
let webcam
let webcamElement = document.getElementById("webcam")
let capturing = false

async function capture() {
    capturing = true

    while (capturing) {
        const img = await webcam.capture();
        const predictions = await model.estimateFaces(img);

        if (predictions.length > 0) {
           
            let a = []; b = []; c = []
            for (let i = 0; i < predictions.length; i++) {
                const keypoints = predictions[i].mesh;
                // Log facial keypoints.
                for (let i = 0; i < keypoints.length; i++) {
                    const [x, y, z] = keypoints[i];
                    a.push(y)
                    b.push(x)
                    c.push(z)
                }
            }

            // Plotting the mesh
            var data = [
                {
                    opacity: 0.8,
                    color: 'rgb(300,100,200)',
                    type: 'mesh3d',
                    x: a,
                    y: b,
                    z: c,
                }
            ];
            Plotly.newPlot('plot', data)

        }
    }
}

async function main() {
    // Load the MediaPipe facemesh model.
    // model = await facemesh.load();
    model = await faceLandmarksDetection.load(
        faceLandmarksDetection.SupportedPackages.mediapipeFacemesh);    
    console.log("Model loaded")

    webcam = await tf.data.webcam(webcamElement);
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