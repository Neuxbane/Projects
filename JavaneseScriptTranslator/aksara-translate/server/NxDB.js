const strToInt = (str, base=0xFFFFn)=>str.split('').reduce((pV, cV, cI, a)=>pV+BigInt(cV.charCodeAt() +1)*(base + 1n)**BigInt(a.length-cI-1),0n)
const intToStr = (int, base=0xFFFFn)=>{int=BigInt(int);let str="";while(int){int--;str+=String.fromCharCode(Number(int%(base+1n)));int/=base+1n;}return str.split('').reverse().join('');}


class IOTADataBase{
	#key; #client; #password; algorithm;
	constructor(option = {key:"example3",password:"Hello world!", client:new (require('@iota/client')).ClientBuilder().build(), algorithm:(x)=>Math.sin(x)*Math.cos(x)*2}){
		const def = {...{key:"example3",password:"Hello world!", client:new (require('@iota/client')).ClientBuilder().build(), algorithm:(x)=>Math.sin(x)*Math.cos(x)*2}, ...option};
		this.#key = def.key;
		this.#client = def.client;
		this.#password = def.password;
		this.algorithm = def.algorithm;
	}

	#encrypt = (text, password, algorithm = (x)=>Math.sin(x)*Math.cos(x)*2) => {
		let salt = Math.round(Math.random()*0xFFFF);
		password = (function(str, base=0xFFFFn){return str.split('').reduce((pV, cV, cI, a)=>pV+BigInt(cV.charCodeAt() +1)*(base + 1n)**BigInt(a.length-cI-1),0n)})(password)*BigInt(salt);
		let seed = algorithm(Number((password % 0xFFFFn)**3n))
		return String.fromCharCode(salt)+text.split('').map(x=>String.fromCharCode(x.charCodeAt() + Math.round((seed = algorithm(seed*0xFFFF))*0xFF))).join('')
	}
	
	#decrypt = (text, password, algorithm = (x)=>Math.sin(x)*Math.cos(x)*2) => {
		let salt = text[0].charCodeAt();text=text.substring(1)
		password = (function(str, base=0xFFFFn){return str.split('').reduce((pV, cV, cI, a)=>pV+BigInt(cV.charCodeAt() +1)*(base + 1n)**BigInt(a.length-cI-1),0n)})(password)*BigInt(salt);
		let seed = algorithm(Number((password % 0xFFFFn)**3n))
		return text.split('').map(x=>String.fromCharCode(x.charCodeAt() - Math.round((seed = algorithm(seed*0xFFFF))*0xFF))).join('')
	}

	async getData(){
		const message_ids = await this.#client.getMessage().index(this.#key);
		for (let i in message_ids) try{
			message_ids[i] = JSON.parse(this.#decrypt(Buffer.from((await this.#client.getMessage().data(message_ids[i])).message.payload.data, 'hex').toString('utf8'),this.#password, this.algorithm));
		} catch(e){
			message_ids[i] = undefined;
		}
		return message_ids.filter(v=>v!=undefined).sort((a,b)=>a.t-b.t);
	}

	async add(data){
		await this.#client.message()
		.index(this.#key)
		.data(this.#encrypt(JSON.stringify({t:Date.now(),v:data}),this.#password, this.algorithm))
		.submit();
	}
}

module.exports = { IOTADataBase }