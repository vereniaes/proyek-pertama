import { createLoader, createErrorMessage } from "@/scripts/utils/index.js";
import { createStoryCardTemplate } from "@/views/templates/story-templates.js";
import FavoritesPresenter from "./favorites-presenter.js";

export default class FavoritesPage {
  #presenter;

  constructor() {
    this.#presenter = new FavoritesPresenter(this);
  }

  async render() {
    return `
      <section class="container">
        <h1 class="page-title">Cerita Favorit</h1>
        <div id="content-container">
          ${createLoader()}
        </div>
      </section>
    `;
  }

  async afterRender() {
    await this.#presenter.loadFavorites();
  }

  showLoading() {
    const container = document.getElementById("content-container");
    if (container) {
      container.innerHTML = createLoader();
    }
  }

  hideLoading() {
    const container = document.getElementById("content-container");
    if (container) {
      container.innerHTML = '<div id="favorites-list" class="story-list"></div>';
    }
  }

  showError(message) {
    const container = document.getElementById("content-container");
    if (container) {
      container.innerHTML = createErrorMessage(message);
    }
  }

  renderFavorites(favorites) {
    const favoritesListElement = document.getElementById("favorites-list");
    if (!favoritesListElement) return;

    favoritesListElement.innerHTML = "";

    if (favorites.length === 0) {
      favoritesListElement.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-heart" style="font-size: 4rem; color: #d1d5db; margin-bottom: 1rem;"></i>
          <p class="text-center">Belum ada cerita favorit.</p>
          <p class="text-center">Tambahkan cerita ke favorit dari halaman detail.</p>
        </div>
      `;
      return;
    }

    favorites.forEach((story) => {
      const storyCard = createStoryCardTemplate(story);
      const cardElement = document.createElement('div');
      cardElement.innerHTML = storyCard;
      
      // Add remove button
      const removeButton = document.createElement('button');
      removeButton.className = 'btn btn-danger remove-favorite-btn';
      removeButton.innerHTML = '<i class="fa-solid fa-heart-broken"></i> Hapus dari Favorit';
      removeButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.#presenter.removeFromFavorites(story.id);
      });
      
      cardElement.querySelector('.story-card__content').appendChild(removeButton);
      favoritesListElement.appendChild(cardElement.firstElementChild);
    });
  }

  showSuccess(message) {
    // Create temporary success message
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
}