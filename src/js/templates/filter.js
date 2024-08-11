export function createActiveFilter(data, filterType) {
  const filter = data.charAt(0).toUpperCase() + data.slice(1)

  const filterTemplate = `
        <button
          id="dropdownSearchButton"
          data-dropdown-toggle="dropdownSearch"
          data-dropdown-placement="bottom"
          data-filter-type="${filterType}"
          class="selected_filter_btn cursor-pointer line-clamp-1 max-h-[52px] inline-flex w-52 items-center my-2 mr-2 justify-between rounded-lg bg-yellow py-4 pl-5 pr-3 text-center text-sm font-medium text-black focus:outline-none whitespace-nowrap"
          type="button"
          v
        >
          ${filter}
          <svg
            fill="#000000"
            width="20px"
            height="20px"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            data-darkreader-inline-fill=""
            style="--darkreader-inline-fill: #000000"
            class="close_btn cursor-pointer"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M18.8,16l5.5-5.5c0.8-0.8,0.8-2,0-2.8l0,0C24,7.3,23.5,7,23,7c-0.5,0-1,0.2-1.4,0.6L16,13.2l-5.5-5.5 c-0.8-0.8-2.1-0.8-2.8,0C7.3,8,7,8.5,7,9.1s0.2,1,0.6,1.4l5.5,5.5l-5.5,5.5C7.3,21.9,7,22.4,7,23c0,0.5,0.2,1,0.6,1.4 C8,24.8,8.5,25,9,25c0.5,0,1-0.2,1.4-0.6l5.5-5.5l5.5,5.5c0.8,0.8,2.1,0.8,2.8,0c0.8-0.8,0.8-2.1,0-2.8L18.8,16z"
              ></path>
            </g>
          </svg>
        </button>
      `

  const container = document.querySelector(".selected_filters")
  container.insertAdjacentHTML("beforeend", filterTemplate)
}





