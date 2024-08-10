export function createCard(data) {
  function generateIngredientsList(ingredients) {
    return ingredients.map(ingredient => `
        <ul class="my-2 h-[40px] w-[45%]">
            <li>${ingredient.ingredient}</li>
            ${ingredient.quantity && !ingredient.unit ? `<li class="text-grey">${ingredient.quantity}</li>` : ''}
            ${ingredient.quantity && ingredient.unit ? `<li class="text-grey">${ingredient.quantity} ${ingredient.unit}</li>` : ''}
        </ul>
    `).join('')
  }

  const cardTemplate = `
        <article
          class="box-border h-[700px] w-[380px] cursor-default rounded-xl bg-white animate-fadeIn"
        >
          <div class="relative h-[250px] cursor-default text-end">
            <img
              src="assets/recipes/${data.image}"
              alt="Photo de ${data.name}"
              class="h-full w-full rounded-t-xl object-cover"
            />
            <p
              class="absolute right-6 top-6 w-[64px] rounded-xl bg-yellow py-[4px] text-center font-manrope text-sm font-normal"
            >
              ${data.time}min
            </p>
          </div>
          <div class="box-border h-[450px] overflow-hidden p-6 pt-8">
            <h2 class="max-h-[25px] font-anton">${data.name}</h2>
            <div
              class="max-h-[220px] overflow-hidden py-6 font-manrope text-sm"
            >
              <h3 class="mb-3 text-grey">Recette</h3>
              <p class="line-clamp-4">${data.description}</p>
            </div>
            <div class="box-border font-manrope text-sm">
              <h3 class="mb-[5px] w-full text-grey">Ingrédients</h3>
              <div
                class="flex h-[180px] w-full flex-col flex-wrap content-between"
              >
              ${generateIngredientsList(data.ingredients)}
              </div>
            </div>
          </div>
        </article>
    `

  const container = document.querySelector(".cards_section")
  container.insertAdjacentHTML("beforeend", cardTemplate)
}
