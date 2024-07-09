import { Recipe } from "./components/recipe.js";
import Select from "./components/select.js";

let recipes = [];
let selectedIngredients = [];
let selectedAppliances = [];
let selectedUstensils = [];

// Récupère les recettes depuis un fichier JSON
const fetchRecipes = async () => {
  const r = await fetch("data/recipes.json");
  return r.json();
};

// Ajoute les recettes au DOM
const addRecipesDOM = (recipes) => {
  const recipesDOM = document.querySelector(".recipes");
  recipesDOM.innerHTML = ''
  recipes.forEach((recipe) => {
    const li = document.createElement("li");
    li.classList.add("recipe");
    const r = new Recipe(recipe);
    li.appendChild(r.render());
    recipesDOM.appendChild(li);
  });
};

// Crée les filtres pour les ingrédients, ustensiles et appareils
const createFilters = () => {
  let ingredients = recipes
    .map((recipe) =>
      recipe.ingredients.map(({ ingredient }) => ingredient.toLowerCase())
    )
    .flat();
  ingredients = [...new Set(ingredients)];

  let ustensils = [...new Set(recipes.map((r) => r.ustensils.map(u => u.toLowerCase())).flat())];

  let appliances = [...new Set(recipes.map((r) => r.appliance.toLowerCase()))];

  const filters = document.querySelector(".filters");
  const selectIngredients = new Select("Ingrédients", ingredients, (value) => {
    selectedIngredients.push(value);
    filterRecipes()
  }, (value) => {
    selectedIngredients = selectedIngredients.filter(ingredient => ingredient !== value)
    filterRecipes()
  });
  filters.appendChild(selectIngredients.render());

  const selectUstensils = new Select("Ustensils", ustensils, (value) => {
    selectedUstensils.push(value);
    filterRecipes()
  }, (value) => {
    selectedUstensils = selectedUstensils.filter(ustensil => ustensil !== value)
    filterRecipes()
  });
  filters.appendChild(selectUstensils.render());

  const selectAppliances = new Select("Appareils", appliances, (value) => {
    selectedAppliances.push(value);
    filterRecipes()
  }, (value) => {
    selectedAppliances = selectedAppliances.filter(appliance => appliance !== value)
    filterRecipes()
  });
  filters.appendChild(selectAppliances.render());
};

const filterRecipesByIngredient = (recipe) => {  
    if(selectedIngredients.length === 0){
      return true;
    }

    return recipe
    .ingredients
    .filter(ingredient => selectedIngredients.includes(ingredient.ingredient.toLowerCase()))
    .length === selectedIngredients.length
  
}

const filterBySearch = (recipe) => {
  // TODO: Chercher dans le titre & les ingrédients
  return true
}

const filterRecipesByUstensil = (recipe) => {  
    if(selectedUstensils.length === 0){
      return true;
    }

    return recipe
    .ustensils
    .filter(ustensil => selectedUstensils.includes(ustensil.toLowerCase()))
    .length === selectedUstensils.length
}

const filterRecipesByAppliance = (recipe) => {
  if(selectedAppliances.length === 0){
    return true;
  }
  return selectedAppliances.includes(recipe.appliance.toLowerCase())

}

const filterRecipes = () => {  
  const filteredRecipes = recipes.filter(recipe => {
    return filterRecipesByIngredient(recipe) 
      && filterRecipesByUstensil(recipe)
      && filterRecipesByAppliance(recipe)
      && filterBySearch(recipe)
  })


  addRecipesDOM(filteredRecipes);


}

// Initialise l'application
const init = async () => {
  recipes = await fetchRecipes();
  addRecipesDOM(recipes);
  createFilters();
};

init();