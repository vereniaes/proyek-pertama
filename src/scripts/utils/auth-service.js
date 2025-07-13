import SessionStorage from "@/scripts/utils/session-storage.js";

const AuthService = {
  setToken(token) {
    SessionStorage.setItem("auth_token", token);
  },

  getToken() {
    return SessionStorage.getItem("auth_token");
  },

  removeToken() {
    SessionStorage.removeItem("auth_token");
  },

  isLoggedIn() {
    return !!this.getToken();
  },
};

export default AuthService;
