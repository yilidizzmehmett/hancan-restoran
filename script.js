
const products = [
  {id:1,name:"Tavuk Döner Dürüm",category:"Döner",price:180,desc:"Taze lavaşta tavuk döner"},
  {id:2,name:"Et Döner Dürüm",category:"Döner",price:250,desc:"Lezzetli et döner dürüm"},
  {id:3,name:"Tavuk Döner Porsiyon",category:"Döner",price:250,desc:"Pilav ve garnitür ile"},
  {id:4,name:"Adana Kebap",category:"Kebap",price:350,desc:"Usta işi közde kebap"},
  {id:5,name:"Urfa Kebap",category:"Kebap",price:350,desc:"Izgarada özenle hazırlanır"},
  {id:6,name:"Tavuk Şiş",category:"Izgara",price:300,desc:"Izgarada tavuk şiş"},
  {id:7,name:"Tavuk Kanat",category:"Izgara",price:350,desc:"Izgarada tavuk kanat"},
  {id:8,name:"Patates Kızartması",category:"Yan Ürünler",price:100,desc:"Çıtır patates"},
  {id:9,name:"Ayran",category:"İçecekler",price:35,desc:"Soğuk ayran"},
  {id:10,name:"Kola",category:"İçecekler",price:60,desc:"Soğuk içecek"}
];

let cart = [];
let activeCategory = "Tümü";
const money = n => n.toLocaleString("tr-TR") + " ₺";
const categories = ["Tümü", ...new Set(products.map(p => p.category))];

const categoryBox = document.getElementById("categories");
const productBox = document.getElementById("products");
const cartBox = document.getElementById("cart");

function renderCategories() {
  categoryBox.innerHTML = categories.map(c =>
    `<button type="button" class="${c === activeCategory ? "gold" : ""}" data-cat="${c}">${c}</button>`
  ).join("");

  categoryBox.querySelectorAll("[data-cat]").forEach(button => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.cat;
      renderCategories();
      renderProducts();
    });
  });
}

function renderProducts() {
  const list = activeCategory === "Tümü"
    ? products
    : products.filter(p => p.category === activeCategory);

  productBox.innerHTML = list.map(p => `
    <article class="product">
      <div class="product-image" aria-hidden="true">🍽️</div>
      <p class="eyebrow">${p.category}</p>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="product-bottom">
        <strong>${money(p.price)}</strong>
        <button type="button" class="gold" data-add="${p.id}">+ Ekle</button>
      </div>
    </article>
  `).join("");

  productBox.querySelectorAll("[data-add]").forEach(button => {
    button.addEventListener("click", () => {
      const product = products.find(p => p.id === Number(button.dataset.add));
      const item = cart.find(p => p.id === product.id);
      if (item) item.qty++;
      else cart.push({...product, qty:1});
      renderCart();
    });
  });
}

function renderCart() {
  const count = cart.reduce((sum, p) => sum + p.qty, 0);
  const total = cart.reduce((sum, p) => sum + p.price * p.qty, 0);

  document.getElementById("cartbar").hidden = count === 0;
  document.getElementById("count").textContent = count;
  document.getElementById("total").textContent = money(total);

  document.getElementById("cartitems").innerHTML = cart.length
    ? cart.map(p => `
      <div class="cartitem">
        <span>${p.name} × ${p.qty}</span>
        <strong>${money(p.price * p.qty)}</strong>
        <button type="button" data-remove="${p.id}" aria-label="Bir adet azalt">−</button>
        <button type="button" data-plus="${p.id}" aria-label="Bir adet artır">+</button>
      </div>
    `).join("")
    : "<p>Sepetin boş.</p>";

  document.querySelectorAll("[data-remove]").forEach(button => {
    button.onclick = () => {
      const item = cart.find(p => p.id === Number(button.dataset.remove));
      if (item.qty > 1) item.qty--;
      else cart = cart.filter(p => p.id !== item.id);
      renderCart();
    };
  });

  document.querySelectorAll("[data-plus]").forEach(button => {
    button.onclick = () => {
      cart.find(p => p.id === Number(button.dataset.plus)).qty++;
      renderCart();
    };
  });
}

document.getElementById("openCart").addEventListener("click", () => cartBox.showModal());
document.getElementById("closeCart").addEventListener("click", () => cartBox.close());

const serviceType = document.getElementById("serviceType");
const addressLabel = document.getElementById("addressLabel");
const addressInput = addressLabel.querySelector("textarea");

function updateService() {
  const service = serviceType.value;
  addressLabel.firstChild.textContent =
    service === "Masa servisi" ? "Masa numarası / not" :
    service === "Paket servis" ? "Teslimat adresi / not" :
    "Gel-al saati / not";

  addressInput.placeholder =
    service === "Masa servisi" ? "Masa numaranız" :
    service === "Paket servis" ? "Mahalle, cadde, bina ve daire" :
    "Tahmini geliş saatiniz";

  addressInput.required = service === "Paket servis";
}
serviceType.addEventListener("change", updateService);
updateService();

document.getElementById("checkout").addEventListener("submit", event => {
  event.preventDefault();
  if (!cart.length) {
    alert("Sepetiniz boş. Önce menüden ürün ekleyin.");
    return;
  }

  const form = new FormData(event.currentTarget);
  const lines = cart.map(p => `${p.name} x${p.qty} — ${money(p.price * p.qty)}`).join("\n");
  const total = cart.reduce((sum, p) => sum + p.price * p.qty, 0);

  const message = [
    "HANCAN KEBAP DÖNER - SİPARİŞ",
    `Ad Soyad: ${form.get("name")}`,
    `Telefon: ${form.get("phone")}`,
    `Sipariş türü: ${form.get("service")}`,
    `Adres / Not: ${form.get("address") || "-"}`,
    `Ödeme: ${form.get("payment")}`,
    "",
    lines,
    "",
    `TOPLAM: ${money(total)}`
  ].join("\n");

  const whatsappUrl = "https://wa.me/905451546507?text=" + encodeURIComponent(message);
  window.open(whatsappUrl, "_blank", "noopener");
});

document.getElementById("year").textContent = new Date().getFullYear();
renderCategories();
renderProducts();
renderCart();
