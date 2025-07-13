import { createLoader, createErrorMessage } from "@/scripts/utils/index.js";
import AddStoryPresenter from "./add-story-presenter.js";
import Camera from "@/scripts/utils/camera.js";

export default class AddStoryPage {
  #presenter;
  #photo = null;
  #lat = null;
  #lon = null;
  #camera = null;
  #isCameraOpen = false;

  constructor() {
    this.#presenter = new AddStoryPresenter(this);
  }

  async render() {
    return `
          <section class="container">
            <h1 class="page-title">Tambah Cerita Baru</h1>
            <div class="add-story-container">
                <form id="add-story-form">
                    <div class="form-group">
                        <label>Foto Cerita</label>
                        <div class="photo-upload-container">
                            <div id="photo-preview-container" class="photo-preview-container d-none">
                                <img id="photo-preview" src="#" alt="Pratinjau Foto">
                                <button type="button" id="delete-photo-button" aria-label="Hapus foto">&times;</button>
                            </div>
                            <div id="photo-buttons-container" class="photo-buttons-container">
                                <button type="button" id="open-camera-button" class="btn btn-secondary">
                                    <i class="fa-solid fa-camera"></i> Buka Kamera
                                </button>
                                <label for="photo-input" class="btn btn-secondary">
                                    <i class="fa-solid fa-images"></i> Pilih File
                                </label>
                                <input type="file" id="photo-input" name="photo" accept="image/*">
                            </div>
                        </div>
                        <div id="camera-wrapper" class="d-none">
                           <video id="camera-video"></video>
                           <canvas id="camera-canvas"></canvas>
                           <div class="camera-tools">
                                <select id="camera-select"></select>
                                <button type="button" id="take-picture-button" class="btn btn-primary btn-block">
                                    Ambil Gambar
                                </button>
                           </div>
                        </div>
                    </div>
                     <div class="form-group">
                        <label for="description">Deskripsi</label>
                        <textarea id="description" name="description" required></textarea>
                    </div>
                    <p>Klik pada peta untuk memilih lokasi Anda.</p>
                    <div id="add-story-map"></div>
                    <button type="submit" class="btn btn-primary btn-block" style="margin-top: 1.5rem;">Kirim Cerita</button>
                    <div id="feedback-container" style="margin-top: 1rem;"></div>
                </form>
            </div>
          </section>
        `;
  }

  async afterRender() {
    this._initButtonsAndCamera();
    this._initMap();
    this._initForm();
    window.addEventListener("hashchange", this._cleanup.bind(this), {
      once: true,
    });
  }

  _initButtonsAndCamera() {
    const photoInput = document.getElementById("photo-input");
    const openCameraButton = document.getElementById("open-camera-button");
    const takePictureButton = document.getElementById("take-picture-button");
    const cameraWrapper = document.getElementById("camera-wrapper");

    this.#camera = new Camera({
      video: document.getElementById("camera-video"),
      canvas: document.getElementById("camera-canvas"),
      cameraSelect: document.getElementById("camera-select"),
    });

    photoInput.addEventListener("change", () => {
      const file = photoInput.files[0];
      if (file) {
        this._setPhoto(file);
      }
    });

    openCameraButton.addEventListener("click", () => {
      this.#isCameraOpen = !this.#isCameraOpen;
      cameraWrapper.classList.toggle("d-none", !this.#isCameraOpen);
      openCameraButton.innerHTML = this.#isCameraOpen
        ? '<i class="fa-solid fa-camera"></i> Tutup Kamera'
        : '<i class="fa-solid fa-camera"></i> Buka Kamera';

      if (this.#isCameraOpen) {
        this.#camera.launch();
      } else {
        this.#camera.stop();
      }
    });

    takePictureButton.addEventListener("click", async () => {
      const blob = await this.#camera.takePicture();
      if (blob) {
        this._setPhoto(blob);

        openCameraButton.click();
      }
    });

    document
      .getElementById("delete-photo-button")
      .addEventListener("click", () => this._resetPhoto());
    document
      .getElementById("photo-preview")
      .addEventListener("click", () => this._resetPhoto());
  }

  _setPhoto(fileOrBlob) {
    this.#photo = fileOrBlob;
    const photoPreview = document.getElementById("photo-preview");
    const previewContainer = document.getElementById("photo-preview-container");
    const buttonsContainer = document.getElementById("photo-buttons-container");

    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreview.src = e.target.result;
      previewContainer.classList.remove("d-none");
      buttonsContainer.classList.add("d-none");
    };
    reader.readAsDataURL(fileOrBlob);
  }

  _resetPhoto() {
    this.#photo = null;
    document.getElementById("photo-input").value = "";
    document.getElementById("photo-preview").src = "#";
    document.getElementById("photo-preview-container").classList.add("d-none");
    document
      .getElementById("photo-buttons-container")
      .classList.remove("d-none");
  }

  _initMap() {
    const map = L.map("add-story-map").setView([-2.548926, 118.0148634], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      map
    );
    let marker;

    map.on("click", (e) => {
      this.#lat = e.latlng.lat;
      this.#lon = e.latlng.lng;
      if (marker) {
        marker.setLatLng(e.latlng);
      } else {
        marker = L.marker(e.latlng).addTo(map);
      }
      alert(
        `Lokasi dipilih: Lat: ${this.#lat.toFixed(4)}, Lon: ${this.#lon.toFixed(
          4
        )}`
      );
    });
  }

  _initForm() {
    const addStoryForm = document.getElementById("add-story-form");
    addStoryForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!this.#photo) {
        alert("Silakan unggah gambar terlebih dahulu.");
        return;
      }
      const formData = new FormData();
      formData.append("photo", this.#photo);
      formData.append(
        "description",
        document.getElementById("description").value
      );
      if (this.#lat && this.#lon) {
        formData.append("lat", this.#lat);
        formData.append("lon", this.#lon);
      }
      await this.#presenter.addStory(formData);
    });
  }

  _cleanup() {
    if (this.#camera) {
      Camera.stopAllStreams();
    }
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
