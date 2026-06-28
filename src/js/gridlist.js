

//////////////grid & list view //////////////////
const recipesGrid = document.getElementById("recipes-grid");
const gridViewBtn = document.getElementById("grid-view-btn");
const listViewBtn = document.getElementById("list-view-btn");

let currentView = "grid";

function changeViewLayout(viewType) {
  currentView = viewType;

  const cards = document.querySelectorAll(".recipe-card");

  if (viewType === "grid") {
    recipesGrid.className = "grid grid-cols-4 gap-5";

    gridViewBtn.classList.add("bg-white", "text-emerald-600");
    listViewBtn.classList.remove("bg-white", "text-emerald-600");

    cards.forEach((card) => {
      const imageWrapper = card.querySelector(".meal-image");
      const img = card.querySelector("img");
      const content = card.querySelector(".recipe-content");

      card.classList.remove("flex", "h-48");

      imageWrapper.classList.remove("w-44", "flex-shrink-0");
      imageWrapper.classList.add("h-48");

      img.classList.add("group-hover:scale-110");

      content.classList.remove(
        "flex",
        "flex-col",
        "justify-between",
        "flex-1"
      );
    });
  } else {
    recipesGrid.className = "grid grid-cols-2 gap-5";

    listViewBtn.classList.add("bg-white", "text-emerald-600");
    gridViewBtn.classList.remove("bg-white", "text-emerald-600");

    cards.forEach((card) => {
      const imageWrapper = card.querySelector(".meal-image");
      const img = card.querySelector("img");
      const content = card.querySelector(".recipe-content");

      card.classList.add("flex", "h-48");

      imageWrapper.classList.remove("h-48");
      imageWrapper.classList.add("w-44", "h-full", "flex-shrink-0");

      img.classList.remove("group-hover:scale-110");
      img.classList.add("w-full", "h-full", "object-cover");

      content.classList.add(
        "flex",
        "flex-col",
        "justify-between",
        "flex-1"
      );
    });
  }
}

gridViewBtn.addEventListener("click", () => changeViewLayout("grid"));
listViewBtn.addEventListener("click", () => changeViewLayout("list"));

