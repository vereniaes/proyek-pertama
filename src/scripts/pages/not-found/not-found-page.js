export default class NotFoundPage {
  async render() {
    return `
      <section class="container">
        <div class="not-found-container">
          <div class="not-found-content">
            <i class="fa-solid fa-exclamation-triangle not-found-icon"></i>
            <h1 class="not-found-title">404</h1>
            <h2 class="not-found-subtitle">Halaman Tidak Ditemukan</h2>
            <p class="not-found-description">
              Maaf, halaman yang Anda cari tidak dapat ditemukan. 
              Mungkin halaman tersebut telah dipindahkan atau tidak pernah ada.
            </p>
            <div class="not-found-actions">
              <a href="#/" class="btn btn-primary">
                <i class="fa-solid fa-home"></i> Kembali ke Beranda
              </a>
              <button onclick="history.back()" class="btn btn-secondary">
                <i class="fa-solid fa-arrow-left"></i> Kembali
              </button>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // No additional logic needed for 404 page
  }
}