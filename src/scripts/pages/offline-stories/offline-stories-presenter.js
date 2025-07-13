import IndexedDBHelper from "@/scripts/utils/indexeddb.js";

export default class OfflineStoriesPresenter {
  #view;

  constructor(view) {
    this.#view = view;
  }

  async loadOfflineStories() {
    this.#view.showLoading();
    try {
      const stories = await IndexedDBHelper.getAllStories();
      this.#view.hideLoading();
      this.#view.renderOfflineStories(stories);
    } catch (error) {
      console.error('Error loading offline stories:', error);
      this.#view.showError("Gagal memuat cerita offline.");
    }
  }

  async deleteOfflineStory(storyId) {
    try {
      await IndexedDBHelper.deleteStory(storyId);
      this.#view.showSuccess("Cerita berhasil dihapus dari penyimpanan offline!");
      await this.loadOfflineStories(); // Reload stories
    } catch (error) {
      console.error('Error deleting offline story:', error);
      this.#view.showError("Gagal menghapus cerita dari penyimpanan offline.");
    }
  }
}