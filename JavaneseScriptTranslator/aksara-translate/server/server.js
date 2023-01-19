(new (require('./Nxcom')).Server({port:9381}))

const dbCloud = new(require('./NxDB')).IOTADataBase({key:"1"})

const hash = (str='')=>str.split('').reduce((pV, cV, cI, a)=>pV+BigInt(cV.charCodeAt())+0xFFFFn**BigInt(a.length-cI-1),0n).toString(36).split('').reverse().join('').substring(0,32)

let client = new (require('./Nxcom')).Client({url:'ws:localhost:9381',uid:"Server"})

let users = {
	neuxbane:{
		name:"Neuxbane",
		password:"vn4vzf87p4nwmacsuoq146tccc80fdvc",
		token:Math.random().toString(2).substring(2)+Date.now().toString(36)
	}
}

client.environment("auth", async(client)=>{
	dbCloud.add({name:"Neuxbane"})
	if(users[client.data.username]===undefined) return client.reply({s:0,m:'Username not found'})
	if(hash(client.data.password)!==users[client.data.username].password) return client.reply({s:0,m:'Wrong password'})
	users[client.data.username].token = Math.random().toString(36).substring(2)+Date.now().toString(36);
	client.reply({s:1,m:'Ok',t:users[client.data.username].token})
})