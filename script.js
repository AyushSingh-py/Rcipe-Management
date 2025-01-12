// Full script.js with functional Edit/Delete buttons in the new window

// DOM Elements
const searchButton = document.querySelector('.search-btn');
const searchInput = document.querySelector('.search');
const submitButton = document.querySelector('.submit');
const nameInput = document.querySelector('.name');
const ingredientsInput = document.querySelector('.ingredients');
const stepsInput = document.querySelector('.steps');
const fileInput = document.querySelector('.file');

// Load recipes from localStorage or initialize an empty array
const recipes = JSON.parse(localStorage.getItem('recipes')) || [];

// Save recipes to localStorage
function saveRecipes() {
  localStorage.setItem('recipes', JSON.stringify(recipes));
}

// Search and open results in a new window
searchButton.addEventListener('click', () => {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm) ||
    recipe.ingredients.toLowerCase().includes(searchTerm)
  );

  if (filteredRecipes.length === 0) {
    alert('No recipes found matching your search.');
    return;
  }

  openSearchResultsWindow(filteredRecipes);
});

// Open search results in a new window with functional Edit/Delete
function openSearchResultsWindow(filteredRecipes) {
  const newWindow = window.open('', '_blank', 'width=800,height=600');

  const styles = `
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
        padding: 20px;
        background: linear-gradient(to right, #f5f7fa, #c3cfe2);
        color: #333;
        text-align: center;
      }
      .recipe {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 10px;
        background: white;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        text-align: left;
      }
      .recipe h3 {
        font-size: 1.5rem;
        color: #ff7a2a;
      }
      .recipe img {
        max-width: 100%;
        height: auto;
        border-radius: 10px;
        margin-bottom: 20px;
      }
      .recipe p {
        line-height: 1.6;
        margin: 10px 0;
      }
      button {
        background-color: #ff914d;
        color: white;
        border: none;
        padding: 10px 20px;
        font-size: 1rem;
        border-radius: 8px;
        cursor: pointer;
        margin-right: 10px;
      }
      button:hover {
        background-color: #ff7a2a;
      }
    </style>
  `;

  const content = filteredRecipes.map((recipe, index) => `
    <div class="recipe">
      <h3>${recipe.name}</h3>
      ${recipe.image ? `<img src="${recipe.image}" alt="${recipe.name}">` : ''}
      <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
      <p><strong>Steps:</strong> ${recipe.steps}</p>
      <button onclick="editRecipe(${index})">Edit</button>
      <button onclick="deleteRecipe(${index})">Delete</button>
    </div>
  `).join('');

  const script = `
    <script>
      const recipes = JSON.parse(localStorage.getItem('recipes')) || [];

      function saveRecipes() {
        localStorage.setItem('recipes', JSON.stringify(recipes));
      }

      function editRecipe(index) {
        const recipe = recipes[index];
        const newName = prompt('Edit name:', recipe.name);
        const newIngredients = prompt('Edit ingredients:', recipe.ingredients);
        const newSteps = prompt('Edit steps:', recipe.steps);

        if (newName && newIngredients && newSteps) {
          recipes[index] = { ...recipe, name: newName, ingredients: newIngredients, steps: newSteps };
          saveRecipes();
          alert('Recipe updated successfully!');
          location.reload();
        }
      }

      function deleteRecipe(index) {
        if (confirm('Are you sure you want to delete this recipe?')) {
          recipes.splice(index, 1);
          saveRecipes();
          alert('Recipe deleted successfully!');
          location.reload();
        }
      }
    <\/script>
  `;

  newWindow.document.write(`<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Search Results</title>
    ${styles}
  </head>
  <body>
    ${content}
    ${script}
  </body>
  </html>`);

  newWindow.document.close();
}

// Add a new recipe
submitButton.addEventListener('click', () => {
  const name = nameInput.value.trim();
  const ingredients = ingredientsInput.value.trim();
  const steps = stepsInput.value.trim();
  const file = fileInput.files[0];

  if (!name || !ingredients || !steps) {
    alert('Please fill out all fields before submitting.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    const imageData = reader.result;
    recipes.push({ name, ingredients, steps, image: imageData });
    saveRecipes();
    alert('Recipe added successfully!');
    // Clear the form
    nameInput.value = '';
    ingredientsInput.value = '';
    stepsInput.value = '';
    fileInput.value = '';
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    recipes.push({ name, ingredients, steps, image: null });
    saveRecipes();
    alert('Recipe added successfully!');
    nameInput.value = '';
    ingredientsInput.value = '';
    stepsInput.value = '';
  }
});
