export default class RegisterPresenter {
  #model;
  #view;

  constructor(model, view) {
    this.#model = model;
    this.#view = view;
  }

  async register(userData) {
    this.#view.showLoading();
    try {
      const result = await this.#model.register(userData);
      if (result.error) {
        this.#view.showError(result.message);
      } else {
        this.#view.showSuccess("Registrasi berhasil! Silakan login.");
        window.location.hash = "#/login";
      }
    } catch (error) {
      this.#view.showError("Terjadi kesalahan saat registrasi.");
    } finally {
      this.#view.hideLoading();
    }
  }
}
