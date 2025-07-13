export function showFormattedDate(date, locale = "id-ID", options = {}) {
  const defaultOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(date).toLocaleDateString(locale, {
    ...defaultOptions,
    ...options,
  });
}

export function createLoader() {
  return `
        <div class="loading-indicator">
            <i class="fa-solid fa-spinner fa-spin"></i> Memuat...
        </div>
    `;
}

export function createErrorMessage(message) {
  return `
        <div class="error-message">
            <i class="fa-solid fa-circle-exclamation"></i> ${message}
        </div>
    `;
}
