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

Math.sigmoid = (x)=>1/(1+Math.exp(-x))

class UniversalFunction {
	parameters = {
		decoder: [],
		encoder: []
	};

	constructor(encoder = [100,200,300], decoder = [300, 200, 100], memory_unit = 0.7){
		encoder = [17,...encoder]
		decoder = [...decoder,17]

		const netMap = (x,i,a)=>{
			if(i==a.length-1) return undefined;
			const newRandom = (current, next) => new Matrix(Array.from(Array(next),()=>Array.from(Array(current),()=>Math.random())))
			const newBias = (current, next) => new Matrix(Array.from(Array(next),()=>Array.from(Array(1),()=>Math.random())))
			const newZero = (current, next) => new Matrix(Array.from(Array(next),()=>Array.from(Array(1),()=>0)))
			let actv = [
				(x)=>1/(1+Math.exp(-x)),
				(x)=>x,
				(x)=>Math.tanh(x),
				(x)=>Math.sin(x),
				(x)=>Math.cos(x),
				(x)=>x>0?x:0,
				(x)=>x>0?x:0.01*x
			]
			actv = actv[Math.round(Math.random()*(actv.length-1))]
			if(Math.random() <= memory_unit){
				return {state:'memory',weight:newRandom(x, a[i+1]), actv, bias: newBias(x, a[i+1]), prevValue: newZero(x, a[i+1])}
			} else {
				return {state:'zero',weight:newRandom(x, a[i+1]), actv, bias: newBias(x, a[i+1])}
			}
		}

		this.parameters.encoder = encoder.map(netMap).filter((x)=>x!=undefined)

		this.parameters.decoder = decoder.map(netMap).filter((x)=>x!=undefined)

		console.log(this.parameters.encoder);
	}

	evaluate(parameter='encoder',input = new Matrix([])){
		let res = this.parameters[parameter].reduce((p, c, i)=>{
			if(c.state == 'memory'){
				return this.parameters[parameter][i].prevValue = c.weight.dot(p).sum(c.bias).map(c.actv).sum(c.prevValue).map(c.actv)
			} else return c.weight.dot(p).sum(c.bias).map(c.actv)
		}, input)

		if(parameter == 'decoder') return res.map(Math.sigmoid).map(Math.round)
		return res
	}

	predict(object){
		const clearState = (v)=>{
			if(v.state == 'memory') v.prevValue = v.prevValue.map(()=>0)
		}
		this.parameters.decoder.map(clearState)
		this.parameters.encoder.map(clearState)
		const converter = (str)=>str.charCodeAt(0).toString(2).split('').map((x)=>Number(x));
		const fillRest = (x,i,a)=>[Number(a.length-1==i),...Array.from(Array(16-x.length), ()=>0),...x]
		object = JSON.stringify(object).split('').map(converter).map(fillRest);

		const toChar = (y_pred)=>{
			y_pred = y_pred.data
			y_pred.splice(0,1)
			return String.fromCharCode(parseInt(y_pred.map((x)=>Math.round(x)).join(''),2))
		}

		const isStop = (y_pred)=>{
			y_pred = y_pred.data
			return y_pred.splice(0,1)
		}

		const toArr = (x_input)=>{
			return new Matrix([x_input]).transpose()
		}

		let output;

		let res = "";

		for(let y_str of object){
			output = this.evaluate('decoder',this.evaluate('encoder',toArr(y_str)));
			res += toChar(output);
		}

		let max_token = 100;

		while(isStop(output) && max_token){
			output = this.evaluate('decoder',this.evaluate('encoder',toArr(fillRest(converter(res[res.length-1]),isStop(output),[1]))));
			res += toChar(output);
			max_token--;
		}

		return res
	}

	fit(datasets = []){
		const range = (i)=>Array.from(Array(i),(v,k)=>k)
		const toArr = (x_input)=>{
			return new Matrix([x_input]).transpose()
		}
		const converter = (str)=>str.charCodeAt(0).toString(2).split('').map((x)=>Number(x));
		const fillRest = (x,i,a)=>[Number(a.length-1==i),...Array.from(Array(16-x.length), ()=>0),...x]
		datasets = datasets.map((x)=>({x:JSON.stringify(x.x).split('').map((x)=>x.split('').map(converter).map(fillRest).map(toArr)),y:JSON.stringify(x.y).split('').map((x)=>x.split('').map(converter).map(fillRest).map(toArr))}))
		const error = (y_pred, y_train)=>{
			return y_pred.data.reduce((p,c,i)=>p+(c-y_train.data[i])**2,0)
		}

		for(let iteration in range(10)){
			for(let data of datasets){
				for(let dec in this.parameters.decoder){
					for(let index in data.y){
						const y_pred = this.evaluate('decoder',this.evaluate('encoder',data.x[index][0]));
						const y_train = data.y[index][0]
						let delta_error = error(y_pred, y_train)
						let d = new Matrix(this.parameters.decoder[dec].weight.data)
						this.parameters.decoder[dec].weight = this.parameters.decoder[dec].weight.map((v)=>Math.random()*2-1)
						this.parameters.decoder[dec].bias = this.parameters.decoder[dec].bias.map((v)=>Math.random()*2-1)
						// if(index==0)console.log(delta_error)
						delta_error -= error(y_pred, y_train)
						if(index==0)console.log(delta_error,d.data==this.parameters.decoder[dec].weight.data)
						// this.parameters.decoder[dec].weight = this.parameters.decoder[dec].weight.map((v)=>v - 0.001 - delta_error)
					}
				}
			}
		}
	}
}

let model = new UniversalFunction()

model.fit([
	{
		x:1,
		y:0
	},
	{
		x:[1,2,3],
		y:[4,5,6]
	},
	{
		x:"hello",
		y:"hi"
	}
])

console.log(model.predict(1)) // return 0
console.log(model.predict([1,2,3])) // return [4,5,6]
console.log(model.predict("hello")) // return 'hi'