const meals_elem = document.querySelector("#meals");
const favContainer = document.querySelector("#fav_meals");
const form = document.querySelector("#form");
const search_inp = document.querySelector("#search");
const meal_popup = document.querySelector("#meal_popup");
//const popup = document.querySelector = ("#popup");
const close_popup_btn = document.querySelector("#close_popup");
const meal_info_elem = document.querySelector("#meal_info");

getByRandom();
fetchFav();

async function getByRandom() {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );
  const respData = await response.json();
  const random_meal = respData.meals[0];

  //	console.log(random_meal);

  addMeal(random_meal, true);
}

async function getById(id) {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );
  const respData = await response.json();
  const meal = respData.meals[0];

  return meal;

  //	console.log(meal)
}

async function getBysearch(term) {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + term
  );
  const respData = await response.json();
  const meals = respData.meals;

  return meals;
}

function addMeal(mealData, random = false) {
  //	console.log(mealData);

  const meal_elem = document.createElement("div");
  meal_elem.classList.add("meal");

  meal_elem.innerHTML = `loading....`;
  meal_elem.innerHTML = `
				<div class="meal_header">
                      ${
                        random
                          ? `
	                 <span class="random">
						Random Recipe
					</span>

                       `
                          : ""
                      }
	                    
					<img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
				</div>
				<div class="meal_body">
					<h4>${mealData.strMeal}</h4>
					<button class="fav_btn"><i class="fas  fa-heart"></i></button>
				</div>
			    `;
  const btn = meal_elem.querySelector(".meal_body .fav_btn");

  btn.addEventListener("click", () => {
    if (btn.classList.contains("active")) {
      removeFromLS(mealData.idMeal);
      btn.classList.remove("active");
    } else {
      addToLS(mealData.idMeal);
      btn.classList.add("active");
    }
    //	btn.classList.toggle("active");
    favContainer.innerHTML = "";
    fetchFav();
  });

  meal_elem.addEventListener("click", () => {
    updateMealInfos(mealData);
  });

  meals_elem.appendChild(meal_elem);
}

function addToLS(meal_id) {
  const meal_ids = getFromLS();

  localStorage.setItem("meal_ids", JSON.stringify([...meal_ids, meal_id]));
}

function removeFromLS(meal_id) {
  const meal_ids = getFromLS();

  localStorage.setItem(
    "meal_ids",
    JSON.stringify(meal_ids.filter((id) => id !== meal_id))
  );
}

function getFromLS() {
  const meal_ids = JSON.parse(localStorage.getItem("meal_ids"));

  return meal_ids === null ? [] : meal_ids;
}

async function fetchFav() {
  favContainer.innerHTML = "";

  const meal_ids = getFromLS();

  const meals = [];

  for (let i = 0; i < meal_ids.length; i++) {
    const meal_id = meal_ids[i];

    meal = await getById(meal_id);
    addToFav(meal);
    //		meals.push(meal)
  }
  //	console.log(meals);

  //add to screen
}

function addToFav(mealData) {
  console.log(mealData);

  const favMeal = document.createElement("li");
  //	favMeal.classList.add("fav_meals");

  favMeal.innerHTML = `loading....`;
  favMeal.innerHTML = `
        <img
            src="${mealData.strMealThumb}"
            alt="${mealData.strMeal}"
        /><span>${mealData.strMeal}</span>
	       <button class = "clear"> <i class = "fas fa-window-close"></i></button >
    `;
  clear_btn = favMeal.querySelector(".clear");
  clear_btn.addEventListener("click", () => {
    removeFromLS(mealData.idMeal);
    fetchFav();
  });
  //	const clear_btn = favMeal.querySelector("clear");
  //	clear_btn.ad(() => {
  //		removeFromLS(mealData.idMeal);
  //	btn.classList.toggle("active");
  favMeal.addEventListener("click", () => {
    updateMealInfos(mealData);
  });

  favContainer.appendChild(favMeal);
}

function updateMealInfos(mealData) {
  const meal_info = document.createElement("div");
  const ingredients = [];
  //get ing $ measures
  for (let k = 1; k <= 20; k++) {
    if (mealData["strIngredient" + k]) {
      ingredients.push(
        `${mealData["strIngredient" + k]} - ${mealData["strMeasure" + k]}`
      );
    } else {
      break;
    }
  }
  /*
	for (let i = 1; i <= 20; i++) {
			if (mealData["strIngredient" + i]) {
				ingredients.push(
					`${mealData["strIngredient" + i]} - ${
	                    mealData["strMeasure" + i]
	                }`
				);
			} else {
				break;
			}
		}
	*/
  meal_info.innerHTML = `loading....`;
  meal_info.innerHTML = `
				<h1>${mealData.strMeal}</h1>
				<img src="${mealData.strMealThumb}" alt="${mealData}">
				<p>${mealData.strInstructions}</p>
                  <h3>Ingredients:</h3>
                 <ul>
                   ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
                 </ul>
	                 `;
  //				< ul >
  //					<li>${mealData.}</li>
  //					<li>${mealData.}</li>
  //					<li>${mealData.}</li>
  //					<li>${mealData.}</li>
  //				</ul>

  meal_info_elem.appendChild(meal_info);

  meal_popup.classList.remove("hidden");
}

form.addEventListener("submit", async (p) => {
  p.preventDefault();
  //clear container
  meals_elem.innerHTML = "";
  const search = search_inp.value;

  //	console.log(await getBysearch(search));
  const meals = await getBysearch(search);
  if (meals) {
    meals.forEach((meal) => {
      addMeal(meal);
    });
  }
  search_inp.value = "";
});

close_popup_btn.addEventListener("click", () => {
  meal_popup.classList.add("hidden");
});
