let recipes = []

const fetchRecipes = async () => {
    const r = fetch('data/recipes.json')
    return (await r).json()
}

const addRecipesDOM = (recipes) => {
    const recipesDOM = document.querySelector('.recipes')
    recipes.forEach(recipe => {
        const li = document.createElement('li')
        li.classList.add('recipe')
        const r = new Recipe(recipe)
        li.appendChild(r.render())
        recipesDOM.appendChild(li)
    });
}



const init = async () => {
    recipes = await fetchRecipes()
    addRecipesDOM(recipes)
}

init()