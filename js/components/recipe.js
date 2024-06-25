export class Recipe {
    constructor(data) {
        this.data = data;
    }

    render() {
        const recipe = document.createElement('div');
        recipe.classList.add('recipe-content');

        // Image
        const image = document.createElement('img');
        image.setAttribute('src', `assets/${this.data.image}`);
        image.setAttribute('alt', `Image de la recette ${this.data.name}`);
        image.classList.add('recipe-image');
        recipe.appendChild(image);

        // Details container
        const details = document.createElement('div');
        details.classList.add('recipe-details');

        // Title
        const title = document.createElement('h3');
        title.innerText = this.data.name;
        details.appendChild(title);

        // Time
        const time = document.createElement('p');
        time.innerText = `${this.data.time} min`;
        details.appendChild(time);

        // Subtitle "Recette"
        const subtitleRecipe = document.createElement('h4');
        subtitleRecipe.innerText = 'RECETTE';
        subtitleRecipe.classList.add('recipe-subtitle');
        details.appendChild(subtitleRecipe);

        // Description
        const description = document.createElement('p');
        description.innerText = this.data.description;
        details.appendChild(description);

        // Subtitle "Ingrédients"
        const ingredientsTitle = document.createElement('h4');
        ingredientsTitle.innerText = 'INGRÉDIENTS';
        ingredientsTitle.classList.add('recipe-subtitle');
        details.appendChild(ingredientsTitle);

        // Ingredients list
        const ingredientsList = document.createElement('ul');
        ingredientsList.classList.add('ingredients-list');
        this.data.ingredients.forEach(ingredient => {
            const li = document.createElement('li');

            const ingredientName = document.createElement('span');
            ingredientName.classList.add('ingredient-name');
            ingredientName.innerText = ingredient.ingredient;

            const ingredientQuantity = document.createElement('span');
            ingredientQuantity.classList.add('ingredient-quantity');
            ingredientQuantity.innerText = `${ingredient.quantity}${ingredient.unit ? ` ${ingredient.unit}` : ''}`;

            li.appendChild(ingredientName);
            li.appendChild(ingredientQuantity);

            ingredientsList.appendChild(li);
        });
        details.appendChild(ingredientsList);

        // Append details to recipe
        recipe.appendChild(details);

        return recipe;
    }
}
