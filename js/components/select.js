class Select {
  /**
   * @param {string} name - Le nom du dropdown.
   * @param {Array} data - Les données pour peupler le dropdown.
   * @param {Function} selectData - Fonction de rappel pour gérer les données sélectionnées.
   */
  constructor(name, data, selectData, removeData) {
    this.name = name;
    this.data = data;
    this.selectData = selectData;
    this.debounceTimer = null;
    this.container = null;
    this.selectedItems = [];
    this.maxHeight = 315;
    this.ignoreClose = false;
    this.removeData = removeData;
  }

  removeSelectItem(value){
    this.selectedItems = this.selectedItems.filter(e => e !== value)
    this.filterData('', this.list)
  }

  displaySelectedItems(value) {
    // Affiche les éléments sélectionnés en haut de la liste avec un bouton de suppression
    this.selectedItems.forEach((element) => {
      const el = document.createElement("li");
      el.classList.add("selected-item");

      const itemText = document.createElement("span");
      itemText.innerText = element;
      el.appendChild(itemText);

      const removeButton = document.createElement("button");
      removeButton.innerHTML = "&times;";
      removeButton.classList.add("remove-button");
      removeButton.addEventListener("click", (e) => {
        e.stopPropagation();
        this.selectedItems = this.selectedItems.filter(
          (item) => item !== element
        );
        this.filterData(value, this.list);
        this.removeData(element)
      });
      el.appendChild(removeButton);

      this.list.appendChild(el);
    });
  }

  // Filtre les données en fonction de la valeur de recherche
  filterData(value, list) {
    this.list = list
    let filteredData = this.data;
    if (value.length > 0) {
      filteredData = this.data.filter((d) =>
        d.toLowerCase().includes(value.toLowerCase())
      );
    }

    list.innerHTML = "";

    this.displaySelectedItems(value, list)    
    

    // Ajouter un séparateur entre les éléments sélectionnés et non sélectionnés
    if (this.selectedItems.length > 0) {
      const separator = document.createElement("li");
      separator.classList.add("separator");
      list.appendChild(separator);
    }

    // Affiche les autres éléments filtrés
    filteredData.forEach((element) => {      
      if (!this.selectedItems.includes(element)) {
        const el = document.createElement("li");
        el.innerText = element;
        el.addEventListener("click", () => {
          this.selectData(element);
          this.selectedItems.push(element);
          this.filterData(value, list);
          this.ignoreClose = true;
        });
        list.appendChild(el);
      }
    });
  }

  // Fonction de débogage pour le filtrage des données
  debounceFilter(value, list) {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => this.filterData(value, list), 300);
  }

  // Ouvre ou ferme le dropdown
  toggleDropdown() {
    const content = this.container.querySelector(".select-content");

    // Ferme tous les autres dropdowns ( ne fonctionne pas)
    document.querySelectorAll(".select").forEach((select) => {
      const otherContent = select.querySelector(".select-content");
      if (otherContent !== content) {
        otherContent.classList.remove("show");
        select.classList.remove("active");
      }
    });

    // Ouvre ou ferme le dropdown actuel
    content.classList.toggle("show");
    this.container.classList.toggle("active");
  }

  // Ferme le dropdown
  closeDropdown() {
    const content = this.container.querySelector(".select-content");
    content.classList.remove("show");
    this.container.classList.remove("active");
  }

  // Gère les clics en dehors du dropdown pour le fermer
  handleClickOutside(event) {
    if (!this.container.contains(event.target) && !this.ignoreClose) {
      this.closeDropdown();
    }
    this.ignoreClose = false;
  }

  setData(data){
    this.data = data
    this.filterData('', this.list)
  }

  // Rendu du composant

  render() {
    this.container = document.createElement("div");
    this.container.classList.add("select");

    const title = document.createElement("div");
    title.classList.add("select-title");
    title.innerText = this.name;

    const chevron = document.createElement("i");
    chevron.classList.add("fas", "fa-chevron-down");
    title.appendChild(chevron);

    title.addEventListener("click", () => this.toggleDropdown());
    this.container.appendChild(title);

    const content = document.createElement("div");
    content.classList.add("select-content");

    const searchBoxWrapper = document.createElement("div");
    searchBoxWrapper.classList.add("search-box-wrapper");

    const searchBox = document.createElement("input");
    searchBox.setAttribute("type", "search");
    searchBox.classList.add("search-box");
    searchBoxWrapper.appendChild(searchBox);

    const searchIcon = document.createElement("i");
    searchIcon.classList.add("fas", "fa-search", "search-icon");
    searchBoxWrapper.appendChild(searchIcon);

    content.appendChild(searchBoxWrapper);

    const list = document.createElement("ul");
    list.style.maxHeight = "265px";
    list.style.overflowY = "auto";
    this.filterData("", list);
    content.appendChild(list);

    searchBox.addEventListener("input", (e) => {
        this.debounceFilter(e.target.value, list);
    });

    this.container.appendChild(content);

    // Ferme le dropdown en cliquant en dehors
    document.addEventListener("click", (e) => this.handleClickOutside(e));

    return this.container;
  }
}

class SelectIngredients extends Select{

  constructor(data, onSelect, onRemove){
    super('Ingrédients')
    this.data = data
    this.selectData = this.select
    this.removeData = this.remove
    this.onSelect = onSelect
    this.onRemove = onRemove
    this.selectedIngredients = []
  }

  select(value){
    this.selectedIngredients.push(value);
    this.onSelect(value, this.name)
  }

  remove(value){
    this.selectedIngredients = this.selectedIngredients.filter(ingredient => ingredient !== value)
    this.onRemove(value)
  }

  removeSelectedIngredient(value){
    this.selectedIngredients = this.selectedIngredients.filter(ingredient => ingredient !== value)
    this.removeSelectItem(value)
  }

  getSelectedIngredients(){
    return this.selectedIngredients
  }
}

class SelectUstensils extends Select{

  constructor(data, onSelect, onRemove){
    super('Ustensils')
    this.data = data
    this.selectData = this.select
    this.removeData = this.remove
    this.onSelect = onSelect
    this.onRemove = onRemove
    this.selectedUstensils = []
  }

  select(value){
    this.selectedUstensils.push(value);
    this.onSelect(value, this.name)
  }

  remove(value){
    this.selectedUstensils = this.selectedUstensils.filter(ustensil => ustensil !== value)
    this.onRemove(value)
  }

  removeSelectedUstensil(value){
    this.selectedUstensils = this.selectedUstensils.filter(u => u !== value)
    this.removeSelectItem(value)
  }

  getSelectedUstensils(){
    return this.selectedUstensils
  }
}

class SelectAppliances extends Select{

  constructor(data, onSelect, onRemove){
    super('Appareils')
    this.data = data
    this.selectData = this.select
    this.removeData = this.remove
    this.onSelect = onSelect
    this.onRemove = onRemove
    this.selectedAppliances = []
  }

  select(value){
    this.selectedAppliances.push(value);
    this.onSelect(value, this.name)
  }

  remove(value){
    this.selectedAppliances = this.selectedAppliances.filter(appliance => appliance !== value)
    this.onRemove(value)
  }

  removeSelectedAppliance(value){
    this.selectedAppliances = this.selectedAppliances.filter(a => a !== value)
    this.removeSelectItem(value)
  }

  getSelectedAppliances(){
    return this.selectedAppliances
  }
}


export default Select
export { SelectIngredients, SelectUstensils, SelectAppliances };