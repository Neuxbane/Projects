class Matrix {
	constructor(data) {
		this.data = data;
		this.rows = data.length;
		this.cols = data[0].length;
	}
	
	dot(otherMatrix) {
		if (this.cols !== otherMatrix.rows) {
			console.log(`Matrix sizes this.cols (${this.cols}) !== otherMatrix.rows (${otherMatrix.rows}) are not compatible for dot product.`);
			return null;
		}
	
		let result = [];
		for (let i = 0; i < this.rows; i++) {
			result[i] = [];
			for (let j = 0; j < otherMatrix.cols; j++) {
				let sum = 0;
				for (let k = 0; k < this.cols; k++) {
					sum += this.data[i][k] * otherMatrix.data[k][j];
				}
				result[i][j] = sum;
			}
		}
	
		return new Matrix(result);
	}
	
	sum(otherMatrix) {
		if (this.rows !== otherMatrix.rows || this.cols !== otherMatrix.cols) {
			console.log(`Matrix sizes this.rows (${this.rows}) !== otherMatrix.rows (${otherMatrix.rows}) || this.cols (${this.cols}) !== otherMatrix.cols (${otherMatrix.cols}) are not compatible for addition.`);
			return null;
		}
	
		let result = [];
		for (let i = 0; i < this.rows; i++) {
			result[i] = [];
			for (let j = 0; j < this.cols; j++) {
				result[i][j] = this.data[i][j] + otherMatrix.data[i][j];
			}
		}
	
		return new Matrix(result);
	}
	
	inverse() {
		if (this.rows !== this.cols) {
			console.log("Matrix is not square and cannot be inverted.");
			return null;
		}
	
		let result = [];
		for (let i = 0; i < this.rows; i++) {
			result[i] = [];
			for (let j = 0; j < this.cols; j++) {
				result[i][j] = i === j ? 1 : 0;
			}
		}
	
		for (let i = 0; i < this.rows; i++) {
			let pivot = this.data[i][i];
			for (let j = 0; j < this.cols; j++) {
				this.data[i][j] /= pivot;
				result[i][j] /= pivot;
			}
	
			for (let j = 0; j < this.rows; j++) {
				if (j === i) continue;
				let factor = this.data[j][i];
				for (let k = 0; k < this.cols; k++) {
					this.data[j][k] -= this.data[i][k] * factor;
					result[j][k] -= result[i][k] * factor;
				}
			}
		}
	
		return new Matrix(result);
	}

	transpose() {
		let result = [];
		for (let i = 0; i < this.cols; i++) {
			result[i] = [];
			for (let j = 0; j < this.rows; j++) {
				result[i][j] = this.data[j][i];
			}
		}
	
		return new Matrix(result);
	}

	map(func = (v, x, y) => 0) {
		let result = [];
		for (let i = 0; i < this.rows; i++) {
			result[i] = [];
			for (let j = 0; j < this.cols; j++) {
				result[i][j] = func(this.data[i][j], i, j);
			}
		}
	
		return new Matrix(result);
	}
}

// let matrixA = new Matrix(Array.from(Array(3),()=>Array.from(Array(3),()=>Math.round(Math.random()*10))));
// let matrixB = new Matrix(Array.from(Array(3),()=>Array.from(Array(3),()=>Math.random())));
let matrixA = new Matrix([[1,2],[3,4]])
let matrixB = new Matrix([[3,2],[1,5]])

let dotProduct = matrixA.dot(matrixB);
console.log("Dot product:", dotProduct.transpose());

let sum = matrixA.sum(matrixB);
console.log("Sum:", sum);

let inverse = dotProduct.dot(matrixB.inverse());
console.log("Inverse:", inverse.data);
