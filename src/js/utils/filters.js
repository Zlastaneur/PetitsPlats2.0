import { recipesData } from "../data/recipes.js"

// DOM elements
const ingredientBtn = document.getElementById('DropdownBtn_ingredient')
const ingredientDropdown = document.getElementById('dropdownMenu_ingredient')
const ingredientSearchInput = document.getElementById('search-input_ingredient')
const ingredientList = document.querySelector('.ingredient_list')

let isIngredientsOpen = false

// Function to toggle the dropdown state
function toggleIngredientsDropdown() {
    isIngredientsOpen = !isIngredientsOpen

    document.querySelector(".ingredient_appliance").classList.toggle("rotate-180")

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

ingredientBtn.addEventListener('click', () => {
    toggleIngredientsDropdown()
})

function generateIngredientList() {
    const ingredients = recipesData.map(recette => recette.ingredients.map(ing => ({ name: ing.ingredient }))).flat()

    const uniqueIngredientsSet = new Set()
    const uniqueIngredients = ingredients.reduce((acc, ingredient) => {
        if (!uniqueIngredientsSet.has(ingredient.name.toLowerCase())) {
            uniqueIngredientsSet.add(ingredient.name.toLowerCase())
            acc.push(ingredient)
        }
        return acc
    }, [])

    ingredientList.innerHTML = uniqueIngredients.map(ingredient =>
        `<li class="block cursor-pointer py-2 active:bg-blue-100 text-sm">${ingredient.name}</li>`).join("")
}


// Add event listener to filter items based on input
ingredientSearchInput.addEventListener('input', () => {
    const searchTerm = ingredientSearchInput.value.toLowerCase()
    const items = ingredientDropdown.querySelectorAll('li')

    items.forEach((item) => {
        const text = item.textContent.toLowerCase()
        if (text.startsWith(searchTerm)) {
            item.style.display = 'block'
        } else {
            item.style.display = 'none'
        }
    })
})

// ------------Appliance Filter------------------ //

const applianceBtn = document.getElementById('DropdownBtn_appliance')
const applianceDropdown = document.getElementById('dropdownMenu_appliance')
const applianceSearchInput = document.getElementById('search-input_appliance')
const applianceList = document.querySelector('.appliance_list')

let isAppliancesOpen = false

// Function to toggle the dropdown state
function toggleAppliancesDropdown() {
    isAppliancesOpen = !isAppliancesOpen

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

applianceBtn.addEventListener('click', () => {
    toggleAppliancesDropdown()
})

function generateApplianceList() {
    const appliances = recipesData.map(recette => recette.appliance).flat()

    const uniqueAppliances = appliances.reduce((acc, appliance) => {
        if (!acc.includes(appliance)) {
            acc.push(appliance)
        }
        return acc
    }, [])

    applianceList.innerHTML = uniqueAppliances.map(appliance =>
        `<li class="block cursor-pointer py-2 active:bg-blue-100 text-sm">${appliance}</li>`).join("")
}

// Add event listener to filter items based on input
applianceSearchInput.addEventListener('input', () => {
    const searchTerm = applianceSearchInput.value.toLowerCase()
    const items = applianceDropdown.querySelectorAll('li')

    items.forEach((item) => {
        const text = item.textContent.toLowerCase()
        if (text.startsWith(searchTerm)) {
            item.style.display = 'block'
        } else {
            item.style.display = 'none'
        }
    })
})

generateIngredientList()
generateApplianceList()