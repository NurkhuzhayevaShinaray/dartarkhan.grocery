document.addEventListener("DOMContentLoaded", () => {


  const details = document.querySelectorAll("details");
  details.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        details.forEach((el) => {
          if (el !== item) el.removeAttribute("open");
        });
      }
    });
  });

 
  function updateDateTime() {
    const now = new Date();
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    const formattedDate = now.toLocaleString("ru-RU", options);
    const dateElement = document.getElementById("datetime");
    if (dateElement) {
      dateElement.textContent = `Текущие дата и время: ${formattedDate}`;
    }
  }
  setInterval(updateDateTime, 1000);
  updateDateTime();

  
  const body = document.body;
  const header = document.querySelector("header");
  const footer = document.querySelector("footer");
  const themeBtn = document.getElementById("themeToggle");

  let currentMode = localStorage.getItem("mode") || "light";
  if (currentMode === "dark") {
    body.classList.add("dark-mode");
    if (header) header.style.backgroundColor = "#1a1a1a";
    if (footer) footer.style.backgroundColor = "#1a1a1a";
    updateDetailsDarkMode(true);
  }

  function updateThemeIcon() {
    if (!themeBtn) return;
    themeBtn.textContent = body.classList.contains("dark-mode") ? "☀️" : "🌙";
  }
  updateThemeIcon();

  function updateDetailsDarkMode(isDark) {
    const bg = isDark ? "rgba(30,30,30,0.8)" : "rgba(0,0,0,0.6)";
    const textColor = isDark ? "#f0f0f0" : "#fff";
    details.forEach((d) => {
      d.style.background = bg;
      const summary = d.querySelector("summary");
      const paragraph = d.querySelector("p");
      if (summary) summary.style.color = "#ffd700";
      if (paragraph) paragraph.style.color = textColor;
    });
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      body.classList.toggle("dark-mode");

      const isDark = body.classList.contains("dark-mode");
      if (header) header.style.backgroundColor = isDark ? "#1a1a1a" : "darkgreen";
      if (footer) footer.style.backgroundColor = isDark ? "#1a1a1a" : "darkgreen";

      updateDetailsDarkMode(isDark);

      localStorage.setItem("mode", isDark ? "dark" : "light");
      updateThemeIcon();
    });
  }


  document.querySelectorAll(".icon").forEach((icon) => {
    icon.addEventListener("mouseenter", () => { 
      icon.style.transform = "scale(1.3) rotate(5deg)"; 
    });
    icon.addEventListener("mouseleave", () => { 
      icon.style.transform = "scale(1) rotate(0deg)"; 
    });
  });


  document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      event.preventDefault(); 
      const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
      body.style.backgroundColor = randomColor;
      
      
      body.style.transition = "background-color 0.5s ease";
      setTimeout(() => {
        body.style.transition = "";
      }, 500);
    }
  });


  const submitBtn = document.getElementById("submitName");
  const nameInput = document.getElementById("nameInput");
  const greetingText = document.getElementById("greetingText");

  if (submitBtn && nameInput && greetingText) {
    submitBtn.addEventListener("click", () => {
      const userName = nameInput.value.trim();
      if (userName === "") { 
        alert("Пожалуйста, введите ваше имя"); 
        return; 
      }


      if (userName.length < 2) {
        alert("Имя должно содержать минимум 2 символа");
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Пожалуйста, подождите...';

      setTimeout(() => {
        submitBtn.innerHTML = "✅ Отправлено!";
        greetingText.textContent = `Здравствуйте, ${userName}!`;
        
        
        localStorage.setItem('userName', userName);
        localStorage.setItem('lastGreeting', new Date().toISOString());
        

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = "Отправить";
          nameInput.value = "";
        }, 1500);
      }, 2000);
    });
  }

  
  const showTimeBtn = document.getElementById("showTimeBtn");
  const currentTime = document.getElementById("currentTime");
  if (showTimeBtn && currentTime) {
    showTimeBtn.addEventListener("click", () => {
      const now = new Date();
      currentTime.textContent = `⏰ Текущее время: ${now.toLocaleTimeString('ru-RU')}`;
      
      currentTime.style.opacity = '0';
      currentTime.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        currentTime.style.transition = 'all 0.3s ease';
        currentTime.style.opacity = '1';
        currentTime.style.transform = 'translateY(0)';
      }, 10);
    });
  }

 
  const stars = document.querySelectorAll("#rating span");
  if (stars.length) {
    stars.forEach((star, index) => {
      star.addEventListener("click", () => {
        stars.forEach((s, i) => s.classList.toggle("active", i <= index));
        
        const rating = index + 1;
        localStorage.setItem('userRating', rating);
        
   
        const ratingText = document.getElementById('ratingResult');
        if (ratingText) {
          ratingText.textContent = `Ваша оценка: ${rating} из 5 ⭐️`;
          ratingText.style.color = '#ffd700';
        }
      });
      
   
      star.addEventListener("mouseenter", () => {
        star.style.transform = "scale(1.3)";
      });
      star.addEventListener("mouseleave", () => {
        star.style.transform = "scale(1)";
      });
    });
    

    const savedRating = localStorage.getItem('userRating');
    if (savedRating) {
      stars.forEach((s, i) => {
        if (i < savedRating) {
          s.classList.add('active');
        }
      });
    }
  }


  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollTopBtn.style.display = 'block';
        scrollTopBtn.style.opacity = '1';
      } else {
        scrollTopBtn.style.opacity = '0';
        setTimeout(() => {
          if (window.scrollY <= 300) {
            scrollTopBtn.style.display = 'none';
          }
        }, 300);
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  function updateVisitorCount() {
    let visits = localStorage.getItem('pageVisits');
    visits = visits ? parseInt(visits) + 1 : 1;
    localStorage.setItem('pageVisits', visits);
    
    const visitCounter = document.getElementById('visitCounter');
    if (visitCounter) {
      visitCounter.textContent = `👥 Визитов: ${visits}`;
    }
  }
  updateVisitorCount();

  const lastVisit = localStorage.getItem('lastVisit');
  const welcomeMsg = document.getElementById('welcomeMessage');
  
  if (welcomeMsg) {
    if (lastVisit) {
      const lastDate = new Date(lastVisit);
      const now = new Date();
      const hoursDiff = Math.floor((now - lastDate) / (1000 * 60 * 60));
      
      if (hoursDiff < 24) {
        welcomeMsg.textContent = `Добро пожаловать снова! Вы были здесь ${hoursDiff} ч. назад`;
      } else {
        welcomeMsg.textContent = 'С возвращением! Рады видеть вас снова!';
      }
    } else {
      welcomeMsg.textContent = 'Добро пожаловать на наш сайт!';
    }
  }
  
  localStorage.setItem('lastVisit', new Date().toISOString());
  

  document.querySelectorAll('button, .btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-effect');
      
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });

  console.log('%c🍽 Добро пожаловать в Dastarkhan!', 'color: #ffd700; font-size: 20px; font-weight: bold;');
  console.log('%cМы рады видеть вас на нашем сайте!', 'color: #4CAF50; font-size: 14px;');
  console.log('%c💡 Совет: нажмите Space для смены фона!', 'color: #2196F3; font-size: 12px;');

});