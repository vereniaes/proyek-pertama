import { createLoader, createErrorMessage } from "@/scripts/utils/index.js";
import RegisterModel from "./register-model.js";
import RegisterPresenter from "./register-presenter.js";

export default class RegisterPage {
  #presenter;

  constructor() {
    const model = new RegisterModel();
    this.#presenter = new RegisterPresenter(model, this);
  }

  async render() {
    return `
          <section class="container">
            <h1 class="page-title">Register</h1>
            <div id="form-container" class="form-container">
                <form id="register-form">
                    <div class="form-group">
                        <label for="name">Nama</label>
                        <input type="text" id="name" name="name" required minlength="3">
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required minlength="8">
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">Register</button>
                </form>
                <p>Sudah punya akun? <a href="#/login">Login di sini</a></p>
                <div id="feedback-container"></div>
            </div>
          </section>
        `;
  }

  async afterRender() {
    const form = document.getElementById("register-form");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const userData = Object.fromEntries(formData.entries());
      await this.#presenter.register(userData);
    });
  }

  showLoading() {
    document.getElementById("feedback-container").innerHTML = createLoader();
  }

  hideLoading() {
    document.getElementById("feedback-container").innerHTML = "";
  }

  showError(message) {
    document.getElementById("feedback-container").innerHTML =
      createErrorMessage(message);
  }

  showSuccess(message) {
    alert(message);
  }
}
