export class DataBase {
	constructor(options = { dbName: 'exampleName', storeName: '' }) {
		localStorage.setItem('dbName', options.dbName);
		localStorage.setItem('storeName', options.storeName);
	}


	static async open(dbName = localStorage.getItem('dbName'), storeName = localStorage.getItem('storeName')) {
		if(dbName)localStorage.setItem('dbName', 'example');
		if(storeName)localStorage.setItem('storeName', 'example');
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(dbName, 1);
			request.onsuccess = () => {
				const db = request.result;
				resolve(db);
			};
			request.onerror = reject;
			request.onupgradeneeded = () => {
				const db = request.result;
				db.createObjectStore(storeName);
			};
		});
	}


	static async getItem(key) {
		const request = (await this.open())
			.transaction([localStorage.getItem('storeName')], 'readonly')
			.objectStore(localStorage.getItem('storeName'))
			.get(key);
		return new Promise((resolve, reject) => {
			request.onerror = reject;
			request.onsuccess = () => resolve(request.result);
		});
	}

	static async setItem(key, value) {
		const request = (await this.open())
			.transaction([localStorage.getItem('storeName')], 'readwrite')
			.objectStore(localStorage.getItem('storeName'))
			.put(value, key);
		return new Promise((resolve, reject) => {
			request.onerror = reject;
			request.onsuccess = () => resolve(request.result);
		});
	}

	static async deleteItem(key) {
		const request = (await this.open())
			.transaction([localStorage.getItem('storeName')], 'readwrite')
			.objectStore(localStorage.getItem('storeName'))
			.delete(key);
		return new Promise((resolve, reject) => {
			request.onerror = reject;
			request.onsuccess = () => resolve(request.result);
		});
	}
}
