import Notiflix from 'notiflix';
import axios from 'axios';
import _ from 'lodash';
import { generateRecipeCard } from './all-cards-api';
const BASE_URL = 'https://tasty-treats-backend.p.goit.global/api/recipes';
const searchInput = document.querySelector('#id-input-search');
const recipeList = document.querySelector('.filter-card-set');
// full url function
function fullUrl(title) {
  const additionUrl = `?page=1&title=${title}&limit=6`;
  return BASE_URL + additionUrl;
}
// axios fetch url
async function fetchRecipes(keyword) {
  try {
    const response = await axios.get(fullUrl(keyword));
    const data = response.data;
    return data.results;
  } catch (error) {
    console.log(error);
    return error;
  }
}

// Функція для відображення рецептів з урахуванням обраних фільтрів
const recipesRender = async () => {
  const keyword = searchInput.value.trim().toLowerCase();

  const allRecipe = await fetchRecipes(keyword);

  return allRecipe;
};
async function getAllRecipes() {
  try {
    const results = await recipesRender();
    // if (results.lenght == 0) {
    //   Notiflix.Report.failure(
    //     'No recipes found matching the selected filters!'
    //   );
    // }
    const recipeCards = results.map(generateRecipeCard).join('');
    recipeList.innerHTML = recipeCards;

    // ---------------------------------------------------------------------------------------------------------------------------------------
    const heartCheckBoxEl = document.querySelectorAll('.card-checkbox'); // масив усіх інпутів чекбоксів

    let selectedHeartCheckBox = [];

    // Функція для обробки зміни стану чекбоксів
    function handleCheckboxChange(event) {
      const checkbox = event.target; // елемент на який клікаємо <input>
      console.log(checkbox);
      const checkboxId = checkbox.id;

      // дістати всю інформацію з картки за запушити її у масив

      if (checkbox.checked) {
        selectedHeartCheckBox.push(checkboxId);
      } else {
        // Перевіряємо, чи елемент міститься у списку вибраних перед тим, як його видалити
        const index = selectedHeartCheckBox.indexOf(checkboxId);
        if (index !== -1) {
          selectedHeartCheckBox.splice(index, 1);
        }
      }
      console.log(selectedHeartCheckBox); // правильно виводиться масив з даними

      const heartCheckBoxElLocalStorage = JSON.stringify(selectedHeartCheckBox);
      localStorage.setItem('inFavorite', heartCheckBoxElLocalStorage);
    }

    // Додаємо обробник подій для кожного чекбокса
    heartCheckBoxEl.forEach(checkbox => {
      checkbox.addEventListener('change', handleCheckboxChange);
    });

    // Перевіряємо, чи є збережені дані в локальному сховищі
    const storedData = localStorage.getItem('inFavorite');
    if (storedData) {
      // Розпарсуємо дані з локального сховища назад у масив
      selectedHeartCheckBox = JSON.parse(storedData);

      // Відновлюємо стан чекбоксів на основі збережених значень
      heartCheckBoxEl.forEach(checkbox => {
        const checkboxId = checkbox.id;
        if (selectedHeartCheckBox.includes(checkboxId)) {
          checkbox.checked = true;
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
}

// Обробник події для поля пошуку з використанням Debounce
if (searchInput) {
  searchInput.addEventListener(
    'input',
    _.debounce(async () => {
      await getAllRecipes();
    }, 300)
  );
}

// Обробники подій для селекторів часу, країни походження та інгредієнтів
// timeSelect.addEventListener('change', async () => {
//   await getAllRecipes();
// });

// areaSelect.addEventListener('change', async () => {
//   await getAllRecipes();
// });

// ingredientsSelect.addEventListener('change', async () => {
//   await getAllRecipes();
// });

// Виклик функції для відображення рецептів при завантаженні сторінки
