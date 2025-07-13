import { createLoader, createErrorMessage } from "@/scripts/utils/index.js";
import LoginModel from "./login-model.js";
import LoginPresenter from "./login-presenter.js";

export default class LoginPage {
  #presenter;

  constructor() {
    const model = new LoginModel();
    this.#presenter = new LoginPresenter(model, this);
  }

  async render() {
    return `
          <section class="container">
            <h1 class="page-title">Login</h1>
            <div id="form-container" class="form-container">
                <form id="login-form">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">Login</button>
                </form>
                <p>Belum punya akun? <a href="#/register">Register di sini</a></p>
                <div id="feedback-container"></div>
            </div>
          </section>
        `;
  }

  async afterRender() {
    const form = document.getElementById("login-form");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const credentials = Object.fromEntries(formData.entries());
      await this.#presenter.login(credentials);
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
    console.log(message);
  }
}
