import { showFormattedDate } from "@/scripts/utils/index.js";

export const createStoryCardTemplate = (story) => `
  <article class="story-card">
    <a href="#/stories/${story.id}">
      <img src="${story.photoUrl}" class="story-card__image" alt="Gambar dari ${
  story.name
}">
      <div class="story-card__content">
        <h3 class="story-card__title">${story.name}</h3>
        <p class="story-card__meta">
            <i class="fa-solid fa-calendar-days"></i> ${showFormattedDate(
              story.createdAt
            )}
        </p>
        <p class="story-card__description">${story.description.substring(
          0,
          100
        )}${story.description.length > 100 ? "..." : ""}</p>
      </div>
    </a>
  </article>
`;

export const createStoryDetailTemplate = (story) => `
    <div class="story-detail">
        <img src="${story.photoUrl}" alt="Gambar detail dari ${
  story.name
}" class="story-detail__image">
        <h2 class="story-detail__title">${story.name}</h2>
        <p class="story-detail__meta">
            <i class="fa-solid fa-calendar-days"></i> Dibuat pada ${showFormattedDate(
              story.createdAt
            )}
        </p>
        <p class="story-detail__description">${story.description}</p>
        ${story.lat && story.lon ? '<div id="detail-map"></div>' : ""}
    </div>
`;
