const products = [
{ id: 1, name: "Tavuk Döner Dürüm", category: "Döner", price: 180, desc: "Taze lavaşta tavuk döner." },
{ id: 2, name: "Et Döner Dürüm", category: "Döner", price: 250, desc: "Lezzetli et döner dürüm." },
{ id: 3, name: "Tavuk Döner Porsiyon", category: "Döner", price: 250, desc: "Pilav ve garnitür ile." },
{ id: 4, name: "Adana Kebap", category: "Kebap", price: 350, desc: "Usta işi közde kebap." },
{ id: 5, name: "Urfa Kebap", category: "Kebap", price: 350, desc: "Izgarada özenle hazırlanır." },
{ id: 6, name: "Tavuk Şiş", category: "Izgara", price: 300, desc: "Izgarada tavuk şiş." },
{ id: 7, name: "Tavuk Kanat", category: "Izgara", price: 350, desc: "Izgarada tavuk kanat." },
{ id: 8, name: "Patates Kızartması", category: "Yan Ürünler", price: 100, desc: "Çıtır çıtır patates." },
{ id: 9, name: "Ayran", category: "İçecekler", price: 35, desc: "Soğuk ayran." },
{ id: 10, name: "Kola", category: "İçecekler", price: 60, desc: "Soğuk içecek." }
];

let cart = [];
let activeCategory = "Tümü";

const money = n => n.toLocaleString("tr-TR") + " ₺";
const categories = ["Tümü", ...new Set(products.map(p => p.category))];

const categoryBox = document.getElementById("categories");
const productBox = document.getElementById("products");

function renderCategories() {
categoryBox.innerHTML = categories.map(category => "<button class="category ${activeCategory === category ? "active" : ""}" data-category="${category}"> ${category} </button>").join("");

categoryBox.querySelectorAll("button").forEach(button => {
button.addEventListener("click", () => {
activeCategory = button.dataset.category;
renderCategories();
renderProducts();
});
});
}

function renderProducts() {
const visible = activeCategory === "Tümü"
? products
: products.filter(p => p.category === activeCategory);

productBox.innerHTML = visible.map(p => "<article class="product"> <h3>${p.name}</h3> <p>${p.desc}</p> <div class="product-bottom"> <span class="price">${money(p.price)}</span> <button class="add" data-id="${p.id}">+ Sepete Ekle</button> </div> </article>").join("");

productBox.querySelectorAll(".add").forEach(button => {
button.addEventListener("click", () => addToCart(Number(button.dataset.id)));
});
}

function addToCart(id) {
const product = products.find(p => p.id === id);
const existing = cart.find(item => item.id === id);

if (existing) {
existing.quantity++;
} else {
cart.push({ ...product, quantity: 1 });
}

renderCart();
}

function renderCart() {
const count = cart.reduce((sum, item) => sum + item.quantity, 0);
const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

document.getElementById("count").textContent = count;
document.getElementById("total").textContent = money(total);

const cartItems = document.getElementById("cartitems");

if (cart.length === 0) {
cartItems.innerHTML = "<p>Sepetin şu an boş.</p>";
return;
}

cartItems.innerHTML = cart.map(item => "<div class="cart-item"> <div> <strong>${item.name}</strong><br> ${money(item.price)} × ${item.quantity} </div> <div> <button data-action="minus" data-id="${item.id}">−</button> <button data-action="plus" data-id="${item.id}">+</button> <button data-action="remove" data-id="${item.id}">Sil</button> </div> </div>").join("");

cartItems.querySelectorAll("button").forEach(button => {
button.addEventListener("click", () => {
const id = Number(button.dataset.id);
const action = button.dataset.action;
const item = cart.find(p => p.id === id);

  if (!item) return;

  if (action === "plus") item.quantity++;
  if (action === "minus") item.quantity--;
  if (action === "remove") item.quantity = 0;

  cart = cart.filter(p => p.quantity > 0);
  renderCart();
});

});
}

document.getElementById("openCart").addEventListener("click", () => {
document.getElementById("cart").showModal();
});

document.getElementById("closeCart").addEventListener("click", () => {
document.getElementById("cart").close();
});

document.getElementById("checkout").addEventListener("submit", event => {
event.preventDefault();

if (cart.length === 0) {
alert("Kanka, önce sepete ürün eklemelisin.");
return;
}

const form = new FormData(event.target);
const name = form.get("name").trim();
const phone = form.get("phone").trim();
const delivery = form.get("delivery");
const address = form.get("address").trim();
const payment = form.get("payment");

const orderLines = cart.map(item =>
"• ${item.name} x${item.quantity} — ${money(item.price * item.quantity)}"
);

const total = cart.reduce((sum, item) =>
sum + item.price * item.quantity, 0
);

const message = [
"🍽️ HANCAN KEBAP DÖNER SİPARİŞİ",
"",
"👤 Ad Soyad: ${name}",
"📞 Telefon: ${phone}",
"🛍️ Sipariş türü: ${delivery}",
"💳 Ödeme: ${payment}",
"",
"Sipariş ürünleri:",
...orderLines,
"",
"💰 *TOPLAM: ${money(total)}*",
address ? "📍 Adres / Not: ${address}" : ""
].filter(Boolean).join("\n");

window.open(
"https://wa.me/905451546507?text=" + encodeURIComponent(message),
"_blank"
);
});

document.getElementById("year").textContent = new Date().getFullYear();

renderCategories();
renderProducts();
renderCart();
