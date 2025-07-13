import "@/styles/styles.css";

import App from "@/scripts/pages/app.js";

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
    navList: document.querySelector("#nav-list"),
  });

  const main = async () => {
    await app.renderPage();

    window.addEventListener("hashchange", async () => {
      await app.renderPage();
    });
  };

  main();
});
