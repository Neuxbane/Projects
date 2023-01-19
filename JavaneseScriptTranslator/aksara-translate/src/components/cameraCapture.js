import React, { useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

export function VideoCanvas() {
	const canvasRef = useRef(null);
	const modelRef = useRef(null);
	const videoRef = useRef(null);

	const handleVideo = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true });
			videoRef.current.srcObject = stream;
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
	const loadModel = async () => {
		try {
			const model = await tf.loadGraphModel('./../AI/weights.pb');
			modelRef.current = model;
		} catch (error) {
			console.error(error);
		}
	};

		handleVideo();
		loadModel();


		const resize = () => {
			const canvas = canvasRef.current;
			const video = videoRef.current;

			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
		};

		window.addEventListener('resize', resize);
		resize();

		const drawFrame = async () => {
			const canvas = canvasRef.current;
			const video = videoRef.current;
			const ctx = canvas.getContext('2d');

			const aspectRatio = video.videoHeight / video.videoWidth;

			video.width = canvas.offsetWidth;
			video.height = aspectRatio * canvas.offsetWidth;

			// Draw the detected objects on the canvas
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			const image = tf.browser.fromPixels(canvas);
			const batched = image.expandDims(0);
			const result = modelRef.current.predict(batched);
			const prediction = result.dataSync()[0];
			console.log(prediction);


			ctx.drawImage(video, 0, 0);
			requestAnimationFrame(drawFrame);
		};

		requestAnimationFrame(drawFrame);

		return () => {
			window.removeEventListener('resize', resize);
		};
	}, []);

	return (
		<div className="p-2 w-[100%] md:pl-[6rem] md:pr-[6rem] lg:pl-[12rem] lg:pr-[12rem] xl:pl-[18rem] xl:pr-[18rem] justify-center">
			<div className='overflow-hidden rounded-md'>
				<video ref={videoRef} style={{ display: 'none' }} autoPlay />
				<canvas ref={canvasRef} width='auto' height='auto' style={{ width: '100%' }} />
			</div>
		</div>
	);
}
