// ========== ELEMEN DOM ==========
const header = document.getElementById("header");
const navMenu = document.getElementById("nav-menu");
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.querySelectorAll(".nav-link");
const themeToggle = document.getElementById("theme-toggle");
const toTop = document.getElementById("to-top");
const typingText = document.getElementById("typing-text");
const filterButtons = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".card");
const form = document.getElementById("contact-form");

// ========== 1. MENU MOBILE ==========
function setMenu(open) {
  navMenu.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.textContent = open ? "✕" : "☰";
}

navToggle.addEventListener("click", () => {
  setMenu(!navMenu.classList.contains("open"));
});

navLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));

// ========== 2. DARK MODE (disimpan di localStorage) ==========
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
}

const savedTheme =
  localStorage.getItem("theme") ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
applyTheme(savedTheme);

themeToggle.addEventListener("click", () => {
  const next =
    document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem("theme", next);
});

// ========== 3. EFEK MENGETIK ==========
const words = ["Web Developer", "UI Slicer", "Mahasiswa Informatika"];
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function type() {
  const current = words[wordIndex];
  typingText.textContent = current.substring(0, charIndex);

  if (!deleting && charIndex < current.length) {
    charIndex++;
    setTimeout(type, 90);
  } else if (!deleting) {
    deleting = true;
    setTimeout(type, 1400);
  } else if (charIndex > 0) {
    charIndex--;
    setTimeout(type, 45);
  } else {
    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    setTimeout(type, 300);
  }
}
type();

// ========== 4. SCROLL: header, tombol ke atas, link aktif ==========
const sections = document.querySelectorAll("main section[id]");

function onScroll() {
  const y = window.scrollY;
  header.classList.toggle("scrolled", y > 10);
  toTop.classList.toggle("show", y > 400);

  let currentId = "home";
  sections.forEach((sec) => {
    if (y >= sec.offsetTop - 120) currentId = sec.id;
  });
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + currentId);
  });
}

window.addEventListener("scroll", onScroll);
onScroll();

toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ========== 5. ANIMASI MUNCUL SAAT SCROLL ==========
function animateCount(el) {
  const target = Number(el.dataset.count);
  let value = 0;
  const step = Math.max(1, Math.ceil(target / 40));
  const timer = setInterval(() => {
    value += step;
    if (value >= target) {
      value = target;
      clearInterval(timer);
    }
    el.textContent = value;
  }, 35);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("visible");

      el.querySelectorAll(".bar-fill").forEach((bar) => {
        bar.style.width = bar.dataset.width + "%";
      });
      el.querySelectorAll("[data-count]").forEach(animateCount);

      observer.unobserve(el);
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// ========== 6. FILTER PROYEK ==========
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;
    cards.forEach((card) => {
      const match = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hide", !match);
    });
  });
});

// ========== 7. VALIDASI FORM KONTAK ==========
function setError(id, message) {
  const input = document.getElementById(id);
  document.getElementById(id + "-error").textContent = message;
  input.closest(".field").classList.toggle("invalid", Boolean(message));
  return !message;
}

function validate() {
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const okName = setError("name", name.length < 3 ? "Nama minimal 3 karakter." : "");
  const okEmail = setError("email", !emailPattern.test(email) ? "Format email tidak valid." : "");
  const okMsg = setError("message", message.length < 10 ? "Pesan minimal 10 karakter." : "");

  return okName && okEmail && okMsg;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const success = document.getElementById("form-success");
  success.textContent = "";

  if (validate()) {
    success.textContent = "Terima kasih! Pesanmu berhasil dikirim (simulasi).";
    form.reset();
  }
});

["name", "email", "message"].forEach((id) => {
  document.getElementById(id).addEventListener("input", () => setError(id, ""));
});

// ========== 8. TAHUN OTOMATIS DI FOOTER ==========
document.getElementById("year").textContent = new Date().getFullYear();