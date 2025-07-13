import StoryApi from "@/scripts/data/story-api.js";

export default class RegisterModel {
  async register({ name, email, password }) {
    return StoryApi.register({ name, email, password });
  }
}
