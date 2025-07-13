import StoryApi from "@/scripts/data/story-api.js";
import { parseActiveUrl } from "@/scripts/routes/url-parser.js";

export default class DetailPresenter {
  #view;
  #storyApi;

  constructor(view) {
    this.#view = view;
    this.#storyApi = StoryApi;
  }

  async fetchStoryDetail() {
    const url = parseActiveUrl();
    if (!url.id) {
      this.#view.showError("ID Cerita tidak ditemukan.");
      return;
    }

    this.#view.showLoading();
    try {
      const result = await this.#storyApi.getStoryDetail(url.id);
      if (result.error) {
        this.#view.showError(result.message);
      } else {
        this.#view.renderStoryDetail(result.story);
        if (result.story.lat && result.story.lon) {
          this.#view.initializeMap(result.story);
        }
      }
    } catch (error) {
      this.#view.showError("Gagal memuat detail cerita.");
    }
  }
}
