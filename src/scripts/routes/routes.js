import DashboardPage from "@/scripts/pages/dashboard/dashboard-page.js";
import AddStoryPage from "@/scripts/pages/add-story/add-story-page.js";
import DetailPage from "@/scripts/pages/detail/detail-page.js";
import LoginPage from "@/scripts/pages/login/login-page.js";
import RegisterPage from "@/scripts/pages/register/register-page.js";
import GuestStoryPage from "@/scripts/pages/guest-story/guest-story-page.js";
import FavoritesPage from "@/scripts/pages/favorites/favorites-page.js";
import OfflineStoriesPage from "@/scripts/pages/offline-stories/offline-stories-page.js";
import SettingsPage from "@/scripts/pages/settings/settings-page.js";
import NotFoundPage from "@/scripts/pages/not-found/not-found-page.js";

const routes = {
  "/": new DashboardPage(),
  "/stories/add": new AddStoryPage(),
  "/stories/:id": new DetailPage(),
  "/login": new LoginPage(),
  "/register": new RegisterPage(),
  "/guest-story": new GuestStoryPage(),
  "/favorites": new FavoritesPage(),
  "/offline-stories": new OfflineStoriesPage(),
  "/settings": new SettingsPage(),
  "/404": new NotFoundPage(),
};

export default routes;
