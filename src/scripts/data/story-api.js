import CONFIG from "@/scripts/config.js";
import AuthService from "@/scripts/utils/auth-service.js";

const StoryApi = {
  async register({ name, email, password }) {
    const response = await fetch(`${CONFIG.BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    return response.json();
  },

  async login({ email, password }) {
    const response = await fetch(`${CONFIG.BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const responseJson = await response.json();

    if (!responseJson.error) {
      AuthService.setToken(responseJson.loginResult.token);
    }

    return responseJson;
  },

  async getAllStories() {
    const token = AuthService.getToken();
    if (!token) {
      window.location.hash = "/guest-story";
      return { error: true, message: "Not authenticated", listStory: [] };
    }

    const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  async getStoryDetail(id) {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(`${CONFIG.BASE_URL}/stories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  },

  async addNewStory(formData) {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    return response.json();
  },

  async addNewStoryAsGuest(formData) {
    const response = await fetch(`${CONFIG.BASE_URL}/stories/guest`, {
      method: "POST",
      body: formData,
    });
    return response.json();
  },
};

export default StoryApi;
