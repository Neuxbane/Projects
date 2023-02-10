console.log = (...args)=>{
	let timeStamp = document.createElement("p")
	timeStamp.style.color = "cyan";
	timeStamp.className = "time"
	timeStamp.appendChild(document.createTextNode(new Date()))

	let element = document.createElement("p")
	element.appendChild(document.createTextNode(args.join(' ')))

	let div = document.createElement("div");
	div.style.display = "flex"

	div.appendChild(timeStamp);
	div.appendChild(element);

	document.getElementById("logger").appendChild(div)
}

console.table = (data) => {
    let table = document.createElement("table");
    let headers = Object.keys(data[0]);

    let headerRow = document.createElement("tr");
    headers.forEach(header => {
        let headerCell = document.createElement("th");
        headerCell.appendChild(document.createTextNode(header));
        headerRow.appendChild(headerCell);
    });
    table.appendChild(headerRow);

    data.forEach(rowData => {
        let row = document.createElement("tr");
        headers.forEach(header => {
            let cell = document.createElement("td");
            cell.appendChild(document.createTextNode(rowData[header]));
            row.appendChild(cell);
        });
        table.appendChild(row);
    });
    document.getElementById("logger").appendChild(table);
};

console.warn = (...args) => {
    let element = document.createElement("p");
    element.style.color = "orange";
    element.appendChild(document.createTextNode(args.join(" ")));
    document.getElementById("logger").appendChild(element);
};

console.error = (...args) => {
	args = args.map(v=>v?.stack??v);
    let element = document.createElement("p");
    element.style.color = "red";
    element.appendChild(document.createTextNode(args.join(" ")));
    document.getElementById("logger").appendChild(element);
};




console.log("Hello world")
new Promise((resolve)=>{
	throw new Error("asd");
}).catch(console.error)