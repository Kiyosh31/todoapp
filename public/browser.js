function itemTemplate(data) {
  return `
  <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${data.text}</span>
    <div>
      <button data-id="${data._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
      <button data-id="${data._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
  </li>
  `
}

// Inital Page Load Render
let ourHTML = items
  .map((item) => {
    return itemTemplate(item)
  })
  .join("")
document.getElementById("item-list").insertAdjacentHTML("beforeend", ourHTML)

// Create Feature
let createField = document.getElementById("create-field")

document.getElementById("create-form").addEventListener("submit", (e) => {
  e.preventDefault()
  axios
    .post("/create-item", {
      text: createField.value,
    })
    .then((response) => {
      // Create the HTML for the new item
      document
        .getElementById("item-list")
        .insertAdjacentHTML("beforeend", itemTemplate(response.data))
      createField.value = ""
      createField.focus()
    })
    .catch((err) => console.log("Please try again later."))
})

document.addEventListener("click", (e) => {
  // Delete Feature
  if (e.target.classList.contains("delete-me")) {
    if (confirm("Do you really want to delete this item permanently?")) {
      axios
        .post("/delete-item", {
          id: e.target.getAttribute("data-id"),
        })
        .then(() => {
          e.target.parentElement.parentElement.remove()
        })
        .catch((err) => console.log("Please try again later."))
    }
  }

  // Update Feature
  if (e.target.classList.contains("edit-me")) {
    let newText = prompt(
      "Enter your desire new text",
      e.target.parentElement.parentElement.querySelector(".item-text").innerHTML
    )
    if (newText) {
      axios
        .post("/update-item", {
          text: newText,
          id: e.target.getAttribute("data-id"),
        })
        .then(() => {
          e.target.parentElement.parentElement.querySelector(
            ".item-text"
          ).innerHTML = newText
        })
        .catch((err) => console.log("Please try again later."))
    }
  }
})
