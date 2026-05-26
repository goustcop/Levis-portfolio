'use strict';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// gallery modal variables
const galleryModalContainer = document.querySelector("[data-gallery-modal-container]");
const galleryOverlay = document.querySelector("[data-gallery-overlay]");
const galleryCloseBtn = document.querySelector("[data-gallery-close-btn]");
const galleryBtn = document.querySelector("[data-gallery-btn]");
const modalGallery = document.querySelector("[data-modal-gallery]");

let currentGalleryData = null;

// render PDF pages into container
const renderPdfToCanvas = function (url, container, scale) {
  scale = scale || 0.8;
  pdfjsLib.getDocument(url).promise.then(function (pdf) {
    for (let p = 1; p <= pdf.numPages; p++) {
      pdf.getPage(p).then(function (page) {
        const viewport = page.getViewport({ scale: scale });
        const canvas = document.createElement("canvas");
        canvas.className = "gallery-modal-canvas";
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#1c2221";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        page.render({ canvasContext: ctx, viewport: viewport });
        container.appendChild(canvas);
      });
    }
  });
};

// readability toggle
const readabilityBtn = document.querySelector("[data-readability-btn]");
readabilityBtn.addEventListener("click", function () {
  document.documentElement.classList.toggle("readable");
  readabilityBtn.classList.toggle("active");
});

// populate modal gallery
const populateGallery = function (galleryData) {
  modalGallery.innerHTML = "";
  if (!galleryData) return;
  const items = JSON.parse(galleryData);
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const wrapper = document.createElement("div");
    wrapper.className = "modal-gallery-item";
    if (item.type === "pdf") {
      wrapper.classList.add("modal-gallery-item-pdf");
      var scale = item.label === "About Us Post" ? 0.35 : 0.8;
      renderPdfToCanvas(item.src, wrapper, scale);
    } else {
      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.label || "";
      img.loading = "lazy";
      wrapper.appendChild(img);
    }
    const label = document.createElement("span");
    label.textContent = item.label || "";
    wrapper.appendChild(label);
    modalGallery.appendChild(wrapper);
  }
}

// gallery modal toggle
const galleryModalFunc = function () {
  galleryModalContainer.classList.toggle("active");
  galleryOverlay.classList.toggle("active");
}

// open gallery modal
galleryBtn.addEventListener("click", function () {
  if (currentGalleryData) {
    populateGallery(currentGalleryData);
    galleryModalFunc();
  }
});

galleryCloseBtn.addEventListener("click", galleryModalFunc);
galleryOverlay.addEventListener("click", galleryModalFunc);

// portfolio modal
const portfolioModalContainer = document.querySelector("[data-portfolio-modal-container]");
const portfolioOverlay = document.querySelector("[data-portfolio-overlay]");
const portfolioCloseBtn = document.querySelector("[data-portfolio-close-btn]");
const portfolioTitle = document.querySelector("[data-portfolio-title]");
const portfolioImg = document.querySelector("[data-portfolio-img]");

const portfolioModalFunc = function () {
  portfolioModalContainer.classList.toggle("active");
  portfolioOverlay.classList.toggle("active");
};

portfolioCloseBtn.addEventListener("click", portfolioModalFunc);
portfolioOverlay.addEventListener("click", portfolioModalFunc);

document.querySelectorAll(".project-item > a").forEach(function (link) {
  link.addEventListener("click", function () {
    var item = this.closest(".project-item");
    var data = JSON.parse(item.dataset.portfolio);
    portfolioTitle.textContent = data.title;
    portfolioImg.src = data.src;
    portfolioImg.alt = data.title;
    portfolioModalFunc();
  });
});

// gallery navigation
const galleryPrev = document.querySelector("[data-gallery-prev]");
const galleryNext = document.querySelector("[data-gallery-next]");

galleryPrev.addEventListener("click", function () {
  modalGallery.scrollBy({ left: -modalGallery.clientWidth, behavior: "smooth" });
});

galleryNext.addEventListener("click", function () {
  modalGallery.scrollBy({ left: modalGallery.clientWidth, behavior: "smooth" });
});

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
  // close gallery modal if testimonials modal is closing
  if (!modalContainer.classList.contains("active")) {
    galleryModalContainer.classList.remove("active");
    galleryOverlay.classList.remove("active");
  }
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {
    const parent = this.closest("[data-client-id]");
    currentGalleryData = parent ? parent.dataset.gallery : null;

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);

// open client modals from clients section
const clientModalLinks = document.querySelectorAll("[data-client-modal]");
for (let i = 0; i < clientModalLinks.length; i++) {
  clientModalLinks[i].addEventListener("click", function () {
    const clientId = this.dataset.clientModal;
    const targetItem = document.querySelector(`[data-client-id="${clientId}"]`);
    if (targetItem) {
      const item = targetItem.querySelector("[data-testimonials-item]");
      modalImg.src = item.querySelector("[data-testimonials-avatar]").src;
      modalImg.alt = item.querySelector("[data-testimonials-avatar]").alt;
      modalTitle.innerHTML = item.querySelector("[data-testimonials-title]").innerHTML;
      modalText.innerHTML = item.querySelector("[data-testimonials-text]").innerHTML;
      currentGalleryData = targetItem.dataset.gallery;
      testimonialsModalFunc();
    }
  });
}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}