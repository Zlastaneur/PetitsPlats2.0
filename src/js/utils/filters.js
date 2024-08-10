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

let ingredientFilterItems
let applianceFilterItems
let utensilFilterItems

let isIngredientsOpen = false
let isAppliancesOpen = false
let isUtensilsOpen = false
let activeFilters = []

// ------------ Event listeners ------------------ //
ingredientBtn.addEventListener('click', toggleIngredientsDropdown)
ingredientSearchInput.addEventListener('input', filterIngredientsWithInput)

applianceBtn.addEventListener('click', toggleAppliancesDropdown)
applianceSearchInput.addEventListener('input', filterAppliancesWithInput)

utensilBtn.addEventListener('click', toggleUtensilsDropdown)
utensilSearchInput.addEventListener('input', filterUtensilsWithInput)

filtersContainer.addEventListener('click', deleteSelectedFilter)

// ------------ Functions ------------------ //

function createFiltersList() {
    createIngredientsList()
    createAppliancesList()
    createUtensilsList()
}

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
    if (event.target.classList.contains('close_btn')) {
        const button = event.target.parentElement
        const filter = button.textContent.trim().toLowerCase()
        activeFilters = activeFilters.filter(element => element !== filter)
        button.remove()

        updateRecipesDisplay()
        createIngredientsList()
    }
}

// ------------Ingredients Filter------------------ //

function toggleIngredientsDropdown() {
    isIngredientsOpen = !isIngredientsOpen
    document.querySelector(".chevron_appliance").classList.toggle("rotate-180")

    if (isIngredientsOpen) {
        ingredientDropdown.classList.remove('hidden')
        ingredientDropdown.classList.add('animate-expand')
        ingredientDropdown.classList.remove('animate-collapse')
    } else {
        ingredientDropdown.classList.add('animate-collapse')
        ingredientDropdown.classList.remove('animate-expand')
        setTimeout(() => {
            ingredientDropdown.classList.add('hidden')
        }, 505)
    }
}

function createIngredientsList() {
    const ingredientContainer = document.querySelector('.ingredient_list')
    const ingredients = recipesData.flatMap(recette => recette.ingredients.map(ing => ({ name: ing.ingredient })))
    const uniqueIngredientsSet = new Set()
    const uniqueIngredients = ingredients.reduce((acc, ingredient) => {
        const ingredientNameLower = ingredient.name.toLowerCase()
        if (!uniqueIngredientsSet.has(ingredientNameLower) && !activeFilters.includes(ingredientNameLower)) {
            uniqueIngredientsSet.add(ingredientNameLower)
            acc.push(ingredient)
        }
        return acc
    }, [])

    ingredientContainer.innerHTML = uniqueIngredients.map(ingredient => `<li class="block cursor-pointer py-2 px-4 hover:bg-yellow text-sm">${ingredient.name}</li>`).join("")
    ingredientFilterItems = ingredientDropdown.querySelectorAll('li')
    addIngredientsListeners()
}

function addIngredientsListeners() {
    ingredientFilterItems.forEach(item => {
        item.addEventListener("click", () => {
            const clickedIngredient = item.textContent.trim().toLowerCase()
            activeFilters.push(clickedIngredient)

            createFilter(clickedIngredient)
            updateRecipesDisplay()
            createIngredientsList()
        })
    })
}

function filterIngredientsWithInput() {
    const searchTerm = ingredientSearchInput.value.toLowerCase()

    ingredientFilterItems.forEach(item => {
        const text = item.textContent.toLowerCase()
        item.style.display = text.startsWith(searchTerm) ? 'block' : 'none'
    })
}

// ------------Appliance Filter------------------ //

function toggleAppliancesDropdown() {
    isAppliancesOpen = !isAppliancesOpen
    document.querySelector(".chevron_appliance").classList.toggle("rotate-180")

    if (isAppliancesOpen) {
        applianceDropdown.classList.remove('hidden')
        applianceDropdown.classList.add('animate-expand')
        applianceDropdown.classList.remove('animate-collapse')
    } else {
        applianceDropdown.classList.add('animate-collapse')
        applianceDropdown.classList.remove('animate-expand')
        setTimeout(() => {
            applianceDropdown.classList.add('hidden')
        }, 505)
    }
}

function createAppliancesList() {
    const applianceList = document.querySelector('.appliance_list')
    const appliances = recipesData.map(recette => recette.appliance).flat()

    const uniqueAppliances = appliances.reduce((acc, appliance) => {
        if (!acc.includes(appliance)) {
            acc.push(appliance)
        }
        return acc
    }, [])

    applianceList.innerHTML = uniqueAppliances.map(appliance => `<li class="block cursor-pointer py-2 px-4 hover:bg-yellow text-sm">${appliance}</li>`).join("")
    applianceFilterItems = applianceDropdown.querySelectorAll('li')
    addAppliancesListeners()
}

function addAppliancesListeners() {
    applianceFilterItems.forEach(item => {
        item.addEventListener("click", () => {
            const clickedAppliance = item.textContent.trim().toLowerCase()
            activeFilters.push(clickedAppliance)

            createFilter(clickedAppliance)
            updateRecipesDisplay()
            createAppliancesList()
        })
    })
}

function filterAppliancesWithInput() {
    const searchTerm = applianceSearchInput.value.toLowerCase()
    applianceFilterItems = applianceDropdown.querySelectorAll('li')

    applianceFilterItems.forEach((item) => {
        const text = item.textContent.toLowerCase()
        if (text.startsWith(searchTerm)) {
            item.style.display = 'block'
        } else {
            item.style.display = 'none'
        }
    })
}

// ------------Utensils Filter------------------ //

function toggleUtensilsDropdown() {
    isUtensilsOpen = !isUtensilsOpen
    document.querySelector(".chevron_utensil").classList.toggle("rotate-180")

    if (isUtensilsOpen) {
        utensilDropdown.classList.remove('hidden')
        utensilDropdown.classList.add('animate-expand')
        utensilDropdown.classList.remove('animate-collapse')
    } else {
        utensilDropdown.classList.add('animate-collapse')
        utensilDropdown.classList.remove('animate-expand')
        setTimeout(() => {
            utensilDropdown.classList.add('hidden')
        }, 505)
    }
}

function createUtensilsList() {
    const utensilList = document.querySelector('.utensil_list')
    const utensils = recipesData.map(recette => recette.ustensils).flat()

    const uniqueUtensils = utensils.reduce((acc, utensil) => {
        // Filtrer les ustensiles pour ne garder que ceux qui contiennent des lettres, espaces et accents
        const filteredUtensil = utensil.replace(/[^a-zA-ZÀ-ÿ\s]/g, '').toLowerCase()
        if (filteredUtensil && !acc.includes(filteredUtensil)) {
            acc.push(filteredUtensil)
        }
        return acc
    }, [])

    utensilList.innerHTML = uniqueUtensils.map(utensil => {
        const capitalizedUtensil = utensil.charAt(0).toUpperCase() + utensil.slice(1)
        return `<li class="block cursor-pointer py-2 px-4 hover:bg-yellow text-sm">${capitalizedUtensil}</li>`
    }).join("")

    utensilFilterItems = utensilDropdown.querySelectorAll('li')
    addUtensilsListeners()
}

function addUtensilsListeners() {
    utensilFilterItems.forEach(item => {
        item.addEventListener("click", () => {
            const clickedUtensil = item.textContent.trim().toLowerCase()
            activeFilters.push(clickedUtensil)

            createFilter(clickedUtensil)
            updateRecipesDisplay()
            createAppliancesList()
        })
    })
}

function filterUtensilsWithInput() {
    const searchTerm = utensilSearchInput.value.toLowerCase()

    items.forEach((item) => {
        const text = item.textContent.toLowerCase()
        if (text.startsWith(searchTerm)) {
            item.style.display = 'block'
        } else {
            item.style.display = 'none'
        }
    })
}

createFiltersList()
