function initCarrusel() {
  const carrusel = document.getElementById('carrusel');
  if (!carrusel) return;

  const slides = Array.from(carrusel.querySelectorAll('.slide'));
  const prevBtn = carrusel.querySelector('.prev');
  const nextBtn = carrusel.querySelector('.next');
  let index = 0;

  function updatePositions() {
    slides.forEach((s, i) => {
      s.classList.remove('prev', 'active', 'next');
      if (i === index) s.classList.add('active');
      else if (i === (index - 1 + slides.length) % slides.length) s.classList.add('prev');
      else if (i === (index + 1) % slides.length) s.classList.add('next');
    });
  }

  function goTo(newIndex) {
    index = (newIndex + slides.length) % slides.length;
    updatePositions();
  }

  prevBtn.addEventListener('click', () => goTo(index - 1));
  nextBtn.addEventListener('click', () => goTo(index + 1));

  let autoplay = true;
  setInterval(() => { if (autoplay) goTo(index + 1); }, 4000);

  carrusel.addEventListener('mouseenter', () => autoplay = false);
  carrusel.addEventListener('mouseleave', () => autoplay = true);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goTo(index - 1);
    if (e.key === 'ArrowRight') goTo(index + 1);
  });

  updatePositions();
}

window.initCarrusel = initCarrusel;
