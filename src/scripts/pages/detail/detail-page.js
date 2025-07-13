import { createLoader, createErrorMessage } from "@/scripts/utils/index.js";
import { createStoryDetailTemplate } from "@/views/templates/story-templates.js";
import DetailPresenter from "./detail-presenter.js";
import IndexedDBHelper from "@/scripts/utils/indexeddb.js";

export default class DetailPage {
  #presenter;

  constructor() {
    this.#presenter = new DetailPresenter(this);
  }

  async render() {
    return `
          <section id="detail-container" class="container">
             ${createLoader()}
          </section>
        `;
  }

  async afterRender() {
    await this.#presenter.fetchStoryDetail();
    this._setupActionButtons();
  }

  _setupActionButtons() {
    // Add action buttons container after story detail is rendered
    setTimeout(() => {
      const storyDetail = document.querySelector('.story-detail');
      if (storyDetail) {
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'story-actions';
        actionsContainer.innerHTML = `
          <button id="save-offline-btn" class="btn btn-secondary">
            <i class="fa-solid fa-download"></i> Simpan Offline
          </button>
          <button id="favorite-btn" class="btn btn-primary">
            <i class="fa-solid fa-heart"></i> <span id="favorite-text">Tambah ke Favorit</span>
          </button>
        `;
        storyDetail.appendChild(actionsContainer);
        
        this._initActionButtons();
      }
    }, 100);
  }

  async _initActionButtons() {
    const saveOfflineBtn = document.getElementById('save-offline-btn');
    const favoriteBtn = document.getElementById('favorite-btn');
    const favoriteText = document.getElementById('favorite-text');
    
    if (saveOfflineBtn) {
      saveOfflineBtn.addEventListener('click', () => {
        this.#presenter.saveStoryOffline();
      });
    }
    
    if (favoriteBtn) {
      // Check if already favorite
      const storyId = this.#presenter.getCurrentStoryId();
      if (storyId) {
        const isFavorite = await IndexedDBHelper.isFavorite(storyId);
        if (isFavorite) {
          favoriteBtn.className = 'btn btn-danger';
          favoriteBtn.innerHTML = '<i class="fa-solid fa-heart-broken"></i> <span id="favorite-text">Hapus dari Favorit</span>';
        }
      }
      
      favoriteBtn.addEventListener('click', () => {
        this.#presenter.toggleFavorite();
      });
    }
  }

  getContainer() {
    return document.getElementById("detail-container");
  }

  showLoading() {
    const container = this.getContainer();
    if (container) {
      container.innerHTML = createLoader();
    }
  }

  hideLoading() {}

  showError(message) {
    const container = this.getContainer();
    if (container) {
      container.innerHTML = createErrorMessage(message);
    }
  }

  renderStoryDetail(story) {
    const container = this.getContainer();
    if (container) {
      container.innerHTML = createStoryDetailTemplate(story);
    }
  }

  initializeMap(story) {
    const mapElement = document.getElementById("detail-map");
    if (!mapElement) return;

    const map = L.map(mapElement).setView([story.lat, story.lon], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([story.lat, story.lon])
      .addTo(map)
      .bindPopup(story.name)
      .openPopup();
  }

  showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${message}`;
    successDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 1rem;
      border-radius: 8px;
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
      successDiv.remove();
    }, 3000);
  }

  updateFavoriteButton(isFavorite) {
    const favoriteBtn = document.getElementById('favorite-btn');
    if (favoriteBtn) {
      if (isFavorite) {
        favoriteBtn.className = 'btn btn-danger';
        favoriteBtn.innerHTML = '<i class="fa-solid fa-heart-broken"></i> <span id="favorite-text">Hapus dari Favorit</span>';
      } else {
        favoriteBtn.className = 'btn btn-primary';
        favoriteBtn.innerHTML = '<i class="fa-solid fa-heart"></i> <span id="favorite-text">Tambah ke Favorit</span>';
      }
    }
  }
}
