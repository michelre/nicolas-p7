import Filter from "./components/filter.js";
import { Recipe } from "./components/recipe.js";
import {SelectIngredients, SelectUstensils, SelectAppliances} from "./components/select.js"
import { updateCounter } from "./helpers.js";

let recipes = [];
let selectIngredients = null;
let selectUstensils = null;
let selectAppliances = null;
let query = ''
let filters = []

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

const onRemoveFilter = (filter) => {
  if(filter.selectName === 'Ingrédients'){
    selectIngredients.removeSelectedIngredient(filter.value)
  }  
  if(filter.selectName === 'Ustensils'){
    selectUstensils.removeSelectedUstensil(filter.value)
  }
  if(filter.selectName === 'Appareils'){
    selectAppliances.removeSelectedAppliance(filter.value)
  }  
  filterRecipes()
}

const addSelectedFilters = (value, selectName) => {
  const selectedFilters = document.querySelector('.selected-filters')
  const filter = new Filter(value, selectName, onRemoveFilter)
  filters.push(filter)
  selectedFilters.appendChild(filter.render())
}

const onSelect = (value, selectName) => {
  filterRecipes()
  addSelectedFilters(value, selectName)
}

const onRemove = (value) => {  
  let restingFilters = []
  for(let i = 0; i < filters.length; i++){
    if(filters[i].getValue() === value){
      filters[i].remove()
    }
    restingFilters.push(filters[i])
  }
  filters = restingFilters
  filterRecipes()
}

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
  selectIngredients = new SelectIngredients(ingredients, onSelect, onRemove)
  selectUstensils = new SelectUstensils(ustensils, onSelect, onRemove)
  selectAppliances = new SelectAppliances(appliances, onSelect, onRemove)
  filters.appendChild(selectIngredients.render());
  filters.appendChild(selectUstensils.render());
  filters.appendChild(selectAppliances.render());
  

  //Initialisation d'évènements sur le champs de recherche
  const form = document.querySelector('#search-form')
  form.addEventListener('input', e => {
    query = e.target.value.toLowerCase()
    filterRecipes()
  })
};

const filterRecipesByIngredient = (recipe) => {  
    const selectedIngredients = selectIngredients.getSelectedIngredients()
    if(selectedIngredients.length === 0){
      return true;
    }

    return recipe
    .ingredients
    .filter(ingredient => selectedIngredients.includes(ingredient.ingredient.toLowerCase()))
    .length === selectedIngredients.length
  
}

const filterBySearch = (recipe) => {
  if(query.length === 0) {
    return true
  }

  return recipe
    .ingredients
    .filter(ingredient => ingredient.ingredient.toLowerCase().includes(query))
    .length > 0 || recipe.name.toLowerCase().includes(query)
}

const filterRecipesByUstensil = (recipe) => {  
    const selectedUstensils = selectUstensils.getSelectedUstensils()
    if(selectedUstensils.length === 0){
      return true;
    }

    return recipe
    .ustensils
    .filter(ustensil => selectedUstensils.includes(ustensil.toLowerCase()))
    .length === selectedUstensils.length
}

const filterRecipesByAppliance = (recipe) => {
  const selectedAppliances = selectAppliances.getSelectedAppliances()
  if(selectedAppliances.length === 0){
    return true;
  }
  return selectedAppliances.includes(recipe.appliance.toLowerCase())

}

const filterRecipes = () => {  
  // Avantage: On peut sortir du for à tout moment. Inconvénient: Moins lisible car incrément de boucle présent
  let filteredRecipes = []
  for(let i = 0; i < recipes.length; i++){ 
    const recipe = recipes[i]
    if(filterRecipesByIngredient(recipe) 
      && filterRecipesByUstensil(recipe)
      && filterRecipesByAppliance(recipe)
      && filterBySearch(recipe)) {
        filteredRecipes.push(recipe)
      }
  }  


  addRecipesDOM(filteredRecipes);
  updateCounter(filteredRecipes)

}

// Initialise l'application
const init = async () => {
  recipes = await fetchRecipes();
  addRecipesDOM(recipes);
  createFilters();
  filterRecipes()
};

init();