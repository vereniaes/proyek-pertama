import { createLoader, createErrorMessage } from "@/scripts/utils/index.js";
import SettingsPresenter from "./settings-presenter.js";

export default class SettingsPage {
  #presenter;

  constructor() {
    this.#presenter = new SettingsPresenter(this);
  }

  async render() {
    return `
      <section class="container">
        <h1 class="page-title">Pengaturan</h1>
        <div class="settings-container">
          <div class="settings-section">
            <h3><i class="fa-solid fa-bell"></i> Notifikasi Push</h3>
            <p>Terima notifikasi ketika ada cerita baru</p>
            <div class="setting-item">
              <button id="notification-toggle" class="btn btn-primary">
                <span id="notification-status">Memuat...</span>
              </button>
            </div>
          </div>
          
          <div class="settings-section">
            <h3><i class="fa-solid fa-download"></i> Penyimpanan Offline</h3>
            <p>Kelola cerita yang disimpan untuk akses offline</p>
            <div class="setting-item">
              <a href="#/offline-stories" class="btn btn-secondary">
                <i class="fa-solid fa-folder-open"></i> Lihat Cerita Offline
              </a>
            </div>
          </div>
          
          <div class="settings-section">
            <h3><i class="fa-solid fa-heart"></i> Favorit</h3>
            <p>Kelola cerita favorit Anda</p>
            <div class="setting-item">
              <a href="#/favorites" class="btn btn-secondary">
                <i class="fa-solid fa-star"></i> Lihat Favorit
              </a>
            </div>
          </div>
          
          <div class="settings-section">
            <h3><i class="fa-solid fa-info-circle"></i> Informasi Aplikasi</h3>
            <div class="app-info">
              <p><strong>Versi:</strong> 1.0.0</p>
              <p><strong>Dibuat oleh:</strong> Story App Team</p>
              <p><strong>PWA:</strong> <span id="pwa-status">Memuat...</span></p>
            </div>
          </div>
        </div>
        <div id="feedback-container"></div>
      </section>
    `;
  }

  async afterRender() {
    await this.#presenter.initializeSettings();
  }

  updateNotificationStatus(isSubscribed) {
    const button = document.getElementById("notification-toggle");
    const status = document.getElementById("notification-status");
    
    if (isSubscribed) {
      button.className = "btn btn-danger";
      status.textContent = "Matikan Notifikasi";
      button.onclick = () => this.#presenter.unsubscribeFromNotifications();
    } else {
      button.className = "btn btn-primary";
      status.textContent = "Aktifkan Notifikasi";
      button.onclick = () => this.#presenter.subscribeToNotifications();
    }
  }

  updatePWAStatus(isInstalled) {
    const pwaStatus = document.getElementById("pwa-status");
    pwaStatus.textContent = isInstalled ? "Terinstal" : "Belum Terinstal";
    pwaStatus.style.color = isInstalled ? "#10b981" : "#ef4444";
  }

  showLoading() {
    document.getElementById("feedback-container").innerHTML = createLoader();
  }

  hideLoading() {
    document.getElementById("feedback-container").innerHTML = "";
  }

  showError(message) {
    document.getElementById("feedback-container").innerHTML = createErrorMessage(message);
  }

  showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${message}`;
    successDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 1rem;
      border-radius: 8px;
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
      successDiv.remove();
    }, 3000);
  }
}