import StoryApi from "@/scripts/data/story-api.js";

export default class AddStoryPresenter {
  #view;
  #storyApi;

  constructor(view) {
    this.#view = view;
    this.#storyApi = StoryApi;
  }

  async addStory(formData) {
    this.#view.showLoading();
    try {
      const result = await this.#storyApi.addNewStory(formData);
      if (result.error) {
        this.#view.showError(result.message);
      } else {
        this.#view.showSuccess("Cerita berhasil ditambahkan!");
        window.location.hash = "#/";
      }
    } catch (error) {
      this.#view.showError("Gagal menambahkan cerita. Silakan coba lagi.");
    } finally {
      this.#view.hideLoading();
    }
  }
}
