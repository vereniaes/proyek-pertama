import IndexedDBHelper from "@/scripts/utils/indexeddb.js";

export default class FavoritesPresenter {
  #view;

  constructor(view) {
    this.#view = view;
  }

  async loadFavorites() {
    this.#view.showLoading();
    try {
      const favorites = await IndexedDBHelper.getAllFavorites();
      this.#view.hideLoading();
      this.#view.renderFavorites(favorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
      this.#view.showError("Gagal memuat cerita favorit.");
    }
  }

  async removeFromFavorites(storyId) {
    try {
      await IndexedDBHelper.removeFromFavorites(storyId);
      this.#view.showSuccess("Cerita berhasil dihapus dari favorit!");
      await this.loadFavorites(); // Reload favorites
    } catch (error) {
      console.error('Error removing from favorites:', error);
      this.#view.showError("Gagal menghapus cerita dari favorit.");
    }
  }
}