new Typed(".home__typed", {
  strings: [
    "Diploma Electronics Engineer",
    "Circuit Designer",
    "Power Electronics",
    "Embedded Systems"
  ],
  typeSpeed: 70,
  backSpeed: 40,
  loop: true
});

window.addEventListener("scroll", () => {
  const scrollUp = document.getElementById("scroll-up");
  scrollY > 300
    ? scrollUp.classList.add("show-scroll")
    : scrollUp.classList.remove("show-scroll");
});
