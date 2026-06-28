

import * as allCategories from "./allcategories.js"
import * as sideBar from "./sidebar.js"
import * as getMeals from "./getmeal.js";
import { getAreas } from "./areas.js";
import * as gridListView from "./gridlist.js"
import * as mealDetails from "./details.js"
import { initFoodLog} from "./foodlog.js";
import * as products from "./productscanner.js"

initFoodLog();






getMeals.getMeals("chicken")
allCategories.getAllCategories()
getAreas()

//////////////category section //////////////////


const categoriesGrid = document.getElementById("categories-grid");
if (categoriesGrid) {
    categoriesGrid.addEventListener("click", async (e) => { 
    const clickedCard = e.target.closest(".category-card");
    if (clickedCard) {
      const categoryName = clickedCard.dataset.category;
      const filteredMeals = await allCategories.filter("category", categoryName);
      getMeals.displayMeals(filteredMeals);
      getMeals.mealsCount(filteredMeals)
    }
  }); 
}

//////////////area section //////////////////


const areaBtnContainer = document.getElementById("areaBtns");


  areaBtnContainer.addEventListener("click", async (e) => {

    const clickedBtn = e.target.closest(".area-btn");

      const areaName = clickedBtn.dataset.area;

      document.querySelectorAll(".area-btn").forEach((btn) => {
        btn.classList.remove(
          "bg-emerald-600",
          "text-white",
          "hover:bg-emerald-700",
        );
        btn.classList.add("bg-gray-100", "text-gray-700", "hover:bg-gray-200");
      });

      clickedBtn.classList.remove(
        "bg-gray-100",
        "text-gray-700",
        "hover:bg-gray-200",
      );
      clickedBtn.classList.add(
        "bg-emerald-600",
        "text-white",
        "hover:bg-emerald-700",
      );

      if (areaName === "all") {
        getMeals.getMeals("chicken");
      } else {
        const filteredMeals = await allCategories.filter("area", areaName);
        getMeals.displayMeals(filteredMeals);
        getMeals.mealsCount(filteredMeals)
      }
    }
  );



