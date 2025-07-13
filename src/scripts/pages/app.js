import routes from "@/scripts/routes/routes.js";
import {
  getActiveRoute,
  getActivePathname,
} from "@/scripts/routes/url-parser.js";
import AuthService from "@/scripts/utils/auth-service.js";
import PushNotificationHelper from "@/scripts/utils/push-notification.js";
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
    this._initializeServiceWorker();
    this._setupInstallPrompt();
  }

  async _initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully:', registration);
        
        // Auto-subscribe to push notifications for logged-in users
        if (AuthService.isLoggedIn()) {
          const isSubscribed = await PushNotificationHelper.isSubscribed();
          if (!isSubscribed) {
            try {
              await PushNotificationHelper.subscribe();
              console.log('Auto-subscribed to push notifications');
            } catch (error) {
              console.log('Auto-subscription failed, user can manually enable in settings');
            }
          }
        }
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  _setupInstallPrompt() {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      
      // Show install button if not already installed
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        this._showInstallButton(deferredPrompt);
      }
    });
  }

  _showInstallButton(deferredPrompt) {
    const installButton = document.createElement('button');
    installButton.className = 'install-button';
    installButton.innerHTML = '<i class="fa-solid fa-download"></i> Install App';
    installButton.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #3b82f6;
      color: white;
      border: none;
      padding: 12px 16px;
      border-radius: 8px;
      cursor: pointer;
      z-index: 1000;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      font-weight: 600;
    `;
    
    installButton.addEventListener('click', async () => {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      installButton.remove();
      deferredPrompt = null;
    });
    
    document.body.appendChild(installButton);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      if (installButton.parentNode) {
        installButton.remove();
      }
    }, 10000);
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
                <a href="#/" class="btn btn-primary">Kembali ke Beranda</a>
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
