const tf = require('@tensorflow/tfjs');
const fs = require('fs');

const text = fs.readFileSync('text.txt', 'utf8');

const charSet = Array.from(new Set(text.split('')));
const dataSize = text.length;
const vocabSize = charSet.length;

const charToIndex = charSet.reduce((obj, char, i) => {
	obj[char] = i;
	return obj;
}, {});

const indexToChar = charSet.reduce((arr, char, i) => {
	arr[i] = char;
	return arr;
}, []);

const inputText = text.split('');
const inputSize = 100;
const outputSize = 1;

const input = tf.tensor(inputText.map(char => charToIndex[char]));
const output = input.slice([inputSize], [outputSize]);

const model = tf.sequential();

model.add(tf.layers.lstm({
	units: 256,
	inputShape: [inputSize, vocabSize],
	returnSequences: true
}));

model.add(tf.layers.dropout(0.2));

model.add(tf.layers.lstm({
	units: 256,
	returnSequences: true
}));

model.add(tf.layers.dropout(0.2));

model.add(tf.layers.lstm({
	units: 256
}));

model.add(tf.layers.dropout(0.2));

model.add(tf.layers.dense({
	units: vocabSize,
	activation: 'softmax'
}));

const optimizer = tf.train.rmsprop(0.01);

model.compile({
	optimizer,
	loss: 'categoricalCrossentropy'
});

const oneHot = (i) => {
	const arr = new Array(vocabSize).fill(0);
	arr[i] = 1;
	return arr;
};

const xs = tf.tensor(inputText.slice(0, -1).map((char, i) => oneHot(charToIndex[char])));
const ys = tf.tensor(inputText.slice(1).map((char, i) => oneHot(charToIndex[char])));

model.fit(xs, ys, {
	epochs: 100,
	callbacks: {
		onEpochEnd: async (epoch, log) => {
			console.log(`Epoch ${epoch}: loss = ${log.loss}`);
			const seed = 'I';
			const temperature = 0.5;
			const generated = await generateText(model, seed, temperature);
			console.log(generated);
		}
	}
});

async function generateText(model, seed, temperature) {
	let generated = '';
	let sentence = seed;
	let state = null;
	while (sentence.length < 100) {
		const inputBuffer = tf.buffer([1, inputSize, vocabSize]);
		for (let i = 0; i < inputSize; i++) {
			inputBuffer.set(1, 0, i, charToIndex[sentence[sentence.length - inputSize + i]]);
		}
		const input = inputBuffer.toTensor();
		const output = model.predict(input, {
			initialState: state
		});
		const logits = output.as1D();
		const probs = tf.div(tf.exp(tf.div(logits, temperature)), tf.sum(tf.exp(tf.div(logits, temperature))));
		const charIndex = (await probs.data())[0];
		generated += indexToChar[charIndex];
		sentence = sentence.slice(1) + indexToChar[charIndex];
		state = output.slice([0, outputSize - 1], [1, outputSize]);
	}
	return generated;
}