function getActivePathname() {
  return window.location.hash.replace(/^#/, "") || "/";
}

function getActiveRoute() {
  const path = getActivePathname();
  if (path === "/stories/add") return "/stories/add";
  if (path === "/guest-story") return "/guest-story";

  if (path.startsWith("/stories/")) {
    const segments = path.split("/");
    if (segments.length === 3 && segments[1] === "stories") {
      return "/stories/:id";
    }
  }

  if (path === "/login") return "/login";
  if (path === "/register") return "/register";

  if (path === "/") return "/";

  return path;
}

function parseActiveUrl() {
  const path = getActivePathname();
  const segments = path.split("/").filter((segment) => segment.length > 0);

  return {
    resource: segments[0] || null,
    id: segments[1] || null,
    verb: segments[2] || null,
  };
}

export { getActiveRoute, parseActiveUrl, getActivePathname };
