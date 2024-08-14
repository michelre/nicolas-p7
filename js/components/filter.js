class Filter {

    constructor(value, selectName, onRemove){
        this.value = value
        this.element = null
        this.selectName = selectName 
        this.onRemove = onRemove
    }

    remove(){
        this.element.remove()
        this.onRemove(this)
    }

    getValue(){
        return this.value
    }

    render(){
        const element = document.createElement('li')
        element.classList.add('selected-filter')
        const text = document.createElement('span')
        text.innerText = this.value

        const removeButton = document.createElement("button");
        removeButton.innerHTML = "&times;";

        element.appendChild(text)
        element.appendChild(removeButton)

        removeButton.addEventListener('click', () => {
            this.remove()        
          })

        this.element = element
        return element
    }

}

export default Filter