var appElement = document.querySelector("#app"); 
 
 var buttonElement = document.createElement("button");
 var inputElement = document.createElement("input"); 
 var listElement = document.createElement("ul"); 
 
 buttonElement.appendChild(document.createTextNode("Add")); 
 
 appElement.appendChild(inputElement); 
 appElement.appendChild(buttonElement); 
 appElement.appendChild(listElement); 
 
 buttonElement.onclick = function(){
 add(); 
 }
 
 inputElement.setAttribute('id', 'name');
 inputElement.setAttribute('type', 'text');
 listElement.setAttribute('id', 'list');
 const BACKEND_IP = "192.168.56.40";
 
 async function add(){
 var savedName = inputElement.value;
 
 if (savedName.trim() === ""){
 return;
 }
 
 try {
 const res = await fetch(`http://${BACKEND_IP}:3000/items`, {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ text: savedName })
 });
 
 if (!res.ok) throw new Error("Error adding to database");
 
 const itemListLine = document.createElement('li');
 itemListLine.textContent = savedName;
 listElement.appendChild(itemListLine);
 
 inputElement.value = "";
 } catch (e) {
 console.error("Error while adding an item:", e);
 }
 }
 
 async function load(){
 listElement.innerHTML = "";
 const res = await fetch(`http://${BACKEND_IP}:3000/items`);
 const items = await res.json();
 
 items.forEach(item => {
 var itemListLine = document.createElement('li');
 itemListLine.textContent = item.text;
 listElement.appendChild(itemListLine);
 })
 }
 
 load();
