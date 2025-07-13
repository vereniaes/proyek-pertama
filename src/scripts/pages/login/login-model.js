import StoryApi from "@/scripts/data/story-api.js";

export default class LoginModel {
  async login({ email, password }) {
    return StoryApi.login({ email, password });
  }
}
