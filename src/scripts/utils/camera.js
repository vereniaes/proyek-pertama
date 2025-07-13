export default class Camera {
  #currentStream;
  #streaming = false;
  #width = 640;
  #height = 0;

  #videoElement;
  #selectCameraElement;
  #canvasElement;

  static stopAllStreams() {
    if (window.currentStreams && Array.isArray(window.currentStreams)) {
      window.currentStreams.forEach((stream) => {
        if (stream.active) {
          stream.getTracks().forEach((track) => track.stop());
        }
      });
      window.currentStreams = [];
    }
  }

  static #addNewStream(stream) {
    if (!Array.isArray(window.currentStreams)) {
      window.currentStreams = [];
    }
    window.currentStreams.push(stream);
  }

  constructor({ video, cameraSelect, canvas }) {
    this.#videoElement = video;
    this.#selectCameraElement = cameraSelect;
    this.#canvasElement = canvas;
  }

  async launch() {
    Camera.stopAllStreams(); // Hentikan stream lama sebelum memulai yang baru

    const deviceId = this.#selectCameraElement.value
      ? { exact: this.#selectCameraElement.value }
      : undefined;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { aspectRatio: 4 / 3, deviceId },
        audio: false,
      });

      this.#currentStream = stream;
      Camera.#addNewStream(stream);

      this.#videoElement.srcObject = stream;
      this.#videoElement.play();

      this.#populateDeviceList(stream);
      this.#initListeners();
    } catch (error) {
      console.error("Error launching camera:", error);
      alert("Gagal meluncurkan kamera. Pastikan Anda memberikan izin.");
      return null;
    }

    return this;
  }

  #initListeners() {
    this.#videoElement.oncanplay = () => {
      if (!this.#streaming) {
        this.#height =
          (this.#videoElement.videoHeight * this.#width) /
          this.#videoElement.videoWidth;
        this.#canvasElement.setAttribute("width", this.#width);
        this.#canvasElement.setAttribute("height", this.#height);
        this.#streaming = true;
      }
    };

    this.#selectCameraElement.onchange = () => {
      this.launch();
    };
  }

  async #populateDeviceList() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      const currentDeviceId = this.#currentStream
        .getVideoTracks()[0]
        .getSettings().deviceId;

      let optionsHtml = "";
      videoDevices.forEach((device, index) => {
        optionsHtml += `
          <option value="${device.deviceId}" ${
          device.deviceId === currentDeviceId ? "selected" : ""
        }>
            ${device.label || `Kamera ${index + 1}`}
          </option>
        `;
      });
      this.#selectCameraElement.innerHTML = optionsHtml;
    } catch (error) {
      console.error("Error populating device list:", error);
    }
  }

  stop() {
    if (this.#currentStream instanceof MediaStream) {
      this.#currentStream.getTracks().forEach((track) => track.stop());
    }
    this.#videoElement.srcObject = null;
    this.#streaming = false;
  }

  #clearCanvas() {
    const context = this.#canvasElement.getContext("2d");
    context.fillStyle = "#AAAAAA";
    context.fillRect(
      0,
      0,
      this.#canvasElement.width,
      this.#canvasElement.height
    );
  }

  takePicture() {
    if (!this.#width || !this.#height) {
      this.#clearCanvas();
      return null;
    }

    const context = this.#canvasElement.getContext("2d");
    this.#canvasElement.width = this.#width;
    this.#canvasElement.height = this.#height;
    context.drawImage(this.#videoElement, 0, 0, this.#width, this.#height);

    return new Promise((resolve) => {
      this.#canvasElement.toBlob((blob) => resolve(blob), "image/jpeg");
    });
  }
}
