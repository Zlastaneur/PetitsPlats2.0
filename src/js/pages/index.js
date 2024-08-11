import { recipesData } from "../data/recipes.js"
import { createCard } from "../templates/card.js"

export const displayRecipes = () => {
  try {
    recipesData.forEach((recipe) => {
      createCard(recipe)
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error)
  }
}

export function updateRecipeCount(recipesList) {
  const countContainer = document.querySelector(".recipe_count")

  countContainer.innerHTML = ""
  countContainer.innerHTML = `${recipesList.length} Recettes`
}

displayRecipes()
updateRecipeCount(recipesData)