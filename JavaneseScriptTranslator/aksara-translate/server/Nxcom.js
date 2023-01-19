class Server {
	ws;clients={};
	constructor(option={port:48571}){
		if(typeof(WebSocket) != 'undefined') throw new Error("Web Browser cannot start socket as Server Side")
		this.ws = new (require('ws').Server)(option);
		this.ws.on("error",console.error);
		this.ws.on("connection",(socket)=>{
			socket.once("message",(i)=>{
				if(this.clients[i.toString()]==undefined){
					this.clients[socket.id=i.toString()]=socket
					socket.onclose=()=>delete this.clients[socket.id]
					socket.on("message",(data)=>{
						try{
							let l=JSON.parse(data.toString());
							this.clients?.[l[1].from]?.send(JSON.stringify([l[0],{...l[1],...{from:socket.id}}]));
						}catch{}
					})
				} else socket.terminate();
			})
		});
	}
};

class Client {
	uid;ws;#listner={};
	constructor(option={url:'ws:localhost:12345',uid:Math.random().toString(36).substring(2)}){
		if(option.url==undefined)option.url='ws:localhost:12345';
		if(option.uid==undefined)option.uid=Math.random().toString(36).substring(2);
		this.ws=(typeof(WebSocket) != 'undefined' ? new WebSocket(option.url) : new(require('ws'))(option.url));
		this.ws.onopen=()=>this.ws.send(this.uid=option.uid);
		this.ws.onclose=()=>this.ws=(typeof(WebSocket) != 'undefined' ? new WebSocket(option.url) : new(require('ws'))(option.url));
		this.ws.onmessage = (event)=>{
			const [env, data] = JSON.parse(event.data)
			data.reply = async(msg)=>{
				const delay = time => new Promise(res=>setTimeout(res,time));
				const id = Math.random().toString(36).substring(2)+Date.now().toString(36);
				while(1){
					try{this.ws.send(JSON.stringify([env, {data:msg,id:data.id, from:data.from}]));break;}
					catch(e){await delay(1)}
				}
				let res=new Error(`No replied for id ${id}`);
				this.#listner["-Q "+JSON.stringify([id,data.from])] = (response)=>res=response
				let retry = 3000;
				while(res.constructor.name == 'Error' && retry--) await delay(1);
				return res;
			}
			for(let v in this.#listner){
				if(v.startsWith("-Q ")){
					let d = JSON.parse(v.split(' ')[1]);
					if(d.id==data.id&&d.from==data.from){
						this.#listner[v]({env, ...data})
						delete this.#listner[v]
						continue;
					}
				}
				this.#listner[v]({env, ...data})
			}
		}
	}

	environment(env, handler=(message={from:'',env:'', data:{}, id:'', reply:(message)=>{}})=>{}){
		this.#listner[handler.toString()]=handler;
		return ()=>delete this.#listner[handler.toString()]
	}

	connect(uid){
		return {
			send:async(env, data)=>{
				const delay = time => new Promise(res=>setTimeout(res,time));
				const id = Math.random().toString(36).substring(2)+Date.now().toString(36);
				while(1){
					try{this.ws.send(JSON.stringify([env, {data:data,id:id,from:uid}]));break;}
					catch(e){await delay(1)}
				}
				let res= new Error(`No replied for id ${id}`);
				this.#listner["-Q "+JSON.stringify([id,data.from])] = (response)=>res=response
				let retry = 3000;
				while(res.constructor.name == 'Error' && retry--) await delay(1);
				return res;
			}
		}
	}
};

module.exports = { Server, Client }