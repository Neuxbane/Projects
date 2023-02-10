const LEARNING_RATE = 1.7

class NeuralNetwork {
	constructor(inputs, outputs) {
		this.inputs = inputs;
		this.outputs = outputs;

		this.weights1 = new Matrix(this.outputs, this.inputs);
		this.bias1 = new Matrix(this.outputs, 1);
	}

	// Feedforward function
	predict(inputArray) {
		// Convert input array to matrix
		let inputs = Matrix.fromArray(inputArray);

		// Calculate the weighted sum
		let hidden = Matrix.multiply(this.weights1, inputs);
		hidden.add(this.bias1);

		// Apply the activation function (tanh)
		hidden.map(x => Math.tanh(x));

		// Return the result as an array
		return hidden.toArray();
	}

	// Train the network using stochastic gradient descent
	train(inputArray, targetArray) {
		// Convert input and target arrays to matrices
		let inputs = Matrix.fromArray(inputArray);
		let targets = Matrix.fromArray(targetArray);

		// Calculate the weighted sum
		let hidden = Matrix.multiply(this.weights1, inputs);
		hidden.add(this.bias1);

		// Apply the activation function (tanh)
		hidden.map(x => Math.tanh(x));

		// Calculate the error
		let error = Matrix.subtract(targets, hidden);

		// Calculate the gradient of the weights
		let gradients = Matrix.multiply(error, inputs.transpose());
		gradients.multiply(LEARNING_RATE);

		// Update the weights and biases
		this.weights1.add(gradients);
		this.bias1.add(error.multiply(LEARNING_RATE));
	}
}

class Matrix {
	constructor(rows, cols) {
		this.rows = rows;
		this.cols = cols;
		this.data = [];

		for (let i = 0; i < this.rows; i++) {
		this.data[i] = [];
		for (let j = 0; j < this.cols; j++) {
			this.data[i][j] = 0;
		}
		}
	}

	static fromArray(arr) {
		let m = new Matrix(arr.length, 1);
		for (let i = 0; i < arr.length; i++) {
			m.data[i][0] = arr[i];
		}
		return m;
	}

	static subtract(a, b) {
		let result = new Matrix(a.rows, a.cols);
		for (let i = 0; i < result.rows; i++) {
			for (let j = 0; j < result.cols; j++) {
				result.data[i][j] = a.data[i][j] - b.data[i][j];
			}
		}
		return result;
	}

	transpose() {
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				this.data[j][i] = this.data[i][j];
			}
		}
		return this;
	}

	multiply(target) {
		let result = new Matrix(this.rows, target.cols);
		for (let i = 0; i < result.rows; i++) {
			for (let j = 0; j < result.cols; j++) {
				let sum = 0;
				for (let k = 0; k < this.cols; k++) {
					sum += this.data[i][k] * target.data[k][j];
				}
				result.data[i][j] = sum;
			}
		}
		return result;
	}

	static multiply(a, b){
		let result = new Matrix(a.rows, b.cols);
		for (let i = 0; i < result.rows; i++) {
			for (let j = 0; j < result.cols; j++) {
				let sum = 0;
				for (let k = 0; k < a.cols; k++) {
					sum += a.data[i][k] * b.data[k][j];
				}
				result.data[i][j] = sum;
			}
		}
		return result;
	}

	toArray() {
		let arr = [];
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				arr.push(this.data[i][j]);
			}
		}
		return arr;
	}

	add(n) {
		if (n instanceof Matrix) {
			for (let i = 0; i < this.rows; i++) {
				for (let j = 0; j < this.cols; j++) {
					this.data[i][j] += n.data[i][j];
				}
			}
		} else {
			for (let i = 0; i < this.rows; i++) {
				for (let j = 0; j < this.cols; j++) {
					this.data[i][j] += n;
				}
			}
		}
	}

	map(func) {
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				let val = this.data[i][j];
				this.data[i][j] = func(val);
			}
		}
		return this;
	}

	static hadamard(a, b) {
		let result = new Matrix(a.rows, a.cols);
		for (let i = 0; i < result.rows; i++) {
			for (let j = 0; j < result.cols; j++) {
				result.data[i][j] = a.data[i][j] * b.data[i][j];
			}
		}
		return result;
	}
}

// Create a new neural network with 1 input and 2 outputs
let nn = new NeuralNetwork(1, 2);

// Define the training data
let inputs = [[1], [2], [3], [4]];
let targets = [[1, 0], [0, 1], [0, 1], [1, 0]];

// Train the network using the training data
for (let i = 0; i < 10000; i++) {
	let index = Math.floor(Math.random() * inputs.length);
	nn.train(inputs[index], targets[index]);
}

// Test the network with new data
let testData = [[5], [6], [7], [8]];
for (let i = 0; i < testData.length; i++) {
	console.log(nn.predict(testData[i]));
}
