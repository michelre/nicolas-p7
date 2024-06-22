class Recipe {

    constructor(data){
        this.data = data
    }


    render(){
        const recipe = document.createElement('div')

        const image = document.createElement('img')
        image.setAttribute('src', '')
        image.setAttribute('alt', `Image de la recette ${this.data.name}`)
        recipe.appendChild(image)

        const title = document.createElement('h3')
        title.innerText = this.data.name
        recipe.appendChild(title)

        return recipe;
    }

}