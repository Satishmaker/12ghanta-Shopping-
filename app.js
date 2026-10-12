// Demo catalog: replace these examples with your actual products and prices.
const products = [
  {id:1,name:"आटा 5 किलो",desc:"उदाहरण प्रोडक्ट • स्टॉक की पुष्टि करें",price:210,emoji:"🌾"},
  {id:2,name:"चावल 5 किलो",desc:"उदाहरण प्रोडक्ट • स्टॉक की पुष्टि करें",price:290,emoji:"🍚"},
  {id:3,name:"नहाने का साबुन",desc:"उदाहरण प्रोडक्ट • स्टॉक की पुष्टि करें",price:35,emoji:"🧼"},
  {id:4,name:"नोटबुक",desc:"उदाहरण प्रोडक्ट • स्टॉक की पुष्टि करें",price:40,emoji:"📒"},
  {id:5,name:"मोबाइल चार्जिंग केबल",desc:"उदाहरण प्रोडक्ट • स्टॉक की पुष्टि करें",price:99,emoji:"🔌"},
  {id:6,name:"स्टील की पानी बोतल",desc:"उदाहरण प्रोडक्ट • स्टॉक की पुष्टि करें",price:149,emoji:"🧴"}
];
const cart = new Map();
const money = n => "₹" + n.toLocaleString("en-IN");
const productsEl = document.querySelector("#products");
const cartEl = document.querySelector("#cart-items");
const toastEl = document.querySelector("#toast");
function toast(message){toastEl.textContent=message;toastEl.style.display="block";setTimeout(()=>toastEl.style.display="none",2600)}
function renderProducts(query=""){
  const filtered=products.filter(p=>p.name.toLowerCase().includes(query.toLowerCase()));
  document.querySelector("#product-count").textContent=filtered.length+" सामान";
  productsEl.innerHTML=filtered.map(p=>`<article class="product">
    <div class="product-art" aria-hidden="true">${p.emoji}</div><h3>${p.name}</h3><p>${p.desc}</p>
    <div class="price-row"><span class="price">${money(p.price)}</span><span class="pill">डेमो</span></div>
    <button class="primary" type="button" data-add="${p.id}">कार्ट में जोड़ें</button></article>`).join("") || '<p class="muted">कोई सामान नहीं मिला।</p>';
}
function renderCart(){
  const entries=[...cart.entries()].filter(([,qty])=>qty>0);
  document.querySelector("#cart-count").textContent=`(${entries.reduce((s,[,q])=>s+q,0)})`;
  if(!entries.length){cartEl.innerHTML='<p class="muted">अभी कार्ट खाली है।</p>'}
  else cartEl.innerHTML=entries.map(([id,qty])=>{const p=products.find(x=>x.id===id);return `<div class="cart-line"><div class="cart-name"><strong>${p.name}</strong><br><span class="muted">${money(p.price)} × ${qty}</span></div><div class="qty"><button type="button" data-change="${id}" data-delta="-1" aria-label="एक कम करें">−</button><span>${qty}</span><button type="button" data-change="${id}" data-delta="1" aria-label="एक बढ़ाएँ">+</button></div></div>`}).join("");
  document.querySelector("#total").textContent=money(entries.reduce((sum,[id,q])=>sum+products.find(p=>p.id===id).price*q,0));
}
productsEl.addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(!b)return;const id=Number(b.dataset.add);cart.set(id,(cart.get(id)||0)+1);renderCart();toast("कार्ट में जोड़ दिया गया")});
cartEl.addEventListener("click",e=>{const b=e.target.closest("[data-change]");if(!b)return;const id=Number(b.dataset.change),next=(cart.get(id)||0)+Number(b.dataset.delta);if(next<=0)cart.delete(id);else cart.set(id,next);renderCart()});
document.querySelector("#search").addEventListener("input",e=>renderProducts(e.target.value));
document.querySelector("#clear-cart").addEventListener("click",()=>{cart.clear();renderCart()});
document.querySelector("#order-form").addEventListener("submit",e=>{
  e.preventDefault();
  if(cart.size===0){toast("पहले कार्ट में सामान जोड़ें");return}
  const data=new FormData(e.currentTarget);
  const items=[...cart.entries()].map(([id,qty])=>{const p=products.find(x=>x.id===id);return {name:p.name,qty,price:p.price}});
  const order={id:"12H-"+Date.now().toString().slice(-7),date:new Date().toLocaleString("hi-IN"),customerName:data.get("customerName"),phone:data.get("phone"),address:data.get("address"),area:data.get("area"),items,total:items.reduce((s,i)=>s+i.qty*i.price,0),status:"पुष्टि बाकी"};
  // Demo-only storage on this device. Do not store real customer data this way for a live business.
  const orders=JSON.parse(localStorage.getItem("12ghante-demo-orders")||"[]");orders.unshift(order);localStorage.setItem("12ghante-demo-orders",JSON.stringify(orders));
  alert(`डेमो ऑर्डर बन गया: ${order.id}\nकुल: ${money(order.total)}\n\nयह ऑर्डर दुकान तक नहीं भेजा गया है। अभी असली ऑर्डर न मानें।`);
  cart.clear();renderCart();e.currentTarget.reset();
});
document.querySelector("#show-orders").addEventListener("click",()=>{
  const box=document.querySelector("#orders-list");box.hidden=!box.hidden;if(box.hidden)return;
  const orders=JSON.parse(localStorage.getItem("12ghante-demo-orders")||"[]");
  box.innerHTML=orders.length?orders.map(o=>`<div class="order-card"><strong>${o.id}</strong> • ${o.date}<br>${o.customerName} • ${o.phone}<br>${o.area} — ${o.address}<br>${o.items.map(i=>`${i.name} × ${i.qty}`).join(", ")}<br><strong>${money(o.total)}</strong> • ${o.status}</div>`).join(""):"इस डिवाइस पर कोई डेमो ऑर्डर नहीं है।";
});
renderProducts();renderCart();
