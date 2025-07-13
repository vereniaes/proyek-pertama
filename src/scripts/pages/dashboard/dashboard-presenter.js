import StoryApi from "@/scripts/data/story-api.js";

export default class DashboardPresenter {
  #view;
  #storyApi;

  constructor(view) {
    this.#view = view;
    this.#storyApi = StoryApi;
  }

  async fetchStories() {
    this.#view.showLoading();
    try {
      const result = await this.#storyApi.getAllStories();

      this.#view.hideLoading();
      if (result.error) {
        this.#view.showError(result.message);
      } else {
        this.#view.renderStories(result.listStory);
        this.initMap(result.listStory);
      }
    } catch (error) {
      this.#view.showError("Gagal memuat cerita. Periksa koneksi Anda.");
    }
  }

  initMap(stories) {
    this.#view.initializeMap(stories);
  }
}
