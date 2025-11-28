
function initCharacterScene(containerId, modelPath, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

 
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    50,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

 
 
const ambient = new THREE.AmbientLight(
  0xffffff,
  options.ambientIntensity !== undefined ? options.ambientIntensity : 1
);
scene.add(ambient);

const directional = new THREE.DirectionalLight(
  0xffffff,
  options.directionalIntensity !== undefined ? options.directionalIntensity : 1.5
);
directional.position.set(
  options.directionalX || 2,
  options.directionalY || 2,
  options.directionalZ || 5
);
scene.add(directional);


if (options.fillLightIntensity) {
  const fill = new THREE.DirectionalLight(0xffffff, options.fillLightIntensity);
  fill.position.set(-2, 1, 2);
  scene.add(fill);
}


 camera.position.set(0, options.cameraY || 0, options.cameraZ || 5);


 
  const loader = new THREE.GLTFLoader();
  let model = null;
  let mixer = null;


loader.load(
  modelPath,
  (gltf) => {
    model = gltf.scene;
    const s = options.scale || 1;
    model.scale.set(s, s, s);
    model.position.y = options.y || 0;
    model.position.x = options.x || 0;
    scene.add(model);

    if (options.scrollAnimated) {
  setupScrollAnimations(options.characterName || "personaje");
}

  
    if (options.scrollAnimated) {
      window.modelRotation = model.rotation;
    }

   
    if (gltf.animations && gltf.animations.length > 0 && !options.noAutoAnimation) {
      mixer = new THREE.AnimationMixer(model);
      gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
    }
  },
    undefined,
    (err) => console.error('Error cargando modelo:', err)
  );


  if (options.interactive) {
    let isDragging = false, prevX = 0, prevY = 0;
    renderer.domElement.style.cursor = 'grab';
    renderer.domElement.addEventListener('pointerdown', (e) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
      renderer.domElement.style.cursor = 'grabbing';
    });
    window.addEventListener('pointerup', () => {
      isDragging = false;
      renderer.domElement.style.cursor = 'grab';
    });
    window.addEventListener('pointermove', (e) => {
      if (!isDragging || !model) return;
      const dx = (e.clientX - prevX) * 0.01;
      const dy = (e.clientY - prevY) * 0.01;
      model.rotation.y += dx;
      model.rotation.x += dy * 0.2;
      prevX = e.clientX;
      prevY = e.clientY;
    });

    renderer.domElement.addEventListener(
      'wheel',
      (ev) => {
        ev.preventDefault();
        camera.position.z += ev.deltaY * 0.01;
        camera.position.z = Math.min(Math.max(camera.position.z, 2), 10);
      },
      { passive: false }
    );
  }


function setupScrollAnimations(characterName) {
  gsap.registerPlugin(ScrollTrigger);

  const modelClass = `.${characterName}-model`;
  const sceneId = `#scene-${characterName}`;
  const infoClass = `.${characterName}-info`;
  const sectionDesc = `.section-description`;
  const sectionModel = `.section-modelsheet`;
  const sectionConcept = `.section-concept`;

 
  gsap.to(modelClass, {
    y: () => {
      const lastSection = document.querySelector(sectionConcept);
      return lastSection ? lastSection.offsetHeight * 0.001 : 0;
    },
    ease: "none",
    scrollTrigger: {
      trigger: infoClass,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.5,
    },
  });

 
  gsap.to(sceneId + " canvas", {
    onUpdate: () => {},
  });

  gsap.to(sceneId, {
    scrollTrigger: {
      trigger: sectionDesc,
      start: "top center",
      end: "bottom center",
      scrub: true,
      onEnter: () => gsap.to(window.modelRotation, { y: 1, duration: 1 }),
    },
  });

  gsap.to(sceneId, {
    scrollTrigger: {
      trigger: sectionModel,
      start: "top center",
      end: "bottom center",
      scrub: true,
      onEnter: () => gsap.to(window.modelRotation, { y: -1, duration: 1 }),
    },
  });

  gsap.to(sceneId, {
    scrollTrigger: {
      trigger: sectionConcept,
      start: "top center",
      end: "bottom bottom",
      scrub: true,
      onEnter: () => gsap.to(window.modelRotation, { y: 0, duration: 1 }),
    },
  });
}


  // --- RENDER LOOP ---
  const clock = new THREE.Clock();
  function render() {
    requestAnimationFrame(render);
    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    renderer.render(scene, camera);
  }
  render();

  // Responsividad
  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}
