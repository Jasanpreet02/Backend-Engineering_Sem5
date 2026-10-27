
const products = [
  { id: 1, name: "Phulkari Dupatta", category: "Clothing", price: 899,
    image: "https://www.teejh.com/cdn/shop/files/TED15_1_1024x1024.jpg?v=1699512250" },
  { id: 2, name: "Punjabi Jutti", category: "Footwear", price: 699,
    image: "https://cdn.exoticindia.com/images/products/original/footwear/sjc54-beeswax.jpg" },
  { id: 3, name: "Punjabi Mango Pickle", category: "Food", price: 249,
    image: "https://www.mothersrecipe.com/cdn/shop/files/PunjabiMangoPickle500g_1800x1800.png?v=1751454936" },
  { id: 4, name: "Traditional Charpai", category: "Home", price: 2499,
    image: "https://punjabicharmcollection.com/cdn/shop/products/63.png?v=1666141132&width=500" },
  { id: 5, name: "Phulkari Shawl", category: "Clothing", price: 1299,
    image: "https://cdn.exoticindia.com/images/products/original/shawls/fuchsiarose_phulkari_dupatta_from_punjab_with_ari-embroidered_shz21.webp" },
  { id: 6, name: "Embroidered Jutti", category: "Footwear", price: 799,
    image: "https://houseofavi.in/cdn/shop/products/86_d6943d9d-8201-4aab-b87e-9030d9071b1f.jpg?crop=center&height=600&v=1735022402&width=500" },
  { id: 7, name: "Punjabi Suit", category: "Clothing", price: 1599,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=450&q=75" },
  { id: 8, name: "Mustard Oil", category: "Food", price: 199,
    image: "" },
  { id: 9, name: "Punjabi Paranda", category: "Accessories", price: 199,
    image: "" },
  { id: 10, name: "Traditional Phulkari Bag", category: "Accessories", price: 599,
    image: "https://theamritsarstore.com/cdn/shop/files/traditional-phulkari-embroidered-potli-bag-for-women..png?v=1773136533" },
  { id: 11, name: "Punjabi Spice Set", category: "Food", price: 349,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=450&q=75" },
  { id: 12, name: "Phulkari Cushion", category: "Home", price: 449,
    image: "" }
];

const cart = {};
let couponApplied = false;

const $ = id => document.getElementById(id);
const money = amount => "₹" + amount.toLocaleString("en-IN");

function showProducts() {
  const search = $("search").value.trim().toLowerCase();
  const category = $("category").value;
  const sort = $("sort").value;

  let list = products.filter(p =>
    p.name.toLowerCase().includes(search) &&
    (category === "All" || p.category === category)
  );

  if (sort === "low") list.sort((a, b) => a.price - b.price);
  if (sort === "high") list.sort((a, b) => b.price - a.price);
  if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));

  $("no-products").hidden = list.length > 0;
  const container = $("product-list");
  container.replaceChildren();

  list.forEach(p => {
    const card = document.createElement("article");
    card.className = "product";

    const image = document.createElement("img");
    image.alt = p.name;
    image.loading = "lazy";

    const fallback = document.createElement("div");
    fallback.className = "image-fallback";
    fallback.textContent = p.name;
    fallback.hidden = true;

    image.onerror = () => {
      image.hidden = true;
      fallback.hidden = false;
    };

    if (p.image) {
      image.src = p.image;
    } else {
      image.hidden = true;
      fallback.hidden = false;
    }

    const name = document.createElement("h3");
    name.textContent = p.name;

    const categoryText = document.createElement("p");
    categoryText.textContent = p.category;

    const price = document.createElement("p");
    price.className = "price";
    price.textContent = money(p.price);

    const button = document.createElement("button");
    button.textContent = "Add to Cart";
    button.addEventListener("click", () => addToCart(p.id));

    card.append(image, fallback, name, categoryText, price, button);
    container.appendChild(card);
  });
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  $("message").textContent = "Product added to cart!";
  showCart();
}

function changeQty(id, amount) {
  cart[id] = (cart[id] || 0) + amount;
  if (cart[id] <= 0) delete cart[id];
  showCart();
}

function removeItem(id) {
  delete cart[id];
  showCart();
}

function showCart() {
  const items = products.filter(p => cart[p.id]);
  const count = items.reduce((sum, p) => sum + cart[p.id], 0);
  const subtotal = items.reduce((sum, p) => sum + p.price * cart[p.id], 0);

  if (!items.length) {
    couponApplied = false;
    $("coupon-message").textContent = "";
  }

  const discount = couponApplied ? Math.round(subtotal * 0.10) : 0;

  $("cart-count").textContent = count;
  $("subtotal").textContent = money(subtotal);
  $("discount").textContent = money(discount);
  $("total").textContent = money(subtotal - discount);

  const container = $("cart-items");
  container.replaceChildren();

  if (!items.length) {
    container.textContent = "Your cart is empty.";
    return;
  }

  items.forEach(p => {
    const row = document.createElement("div");
    row.className = "cart-row";

    const details = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = p.name;

    const price = document.createElement("p");
    price.textContent = money(p.price) + " each";
    details.append(name, price);

    const controls = document.createElement("div");
    controls.className = "quantity";

    const minus = document.createElement("button");
    minus.textContent = "−";
    minus.setAttribute("aria-label", "Decrease quantity");
    minus.addEventListener("click", () => changeQty(p.id, -1));

    const quantity = document.createElement("span");
    quantity.textContent = cart[p.id];

    const plus = document.createElement("button");
    plus.textContent = "+";
    plus.setAttribute("aria-label", "Increase quantity");
    plus.addEventListener("click", () => changeQty(p.id, 1));

    const remove = document.createElement("button");
    remove.textContent = "Remove";
    remove.className = "remove";
    remove.addEventListener("click", () => removeItem(p.id));

    controls.append(minus, quantity, plus, remove);
    row.append(details, controls);
    container.appendChild(row);
  });
}

$("search").addEventListener("input", showProducts);
$("category").addEventListener("change", showProducts);
$("sort").addEventListener("change", showProducts);

$("apply-coupon").addEventListener("click", () => {
  const code = $("coupon").value.trim().toUpperCase();
  const hasItems = Object.keys(cart).length > 0;

  if (!hasItems) {
    couponApplied = false;
    $("coupon-message").textContent = "Add products before applying a coupon.";
  } else if (code === "PIND10") {
    couponApplied = true;
    $("coupon-message").textContent = "Success! You saved 10% on your order.";
  } else {
    couponApplied = false;
    $("coupon-message").textContent = "Invalid coupon. Try PIND10.";
  }

  showCart();
});

$("checkout-form").addEventListener("submit", event => {
  event.preventDefault();

  if (!Object.keys(cart).length) {
    $("message").textContent = "Please add products to your cart first.";
    $("cart").scrollIntoView({ behavior: "smooth" });
    return;
  }

  const name = $("customer-name").value.trim();
  const phone = $("phone").value.trim();
  const address = $("address").value.trim();
  const payment = $("payment").value;
  const orderNumber = "PB" + Date.now().toString().slice(-8);
  const items = products.filter(p => cart[p.id]);

  $("order-details").textContent =
    `Order Number: ${orderNumber}\nCustomer: ${name}\nPhone: ${phone}\nAddress: ${address}\nPayment: ${payment}\nTotal Paid: ${$("total").textContent}`;

  const orderItems = $("order-items");
  orderItems.replaceChildren();

  items.forEach(p => {
    const line = document.createElement("p");
    line.className = "order-line";
    line.textContent = `${p.name} × ${cart[p.id]} — ${money(p.price * cart[p.id])}`;
    orderItems.appendChild(line);
  });

  $("order-success").hidden = false;
  $("checkout-form").hidden = true;
  $("message").textContent = "";

  Object.keys(cart).forEach(id => delete cart[id]);
  couponApplied = false;
  $("coupon").value = "";
  $("coupon-message").textContent = "";
  showCart();

  $("order-success").scrollIntoView({ behavior: "smooth", block: "center" });
});

$("continue-shopping").addEventListener("click", () => {
  $("order-success").hidden = true;
  $("checkout-form").hidden = false;
  $("checkout-form").reset();
  $("message").textContent = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
});

showProducts();
showCart();
