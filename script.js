const loader = document.getElementById("loader");
const navbar = document.getElementById("navbar");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

window.addEventListener("load", () => {
  setTimeout(() => loader.classList.add("hide"), 450);
  reveal();
});

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
  reveal();
});

function reveal() {
  document.querySelectorAll(".reveal").forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight * .88) {
      el.classList.add("active");
    }
  });
}

menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("open");
  navMenu.classList.toggle("open");
  document.body.style.overflow = navMenu.classList.contains("open") ? "hidden" : "";
});

document.querySelectorAll("nav a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("open");
    navMenu.classList.remove("open");
    document.body.style.overflow = "";
  });
});

// CHEKI CALCULATOR
const member = document.getElementById("member");
const quantity = document.getElementById("quantity");
const minus = document.getElementById("minus");
const plus = document.getElementById("plus");
const unitPrice = document.getElementById("unitPrice");
const totalPrice = document.getElementById("totalPrice");
const orderStatus = document.getElementById("orderStatus");
const orderForm = document.getElementById("orderForm");

function rupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value);
}

function updatePrice() {
  const selected = member.options[member.selectedIndex];
  const price = Number(selected.dataset.price);
  let qty = Number(quantity.value) || 1;

  if (qty < 1) qty = 1;
  if (qty > 99) qty = 99;
  quantity.value = qty;

  unitPrice.textContent = rupiah(price);
  totalPrice.textContent = rupiah(price * qty);
  orderStatus.textContent = `${qty} CHEKI`;
}

const memberChoices = document.querySelectorAll(".member-choice");

memberChoices.forEach((choice) => {
  choice.addEventListener("click", () => {
    memberChoices.forEach((item) => item.classList.remove("active"));
    choice.classList.add("active");

    const memberName = choice.dataset.member;
    const option = Array.from(member.options).find((item) => item.value === memberName);
    if (option) {
      member.value = memberName;
      member.dispatchEvent(new Event("change"));
    }
  });
});

member.addEventListener("change", () => {
  memberChoices.forEach((choice) => {
    choice.classList.toggle("active", choice.dataset.member === member.value);
  });
  updatePrice();
});

minus.addEventListener("click", () => {
  quantity.value = Math.max(1, Number(quantity.value) - 1);
  updatePrice();
});

plus.addEventListener("click", () => {
  quantity.value = Math.min(99, Number(quantity.value) + 1);
  updatePrice();
});

quantity.addEventListener("input", updatePrice);

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const selected = member.options[member.selectedIndex];
  const memberName = selected.value;
  const qty = Number(quantity.value);
  const price = Number(selected.dataset.price);
  const total = price * qty;
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!name || !phone) {
    alert("Mohon isi nama dan nomor WhatsApp terlebih dahulu.");
    return;
  }

  // Nomor admin DELUNA: 081232376580 -> format internasional 6281232376580
  const adminWhatsApp = "6281232376580";

  const message =
    "Halo Admin DELUNA 👋%0A%0A" +
    "Saya ingin melakukan pemesanan Cheki.%0A%0A" +
    "Nama: " + encodeURIComponent(name) + "%0A" +
    "No. WhatsApp: " + encodeURIComponent(phone) + "%0A" +
    "Member: " + encodeURIComponent(memberName) + "%0A" +
    "Jumlah Cheki: " + qty + "%0A" +
    "Harga / Cheki: " + encodeURIComponent(rupiah(price)) + "%0A" +
    "Total: " + encodeURIComponent(rupiah(total)) + "%0A%0A" +
    "Mohon informasi mengenai pembayaran dan proses selanjutnya. Terima kasih 🙏";

  const whatsappURL = "https://wa.me/" + adminWhatsApp + "?text=" + message;

  window.open(whatsappURL, "_blank", "noopener,noreferrer");
});

updatePrice();
