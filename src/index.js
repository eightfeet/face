import './style/common.scss';
import * as faceapi from 'face-api.js/dist/face-api.min';
const imgbox = document.getElementById('imgbox');
const file = document.getElementById('file');

Promise.all([
	faceapi.nets.tinyFaceDetector.loadFromUri('/assets'),
	faceapi.nets.faceLandmark68Net.loadFromUri('/assets'),
	faceapi.nets.faceRecognitionNet.loadFromUri('/assets'),
	faceapi.nets.faceExpressionNet.loadFromUri('/assets')
]).then(() => {
	file.addEventListener('change', onChange);
});

async function onChange() {
	const imgFile = file.files[0];
	const faceImg = await faceapi.bufferToImage(imgFile);
	imgbox.innerHTML='';
	const img = document.createElement('img');
	img.setAttribute('src', faceImg.src);
	imgbox.append(img);
	img.onload = async () => {
		const canvas = faceapi.createCanvasFromMedia(img);
		imgbox.append(canvas);
		const displaySize = { width: img.width, height: img.height };
		faceapi.matchDimensions(canvas, displaySize);
		const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
		const resizedDetections = faceapi.resizeResults(detections, displaySize);
		canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
		// faceapi.draw.drawDetections(canvas, resizedDetections);
		// faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
		faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
		if (resizedDetections[0]) {
			const points = resizedDetections[0].landmarks.positions;

			const pA = points[17];
			const pB = points[26];
			const pC = points[45];
			const pD = points[36];

			const ctx=canvas.getContext("2d");
			ctx.fillStyle="red";
			
			ctx.moveTo(pA.x,pA.y);
			ctx.lineTo(pB.x,pB.y);
			ctx.lineTo(pC.x,pC.y);
			ctx.lineTo(pD.x,pD.y);
			ctx.lineTo(pA.x,pA.y);
			ctx.stroke();

			// 求钜行长度
			const L = Math.sqrt(Math.pow((pB.x - pA.x), 2) + Math.pow((pB.y - pA.y), 2));
			// 求角度
			const ANGLE = Math.atan((pB.y - pA.y)/(pB.x - pA.x))*180/Math.PI;

			const Papa = document.getElementById('imgbox');
			const rec = document.createElement('div');
			rec.style.width = `${L}px`;
			rec.style.height = `${L/2}px`;
			rec.style.position = 'absolute';
			rec.style.left = `${pA.x}px`;
			rec.style.top = `${pA.y}px`;
			rec.style.backgroundColor = 'rgba(255, 255, 0, 0.5)';
			rec.style.webkitTransformOrigin = '0 0';
			rec.style.transformOrigin = '0 0';
			rec.style.transform = `rotate(${ANGLE}deg)`;
			rec.style.webkitTransform = `rotate(${ANGLE}deg)`;
			Papa.appendChild(rec);
		}
	};
}
