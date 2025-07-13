import { createLoader, createErrorMessage } from "@/scripts/utils/index.js";
import { createStoryDetailTemplate } from "@/views/templates/story-templates.js";
import DetailPresenter from "./detail-presenter.js";

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
}
