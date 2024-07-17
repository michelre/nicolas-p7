import { Recipe } from "./components/recipe.js";
import Select from "./components/select.js";

let recipes = [];
let selectedIngredients = [];
let selectedAppliances = [];
let selectedUstensils = [];
let query = ''
let selectedFilters = null

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

const removeSelectedIngredient = (value) => {
  selectedIngredients = selectedIngredients.filter(ingredient => ingredient !== value)
  filterRecipes()
}

const removeSelectedUstensil = (value) => {
  selectedUstensils = selectedUstensils.filter(ustensil => ustensil !== value)
  filterRecipes()
}

const removeSelectedAppliance = (value) => {
  selectedAppliances = selectedAppliances.filter(appliance => appliance !== value)
  filterRecipes()
}

const addSelectedFilters = (value, removeCallback, selectObject) => {
  selectedFilters = document.querySelector('.selected-filters')
  const element = document.createElement('li')
  element.classList.add('selected-filter')

  const text = document.createElement('span')
  text.innerText = value

  const removeButton = document.createElement("button");
  removeButton.innerHTML = "&times;";

  element.appendChild(text)
  element.appendChild(removeButton)
  
  selectedFilters.appendChild(element)

  removeButton.addEventListener('click', () => {
    removeCallback(value)
    selectObject.removeSelectItem(value)
    element.remove()

  })
}

const removeSelectedFilters = (value) => {
  const filters = document.querySelectorAll('.selected-filter')
  filters.forEach(e => {
    if(e.innerText.includes(value)){
      e.remove()
    }
  })
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
  const selectIngredients = new Select("Ingrédients", ingredients, (value) => {
    selectedIngredients.push(value);
    filterRecipes()
    addSelectedFilters(value, removeSelectedIngredient, selectIngredients)
  }, (value) => {
    removeSelectedIngredient(value)
    removeSelectedFilters(value)
  });
  filters.appendChild(selectIngredients.render());

  const selectUstensils = new Select("Ustensils", ustensils, (value) => {
    selectedUstensils.push(value);
    filterRecipes()
    addSelectedFilters(value, removeSelectedUstensil)
  }, (value) => {
    removeSelectedUstensil(value)
    removeSelectedFilters(value)
  });
  filters.appendChild(selectUstensils.render());

  const selectAppliances = new Select("Appareils", appliances, (value) => {
    selectedAppliances.push(value);
    filterRecipes()
    addSelectedFilters(value, removeSelectedAppliance)
  }, (value) => {
    removeSelectedAppliance(value)
    removeSelectedFilters(value)
  });
  filters.appendChild(selectAppliances.render());

  //Initialisation d'évènements sur le champs de recherche
  const form = document.querySelector('#search-form')
  form.addEventListener('input', e => {
    query = e.target.value.toLowerCase()
    filterRecipes()
  })
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
  if(query.length === 0) {
    return true
  }

  return recipe
    .ingredients
    .filter(ingredient => ingredient.ingredient.toLowerCase().includes(query))
    .length > 0 || recipe.name.toLowerCase().includes(query)
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
  updateCounter(filteredRecipes)



}

const updateCounter = (filteredRecipes) => {
  const counter = document.querySelector('.counter')
  counter.innerText = `${filteredRecipes.length} ${filteredRecipes.length > 1 ? 'recettes' : 'recette'}`
}

// Initialise l'application
const init = async () => {
  recipes = await fetchRecipes();
  addRecipesDOM(recipes);
  createFilters();
  filterRecipes()
};

init();