import { recipesData } from "../data/recipes.js"
import { createCard } from "../templates/card.js"
import { createFilter } from "../templates/filter.js"

// ------------ Variables and selectors ------------------ //
const ingredientBtn = document.getElementById('DropdownBtn_ingredient')
const ingredientDropdown = document.getElementById('dropdownMenu_ingredient')
const ingredientSearchInput = document.getElementById('search-input_ingredient')

const applianceBtn = document.getElementById('DropdownBtn_appliance')
const applianceDropdown = document.getElementById('dropdownMenu_appliance')
const applianceSearchInput = document.getElementById('search-input_appliance')

const utensilBtn = document.getElementById('DropdownBtn_utensil')
const utensilDropdown = document.getElementById('dropdownMenu_utensil')
const utensilSearchInput = document.getElementById('search-input_utensil')

const filtersContainer = document.querySelector('.selected_filters')

let isIngredientsOpen = false
let isAppliancesOpen = false
let isUtensilsOpen = false
let activeFilters = []

// ------------ Event listeners ------------------ //
ingredientBtn.addEventListener('click', () => {
    isIngredientsOpen = toggleDropdownButton(isIngredientsOpen, ingredientDropdown, document.querySelector(".chevron_ingredient"))
})
applianceBtn.addEventListener('click', () => {
    isAppliancesOpen = toggleDropdownButton(isAppliancesOpen, applianceDropdown, document.querySelector(".chevron_appliance"))
})
utensilBtn.addEventListener('click', () => {
    isUtensilsOpen = toggleDropdownButton(isUtensilsOpen, utensilDropdown, document.querySelector(".chevron_utensil"))
})

ingredientSearchInput.addEventListener('input', () => handleFilterInput(ingredientSearchInput, ingredientDropdown))
applianceSearchInput.addEventListener('input', () => handleFilterInput(applianceSearchInput, applianceDropdown))
utensilSearchInput.addEventListener('input', () => handleFilterInput(utensilSearchInput, utensilDropdown))

filtersContainer.addEventListener('click', deleteSelectedFilter)

// ------------ Functions ------------------ //


function updateRecipesDisplay() {
    const container = document.querySelector(".cards_section")
    container.innerHTML = ""

    const filteredRecipes = recipesData.filter(recipe =>
        activeFilters.every(filter =>
            recipe.ingredients.some(item => item.ingredient.toLowerCase() === filter)
            || recipe.appliance.toLowerCase() === filter
            || recipe.ustensils.some(ustensils => ustensils.toLowerCase() === filter)
        )
    )

    filteredRecipes.forEach(createCard)
    updateRecipeCount(filteredRecipes)
}

function updateRecipeCount(recipesList) {
    const recipeContainer = document.querySelector(".recipe_count")
    recipeContainer.innerHTML = `${recipesList.length} Recettes`
    //recipeContainer.insertAdjacentHTML("afterbegin", `${recipesList.length}`)
}

function deleteSelectedFilter(event) {
    if (event.target.classList.contains('close_btn') || event.target.closest('.close_btn')) {
        const button = event.target.closest('.selected_filter_btn')
        const filter = button.textContent.trim().toLowerCase()
        const filterType = button.dataset.filterType
        activeFilters = activeFilters.filter(element => element !== filter)
        button.remove()

        updateRecipesDisplay()
        dispatchFilterCreation(filterType)
    }
}

function toggleDropdownButton(isOpen, dropdownElement, chevronElement) {
    isOpen = !isOpen
    chevronElement.classList.toggle("rotate-180")

    if (isOpen) {
        dropdownElement.classList.remove('hidden')
        dropdownElement.classList.add('animate-expand')
        dropdownElement.classList.remove('animate-collapse')
    } else {
        dropdownElement.classList.add('animate-collapse')
        dropdownElement.classList.remove('animate-expand')
        setTimeout(() => {
            dropdownElement.classList.add('hidden')
        }, 505)
    }

    return isOpen
}

function addListenersToFiltersList(filterList) {
    filterList.forEach(item => {
        item.addEventListener("click", handleFilterClick)
    })
}

function handleFilterClick(event) {
    const clickedFilter = event.target.textContent.trim().toLowerCase()
    const filterType = event.target.dataset.filterType

    activeFilters.push(clickedFilter)

    createFilter(clickedFilter, filterType)
    updateRecipesDisplay()

    dispatchFilterCreation(filterType)
}

function dispatchFilterCreation(filterType) {
    if (filterType === 'ingredient') {
        createIngredientsList()
    } else if (filterType === 'appliance') {
        createAppliancesList()
    } else if (filterType === 'utensil') {
        createUtensilsList()
    }
}

function handleFilterInput(searchInput, dropdownContainer) {
    const searchTerm = searchInput.value.toLowerCase()
    const filterItems = dropdownContainer.querySelectorAll('li')

    filterItems.forEach(item => {
        const text = item.textContent.toLowerCase()
        item.style.display = text.startsWith(searchTerm) ? 'block' : 'none'
    })
}

function handleFiltersListCreation(listContainerSelector, dropdownContainer, data, filterType) {
    const listContainer = document.querySelector(listContainerSelector)
    const uniqueItems = [...new Set(data.filter(item => !activeFilters.includes(item.toLowerCase())))]

    listContainer.innerHTML = uniqueItems.map(item => {
        const capitalizedItem = item.charAt(0).toUpperCase() + item.slice(1)
        return `<li data-filter-type="${filterType}" class="block cursor-pointer py-2 px-4 hover:bg-yellow text-sm">${capitalizedItem}</li>`
    }).join("")

    const filterItems = dropdownContainer.querySelectorAll('li')
    addListenersToFiltersList(filterItems)
}

function createIngredientsList() {
    const ingredients = recipesData.flatMap(recette => recette.ingredients.map(ing => ing.ingredient.toLowerCase()))
    handleFiltersListCreation('.ingredient_list', ingredientDropdown, ingredients, 'ingredient')
}

function createAppliancesList() {
    const appliances = recipesData.flatMap(recette => recette.appliance)
    handleFiltersListCreation('.appliance_list', applianceDropdown, appliances, 'appliance')
}

function createUtensilsList() {
    const utensils = recipesData.flatMap(recette => recette.ustensils.map(utensil => utensil.replace(/[^a-zA-ZÀ-ÿ\s]/g, '').toLowerCase()))
    handleFiltersListCreation('.utensil_list', utensilDropdown, utensils, 'utensil')
}

createIngredientsList()
createAppliancesList()
createUtensilsList()
