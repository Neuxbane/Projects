const COLOR = {
	Reset: "\x1b[0m",

	Bright: "\x1b[1m",
	Dim: "\x1b[2m",
	Underscore: "\x1b[4m",
	Blink: "\x1b[5m",
	Reverse: "\x1b[7m",
	Hidden: "\x1b[8m",

	FgBlack: "\x1b[30m",
	FgRed: "\x1b[31m",
	FgGreen: "\x1b[32m",
	FgYellow: "\x1b[33m",
	FgBlue: "\x1b[34m",
	FgMagenta: "\x1b[35m",
	FgCyan: "\x1b[36m",
	FgWhite: "\x1b[37m",

	BgBlack: "\x1b[40m",
	BgRed: "\x1b[41m",
	BgGreen: "\x1b[42m",
	BgYellow: "\x1b[43m",
	BgBlue: "\x1b[44m",
	BgMagenta: "\x1b[45m",
	BgCyan: "\x1b[46m",
	BgWhite: "\x1b[47m",
}


class NeuxNet {
	network=[];
	constructor(){

	}
}

const learningRate = 1.7;
let m = Math.random();
let b = Math.random();

function predict(x) {
	return Math.tanh(m * x + b);
}

function loss(prediction, target) {
	return (prediction - target) ** 2;
}

function train(x, y) {
	const prediction = predict(x);
	const error = loss(prediction, y);

	let d_prediction = prediction - y
	let d_tanh = 1 - d_prediction ** 2
	let d = d_tanh * d_prediction;
	let d_m = d * x
	let d_b = d

	m -= learningRate * d_m;
	b -= learningRate * d_b;

	return error;
}

const data = [
	{ x: -3, y: -1 },
	{ x: -2, y: -1 },
	{ x: 3, y: 1 },
	{ x: 1, y: 1 },
];

for (let i = 0; i < 30; i++) {
	let totalError = 0;
	for (const example of data) {
		const x = example.x;
		const y = example.y;
		totalError += train(x, y);
	}
	console.log(`Epoch ${i + 1}: Loss = ${totalError / data.length}`);
}

console.log(`Final m: ${m}`);
console.log(`Final b: ${b}`);

// print the result
for (const example of data) {
	const prediction = predict(example.x)
	console.log((Math.abs(prediction-example.y) < 0.1 ? COLOR.FgGreen : COLOR.FgRed) + example.x + ' -> ' + `${prediction} (${example.y})`);
}