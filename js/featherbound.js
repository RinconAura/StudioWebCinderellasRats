function loadFBSection(sectionPath) {
  const sectionContainer = document.getElementById("fb-content");
  if (!sectionContainer) {
    console.error("No existe el contenedor #fb-content en esta página.");
    return;
  }

  
  fetch(`/pages/Featherbound/${sectionPath}.html`)
    .then(res => {
      if (!res.ok) throw new Error("No se encontró la sección");
      return res.text();
    })
    .then(data => {
      sectionContainer.innerHTML = data;

    
      const existingLink = document.getElementById("section-style");
      if (existingLink) existingLink.remove();

      
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `/css/Featherbound/${sectionPath}.css`;
      link.id = "section-style";
      document.head.appendChild(link);
    })
    .catch(err => {
      sectionContainer.innerHTML = "<p>Error al cargar la sección.</p>";
      console.error(err);
    });
}


function volverFeatherbound() {
  if (window.loadPage) {
    loadPage('Featherbound/featherbound');
  } else {
    window.location.href = "featherbound.html";
  }
}

window.loadFBSection = loadFBSection;
window.volverFeatherbound = volverFeatherbound;
