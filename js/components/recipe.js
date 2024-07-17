export class Recipe {
  constructor(data) {
      this.data = data;
  }

  // Rendu de la recette
  render() {
      const recipe = document.createElement("div");
      recipe.classList.add("recipe-content");

      // Image de la recette
      const image = document.createElement("img");
      //image.setAttribute("src", `assets/${this.data.image}`);
      image.setAttribute("alt", `Image de la recette ${this.data.name}`);
      image.classList.add("recipe-image");
      recipe.appendChild(image);

      // Temps de préparation
      const time = document.createElement("span");
      time.classList.add("recipe-time");
      time.innerText = `${this.data.time} min`;
      recipe.appendChild(time);

      // Conteneur des détails
      const details = document.createElement("div");
      details.classList.add("recipe-details");

      // Titre de la recette
      const title = document.createElement("h3");
      title.innerText = this.data.name;
      details.appendChild(title);

      // Sous-titre "Recette"
      const subtitleRecipe = document.createElement("h4");
      subtitleRecipe.innerText = "RECETTE";
      subtitleRecipe.classList.add("recipe-subtitle");
      details.appendChild(subtitleRecipe);

      // Description de la recette
      const description = document.createElement("p");
      description.innerText = this.data.description;
      details.appendChild(description);

      // Sous-titre "Ingrédients"
      const ingredientsTitle = document.createElement("h4");
      ingredientsTitle.innerText = "INGRÉDIENTS";
      ingredientsTitle.classList.add("recipe-subtitle");
      details.appendChild(ingredientsTitle);

      // Liste des ingrédients
      const ingredientsList = document.createElement("ul");
      ingredientsList.classList.add("ingredients-list");
      this.data.ingredients.forEach((ingredient) => {
          const li = document.createElement("li");

          const ingredientName = document.createElement("span");
          ingredientName.classList.add("ingredient-name");
          ingredientName.innerText = ingredient.ingredient;

          const ingredientQuantity = document.createElement("span");
          ingredientQuantity.classList.add("ingredient-quantity");
          ingredientQuantity.innerText = `${ingredient.quantity}${
              ingredient.unit ? ` ${ingredient.unit}` : ""
          }`;

          li.appendChild(ingredientName);
          li.appendChild(ingredientQuantity);

          ingredientsList.appendChild(li);
      });
      details.appendChild(ingredientsList);

      // Ajouter les détails à la recette
      recipe.appendChild(details);

      return recipe;
  }
}
