export default class LoginPresenter {
  #model;
  #view;

  constructor(model, view) {
    this.#model = model;
    this.#view = view;
  }

  async login(credentials) {
    this.#view.showLoading();
    try {
      const result = await this.#model.login(credentials);
      if (result.error) {
        this.#view.showError(result.message);
      } else {
        this.#view.showSuccess("Login berhasil!");
        window.location.hash = "#/";

        window.location.reload();
      }
    } catch (error) {
      this.#view.showError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      this.#view.hideLoading();
    }
  }
}
