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

const searchbarInput = document.getElementById('searchbar')

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

searchbarInput.addEventListener('input', () => handleSearchbarInput())

// ------------ Functions ------------------ //
function normalizeText(text) {
    return text.toLowerCase().normalize("NFKD").replace(/\p{Diacritic}/gu, "")
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
    const recipesToUse = filteredRecipes.length > 0 ? filteredRecipes : recipesData
    let uniqueItems = []
    let recipesMatchingData = []


    switch (filterType) {
        case 'ingredients':
            recipesMatchingData = data.filter(ingredient =>
                recipesToUse.some(recipe =>
                    recipe.ingredients.some(ing => ing.ingredient.toLowerCase() === ingredient)
                )
            )
            break
        case 'appliance':
            recipesMatchingData = data.filter(appliance =>
                recipesToUse.some(recipe =>
                    recipe.appliance.toLowerCase() === appliance
                )
            )
            break

        case 'ustensils':
            recipesMatchingData = data.filter(utensil =>
                recipesToUse.some(recipe =>
                    recipe.ustensils.some(ustensil => ustensil.toLowerCase() === utensil)
                )
            )
            break
        default: return
    }

    // Get unique items that are not in the active filters
    uniqueItems = [...new Set(recipesMatchingData.filter(item =>
        !activeFilters.includes(item.toLowerCase())

    ))]

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
    const searchTerm = normalizeText(searchInput.value)
    const filterItems = dropdownContainer.querySelectorAll('li')

    // Show or hide filter items based on the search term
    filterItems.forEach(item => {
        const text = normalizeText(item.textContent)
        item.style.display = text.includes(searchTerm) ? 'block' : 'none'
    })
}

function handleFilterClick(event) {
    const clickedFilter = event.target.textContent.trim().toLowerCase()
    const filterType = event.target.dataset.filterType

    activeFilters.push(clickedFilter)

    cleanSearchInput(filterType)
    //cleanSearchbarInput()
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

/*function cleanSearchbarInput() {
    searchbarInput.value = ''
}*/

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

function updateRecipesDisplay(data) {
    const container = document.querySelector(".cards_section")
    container.innerHTML = ""


    if (Array.isArray(data) && data.length > 0) {
        data.forEach(createCard)
        updateRecipeCount(data)
    } else {
        const RecipesToUse = filteredRecipes.length > 0 ? filteredRecipes : recipesData
        // Filter recipes based on active filters
        filteredRecipes = RecipesToUse.filter(recipe =>
            activeFilters.every(filter =>
                recipe.ingredients.some(item => item.ingredient.toLowerCase() === filter)
                || recipe.appliance.toLowerCase() === filter
                || recipe.ustensils.some(ustensils => ustensils.toLowerCase() === filter)
            )
        )
        console.log(searchbarInput.value.length)

        if (searchbarInput.value.length > 0) {
            handleSearchbarInput()
        } else {
            filteredRecipes.forEach(createCard)
            updateRecipeCount(filteredRecipes)
        }
    }
}

function handleSearchbarInput() {
    const searchTerm = normalizeText(searchbarInput.value)
    const isSearchTermLongEnough = searchTerm.length >= 3
    const RecipesToUse = activeFilters.length > 0 ? filteredRecipes : recipesData
    let searchedRecipes = []

    if (isSearchTermLongEnough) {
        searchedRecipes = RecipesToUse.filter(recipe => {
            return normalizeText(recipe.name).includes(searchTerm) ||
                normalizeText(recipe.description).includes(searchTerm) ||
                recipe.ingredients.some(ing => normalizeText(ing.ingredient).includes(searchTerm)) ||
                normalizeText(recipe.appliance).includes(searchTerm) ||
                recipe.ustensils.some(utensils => normalizeText(utensils).includes(searchTerm))
        })

        if (searchedRecipes.length === 0) {
            displayNoResultsMessage(searchTerm)
            updateRecipeCount(searchedRecipes)
        } else {
            filteredRecipes = searchedRecipes
            updateRecipesDisplay(searchedRecipes)
        }

    } else {
        updateRecipesDisplay(RecipesToUse)
    }
    createAllFiltersList()
}

function displayNoResultsMessage(searchTerm) {
    const recipesContainer = document.querySelector(".cards_section")
    recipesContainer.innerHTML = `<p class="text-center">Aucune recette ne contient "${searchTerm}", vous pouvez chercher "tarte aux pommes", "poisson", etc.</p>`
}

/*
function handleSearchbarInput() {
    const searchTerm = normalizeText(searchbarInput.value)
    if (searchTerm.length >= 3) {
        filteredRecipes = recipesData.filter(recipe => {
            return normalizeText(recipe.name).includes(searchTerm) ||
                normalizeText(recipe.description).includes(searchTerm) ||
                recipe.ingredients.some(ing => normalizeText(ing.ingredient).includes(searchTerm)) ||
                normalizeText(recipe.appliance).includes(searchTerm) ||
                recipe.ustensils.some(utensils => normalizeText(utensils).includes(searchTerm))
        })

        updateRecipesDisplay(filteredRecipes)
        createAllFiltersList()
    } else if (recipesData !== filteredRecipes && searchTerm.length < 3 && activeFilters.length === 0) {
        filteredRecipes = recipesData
        updateRecipesDisplay(recipesData)
        createAllFiltersList()
    } else if (recipesData !== filteredRecipes && searchTerm.length < 3 && activeFilters.length >= 1) {
        updateRecipesDisplay(filteredRecipes)
        createAllFiltersList()
    }

    function normalizeText(text) {
        return text.toLowerCase().normalize("NFKD").replace(/\p{Diacritic}/gu, "")
    }
}*/
createAllFiltersList()
