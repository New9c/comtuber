
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//      http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
const { FaceLandmarker, FilesetResolver, DrawingUtils } = vision;
const demosSection = document.getElementById("demos");
const videoBlendShapes = document.getElementById("video-blend-shapes");
let faceLandmarker;
let runningMode = "IMAGE";
let enableWebcamButton;
let streamState = false;
let mad = false;
const videoWidth = 480;
// Before we can use HandLandmarker class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
async function createFaceLandmarker() {
	const filesetResolver = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");
	faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
		baseOptions: {
			modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
			delegate: "GPU"
		},
		outputFaceBlendshapes: true,
		runningMode,
		numFaces: 1
	});
	demosSection.classList.remove("invisible");
}
createFaceLandmarker();
/********************************************************************
Main comtuber functionality
********************************************************************/
const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");
// Check if webcam access is supported.
function hasGetUserMedia() {
	return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}
// If webcam supported, add event listener to button for when user
// wants to activate it.
if (hasGetUserMedia()) {
	enableWebcamButton = document.getElementById("webcamButton");
	enableWebcamButton.addEventListener("click", enableCam);
}
else {
	console.warn("getUserMedia() is not supported by your browser");
}
// Enable the live webcam view and start detection.
function enableCam(event) {
	if (!faceLandmarker) {
		console.log("Wait! faceLandmarker not loaded yet.");
		return;
	}
	if (streamState == false) {
		streamState = true;
		enableWebcamButton.innerText = "BRB";
	}
	else {
		streamState = false;
		enableWebcamButton.innerText = "C:";
	}
	// getUsermedia parameters.
	const constraints = {
		video: true
	};
	// Activate the webcam stream.
	navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
		video.srcObject = stream;
		video.addEventListener("loadeddata", predictWebcam);
	});
}
document.getElementById("avatar").addEventListener("click", function() {
	mad = !mad
	console.log("Mood Swapped!");
});
let lastVideoTime = -1;
let results = undefined;
const drawingUtils = new DrawingUtils(canvasCtx);
async function predictWebcam() {
	const radio = video.videoHeight / video.videoWidth;
	video.style.width = videoWidth + "px";
	video.style.height = videoWidth * radio + "px";
	canvasElement.style.width = videoWidth + "px";
	canvasElement.style.height = videoWidth * radio + "px";
	canvasElement.width = video.videoWidth;
	canvasElement.height = video.videoHeight;
	// Now let's start detecting the stream.
	if (runningMode === "IMAGE") {
		runningMode = "VIDEO";
		await faceLandmarker.setOptions({ runningMode: runningMode });
	}
	let startTimeMs = performance.now();
	if (lastVideoTime !== video.currentTime) {
		lastVideoTime = video.currentTime;
		results = faceLandmarker.detectForVideo(video, startTimeMs);
	}
	imagepicker(videoBlendShapes, results.faceBlendshapes);
	// drawBlendShapes(videoBlendShapes, results.faceBlendshapes);
	// Call this function again to keep predicting when the browser is ready.
	if (streamState === true) {
		window.requestAnimationFrame(predictWebcam);
	} else {
		document.getElementById('avatar').src = "imgs/BRB.png";
	}
}

function imagepicker(el, blendShapes) {
	if (!blendShapes.length) {
		return;
	}
	const landmarks = blendShapes[0].categories;
	const blinkThre = 0.5;
	const raiseBrowThre = 0.7;
	const squintThre = 0.02;
	const jawThre = 0.1;
	const smileThre = 0.001;
	const frownThre = 0.01;

	let isBlinking = landmarks[9].score >= blinkThre && landmarks[10].score >= blinkThre;
	let raisedBrow = landmarks[3].score >= raiseBrowThre && landmarks[4].score >= raiseBrowThre && landmarks[5].score >= raiseBrowThre;
	let squinted = landmarks[1].score >= squintThre && landmarks[2].score >= squintThre;
	let notOpenedJaw = landmarks[25].score < jawThre;
	let smiling = landmarks[30].score < smileThre && landmarks[31].score < smileThre;
	let frowning = landmarks[30].score >= frownThre && landmarks[31].score >= frownThre;


	let defArr = ["talking.png", "default.png", "sad.png", "_.png", "wow.png", "stunned.png", "stunned.png", "stunned.png", "haha.png", "smirk.png", "confused.png", "mhm.png", "talking.png", "sleep.png", "sad.png", "tri_.png", "yawn.png", "satisfied.png", "welp.png", "mourn.png", "haha.png", "smirk.png", "confused.png", "confused.png"];
	let madArr = ["_talking.png", "_.png", "pissed.png", "_.png", "wow.png", "stunned.png", "stunned.png", "stunned.png", "uhh.png", "mhm.png", "pissed.png", "mhm.png", "_talking.png", "tri_.png", "pissed.png", "mhm.png", "yawn.png", "satisfied.png", "welp.png", "mourn.png", "uhh.png", "mhm.png", "mad.png", "mhm.png"];
	let idx = 0;
	if (isBlinking) {
		idx += 12
	}
	if (raisedBrow) {
		idx += 4
	} else if (squinted) {
		idx += 8
	}
	if (notOpenedJaw) {
		idx += 1
		if (smiling) {
			idx += 0
		} else if (frowning) {
			idx += 1
		} else {
			idx += 2
		}
	}
	document.getElementById('avatar').src = "imgs/" + (mad ? madArr[idx] : defArr[idx]);
}
/*
function drawBlendShapes(el, blendShapes) {
	if (!blendShapes.length) {
		return;
	}
	console.log(blendShapes[0]);
	let htmlMaker = "";
	blendShapes[0].categories.map((shape) => {
		htmlMaker += `
	  <li class="blend-shapes-item">
		<span class="blend-shapes-label">${shape.displayName || shape.categoryName}</span>
		<span class="blend-shapes-value" style="width: calc(${+shape.score * 100}% - 120px)">${(+shape.score).toFixed(4)}</span>
	  </li>
	`;
	});
	el.innerHTML = htmlMaker;
}
*/
