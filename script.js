const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

function closeMenu() {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menú");
}
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));

document.querySelectorAll("[data-message]").forEach(link => {
  link.addEventListener("click", () => {
    link.href = `https://wa.me/543413846242?text=${encodeURIComponent(link.dataset.message)}`;
    link.target = "_blank";
    link.rel = "noopener";
  });
});

const catalogModal = document.getElementById("catalogModal");
const catalogTitle = document.getElementById("catalogTitle");
const catalogItems = document.getElementById("catalogItems");
const WHATSAPP_NUMBER = "543413846242";

const catalogData = {
  "Soluciones para techos": [
    { name: "Impermeabilizantes", placeholder: true },
    { name: "Membranas líquidas", placeholder: true },
    { name: "Soluciones para filtraciones", placeholder: true }
  ],
  "Pinturas y revestimientos": [
    {
      id: "revear-impronta",
      name: "Revestimiento Revear línea Impronta",
      image: "imagenes/revear-impronta.jpg",
      description: "Lata revestimiento acrílico decorativo de efecto texturado marca Revear línea Impronta para uso exterior",
      whatsappDescription: "revestimiento acrílico decorativo de efecto texturado marca Revear línea Impronta para uso exterior"
    },
    {
      id: "parex-decoflex",
      name: "Revestimiento Parex línea Decoflex",
      image: "imagenes/parex-decoflex.jpg",
      description: "Lata de revestimiento decorativo acrílico marca Parex línea Decoflex para uso interior y exterior",
      whatsappDescription: "revestimiento decorativo acrílico marca Parex línea Decoflex para uso interior y exterior"
    }
  ],
  "Materiales para obra": [
    { name: "Materiales de construcción", placeholder: true },
    { name: "Adhesivos y selladores", placeholder: true },
    { name: "Accesorios para obra", placeholder: true }
  ]
};

const productDetailModal = document.createElement("div");
productDetailModal.className = "product-detail-modal";
productDetailModal.id = "productDetailModal";
productDetailModal.setAttribute("aria-hidden", "true");
productDetailModal.innerHTML = `
  <div class="product-detail-backdrop" data-close-product-detail></div>
  <section class="product-detail-dialog" role="dialog" aria-modal="true" aria-labelledby="productDetailTitle">
    <button class="product-detail-close" type="button" aria-label="Cerrar selección" data-close-product-detail>×</button>
    <p class="eyebrow dark"><span></span> IMHOOF GROUP / CONSULTA DE PRODUCTO</p>
    <div class="product-detail-content">
      <img class="product-detail-image" id="productDetailImage" src="" alt="">
      <div class="product-detail-info">
        <h2 id="productDetailTitle"></h2>
        <p id="productDetailDescription"></p>
        <label class="quantity-label" for="productQuantity">Cantidad</label>
        <div class="quantity-control">
          <button type="button" id="quantityMinus" aria-label="Restar una unidad">−</button>
          <output id="productQuantity" aria-live="polite">1</output>
          <button type="button" id="quantityPlus" aria-label="Agregar una unidad">+</button>
        </div>
        <a class="product-whatsapp-button" id="productWhatsApp" href="#" target="_blank" rel="noopener">Continuar a WhatsApp ↗</a>
      </div>
    </div>
  </section>`;
document.body.appendChild(productDetailModal);

const productDetailImage = document.getElementById("productDetailImage");
const productDetailTitle = document.getElementById("productDetailTitle");
const productDetailDescription = document.getElementById("productDetailDescription");
const productQuantity = document.getElementById("productQuantity");
const productWhatsApp = document.getElementById("productWhatsApp");
let selectedProduct = null;
let selectedQuantity = 1;
let lastCatalogTrigger = null;

function updateProductWhatsApp() {
  if (!selectedProduct) return;
  const unit = selectedQuantity === 1 ? "lata" : "latas";
  const message = `Hola, quiero realizar una compra de ${selectedQuantity} ${unit} ${selectedProduct.whatsappDescription}.`;
  productQuantity.textContent = String(selectedQuantity);
  productWhatsApp.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
function openProductDetail(product) {
  selectedProduct = product;
  selectedQuantity = 1;
  productDetailImage.src = product.image;
  productDetailImage.alt = product.name;
  productDetailTitle.textContent = product.name;
  productDetailDescription.textContent = product.description;
  updateProductWhatsApp();
  productDetailModal.classList.add("is-open");
  productDetailModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("product-detail-lock");
  productDetailModal.querySelector(".product-detail-close").focus();
}
function closeProductDetail() {
  productDetailModal.classList.remove("is-open");
  productDetailModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("product-detail-lock");
  selectedProduct = null;
}
document.getElementById("quantityMinus").addEventListener("click", () => {
  selectedQuantity = Math.max(1, selectedQuantity - 1);
  updateProductWhatsApp();
});
document.getElementById("quantityPlus").addEventListener("click", () => {
  selectedQuantity = Math.min(99, selectedQuantity + 1);
  updateProductWhatsApp();
});
productDetailModal.querySelectorAll("[data-close-product-detail]").forEach(el => el.addEventListener("click", closeProductDetail));

function openCatalog(category, trigger) {
  lastCatalogTrigger = trigger || null;
  catalogTitle.textContent = category;
  catalogItems.replaceChildren();

  (catalogData[category] || []).forEach(product => {
    const article = document.createElement("article");
    article.className = product.image ? "catalog-item catalog-item--photo" : "catalog-item";

    if (product.image) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "catalog-product-card";
      button.setAttribute("aria-label", `Seleccionar ${product.name}`);
      const image = document.createElement("img");
      image.src = product.image;
      image.alt = product.name;
      image.loading = "lazy";
      const name = document.createElement("span");
      name.className = "catalog-product-name";
      name.textContent = product.name;
      button.append(image, name);
      button.addEventListener("click", () => openProductDetail(product));
      article.appendChild(button);
    } else {
      const info = document.createElement("div");
      info.className = "catalog-item-info";
      const title = document.createElement("h3");
      title.textContent = product.name;
      const description = document.createElement("p");
      description.textContent = "Consultá por presentaciones, precio y disponibilidad.";
      info.append(title, description);
      article.appendChild(info);
    }
    catalogItems.appendChild(article);
  });

  catalogModal.classList.add("is-open");
  catalogModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("catalog-lock");
  catalogModal.querySelector(".catalog-close").focus();
}
function closeCatalog() {
  catalogModal.classList.remove("is-open");
  catalogModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("catalog-lock");
  if (lastCatalogTrigger) lastCatalogTrigger.focus();
}
document.querySelectorAll(".catalog-trigger").forEach(card => {
  card.addEventListener("click", () => openCatalog(card.dataset.category, card));
  card.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openCatalog(card.dataset.category, card);
    }
  });
});
catalogModal.querySelectorAll("[data-close-catalog]").forEach(el => el.addEventListener("click", closeCatalog));

const workGalleryModal = document.getElementById("workGalleryModal");
const workGalleryTitle = document.getElementById("workGalleryTitle");
const workGalleryGrid = document.getElementById("workGalleryGrid");
const workGalleries = {
  terminaciones: { title: "Trabajos de terminaciones", images: [] },
  obra: { title: "Trabajos de obra", images: [] },
  renovaciones: {
    title: "Trabajos de renovaciones",
    images: [
      "imagenes/a18c1c94-49d2-4f78-8ff7-0c9958202c3a.jpg",
      "imagenes/b8667ff1-c057-4130-a53a-852e870dbc17.jpg",
      "imagenes/fce1147f-d13f-424a-849d-db1f096874ac.jpg"
    ]
  }
};
let lastGalleryTrigger = null;
function openWorkGallery(category, trigger) {
  const gallery = workGalleries[category];
  if (!gallery) return;
  lastGalleryTrigger = trigger;
  workGalleryTitle.textContent = gallery.title;
  workGalleryGrid.replaceChildren();
  if (!gallery.images.length) {
    const message = document.createElement("p");
    message.textContent = "Próximamente agregaremos trabajos de esta categoría.";
    workGalleryGrid.appendChild(message);
  } else {
    gallery.images.forEach((src, index) => {
      const image = document.createElement("img");
      image.src = src;
      image.alt = `${gallery.title} - trabajo ${index + 1}`;
      image.loading = "lazy";
      workGalleryGrid.appendChild(image);
    });
  }
  workGalleryModal.classList.add("is-open");
  workGalleryModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("work-gallery-lock");
  workGalleryModal.querySelector(".work-gallery-close").focus();
}
function closeWorkGallery() {
  workGalleryModal.classList.remove("is-open");
  workGalleryModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("work-gallery-lock");
  if (lastGalleryTrigger) lastGalleryTrigger.focus();
}
document.querySelectorAll(".gallery-trigger").forEach(card => {
  card.addEventListener("click", () => openWorkGallery(card.dataset.gallery, card));
  card.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openWorkGallery(card.dataset.gallery, card);
    }
  });
});
workGalleryModal.querySelectorAll("[data-close-work-gallery]").forEach(el => el.addEventListener("click", closeWorkGallery));

document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;
  closeMenu();
  if (productDetailModal.classList.contains("is-open")) closeProductDetail();
  else if (catalogModal.classList.contains("is-open")) closeCatalog();
  if (workGalleryModal.classList.contains("is-open")) closeWorkGallery();
});
const yearElement = document.getElementById("year");
if (yearElement) yearElement.textContent = new Date().getFullYear();
