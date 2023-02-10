const tf = require('@tensorflow/tfjs');
const fs = require('fs');


async function loadData() {
	const data = await fs.promises.readFile('conversation.txt', 'utf-8');
	return data.split('\n');
}


async function preprocessData(data) {
	// split the data into words
	let words = [];
	for (let line of data) {
		words = words.concat(line.split(' '));
	}

	// create a vocabulary of unique words
	let vocab = Array.from(new Set(words));

	// create a mapping from words to integers
	let wordToIndex = {};
	for (let i = 0; i < vocab.length; i++) {
		wordToIndex[vocab[i]] = i;
	}

	// create a mapping from integers to words
	let indexToWord = {};
	for (let i = 0; i < vocab.length; i++) {
		indexToWord[i] = vocab[i];
	}

	// encode the data as integers
	let encoded = [];
	for (let line of data) {
		let encodedLine = [];
		for (let word of line.split(' ')) {
			encodedLine.push(wordToIndex[word]);
		}
		encoded.push(encodedLine);
	}

	return {
		vocab: vocab,
		wordToIndex: wordToIndex,
		indexToWord: indexToWord,
		encoded: encoded,
	};
}


function createModel(vocabSize) {
	const model = tf.sequential();
	model.add(tf.layers.lstm({
		units: 128,
		inputShape: [vocabSize],
		returnSequences: true,
	}));
	model.add(tf.layers.lstm({
		units: 128,
		returnSequences: false,
	}));
	model.add(tf.layers.dense({
		units: vocabSize,
		activation: 'softmax',
	}));
	model.compile({
		loss: 'categoricalCrossentropy',
		optimizer: tf.train.adam(),
	});
	return model;
}


async function train(model, data, vocabSize, wordToIndex) {
	for (let encodedLine of data) {
		let xs = tf.oneHot(tf.tensor1d(encodedLine.slice(0, -1), 'int32'), vocabSize);
		let ys = tf.oneHot(tf.tensor1d(encodedLine.slice(1), 'int32'), vocabSize);
		let history = await model.fit(xs, ys, {
		batchSize: 32,
		epochs: 10,
		shuffle: true,
		});
		console.log(`Loss: ${history.history.loss[0]}`);
	}
}


async function generateText(model, vocabSize, indexToWord, wordToIndex, start) {
	let generated = start;
	while (generated.length < 100) {
		let xs = tf.oneHot(tf.tensor1d([wordToIndex[generated[generated.length - 1]]], 'int32'), vocabSize);
		let probs = model.predict(xs);
		let wordIndex = tf.argMax(probs, 1).dataSync()[0];
		generated.push(indexToWord[wordIndex]);
	}
	console.log(generated.join(' '));
}


async function main() {
	const data = await loadData();
	const preprocessedData = await preprocessData(data);
	const model = createModel(preprocessedData.vocab.length);
	await train(model, preprocessedData.encoded, preprocessedData.vocab.length, preprocessedData.wordToIndex);
	await generateText(model, preprocessedData.vocab.length, preprocessedData.indexToWord, preprocessedData.wordToIndex, 'The');
}

main();
