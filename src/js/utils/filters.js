import { recipesData } from "../data/recipes.js"
import { createCard } from "../templates/card.js"
import { createActiveFilter } from "../templates/filter.js"
import { updateRecipeCount } from "../pages/index.js"

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
let filteredRecipes = []

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
        }, 250)
    }

    return isOpen
}

function createAllFiltersList() {
    createIngredientsList()
    createAppliancesList()
    createUtensilsList()
}

function createIngredientsList() {
    const ingredients = recipesData.flatMap(recette => recette.ingredients.map(ing => ing.ingredient.toLowerCase()))
    handleFiltersListCreation('.ingredient_list', ingredientDropdown, ingredients, 'ingredients')
}

function createAppliancesList() {
    const appliances = recipesData.flatMap(recette => recette.appliance.toLowerCase())
    handleFiltersListCreation('.appliance_list', applianceDropdown, appliances, 'appliance')
}

function createUtensilsList() {
    const utensils = recipesData.flatMap(recette => recette.ustensils.map(utensil => utensil.replace(/[^a-zA-ZÀ-ÿ\s]/g, '').toLowerCase()))
    handleFiltersListCreation('.utensil_list', utensilDropdown, utensils, 'ustensils')
}

function handleFiltersListCreation(listContainerSelector, dropdownContainer, data, filterType) {
    const listContainer = document.querySelector(listContainerSelector)
    let uniqueItems = []

    // If there is an active filter
    if (Array.isArray(filteredRecipes) && filteredRecipes.length > 0) {
        let recipesMatchingData = []

        // Filter data based on the filter type (ingredients, appliance, or utensils)
        if (filterType === 'ingredients') {
            recipesMatchingData = data.filter(ingredient =>
                filteredRecipes.some(recipe =>
                    recipe.ingredients.some(ing => ing.ingredient.toLowerCase() === ingredient)
                )
            )
        } else if (filterType === 'appliance') {
            recipesMatchingData = data.filter(appliance =>
                filteredRecipes.some(recipe =>
                    recipe.appliance.toLowerCase() === appliance
                )
            )
        } else if (filterType === 'ustensils') {
            recipesMatchingData = data.filter(utensil =>
                filteredRecipes.some(recipe =>
                    recipe.ustensils.some(ustensil => ustensil.toLowerCase() === utensil)
                )
            )
        }

        // Get unique items that are not in the active filters
        uniqueItems = [...new Set(recipesMatchingData.filter(item =>
            !activeFilters.includes(item.toLowerCase())

        ))]
    } else {
        // Get unique items that are not in the active filters
        uniqueItems = [...new Set(data.filter(item =>
            !activeFilters.includes(item.toLowerCase())
        ))]
    }

    // Create the list items for the filter dropdown
    listContainer.innerHTML = uniqueItems.map(item => {
        const capitalizedItem = item.charAt(0).toUpperCase() + item.slice(1)
        return `<li data-filter-type="${filterType}" class="block cursor-pointer py-2 px-4 hover:bg-yellow text-sm">${capitalizedItem}</li>`
    }).join("")

    const filterItems = dropdownContainer.querySelectorAll('li')
    addListenersToFiltersList(filterItems)
}

function addListenersToFiltersList(filterList) {
    filterList.forEach(item => {
        item.addEventListener("click", handleFilterClick)
    })
}

function handleFilterInput(searchInput, dropdownContainer) {
    const searchTerm = searchInput.value.toLowerCase()
    const filterItems = dropdownContainer.querySelectorAll('li')

    // Show or hide filter items based on the search term
    filterItems.forEach(item => {
        const text = item.textContent.toLowerCase()
        item.style.display = text.startsWith(searchTerm) ? 'block' : 'none'
    })
}

function handleFilterClick(event) {
    const clickedFilter = event.target.textContent.trim().toLowerCase()
    const filterType = event.target.dataset.filterType

    activeFilters.push(clickedFilter)

    cleanSearchInput(filterType)
    createActiveFilter(clickedFilter, filterType)
    updateRecipesDisplay()
    createAllFiltersList()
}

function cleanSearchInput(filterType) {
    const inputElement = document.querySelector(`input[data-filter-type="${filterType}"]`)
    if (inputElement) {
        inputElement.value = ''
    }
}

function deleteSelectedFilter(event) {
    if (event.target.classList.contains('close_btn') || event.target.classList.contains('selected_filter_btn')) {
        const button = event.target.closest('.selected_filter_btn')
        const filter = button.textContent.trim().toLowerCase()
        // Remove the filter from active filters
        activeFilters = activeFilters.filter(element => element !== filter)
        button.remove()

        updateRecipesDisplay()
        createAllFiltersList()
    }
}

function updateRecipesDisplay() {
    const container = document.querySelector(".cards_section")
    container.innerHTML = ""

    // Filter recipes based on active filters
    filteredRecipes = recipesData.filter(recipe =>
        activeFilters.every(filter =>
            recipe.ingredients.some(item => item.ingredient.toLowerCase() === filter)
            || recipe.appliance.toLowerCase() === filter
            || recipe.ustensils.some(ustensils => ustensils.toLowerCase() === filter)
        )
    )

    filteredRecipes.forEach(createCard)
    updateRecipeCount(filteredRecipes)
}

createAllFiltersList()
