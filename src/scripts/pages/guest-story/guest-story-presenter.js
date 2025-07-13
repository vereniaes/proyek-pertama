import StoryApi from "@/scripts/data/story-api.js";

export default class GuestStoryPresenter {
  #view;
  #storyApi;

  constructor(view) {
    this.#view = view;
    this.#storyApi = StoryApi;
  }

  async addStory(formData) {
    this.#view.showLoading();
    try {
      const result = await this.#storyApi.addNewStoryAsGuest(formData);
      if (result.error) {
        this.#view.showError(result.message);
      } else {
        this.#view.showSuccess("Cerita berhasil dikirim sebagai tamu!");
        window.location.hash = "#/login";
      }
    } catch (error) {
      this.#view.showError("Gagal menambahkan cerita. Silakan coba lagi.");
    } finally {
      this.#view.hideLoading();
    }
  }
}
