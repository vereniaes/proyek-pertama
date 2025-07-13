import DashboardPage from "@/scripts/pages/dashboard/dashboard-page.js";
import AddStoryPage from "@/scripts/pages/add-story/add-story-page.js";
import DetailPage from "@/scripts/pages/detail/detail-page.js";
import LoginPage from "@/scripts/pages/login/login-page.js";
import RegisterPage from "@/scripts/pages/register/register-page.js";
import GuestStoryPage from "@/scripts/pages/guest-story/guest-story-page.js";

const routes = {
  "/": new DashboardPage(),
  "/stories/add": new AddStoryPage(),
  "/stories/:id": new DetailPage(),
  "/login": new LoginPage(),
  "/register": new RegisterPage(),
  "/guest-story": new GuestStoryPage(),
};

export default routes;
