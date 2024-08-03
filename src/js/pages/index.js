import { recipesData } from "../data/recipes.js"
import { createCard } from "../templates/card.js"

const index = () => {
  try {
    recipesData.forEach((recipe) => {
      createCard(recipe)
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error)
  }
}

index()
