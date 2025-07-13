const SessionStorage = {
  setItem(key, value) {
    sessionStorage.setItem(key, value);
  },

  getItem(key) {
    return sessionStorage.getItem(key);
  },

  removeItem(key) {
    sessionStorage.removeItem(key);
  },
};

export default SessionStorage;
