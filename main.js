/* ============================
   MENU TOGGLE
============================ */

const menuBtn = document.getElementById("menuBtn");
const menuOverlay = document.getElementById("menuOverlay");
const menuClose = document.getElementById("menuClose");

function openMenu() {
  menuOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  menuOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

menuBtn.addEventListener("click", openMenu);
menuClose.addEventListener("click", closeMenu);

// Close menu when clicking outside nav
menuOverlay.addEventListener("click", (e) => {
  if (e.target === menuOverlay) {
    closeMenu();
  }
});

// ESC key close
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeMenu();
  }
});

/* ============================
   LOGO PARALLAX (SUBTLE)
============================ */

const logo = document.querySelector(".site-logo img");

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

document.addEventListener("mousemove", (e) => {
  targetX = (e.clientX / window.innerWidth - 0.5) * 10;
  targetY = (e.clientY / window.innerHeight - 0.5) * 10;
});

function animateLogo() {
  currentX += (targetX - currentX) * 0.08;
  currentY += (targetY - currentY) * 0.08;

  if (logo) {
    logo.style.transform =
      `translate(${currentX}px, ${currentY}px)`;
  }

  requestAnimationFrame(animateLogo);
}

animateLogo();

/* ============================
   SCROLL TEXT AUTO FADE
============================ */

const scrollText = document.querySelector(".scroll");

let scrolled = false;

window.addEventListener("scroll", () => {
  if (!scrollText) return;

  if (window.scrollY > 30 && !scrolled) {
    scrollText.style.opacity = "0";
    scrollText.style.transition = "0.5s ease";
    scrolled = true;
  }
});

/* ============================
   VIDEO SAFETY (MOBILE)
============================ */

const bgVideo = document.getElementById("bg-video");

if (bgVideo) {
  bgVideo.addEventListener("loadeddata", () => {
    bgVideo.classList.add("ready");
  });

  // Fallback play (mobile)
  document.addEventListener("touchstart", () => {
    bgVideo.play().catch(() => {});
  }, { once: true });
}
