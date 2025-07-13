import routes from "@/scripts/routes/routes.js";
import {
  getActiveRoute,
  getActivePathname,
} from "@/scripts/routes/url-parser.js";
import AuthService from "@/scripts/utils/auth-service.js";
import {
  createAuthNavItems,
  createGuestNavItems,
} from "@/views/templates/nav-templates.js";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #navList = null;

  constructor({ navigationDrawer, drawerButton, content, navList }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this.#navList = navList;

    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      const isClickInsideDrawer = this.#navigationDrawer.contains(event.target);
      const isClickOnDrawerButton = this.#drawerButton.contains(event.target);
      if (!isClickInsideDrawer && !isClickOnDrawerButton) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a, button").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });
  }

  _updateNavigation() {
    this.#navList.innerHTML = "";
    if (AuthService.isLoggedIn()) {
      this.#navList.innerHTML = createAuthNavItems();

      const logoutButton = this.#navList.querySelector("#logout-button");
      logoutButton.addEventListener("click", (event) => {
        event.preventDefault();
        AuthService.removeToken();
        window.location.hash = "#/login";
        window.location.reload();
      });
    } else {
      this.#navList.innerHTML = createGuestNavItems();
    }
  }

  async renderPage() {
    this._updateNavigation();

    const isLoggedIn = AuthService.isLoggedIn();
    const path = getActivePathname();
    const guestOnlyRoutes = ["/login", "/register"];
    const publicRoutes = ["/guest-story"];

    if (isLoggedIn && guestOnlyRoutes.includes(path)) {
      window.location.hash = "#/";
      return;
    }

    if (
      !isLoggedIn &&
      !guestOnlyRoutes.includes(path) &&
      !publicRoutes.includes(path)
    ) {
      if (path !== "/") {
        window.location.hash = "#/login";
        return;
      }
    }

    if (!isLoggedIn && path === "/") {
      window.location.hash = "#/guest-story";
      return;
    }

    const routeKey = getActiveRoute();
    const page = routes[routeKey];

    if (!page) {
      this.#content.innerHTML = `
            <div class="container text-center">
                <h1 class="page-title">404 - Halaman Tidak Ditemukan</h1>
                 <p>Maaf, halaman yang Anda cari tidak ada.</p>
            </div>
        `;
      return;
    }

    const renderFunction = async () => {
      this.#content.innerHTML = await page.render();
      await page.afterRender();
    };

    if (document.startViewTransition) {
      document.startViewTransition(renderFunction);
    } else {
      renderFunction();
    }
  }
}

export default App;
