import { recipesData } from "../data/recipes.js"
import { createCard } from "../templates/card.js"

const recipeCount = document.querySelector('.recipe_count ')

const index = () => {
  try {
    recipesData.forEach((recipe) => {
      createCard(recipe)
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error)
  }
}

recipeCount.innerHTML = `${recipesData.length} Recettes`

index()
