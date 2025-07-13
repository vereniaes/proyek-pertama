import { createLoader, createErrorMessage } from "@/scripts/utils/index.js";
import { createStoryCardTemplate } from "@/views/templates/story-templates.js";
import OfflineStoriesPresenter from "./offline-stories-presenter.js";

export default class OfflineStoriesPage {
  #presenter;

  constructor() {
    this.#presenter = new OfflineStoriesPresenter(this);
  }

  async render() {
    return `
      <section class="container">
        <h1 class="page-title">Cerita Offline</h1>
        <p class="text-center" style="margin-bottom: 2rem; color: #6b7280;">
          Cerita yang tersimpan untuk dibaca secara offline
        </p>
        <div id="content-container">
          ${createLoader()}
        </div>
      </section>
    `;
  }

  async afterRender() {
    await this.#presenter.loadOfflineStories();
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
      container.innerHTML = '<div id="offline-stories-list" class="story-list"></div>';
    }
  }

  showError(message) {
    const container = document.getElementById("content-container");
    if (container) {
      container.innerHTML = createErrorMessage(message);
    }
  }

  renderOfflineStories(stories) {
    const storiesListElement = document.getElementById("offline-stories-list");
    if (!storiesListElement) return;

    storiesListElement.innerHTML = "";

    if (stories.length === 0) {
      storiesListElement.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-wifi-slash" style="font-size: 4rem; color: #d1d5db; margin-bottom: 1rem;"></i>
          <p class="text-center">Belum ada cerita yang disimpan untuk offline.</p>
          <p class="text-center">Kunjungi halaman detail cerita untuk menyimpannya secara offline.</p>
        </div>
      `;
      return;
    }

    stories.forEach((story) => {
      const storyCard = createStoryCardTemplate(story);
      const cardElement = document.createElement('div');
      cardElement.innerHTML = storyCard;
      
      // Add delete button
      const deleteButton = document.createElement('button');
      deleteButton.className = 'btn btn-danger delete-offline-btn';
      deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i> Hapus dari Offline';
      deleteButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.#presenter.deleteOfflineStory(story.id);
      });
      
      cardElement.querySelector('.story-card__content').appendChild(deleteButton);
      storiesListElement.appendChild(cardElement.firstElementChild);
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