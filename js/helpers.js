const updateCounter = (filteredRecipes) => {
    const counter = document.querySelector('.counter')
    counter.innerText = `${filteredRecipes.length} ${filteredRecipes.length > 1 ? 'recettes' : 'recette'}`
}

export {updateCounter}