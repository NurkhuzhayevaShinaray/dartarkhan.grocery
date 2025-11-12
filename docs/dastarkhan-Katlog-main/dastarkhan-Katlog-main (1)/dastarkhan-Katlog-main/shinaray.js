

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const setText = (el, txt) => el && (el.textContent = txt);

  function initializeTheme() {
    const themeBtn = document.getElementById('theme-btn') || document.getElementById('themeToggle');
    const html = document.documentElement;
    const currentTheme = localStorage.getItem('theme') || 'light';

    document.body.style.transition = 'background-color 0.4s, color 0.4s';

    if (currentTheme === 'dark') {
      html.classList.add('dark-mode');
      document.body.classList.add('dark-mode');
      if (themeBtn) themeBtn.textContent = '☀️';
    } else {
      html.classList.remove('dark-mode');
      document.body.classList.remove('dark-mode');
      if (themeBtn) themeBtn.textContent = '🌙';
    }

    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        document.body.style.transition = 'background-color 0.4s, color 0.4s';
        const toLight = html.classList.contains('dark-mode');
        if (toLight) {
          html.classList.remove('dark-mode');
          document.body.classList.remove('dark-mode');
          localStorage.setItem('theme', 'light');
          themeBtn.textContent = '🌙';
        } else {
          html.classList.add('dark-mode');
          document.body.classList.add('dark-mode');
          localStorage.setItem('theme', 'dark');
          themeBtn.textContent = '☀️';
        }
      });
    }
  }

  function initializeNav() {
    const nav = document.querySelector('header nav');
    const burger = document.querySelector('.burger');

    if (!nav) return;
    nav.classList.add('nav-links');

    let links = $$('.nav-links a', nav);
    if (links.length === 0) links = $$('a', nav); 
    links.forEach(a => a.classList.add('nav-link'));

    const current = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    links.forEach(a => {
      const href = (a.getAttribute('href') || '').split('/').pop().toLowerCase();
      if (href === current) a.classList.add('active');
      else a.classList.remove('active');
    });

    if (burger) {
      burger.setAttribute('aria-expanded', 'false');
      burger.addEventListener('click', () => {
        const nowActive = !nav.classList.contains('active');
        nav.classList.toggle('active', nowActive);
        burger.setAttribute('aria-expanded', String(nowActive));
      });
    }

    links.forEach(a => {
      a.addEventListener('click', () => {
        if (nav.classList.contains('active')) {
          nav.classList.remove('active');
          if (burger) burger.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  function initializeSalesPage() {
    const page = (document.title || '').toLowerCase();
    if (!page.includes('скидки') && !page.includes('sales')) return;

    const subscribeBtn = document.getElementById('subscribeBtn');
    const subscriptionFormContainer = document.getElementById('subscriptionForm');
    const subscriptionFormWrapper = document.querySelector('.subscription-form-container');

    if (subscribeBtn && subscriptionFormContainer) {
      const formState = { name: '', email: '' };
      let currentStep = 0;

      const steps = [
        {
          title: 'Шаг 1: Ваше имя',
          render() {
            const wrap = document.createElement('div');
            wrap.className = 'form-step';
            wrap.innerHTML = `
              <h4>Как вас зовут?</h4>
              <input type="text" id="name" placeholder="Введите ваше имя" required>
            `;
            queueMicrotask(() => {
              const input = $('#name', wrap);
              if (input) {
                input.value = formState.name || '';
                input.focus();
              }
            });
            return wrap;
          },
          validate() {
            const input = document.getElementById('name');
            const val = (input?.value || '').trim();
            if (!val) { alert('Пожалуйста, введите ваше имя'); return false; }
            formState.name = val;
            return true;
          }
        },
        {
          title: 'Шаг 2: Ваш email',
          render() {
            const wrap = document.createElement('div');
            wrap.className = 'form-step';
            wrap.innerHTML = `
              <h4>Ваш email для уведомлений</h4>
              <input type="email" id="email" placeholder="Введите ваш email" required>
            `;
            queueMicrotask(() => {
              const input = $('#email', wrap);
              if (input) {
                input.value = formState.email || '';
                input.focus();
              }
            });
            return wrap;
          },
          validate() {
            const input = document.getElementById('email');
            const val = (input?.value || '').trim();
            const simpleEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!val) { alert('Пожалуйста, введите ваш email'); return false; }
            if (!simpleEmail.test(val)) { alert('Похоже, email введён некорректно'); return false; }
            formState.email = val;
            return true;
          }
        },
        {
          title: 'Шаг 3: Подтверждение подписки',
          render() {
            const wrap = document.createElement('div');
            wrap.className = 'form-step';
            wrap.innerHTML = `
              <h4>Подтвердите подписку</h4>
              <p>Нажмите кнопку ниже, чтобы завершить подписку на уведомления о скидках</p>
              <div class="form-controls">
                <button type="button" id="confirmBtn">Подтвердить подписку</button>
              </div>
            `;
            return wrap;
          },
          validate() { return true; }
        }
      ];

      function renderStep() {
        const step = steps[currentStep];
        subscriptionFormContainer.innerHTML = '';

        const title = document.createElement('h4');
        title.textContent = step.title;
        subscriptionFormContainer.appendChild(title);

        const content = step.render();
        subscriptionFormContainer.appendChild(content);

        const controls = document.createElement('div');
        controls.className = 'form-controls';

        if (currentStep > 0) {
          const backBtn = document.createElement('button');
          backBtn.type = 'button';
          backBtn.id = 'backBtn';
          backBtn.textContent = 'Назад';
          backBtn.addEventListener('click', () => {
            currentStep = Math.max(0, currentStep - 1);
            renderStep();
          });
          controls.appendChild(backBtn);
        }

        if (currentStep < steps.length - 1) {
          const nextBtn = document.createElement('button');
          nextBtn.type = 'button';
          nextBtn.id = 'nextBtn';
          nextBtn.textContent = 'Далее';
          nextBtn.addEventListener('click', () => {
            if (!steps[currentStep].validate()) return;
            currentStep++;
            renderStep();
          });
          controls.appendChild(nextBtn);
        } else {
          const confirmBtn = document.createElement('button');
          confirmBtn.type = 'button';
          confirmBtn.id = 'confirmBtn';
          confirmBtn.textContent = 'Подтвердить подписку';
          confirmBtn.addEventListener('click', confirmSubscription);
          controls.appendChild(confirmBtn);
        }

        subscriptionFormContainer.appendChild(controls);
      }

      function confirmSubscription() {
        if (!steps[0].validate() || !steps[1].validate()) return;

        subscriptionFormContainer.innerHTML = `
          <div style="text-align:center;padding:20px;">
            <i class="fas fa-check-circle" style="font-size:48px;color:#4CAF50;margin-bottom:15px;"></i>
            <h4 style="color:#4CAF50;">Подписка успешно оформлена!</h4>
            <p id="thanksP"></p>
          </div>
        `;
        const thanks = document.getElementById('thanksP');
        setText(thanks, `Спасибо, ${formState.name}! Теперь вы будете получать уведомления на ${formState.email}`);
      }

      subscribeBtn.addEventListener('click', () => {
        currentStep = 0;
        renderStep();
        if (subscriptionFormWrapper) {
          subscriptionFormWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        subscribeBtn.style.transform = 'scale(0.95)';
        setTimeout(() => (subscribeBtn.style.transform = 'scale(1)'), 200);
      });

      renderStep();
    }

    const saleTimerBtn = document.getElementById('saleTimerBtn');
    const timeDisplay  = document.getElementById('timeDisplay');

    if (saleTimerBtn && timeDisplay) {
      let timerIntervalId = null;
      let saleEndTime = null;

      function stopTimer() {
        if (timerIntervalId) {
          clearInterval(timerIntervalId);
          timerIntervalId = null;
        }
      }

      function updateTimer() {
        const now = new Date();
        const timeLeft = saleEndTime - now;

        if (timeLeft <= 0) {
          stopTimer();
          setText(timeDisplay, 'Акция завершена!');
          return;
        }

        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        timeDisplay.textContent =
          `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
      }

      saleTimerBtn.addEventListener('click', () => {
        const visible = timeDisplay.style.display === 'block';
        if (visible) {
          timeDisplay.style.display = 'none';
          timeDisplay.classList.remove('show');
          stopTimer();
          return;
        }

        timeDisplay.style.display = 'block';
        timeDisplay.classList.add('show');

        saleEndTime = new Date(Date.now() + 5 * 60 * 60 * 1000);
        stopTimer();
        updateTimer();
        timerIntervalId = setInterval(updateTimer, 1000);
      });
    }

    const filterLinks = document.querySelectorAll('.sidebar a[data-filter]');
    filterLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const filterValue = link.getAttribute('data-filter');
        filterSalesItems(filterValue);

        filterLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });

    function filterSalesItems(filter) {
      const saleBanners = document.querySelectorAll('.sale-banner');
      saleBanners.forEach(banner => {
        const raw = banner.getAttribute('data-discount');
        const discount = Number.parseInt(raw, 10);
        let show = true;

        if (Number.isNaN(discount)) {
          show = false;
        } else if (filter === 'super') {
          show = discount >= 50;
        } else if (filter && filter !== 'all') {
          const maxDiscount = Number.parseInt(filter, 10);
          show = discount <= maxDiscount;
        }

        banner.style.display = show ? 'flex' : 'none';
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initializeTheme();
    initializeNav();
    initializeSalesPage();
  });

  window.initializeTheme = initializeTheme;
  window.initializeNav = initializeNav;
  window.initializeSalesPage = initializeSalesPage;
})();
