import { createLoader, createErrorMessage } from "@/scripts/utils/index.js";
import { createStoryCardTemplate } from "@/views/templates/story-templates.js";
import DashboardPresenter from "./dashboard-presenter.js";

export default class DashboardPage {
  #presenter;

  constructor() {
    this.#presenter = new DashboardPresenter(this);
  }

  async render() {
    return `
            <section class="container">
                <h1 class="page-title">Dashboard Cerita</h1>
                <div id="story-map"></div>
                <h2 style="margin-top: 2rem; margin-bottom: 1rem; text-align: center;">Semua Cerita</h2>
                <div id="content-container">
                    ${createLoader()}
                </div>
            </section>
        `;
  }

  async afterRender() {
    await this.#presenter.fetchStories();
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
      container.innerHTML = '<div id="story-list" class="story-list"></div>';
    }
  }

  showError(message) {
    const container = document.getElementById("content-container");
    if (container) {
      container.innerHTML = createErrorMessage(message);
    }
  }

  renderStories(stories) {
    const storyListElement = document.getElementById("story-list");
    if (!storyListElement) return;

    storyListElement.innerHTML = "";

    if (stories.length === 0) {
      storyListElement.innerHTML =
        '<p class="text-center">Belum ada cerita yang ditambahkan.</p>';
      return;
    }

    stories.forEach((story) => {
      storyListElement.innerHTML += createStoryCardTemplate(story);
    });
  }

  initializeMap(stories) {
    const mapElement = document.getElementById("story-map");
    if (!mapElement) return;

    const map = L.map(mapElement).setView([-2.548926, 118.0148634], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker.bindPopup(
          `<b>${story.name}</b><br>${story.description.substring(0, 50)}...`
        );
      }
    });
  }
}
