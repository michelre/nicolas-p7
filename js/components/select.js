class Select {

    constructor(name, data, selectData){
        this.name = name
        this.data = data
        this.selectData = selectData
    }

    filterData(value, list){  
        let filteredData = this.data
        if(value.length > 3){
            filteredData = this.data.filter(d => d.toLowerCase() === value.toLowerCase())
        }      
        
        list.innerHTML = ''
        filteredData.forEach(element => {
            const el = document.createElement('li')
            el.innerText = element
            list.appendChild(el)


            el.addEventListener('click', () => {
                this.selectData(element)
            })
        });
    }

    /**
     * @returns NodeElement
     */
    render(){
        const select = document.createElement('div')
        select.classList.add('select')

        const title = document.createElement('h3')
        title.innerText = this.name
        select.appendChild(title)

        const input = document.createElement('input')
        input.setAttribute('type', 'search')
        select.appendChild(input)

        const list = document.createElement('ul')
        this.filterData('', list)
        select.appendChild(list)



        input.addEventListener('input', (e) => {
            this.filterData(e.target.value, list)
        })


        return select
           
    }

}

export default Select