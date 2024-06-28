import { Recipe } from './components/recipe.js';
import Select from './components/select.js';

let recipes = [];
let selectedIngredients = []
let selectedAppliances = []
let selectedUstensils = []

const fetchRecipes = async () => {
    const r = await fetch('data/recipes.json');
    return r.json();
}

const addRecipesDOM = (recipes) => {
    const recipesDOM = document.querySelector('.recipes');
    recipes.forEach(recipe => {
        const li = document.createElement('li');
        li.classList.add('recipe');
        const r = new Recipe(recipe);
        li.appendChild(r.render());
        recipesDOM.appendChild(li);
    });
}

const createFilters = () => {
    let ingredients = recipes
        .map(recipe => recipe.ingredients.map(({ingredient}) => ingredient.toLowerCase()))
        .flat()
    ingredients = [...new Set(ingredients)]

    let ustensils = [...new Set(recipes.map(r => r.ustensils).flat())]
    
    let appliances = [...new Set(recipes.map(r => r.appliance.toLowerCase()))]






    const filters = document.querySelector('.filters')
    const selectIngredients = new Select('Ingrédients', ingredients, (value) => {
        selectedIngredients.push(value)
        console.log(selectedIngredients)
    })
    filters.appendChild(selectIngredients.render())

    const selectUstensils = new Select('Ustensils', ustensils, (value) => {
        selectedUstensils.push(value)
    })
    filters.appendChild(selectUstensils.render())

    const selectAppliances = new Select('Appareils', appliances, (value) => {
        selectedAppliances.push(value)
    })
    filters.appendChild(selectAppliances.render())
}

const init = async () => {
    recipes = await fetchRecipes();    
    addRecipesDOM(recipes);

    createFilters()
}

init();