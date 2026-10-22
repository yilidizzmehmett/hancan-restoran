const PHONE="905451546507";
const menu=[
{id:1,name:"Tavuk Döner Dürüm",category:"Döner",price:160,emoji:"🌯",desc:"Taze lavaş, tavuk döner ve günlük garnitür."},
{id:2,name:"Et Döner Dürüm",category:"Döner",price:240,emoji:"🌯",desc:"Usta işi et döner ve lezzetli eşlikçiler."},
{id:3,name:"Tavuk Döner Porsiyon",category:"Döner",price:220,emoji:"🍽️",desc:"Pilav ve garnitür ile doyurucu porsiyon."},
{id:4,name:"Adana Kebap",category:"Kebap",price:320,emoji:"🍢",desc:"Izgaradan sıcak, yanında garnitürle."},
{id:5,name:"Urfa Kebap",category:"Kebap",price:320,emoji:"🍢",desc:"Baharat dengesiyle hazırlanan klasik lezzet."},
{id:6,name:"Tavuk Şiş",category:"Izgara",price:260,emoji:"🍗",desc:"Marine edilmiş tavuk şiş, ızgaradan sofranıza."},
{id:7,name:"Tavuk Kanat",category:"Izgara",price:280,emoji:"🍗",desc:"Izgara tavuk kanat ve garnitür."},
{id:8,name:"Patates Kızartması",category:"Yan Ürün",price:80,emoji:"🍟",desc:"Sıcak ve çıtır patates kızartması."},
{id:9,name:"Ayran",category:"İçecek",price:30,emoji:"🥛",desc:"Soğuk ayran."},
{id:10,name:"Kutu İçecek",category:"İçecek",price:50,emoji:"🥤",desc:"Soğuk kutu içecek."}];
const cats=["Tümü",...new Set(menu.map(p=>p.category))];let selected="Tümü",cart={};
const fmt=n=>new Intl.NumberFormat("tr-TR",{style:"currency",currency:"TRY",maximumFractionDigits:0}).format(n);
const total=()=>Object.entries(cart).reduce((s,[id,q])=>s+menu.find(p=>p.id===+id).price*q,0);
const count=()=>Object.values(cart).reduce((s,q)=>s+q,0);
function renderCats(){document.querySelector("#categories").innerHTML=cats.map(c=>`<button class="category ${selected===c?"active":""}" data-cat="${c}">${c}</button>`).join("");document.querySelectorAll("[data-cat]").forEach(b=>b.onclick=()=>{selected=b.dataset.cat;renderCats();renderProducts()})}
function renderProducts(){document.querySelector("#products").innerHTML=menu.filter(p=>selected==="Tümü"||p.category===selected).map(p=>`<article class="card"><div class="visual">${p.emoji}</div><div class="body"><h3>${p.name}</h3><p>${p.desc}</p><div class="bottom"><span>${fmt(p.price)}</span><button class="add" data-add="${p.id}" aria-label="Sepete ekle">+</button></div></div></article>`).join("");document.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>{const id=+b.dataset.add;cart[id]=(cart[id]||0)+1;renderFab()})}
function renderFab(){document.querySelector("#cartbar").hidden=!count();document.querySelector("#count").textContent=count();document.querySelector("#total").textContent=fmt(total())}
function renderCart(){const target=document.querySelector("#cartitems"),items=Object.entries(cart).filter(([,q])=>q>0);if(!items.length){target.innerHTML="<p>Sepet boş.</p>";return}target.innerHTML=items.map(([id,q])=>{const p=menu.find(x=>x.id===+id);return `<div class="cartline"><div><b>${p.name}</b><br><small>${fmt(p.price)} / adet</small></div><div class="qty"><button data-change="${id}" data-d="-1">−</button><b>${q}</b><button data-change="${id}" data-d="1">+</button></div></div>`}).join("")+`<div class="sum"><span>Toplam</span><span>${fmt(total())}</span></div>`;target.querySelectorAll("[data-change]").forEach(b=>b.onclick=()=>{const id=+b.dataset.change;cart[id]=(cart[id]||0)+ +b.dataset.d;if(cart[id]<=0)delete cart[id];renderCart();renderFab()})}
document.querySelector("#openCart").onclick=()=>{renderCart();document.querySelector("#cart").showModal()};
document.querySelector("#checkout").onsubmit=e=>{e.preventDefault();if(!count()){alert("Önce ürün ekleyin.");return}const f=new FormData(e.currentTarget),lines=Object.entries(cart).map(([id,q])=>{const p=menu.find(x=>x.id===+id);return `• ${p.name} x${q} — ${fmt(p.price*q)}`}).join("\n");const msg=`Merhaba Hancan Kebap Döner, sipariş vermek istiyorum.\n\n${lines}\n\nToplam: ${fmt(total())}\nAd Soyad: ${f.get("name")}\nTelefon: ${f.get("phone")}\nTeslimat: ${f.get("delivery")}\nAdres/Not: ${f.get("address")||"-"}\nÖdeme: ${f.get("payment")}`;window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`,"_blank")};
document.querySelector("#year").textContent=new Date().getFullYear();renderCats();renderProducts();