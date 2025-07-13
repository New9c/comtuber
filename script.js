
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
const { FaceLandmarker, FilesetResolver } = vision;
const videoBlendShapes = document.getElementById("video-blend-shapes");
let faceLandmarker;
const runningMode = "VIDEO";
let streamOn = true;
const videoWidth = 480;
let settings = {
	"faces": {
		"BRB": "imgs/BRB.png",
		"ds": "imgs/default.png",
		"df": "imgs/sad.png",
		"dn": "imgs/_.png",
		"do": "imgs/talking.png",
		"dop": "imgs/_talking.png",
		"rs": "imgs/stunned.png",
		"rf": "imgs/stunned.png",
		"rn": "imgs/stunned.png",
		"ro": "imgs/wow.png",
		"ss": "imgs/smirk.png",
		"sf": "imgs/confused.png",
		"sn": "imgs/mhm.png",
		"so": "imgs/haha.png",
		"sop": "imgs/uhh.png",
		"bsop": "imgs/uhh.png",
	},
	"bgColor": "transparent",
	"radius": "5px",
	"blinkThre": 0.5,
	"raiseBrowThre": 0.7,
	"squintThre": 0.02,
	"jawThre": 0.1,
	"smileThre": 0.001,
	"frownThre": 0.01,
	"puckThre": 0.4,
}
// Before we can use HandLandmarker class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
function startCam() {
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
async function createFaceLandmarker() {
	// Create Face Landmarker
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
	// Start Cam
	startCam();
}
createFaceLandmarker();

// Main comtuber functionality

const video = document.getElementById("webcam");
const avatar = document.getElementById("avatar");
const img = document.getElementById('imgInput');
const json = document.getElementById('jsonInput');
const fileUpload = document.getElementById('file-upload');
const exportJSON = document.getElementById('export');
const canvasElement = document.getElementById("output_canvas");
let modImg = null;
let modJson = null;
// Check if webcam access is supported.
function hasGetUserMedia() { return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia); }

function toggleCam() {
	streamOn = !streamOn;
	if (streamOn) startCam();
}
if (!hasGetUserMedia()) document.getElementById("faceCode").innerText = "NO CAMERA FOUND D:";

//document.getElementById("oriModBtn").addEventListener("click", oriModFaces);
document.getElementById("modBtn").addEventListener("click", function() {
	let modVal = document.getElementById('face-to-mod').value.trim();
	modFaces(modVal, modImg)
});

img.addEventListener('change', (event) => { modImg = event.target.files[0]; });
json.addEventListener('change', (event) => {
	if (json.files.length > 0) {
		fileUpload.textContent = json.files[0].name;
	} else {
		fileUpload.textContent = 'Add your file :3';
	}
	modJson = event.target.files[0];
	importJSON()
});

avatar.addEventListener("click", function() {
	toggleCam();
});
avatar.addEventListener("contextmenu", function() {
	event.preventDefault();
	json.click();
});

exportJSON.addEventListener("click", downloadJSON)
const base12 = ["BRB", "ds", "dn", "df", "do", "rs", "rn", "rf", "ro", "ss", "sn", "sf", "so"];
for (let i = 0; i < base12.length; i++) {
	let deFace = document.getElementById(base12[i]);
	let deLabel = document.getElementById("l-" + base12[i]);
	deFace.addEventListener("change", (event) => {
		if (deFace.files.length > 0) {
			deLabel.textContent = deFace.files[0].name;
		} else {
			deLabel.textContent = 'Choose an image :3';
		}
		modFaces(base12[i], event.target.files[0])
	})
}
let lastVideoTime = -1;
let results = undefined;

let lastFrameTime = 0;
const targetFPS = 10;
const frameInterval = 1000 / targetFPS;

function requestFrame() {
	if (streamOn === true) {
		window.requestAnimationFrame(predictWebcam);
	} else {
		avatar.src = settings.faces.BRB;
		document.getElementById('faceCode').innerText = "Be Right Back"
	}
};
async function predictWebcam(timestamp) {
	// Time checker: only proceed if enough time has passed
	if (timestamp - lastFrameTime < frameInterval) {
		requestFrame();
		return;
	}
	//console.log("Interval:", frameInterval, "Elapsed since last frame:", timestamp - lastFrameTime);
	lastFrameTime = timestamp; // Update last frame time

	let startTimeMs = performance.now();
	if (lastVideoTime !== video.currentTime) {
		lastVideoTime = video.currentTime;
		results = faceLandmarker.detectForVideo(video, startTimeMs);
	}
	imagePicker(results.faceBlendshapes);
	drawBlendShapes(videoBlendShapes, results.faceBlendshapes);
	requestFrame();
}
function setupCanvas() {
	const radio = video.videoHeight / video.videoWidth;
	video.style.width = videoWidth + "px";
	video.style.height = videoWidth * radio + "px";
	canvasElement.style.width = videoWidth + "px";
	canvasElement.style.height = videoWidth * radio + "px";
	canvasElement.width = video.videoWidth;
	canvasElement.height = video.videoHeight;
}
function imagePicker(blendShapes) {
	if (!blendShapes.length) {
		return;
	}
	const landmarks = blendShapes[0].categories;

	let isBlinking = landmarks[9].score >= settings.blinkThre && landmarks[10].score >= settings.blinkThre;
	let raisedBrow = landmarks[3].score >= settings.raiseBrowThre && landmarks[4].score >= settings.raiseBrowThre && landmarks[5].score >= settings.raiseBrowThre;
	let squinted = landmarks[1].score >= settings.squintThre && landmarks[2].score >= settings.squintThre;
	let openedJaw = landmarks[25].score >= settings.jawThre;
	let smiling = landmarks[30].score < settings.smileThre && landmarks[31].score < settings.smileThre;
	let frowning = landmarks[30].score >= settings.frownThre && landmarks[31].score >= settings.frownThre;
	let isPucker = landmarks[38].score >= settings.puckThre;

	let faceCode = "";
	if (squinted) {
		faceCode += "s";
	} else if (raisedBrow) {
		faceCode += "r";
	} else {
		faceCode += "d";
	}
	if (openedJaw) {
		faceCode += "o";
	} else if (smiling) {
		faceCode += "s";
	} else if (frowning) {
		faceCode += "f";
	} else {
		faceCode += "n";
	}
	if (isBlinking) {
		faceCode = "b" + faceCode;
	}
	if (isPucker) {
		faceCode += "p";
	}
	document.getElementById('faceCode').innerText = faceCode
	if (settings.faces[faceCode] === undefined && faceCode[faceCode.length - 1] === 'p') {
		faceCode = faceCode.slice(0, -1);
	}

	if (settings.faces[faceCode] === undefined && faceCode[0] === 'b') {
		faceCode = faceCode.slice(1);
	}
	document.getElementById('avatar').src = settings.faces[faceCode];
}
function drawBlendShapes(el, blendShapes) {
	setupCanvas();
	if (!blendShapes.length) {
		return;
	}
	//console.log(blendShapes[0]);
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
function modFaces(modVal, theImg) {
	if (!theImg) {
		alert('Pls upload something at least D:');
		return;
	}

	// Only accept image files
	if (!theImg.type.startsWith('image/')) {
		alert('Please upload an image D:');
		return;
	}
	const reader = new FileReader();
	reader.onload = (e) => {
		settings.faces[modVal] = e.target.result;
		//settings.faces[modVal] = `url(${e.target.result})`;
	};
	reader.readAsDataURL(theImg);
}
function importJSON() {
	if (!modJson) {
		alert('Pls choose a JSON file.');
		return;
	}

	const reader = new FileReader();
	reader.onload = (e) => {
		try {
			const importedSettings = JSON.parse(e.target.result);
			settings = importedSettings;
		} catch (err) {
			alert('Invalid JSON file.');
		}
	};
	reader.readAsText(modJson);
}
function downloadJSON() {
	const jsonStr = JSON.stringify(settings, null, 2);
	const blob = new Blob([jsonStr], { type: 'application/json' });
	const url = URL.createObjectURL(blob);
	const name = document.getElementById("exportName").value.trim() + ".json";
	const a = document.createElement('a');
	a.href = url;
	a.download = name == ".json" ? "Comtuber.json" : name;
	a.click();

	URL.revokeObjectURL(url);
}

const bgColor = document.getElementById("bgcolor")
const radius = document.getElementById("radius")
bgColor.addEventListener("change", changeBgColor);
radius.addEventListener("change", changeRadius);

function changeBgColor() {
	const isValidHex = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(bgColor.value.trim());
	settings.bgColor = isValidHex ? input : "transparent";
	avatar.style.backgroundColor = settings.bgColor;
}
function changeRadius() {
	settings.radius = radius.value.trim();
	avatar.style.borderRadius = settings.radius;
}
changeBgColor();
changeRadius();

const thres = ["blinkThre", "raiseBrowThre", "squintThre", "jawThre", "smileThre", "frownThre", "puckThre"];
for (let i = 0; i < thres.length; i++) {
	let deThre = document.getElementById(thres[i]);
	deThre.addEventListener("change", function() {
		let val = parseFloat(deThre.value);
		if (isNaN(val)) {
			deThre.value = settings[thres[i]];
			return
		}
		val = val < 0 ? 0 : val;
		val = val > 1 ? 1 : val;
		settings[thres[i]] = val;
		deThre.value = val;
	})
	deThre.value = settings[thres[i]];
}
