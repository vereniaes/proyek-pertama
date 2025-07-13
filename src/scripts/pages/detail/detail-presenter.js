import StoryApi from "@/scripts/data/story-api.js";
import { parseActiveUrl } from "@/scripts/routes/url-parser.js";
import IndexedDBHelper from "@/scripts/utils/indexeddb.js";

export default class DetailPresenter {
  #view;
  #storyApi;
  #currentStory = null;

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
        this.#currentStory = result.story;
        this.#view.renderStoryDetail(result.story);
        if (result.story.lat && result.story.lon) {
          this.#view.initializeMap(result.story);
        }
      }
    } catch (error) {
      this.#view.showError("Gagal memuat detail cerita.");
    }
  }

  getCurrentStoryId() {
    return this.#currentStory?.id;
  }

  async saveStoryOffline() {
    if (!this.#currentStory) {
      this.#view.showError("Tidak ada cerita untuk disimpan.");
      return;
    }

    try {
      await IndexedDBHelper.addStory(this.#currentStory);
      this.#view.showSuccess("Cerita berhasil disimpan untuk akses offline!");
    } catch (error) {
      if (error.name === 'ConstraintError') {
        this.#view.showSuccess("Cerita sudah tersimpan untuk akses offline!");
      } else {
        console.error('Error saving story offline:', error);
        this.#view.showError("Gagal menyimpan cerita untuk akses offline.");
      }
    }
  }

  async toggleFavorite() {
    if (!this.#currentStory) {
      this.#view.showError("Tidak ada cerita untuk ditambahkan ke favorit.");
      return;
    }

    try {
      const isFavorite = await IndexedDBHelper.isFavorite(this.#currentStory.id);
      
      if (isFavorite) {
        await IndexedDBHelper.removeFromFavorites(this.#currentStory.id);
        this.#view.updateFavoriteButton(false);
        this.#view.showSuccess("Cerita berhasil dihapus dari favorit!");
      } else {
        await IndexedDBHelper.addToFavorites(this.#currentStory);
        this.#view.updateFavoriteButton(true);
        this.#view.showSuccess("Cerita berhasil ditambahkan ke favorit!");
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      this.#view.showError("Gagal mengubah status favorit.");
    }
  }
}
