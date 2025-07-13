import PushNotificationHelper from "@/scripts/utils/push-notification.js";

export default class SettingsPresenter {
  #view;

  constructor(view) {
    this.#view = view;
  }

  async initializeSettings() {
    try {
      // Check notification subscription status
      const isSubscribed = await PushNotificationHelper.isSubscribed();
      this.#view.updateNotificationStatus(isSubscribed);

      // Check PWA installation status
      const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
      this.#view.updatePWAStatus(isInstalled);
    } catch (error) {
      console.error('Error initializing settings:', error);
    }
  }

  async subscribeToNotifications() {
    this.#view.showLoading();
    try {
      await PushNotificationHelper.subscribe();
      this.#view.updateNotificationStatus(true);
      this.#view.showSuccess("Notifikasi berhasil diaktifkan!");
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      this.#view.showError("Gagal mengaktifkan notifikasi. Pastikan Anda memberikan izin.");
    } finally {
      this.#view.hideLoading();
    }
  }

  async unsubscribeFromNotifications() {
    this.#view.showLoading();
    try {
      await PushNotificationHelper.unsubscribe();
      this.#view.updateNotificationStatus(false);
      this.#view.showSuccess("Notifikasi berhasil dimatikan!");
    } catch (error) {
      console.error('Error unsubscribing from notifications:', error);
      this.#view.showError("Gagal mematikan notifikasi.");
    } finally {
      this.#view.hideLoading();
    }
  }
}