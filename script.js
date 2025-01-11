// DOM Elements
const searchButton = document.querySelector('.search-btn');
const searchInput = document.querySelector('.search');
const submitButton = document.querySelector('.submit');
const nameInput = document.querySelector('.name');
const ingredientsInput = document.querySelector('.ingredients');
const stepsInput = document.querySelector('.steps');
const fileInput = document.querySelector('.file');
const searchResults = document.getElementById('search-results');

// Load recipes from localStorage or initialize an empty array
const recipes = JSON.parse(localStorage.getItem('recipes')) || [];

// Save recipes to localStorage
function saveRecipes() {
  localStorage.setItem('recipes', JSON.stringify(recipes));
}

// Render search results in the same window
function renderSearchResults(filteredRecipes) {
  // Clear previous results
  searchResults.innerHTML = '';

  if (filteredRecipes.length === 0) {
    searchResults.innerHTML = '<p>No recipes found matching your search.</p>';
    return;
  }

  filteredRecipes.forEach((recipe, index) => {
    const recipeDiv = document.createElement('div');
    recipeDiv.classList.add('recipe');
    recipeDiv.innerHTML = `
      <h3>${recipe.name}</h3>
      <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
      <p><strong>Steps:</strong> ${recipe.steps}</p>
      ${recipe.image ? `<img src="${recipe.image}" alt="${recipe.name}" style="max-width: 100%; height: auto; border-radius: 4px;">` : ''}
      <button class="edit-btn" data-index="${index}">Edit</button>
      <button class="delete-btn" data-index="${index}">Delete</button>
    `;
    searchResults.appendChild(recipeDiv);
  });

  // Attach event listeners to buttons
  document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', () => editRecipe(button.dataset.index));
  });

  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', () => deleteRecipe(button.dataset.index));
  });
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

// Search recipes
searchButton.addEventListener('click', () => {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm) ||
    recipe.ingredients.toLowerCase().includes(searchTerm)
  );
  renderSearchResults(filteredRecipes);
});

// Edit a recipe
function editRecipe(index) {
  index = parseInt(index, 10); // Convert index to an integer
  const recipe = recipes[index];
  const newName = prompt('Edit name:', recipe.name);
  const newIngredients = prompt('Edit ingredients:', recipe.ingredients);
  const newSteps = prompt('Edit steps:', recipe.steps);

  if (newName && newIngredients && newSteps) {
    recipes[index] = { ...recipe, name: newName, ingredients: newIngredients, steps: newSteps };
    saveRecipes();
    alert('Recipe updated successfully!');
    renderSearchResults(recipes); // Refresh the displayed recipes
  }
}

// Delete a recipe
function deleteRecipe(index) {
  index = parseInt(index, 10); // Convert index to an integer
  if (confirm('Are you sure you want to delete this recipe?')) {
    recipes.splice(index, 1);
    saveRecipes();
    alert('Recipe deleted successfully!');
    renderSearchResults(recipes); // Refresh the displayed recipes
  }
}
