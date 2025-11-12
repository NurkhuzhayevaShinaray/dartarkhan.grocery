
function initializeTheme() {
  const themeBtn = document.getElementById('theme-btn');
  const html = document.documentElement;
  const body = document.body;
  const currentTheme = localStorage.getItem('theme') || 'light';

  body.style.transition = 'background-color 0.4s, color 0.4s';

  const apply = (mode) => {
    const isDark = mode === 'dark';
    html.classList.toggle('dark-mode', isDark);
    body.classList.toggle('dark-mode', isDark);
    if (themeBtn) themeBtn.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  apply(currentTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      apply(html.classList.contains('dark-mode') ? 'light' : 'dark');
    });
  }
}

function initializeNav() {
  const nav = document.querySelector('header nav');
  const burger = document.querySelector('.burger');
  if (!nav) return;

  // class used by your media CSS
  nav.classList.add('nav-links');

  // active link
  const links = Array.from(nav.querySelectorAll('a'));
  const current = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  links.forEach((a) => {
    a.classList.add('nav-link');
    const href = (a.getAttribute('href') || '').split('/').pop().toLowerCase();
    a.classList.toggle('active', href === current);
  });

  // burger toggle
  if (burger) {
    burger.setAttribute('aria-expanded', 'false');
    burger.addEventListener('click', () => {
      const nowActive = !nav.classList.contains('active');
      nav.classList.toggle('active', nowActive);
      burger.setAttribute('aria-expanded', String(nowActive));
    });

    links.forEach((a) => {
      a.addEventListener('click', () => {
        if (nav.classList.contains('active')) {
          nav.classList.remove('active');
          burger.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }
}

let cartCount = 0;
let cartTotal = 0;

function initializeCart() {
  const savedCart = JSON.parse(localStorage.getItem('cart')) || { count: 0, total: 0 };
  cartCount = savedCart.count;
  cartTotal = savedCart.total;
  updateCartDisplay();

  document.querySelectorAll('.product-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const productCard = e.target.closest('.product');
      const name = productCard.querySelector('h4').textContent;

      // Parse price like "1 180 KZT/кг" -> 1180
      const priceText = productCard.querySelector('.price').textContent;
      const price = parseInt(priceText.replace(/[^\d]/g, ''), 10);

      const quantity = parseInt(form.querySelector('input[type="number"]').value, 10) || 1;
      addToCart(name, price, quantity);
    });
  });

  const checkoutBtn = document.querySelector('.checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cartCount === 0) {
        alert('Корзина пуста!');
        return;
      }
      alert(`Заказ оформлен! Сумма: ${cartTotal} KZT`);
      clearCart();
    });
  }
}

function addToCart(name, price, quantity) {
  cartCount += quantity;
  cartTotal += price * quantity;
  updateCartDisplay();
  saveCartToStorage();
  showCartNotification(name, quantity);
}

function updateCartDisplay() {
  const c = document.getElementById('cartCount');
  const t = document.getElementById('cartTotal');
  if (c) c.textContent = cartCount;
  if (t) t.textContent = cartTotal;
}

function showCartNotification(name, quantity) {
  const note = document.createElement('div');
  note.className = 'cart-notification';
  note.innerHTML = `<i class="fas fa-check-circle"></i> Добавлено: ${quantity} × ${name}`;
  Object.assign(note.style, {
    position: 'fixed', bottom: '20px', right: '20px',
    background: '#4CAF50', color: 'white', padding: '10px 15px',
    borderRadius: '6px', opacity: '0', transition: 'opacity 0.3s, transform 0.3s',
    transform: 'translateY(20px)', zIndex: '9999'
  });
  document.body.appendChild(note);
  setTimeout(() => { note.style.opacity = '1'; note.style.transform = 'translateY(0)'; }, 50);
  setTimeout(() => {
    note.style.opacity = '0';
    setTimeout(() => note.remove(), 300);
  }, 2500);
}

function saveCartToStorage() {
  localStorage.setItem('cart', JSON.stringify({ count: cartCount, total: cartTotal }));
}

function clearCart() {
  cartCount = 0;
  cartTotal = 0;
  updateCartDisplay();
  saveCartToStorage();
}

function initializeStarRating() {
  document.querySelectorAll('.stars').forEach((wrap) => {
    const stars = wrap.querySelectorAll('span');
    stars.forEach((star, index) => {
      star.addEventListener('click', () => {
        stars.forEach((s, i) => { s.style.color = i <= index ? 'gold' : 'gray'; });
        const product = wrap.closest('.product').querySelector('h4').textContent;
        const ratings = JSON.parse(localStorage.getItem('ratings') || '{}');
        ratings[product] = index + 1;
        localStorage.setItem('ratings', JSON.stringify(ratings));
      });
    });
  });
}

function initializeFormValidation() {
  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      let valid = true;
      form.querySelectorAll('input[required]').forEach((input) => {
        if (!input.value.trim()) {
          input.style.borderColor = 'red';
          valid = false;
        } else input.style.borderColor = '';
      });
      if (!valid) {
        e.preventDefault();
        alert('Пожалуйста, заполните все обязательные поля.');
      }
    });
  });
}

function initializeCatalogPage() {
  const page = document.title.toLowerCase();
  if (!page.includes('каталог') && !page.includes('catalog')) return;

  const searchInput = document.getElementById('searchInput');
  const suggestionsId = 'suggestions';
  let suggestions = document.getElementById(suggestionsId);

  if (searchInput && !suggestions) {
    suggestions = document.createElement('ul');
    suggestions.id = suggestionsId;
    suggestions.className = 'suggestions';
    searchInput.insertAdjacentElement('afterend', suggestions);
  }

  function runProductSearch(term) {
    if (!suggestions) return;
    suggestions.innerHTML = '';
    const products = document.querySelectorAll('.product');

    products.forEach((prod) => {
      const nameEl = prod.querySelector('h4');
      const name = nameEl.textContent.toLowerCase();
      const show = term ? name.includes(term) : true;
      prod.style.display = show ? 'block' : 'none';

      if (term && show) {
        const li = document.createElement('li');
        li.className = 'suggest-item';
        li.textContent = nameEl.textContent;
        li.addEventListener('click', () => {
          searchInput.value = li.textContent;
          suggestions.innerHTML = '';
          prod.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        suggestions.appendChild(li);
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('keyup', () => {
      runProductSearch(searchInput.value.toLowerCase().trim());
    });
  }

  const searchBtnProducts = document.querySelector('.search-form button');
  if (searchBtnProducts && searchInput) {
    searchBtnProducts.addEventListener('click', () => {
      runProductSearch(searchInput.value.toLowerCase().trim());
    });
  }

  const applyFilter = document.getElementById('applyFilter');
  if (applyFilter) {
    applyFilter.addEventListener('click', () => {
      const category = document.getElementById('categoryFilter').value;
      const maxPrice = parseInt(document.getElementById('priceFilter').value, 10);

      document.querySelectorAll('.product').forEach((prod) => {
        const name = prod.querySelector('h4').textContent.toLowerCase();
        const priceText = prod.querySelector('.price').textContent;
        const price = parseInt(priceText.replace(/[^\d]/g, ''), 10);
        let show = true;

        if (category === 'fruits' && !['бананы','апельсины','яблоки','арбузы'].some(f => name.includes(f))) show = false;
        if (category === 'vegetables' && !['картофель','морковь','помидоры','огурцы'].some(v => name.includes(v))) show = false;
        if (category === 'dairy' && !['молоко','сметана','творог','сыр'].some(d => name.includes(d))) show = false;
        if (Number.isFinite(maxPrice) && price > maxPrice) show = false;

        prod.style.display = show ? 'block' : 'none';
      });
    });
  }

  document.querySelectorAll('.product').forEach((prod) => {
    prod.style.opacity = '0';
    setTimeout(() => {
      prod.style.transition = 'opacity 0.8s';
      prod.style.opacity = '1';
    }, 100);

    prod.addEventListener('mouseenter', () => prod.style.transform = 'scale(1.05)');
    prod.addEventListener('mouseleave', () => prod.style.transform = 'scale(1)');
    prod.addEventListener('dblclick', () => {
      prod.style.backgroundColor = '#e8ffe8';
      setTimeout(() => prod.style.backgroundColor = '', 600);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'c') {
      clearCart();
      const msg = document.createElement('p');
      msg.textContent = 'Корзина очищена!';
      Object.assign(msg.style, {
        position: 'fixed', bottom: '20px', right: '20px',
        background: '#4CAF50', color: 'white', padding: '10px 15px',
        borderRadius: '6px', zIndex: '9999'
      });
      document.body.appendChild(msg);
      setTimeout(() => msg.remove(), 2000);
    }
  });
}

function wireFoodSearch() {
  const searchBtn = document.getElementById('searchMeal');
  const mealResult = document.getElementById('mealResult');
  const mealInput = document.getElementById('mealSearch');

  if (!searchBtn || !mealResult || !mealInput) return;

  searchBtn.addEventListener('click', async () => {
    const query = mealInput.value.trim();
    if (!query) { mealResult.innerHTML = '<p>Введите название блюда!</p>'; return; }

    mealResult.innerHTML = '<p>Поиск рецептов...</p>';
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (!data.meals) { mealResult.innerHTML = '<p>Рецепты не найдены.</p>'; return; }
      displayMeals(data.meals, mealResult);
    } catch {
      mealResult.innerHTML = '<p>Ошибка при загрузке данных.</p>';
    }
  });

  // inject minimal CSS once
  if (!document.getElementById('meal-css')) {
    const css = `
      .meals-container { display:grid; grid-template-columns:repeat(auto-fill, minmax(250px,1fr)); gap:15px; margin:15px 0; }
      .meal-card { background:#fff; padding:15px; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.1); text-align:center; }
      .meal-card img { width:100%; height:150px; object-fit:cover; border-radius:5px; }
      .meal-card h4 { margin:10px 0 5px; color:#2c5530; }
      .meal-card button { background:#4CAF50; color:#fff; border:none; padding:8px 15px; border-radius:4px; cursor:pointer; margin-top:10px; }
      .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.7); display:flex; justify-content:center; align-items:center; z-index:1000; padding:20px; }
      .modal-content { background:#fff; padding:20px; border-radius:8px; max-width:500px; max-height:80vh; overflow-y:auto; position:relative; }
      .close { position:absolute; top:10px; right:15px; font-size:24px; cursor:pointer; }
      .modal-content img { width:100%; max-height:200px; object-fit:cover; border-radius:5px; margin-bottom:15px; }
    `;
    const style = document.createElement('style');
    style.id = 'meal-css';
    style.textContent = css;
    document.head.appendChild(style);
  }
}

function displayMeals(meals, mount) {
  mount.innerHTML = `
    <h3>Найдено рецептов: ${meals.length}</h3>
    <div class="meals-container">
      ${meals.map(meal => `
        <div class="meal-card">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <h4>${meal.strMeal}</h4>
          <p>${meal.strCategory} • ${meal.strArea}</p>
          <button data-id="${meal.idMeal}">Рецепт</button>
        </div>
      `).join('')}
    </div>
  `;
  mount.querySelectorAll('.meal-card button').forEach(btn => {
    btn.addEventListener('click', () => showRecipe(btn.dataset.id));
  });
}

async function showRecipe(mealId) {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    const data = await response.json();
    if (data.meals) showRecipeModal(data.meals[0]);
  } catch {
    alert('Ошибка загрузки рецепта');
  }
}

function showRecipeModal(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ing && ing.trim()) ingredients.push(`${measure} ${ing}`);
  }

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close" onclick="this.closest('.modal-overlay').remove()">&times;</span>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <h2>${meal.strMeal}</h2>
      <p><strong>${meal.strCategory} • ${meal.strArea}</strong></p>
      <h3>Ингредиенты:</h3>
      <ul>${ingredients.map(ing => `<li>${ing}</li>`).join('')}</ul>
      <h3>Инструкции:</h3>
      <p>${meal.strInstructions}</p>
      ${meal.strYoutube ? `<a href="${meal.strYoutube}" target="_blank">📺 Видео рецепт</a>` : ''}
    </div>
  `;
  document.body.appendChild(modal);
}

document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  initializeNav();
  initializeCart();
  initializeStarRating();
  initializeFormValidation();
  initializeCatalogPage();
  wireFoodSearch();
});
