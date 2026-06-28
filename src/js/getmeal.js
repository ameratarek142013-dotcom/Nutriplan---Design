import { showLoading } from "./loading.js";


export const recipsGrid = document.getElementById("recipes-grid");
const inputSeaarch = document.getElementById("search-input")
let meals = []

inputSeaarch.addEventListener("input", () => {
  let inputValue = inputSeaarch.value.trim();
  if (inputValue === "") {
    getMeals("chicken");
  } else {
    getMeals(inputValue);
  }
});

export async function getMeals(meal) {
  try {
    recipsGrid.innerHTML=`
    <div class="flex items-center justify-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
    `
    let response = await fetch(`https://nutriplan-api.vercel.app/api/meals/search?q=${meal}&page=1&limit=25`);
    let data = await response.json();
    meals = data.results;
    console.log(meals);
    displayMeals(meals);
    mealsCount(meals)
    showLoading()
  } catch (error) {
    console.log(error);
  }
}

export function displayMeals(data) {
  let box = "";
  for (let i = 0; i < data.length; i++) {
    box += `
            <div
              class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
              data-id="${data[i].id}"
            >
              <div class="meal-image relative h-48 overflow-hidden">
                <img
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src=${data[i].thumbnail}
                  alt=${data[i].name}
                  loading="lazy"
                />
                <div class="absolute bottom-3 left-3 flex gap-2">
                  <span
                    class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700"
                  >
                    ${data[i].category}
                  </span>
                  <span
                    class="px-2 py-1 bg-emerald-500 text-xs font-semibold rounded-full text-white"
                  >
                    ${data[i].area}
                  </span>
                </div>
              </div>
              <div class="recipe-content p-4">
                <h3
                  class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1"
                >
                  ${data[i].name}
                </h3>
                <p class="text-xs text-gray-600 mb-3 line-clamp-2">
                  ${data[i].instructions[0]}
                </p>
                <div class="flex items-center justify-between text-xs">
                  <span class="font-semibold text-gray-900">
                    <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>
                    ${data[i].category}
                  </span>
                  <span class="font-semibold text-gray-500">
                    <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
                    ${data[i].area}
                  </span>
                </div>
              </div>
            </div>
        `;
  }
  recipsGrid.innerHTML = box || `
  <div class="flex flex-col items-center justify-center py-12 text-center">
    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <i class="fa-solid fa-search text-gray-400 text-2xl"></i>
    </div>
    <p class="text-gray-500 text-lg">No recipes found</p>
    <p class="text-gray-400 text-sm mt-2">Try searching for something else</p>
</div>
  `;
}

export function mealsCount(meals) {
  document.getElementById("recipes-count").textContent =
    `Showing ${meals.length} recipes`;
}