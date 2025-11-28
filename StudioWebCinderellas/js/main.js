// js/main.js
async function loadPage(page) {
  const main = document.getElementById('main-content');

  try {
    const path = page.includes('/') ? `pages/${page}.html` : `pages/Studio/${page}.html`;
    const response = await fetch(path);
    if (!response.ok) throw new Error(`No se pudo cargar la página: ${path} (status ${response.status})`);

    const html = await response.text();
    main.innerHTML = html;

   
    document.body.className = '';
    const pageName = page.includes('/') ? page.split('/').pop() : page;
    document.body.classList.add(`page-${pageName}`);

   
    const oldLink = document.getElementById('page-style');
    if (oldLink) oldLink.remove();

   
    let cssHref;
    if (page.includes('/')) {
      const parts = page.split('/');
      cssHref = `css/${parts[0]}/${parts[1]}.css`;
    } else {
      cssHref = `css/Studio/${page}.css`;
    }

 
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssHref;
    link.id = 'page-style';
    document.head.appendChild(link);

   
    const oldScript = document.getElementById('page-script');
    if (oldScript) oldScript.remove();

    if (page === 'inicio') {
  const script = document.createElement('script');
  script.src = 'js/carrusel.js'; 
  script.id = 'page-script';
  script.onload = () => {
    if (typeof initCarrusel === 'function') {
      initCarrusel(); 
    }
  };
  document.body.appendChild(script);
}

    
    if (page.startsWith('Featherbound/')) {
      const script = document.createElement('script');
      script.src = '/js/featherbound.js';
      script.id = 'page-script';
      document.body.appendChild(script);
    }

    
    const newMain = main.querySelector('main') || main.querySelector('div');
    const layoutType = newMain?.dataset?.layout || "default";
    const siteHeader = document.querySelector('.site-header');
    const siteFooter = document.querySelector('.site-footer');
    if (layoutType === "alt") {
      if (siteHeader) siteHeader.style.display = 'none';
      if (siteFooter) siteFooter.style.display = 'none';
    } else {
      if (siteHeader) siteHeader.style.display = '';
      if (siteFooter) siteFooter.style.display = '';
    }

   
    window.scrollTo(0, 0);
  } catch (error) {
    main.innerHTML = `<p>Error al cargar la página: ${error.message}</p>`;
    console.error(error);
  }
}

window.loadPage = loadPage; 
loadPage('inicio');
