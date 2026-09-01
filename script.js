const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const progressBar = document.querySelector('.scroll-progress span');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const closeMenu = () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menú');
  document.body.classList.remove('menu-open');
};

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  if (isOpen) {
    closeMenu();
  } else {
    nav.classList.add('open');
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Cerrar menú');
    document.body.classList.add('menu-open');
  }
});

nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 24);
const updateScrollEffects = () => {
  updateHeader();
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
  document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
};
window.addEventListener('scroll', updateScrollEffects, { passive: true });
updateHeader();
updateScrollEffects();

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reduceMotion.matches) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

// Entradas escalonadas para grupos: el contenido aparece como una secuencia, no en bloque.
document.querySelectorAll('.impact-grid, .program-stepper, .action-photo-band, .team-line, .event-list, .gallery-grid').forEach(group => {
  [...group.children].forEach((item, index) => item.style.setProperty('--stagger', `${index * 70}ms`));
});

// Profundidad suave en la portada, limitada a dispositivos con puntero preciso.
const heroVisual = document.querySelector('.hero-visual');
if (heroVisual && window.matchMedia('(pointer: fine)').matches && !reduceMotion.matches) {
  heroVisual.addEventListener('pointermove', event => {
    const bounds = heroVisual.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    heroVisual.style.setProperty('--tilt-x', `${-y * 3}deg`);
    heroVisual.style.setProperty('--tilt-y', `${x * 4}deg`);
  });
  heroVisual.addEventListener('pointerleave', () => {
    heroVisual.style.setProperty('--tilt-x', '0deg');
    heroVisual.style.setProperty('--tilt-y', '0deg');
  });
}

// Resalta en la navegación la sección visible.
const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-38% 0px -55%', threshold: 0 });
  sections.forEach(section => sectionObserver.observe(section));
}

const accordionItems = document.querySelectorAll('.accordion details');
accordionItems.forEach(item => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    accordionItems.forEach(other => {
      if (other !== item) other.open = false;
    });
  });
});

const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('p');

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    lightboxImage.src = item.dataset.src;
    lightboxImage.alt = item.querySelector('img').alt;
    lightboxCaption.textContent = item.dataset.caption;
    lightbox.showModal();
  });
});

lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', event => {
  if (event.target === lightbox) lightbox.close();
});

document.getElementById('year').textContent = new Date().getFullYear();

// Mapa de Puntos Verdes Acción Planeta. Direcciones publicadas por Cruz Verde.
const greenPoints = [
  { id: 398, commune: 'Huechuraba', address: 'Avenida del Parque 4023', place: 'Strip Center', hours: 'Lunes a sábado', lat: -33.3945511, lng: -70.6202978 },
  { id: 427, commune: 'Renca', address: 'Avenida Domingo Santa María 3962', place: 'Supermercado Santa Isabel', hours: 'Lunes a domingo', lat: -33.4068191, lng: -70.7011289 },
  { id: 387, commune: 'Pudahuel', address: 'Isla Portezuelo 615', place: 'Supermercado Santa Isabel', hours: 'Lunes a domingo', lat: -33.4531371, lng: -70.7623512 },
  { id: 112, commune: 'Lo Prado', address: 'Avenida General Óscar Bonilla 5900', place: 'Interior estación Metro Pajaritos', hours: 'Lunes a domingo', lat: -33.4573499, lng: -70.7155518 },
  { id: 53, commune: 'Maipú', address: 'Avenida Los Pajaritos 1920', place: 'Farmacia Cruz Verde', hours: 'Lunes a domingo', lat: -33.5098934, lng: -70.7574917 },
  { id: 474, commune: 'Pedro Aguirre Cerda', address: 'José Joaquín Prieto 5531', place: 'Centro Comercial Portal Ochagavía', hours: 'Lunes a domingo', lat: -33.50108, lng: -70.6679483 },
  { id: 756, commune: 'San Bernardo', address: 'Eyzaguirre 574', place: 'Farmacia Cruz Verde', hours: 'Lunes a sábado', lat: -33.5938099, lng: -70.7058501 },
  { id: 424, commune: 'La Pintana', address: 'Santa Rosa 13015', place: 'Supermercado Santa Isabel', hours: 'Lunes a domingo', lat: -33.5868437, lng: -70.6298305 },
  { id: 412, commune: 'Providencia', address: 'Avenida Francisco Bilbao 2191', place: 'Farmacia Cruz Verde', hours: 'Lunes a domingo', lat: -33.4378985, lng: -70.6040683 },
  { id: 391, commune: 'Las Condes', address: 'Avenida Américo Vespucio 1040', place: 'Strip Center', hours: 'Lunes a domingo', lat: -33.4236144, lng: -70.5785042 },
  { id: 494, commune: 'Ñuñoa', address: 'Tobalaba 4507', place: 'Strip Center', hours: 'Lunes a domingo', lat: -33.4343218, lng: -70.5824311 },
  { id: 1033, commune: 'Peñalolén', address: 'Avenida Los Presidentes 8960', place: 'Centro Médico Clínica Las Condes', hours: 'Lunes a sábado', lat: -33.482782, lng: -70.5708501 },
  { id: 479, commune: 'Peñalolén', address: 'Avenida Mariano Sánchez Fontecilla 10200', place: 'Strip Center', hours: 'Lunes a domingo', lat: -33.4644284, lng: -70.550188 },
  { id: 835, commune: 'La Florida', address: 'Vicente Valdés 85', place: 'Strip Center', hours: 'Lunes a sábado', lat: -33.5265709, lng: -70.5955448 },
  { id: 418, commune: 'Puente Alto', address: 'Concha y Toro 184', place: 'Farmacia Cruz Verde', hours: 'Lunes a domingo', lat: -33.6101784, lng: -70.5759641 },
  { id: 1212, commune: 'Santiago', address: 'Santa Rosa 512', place: 'Farmacia Cruz Verde', hours: 'Lunes a domingo', lat: -33.4507057, lng: -70.6442766 },
  { id: 286, commune: 'Santiago', address: 'Portugal 175', place: 'Servicentro Terpel', hours: 'Lunes a domingo', lat: -33.4444514, lng: -70.6372605 },
  { id: 345, commune: 'Santiago', address: 'Huérfanos 856', place: 'Farmacia Cruz Verde', hours: 'Lunes a domingo', lat: -33.4395225, lng: -70.6489149 },
  { id: 573, commune: 'Santiago', address: 'Avenida Buenos Aires 216', place: 'Farmacia Cruz Verde', hours: 'Lunes a viernes', lat: -33.4282409, lng: -70.6408289 },
  { id: 834, commune: 'Santiago', address: 'Avenida Portugal 481', place: 'Farmacia Cruz Verde', hours: 'Lunes a domingo', lat: -33.4479797, lng: -70.6354661 }
];

const mapElement = document.getElementById('green-map');
const pointList = document.getElementById('point-list');
const pointSearch = document.getElementById('point-search');
const visiblePoints = document.getElementById('visible-points');
const noResults = document.getElementById('no-results');
const pointDialog = document.getElementById('point-dialog');
let greenMap;
let userPosition;
let userMarker;
let activePoint;
const pointMarkers = new Map();

const normalizeText = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const fullAddress = point => `${point.address}, ${point.commune}, Región Metropolitana`;
const directionsUrl = point => `https://www.google.com/maps/dir/?api=1&destination=${point.lat}%2C${point.lng}&travelmode=driving`;

const setActiveMarker = point => {
  pointMarkers.forEach(marker => marker.getElement()?.classList.remove('is-active'));
  pointMarkers.get(point.id)?.getElement()?.classList.add('is-active');
};

const openPoint = point => {
  activePoint = point;
  setActiveMarker(point);
  document.getElementById('point-dialog-number').textContent = `CV ${point.id}`;
  document.getElementById('point-dialog-commune').textContent = point.commune;
  document.getElementById('point-dialog-title').textContent = `Punto Verde en ${point.commune}`;
  document.getElementById('point-dialog-place').textContent = point.place;
  document.getElementById('point-dialog-address').textContent = fullAddress(point);
  document.getElementById('point-dialog-hours').textContent = point.hours;
  document.getElementById('point-directions').href = directionsUrl(point);
  pointDialog.showModal();
};

const pointCard = point => `
  <button class="point-card" type="button" data-point-id="${point.id}" aria-label="Ver Punto CV ${point.id} en ${point.commune}">
    <span class="point-card-top"><span class="point-card-code">CV ${point.id}</span><span class="point-card-arrow" aria-hidden="true">↗</span></span>
    <small>${point.commune}</small>
    <h4>${point.address}</h4>
    <p>${point.place}</p>
    <p class="point-hours">◷ ${point.hours}</p>
  </button>`;

const renderPointList = points => {
  pointList.innerHTML = points.map(pointCard).join('');
  visiblePoints.textContent = points.length;
  noResults.hidden = points.length !== 0;
};

const showFilteredPoints = points => {
  pointMarkers.forEach(marker => marker.remove());
  points.forEach(point => pointMarkers.get(point.id)?.addTo(greenMap));
  renderPointList(points);
  if (points.length && greenMap) {
    greenMap.fitBounds(points.map(point => [point.lat, point.lng]), { padding: [42, 42], maxZoom: 14 });
  }
};

const filterPoints = () => {
  const term = normalizeText(pointSearch.value.trim());
  const matches = term ? greenPoints.filter(point => normalizeText(`${point.commune} ${point.address} ${point.place} ${point.id}`).includes(term)) : greenPoints;
  showFilteredPoints(matches);
};

if (mapElement && window.L) {
  greenMap = L.map(mapElement, { scrollWheelZoom: false, zoomControl: true, minZoom: 9 }).setView([-33.49, -70.65], 11);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(greenMap);

  const markerIcon = L.divIcon({
    className: 'green-map-marker',
    html: '<div class="green-pin"><span>+</span></div>',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -34]
  });

  greenPoints.forEach(point => {
    const popup = `<div class="mini-popup"><img src="assets/punto-recoleccion.jpg" alt=""><div class="mini-popup-body"><small>${point.commune} · CV ${point.id}</small><h4>${point.address}</h4><p>${point.hours}</p><button type="button" data-point-open="${point.id}">Ver ficha del punto</button></div></div>`;
    const marker = L.marker([point.lat, point.lng], { icon: markerIcon, title: `Punto CV ${point.id}, ${point.commune}` }).bindPopup(popup, { closeButton: false, maxWidth: 225 });
    pointMarkers.set(point.id, marker);
    marker.addTo(greenMap);
  });
  greenMap.fitBounds(greenPoints.map(point => [point.lat, point.lng]), { padding: [35, 35] });
} else if (mapElement) {
  mapElement.innerHTML = '<p class="map-fallback">El mapa no pudo cargarse. Puedes encontrar todos los puntos en la lista inferior.</p>';
}

renderPointList(greenPoints);
pointSearch?.addEventListener('input', filterPoints);

pointList?.addEventListener('click', event => {
  const card = event.target.closest('[data-point-id]');
  if (!card) return;
  const point = greenPoints.find(item => item.id === Number(card.dataset.pointId));
  if (!point) return;
  greenMap?.setView([point.lat, point.lng], 15, { animate: !reduceMotion.matches });
  pointMarkers.get(point.id)?.openPopup();
  openPoint(point);
});

mapElement?.addEventListener('click', event => {
  const trigger = event.target.closest('[data-point-open]');
  if (!trigger) return;
  const point = greenPoints.find(item => item.id === Number(trigger.dataset.pointOpen));
  if (point) openPoint(point);
});

document.getElementById('map-reset')?.addEventListener('click', () => {
  pointSearch.value = '';
  showFilteredPoints(greenPoints);
});

document.getElementById('list-toggle')?.addEventListener('click', event => {
  const button = event.currentTarget;
  const expanded = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!expanded));
  pointList.classList.toggle('is-expanded', !expanded);
  button.firstChild.textContent = expanded ? 'Ver lista completa ' : 'Ocultar lista ';
});

const distanceInKm = (origin, point) => {
  const toRad = degrees => degrees * Math.PI / 180;
  const dLat = toRad(point.lat - origin.lat);
  const dLng = toRad(point.lng - origin.lng);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(origin.lat)) * Math.cos(toRad(point.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

document.getElementById('locate-me')?.addEventListener('click', event => {
  const button = event.currentTarget;
  if (!navigator.geolocation) {
    button.textContent = 'Ubicación no disponible';
    return;
  }
  button.classList.add('is-loading');
  button.innerHTML = '<span aria-hidden="true">◎</span> Buscando…';
  navigator.geolocation.getCurrentPosition(position => {
    userPosition = { lat: position.coords.latitude, lng: position.coords.longitude };
    userMarker?.remove();
    if (greenMap) {
      const userIcon = L.divIcon({ className: '', html: '<div class="user-location-pin"></div>', iconSize: [22, 22], iconAnchor: [11, 11] });
      userMarker = L.marker([userPosition.lat, userPosition.lng], { icon: userIcon, title: 'Tu ubicación' }).addTo(greenMap);
    }
    const nearest = [...greenPoints].sort((a, b) => distanceInKm(userPosition, a) - distanceInKm(userPosition, b))[0];
    const distance = distanceInKm(userPosition, nearest);
    greenMap?.fitBounds([[userPosition.lat, userPosition.lng], [nearest.lat, nearest.lng]], { padding: [65, 65], maxZoom: 14 });
    pointMarkers.get(nearest.id)?.openPopup();
    button.classList.remove('is-loading');
    button.innerHTML = `<span aria-hidden="true">◎</span> Más cercano: ${distance.toFixed(1)} km`;
  }, () => {
    button.classList.remove('is-loading');
    button.innerHTML = '<span aria-hidden="true">◎</span> No pudimos ubicarte';
  }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 });
});

pointDialog?.querySelector('.point-dialog-close')?.addEventListener('click', () => pointDialog.close());
pointDialog?.addEventListener('click', event => {
  if (event.target === pointDialog) pointDialog.close();
});
pointDialog?.addEventListener('close', () => {
  pointMarkers.forEach(marker => marker.getElement()?.classList.remove('is-active'));
});

document.getElementById('copy-address')?.addEventListener('click', async event => {
  if (!activePoint) return;
  const button = event.currentTarget;
  try {
    await navigator.clipboard.writeText(fullAddress(activePoint));
    button.textContent = '✓ Dirección copiada';
  } catch {
    button.textContent = fullAddress(activePoint);
  }
  window.setTimeout(() => { button.innerHTML = '<span aria-hidden="true">▢</span> Copiar dirección'; }, 2200);
});
