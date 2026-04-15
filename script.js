/* ============================================
   7 CORE – BTS Fan Website Scripts
   ============================================ */

   document.addEventListener('DOMContentLoaded', () => {

    /* ---------- Custom Cursor ---------- */
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursorFollower');
  
    if (cursor && cursorFollower && window.matchMedia('(hover: hover)').matches) {
      let mouseX = 0, mouseY = 0;
      let followerX = 0, followerY = 0;
  
      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
      });
  
      function animateFollower() {
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        requestAnimationFrame(animateFollower);
      }
      animateFollower();
  
      // Enlarge on hover over interactive elements
      const hoverTargets = document.querySelectorAll('a, button, .member-card, .album-card, .milestone');
      hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursorFollower.style.width = '50px';
          cursorFollower.style.height = '50px';
          cursorFollower.style.borderColor = 'rgba(229, 9, 20, 0.5)';
        });
        el.addEventListener('mouseleave', () => {
          cursorFollower.style.width = '32px';
          cursorFollower.style.height = '32px';
          cursorFollower.style.borderColor = '';
        });
      });
    }
  
    /* ---------- Hero Particles ---------- */
    const heroParticles = document.getElementById('heroParticles');
    if (heroParticles) {
      for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (6 + Math.random() * 6) + 's';
        particle.style.width = (2 + Math.random() * 4) + 'px';
        particle.style.height = particle.style.width;
        heroParticles.appendChild(particle);
      }
    }
  
    /* ---------- Navbar Scroll Effect ---------- */
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
  
    function handleScroll() {
      const scrollY = window.scrollY;
  
      // Navbar background
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
  
      // Back to top button
      if (scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
  
      // Active nav link based on scroll position
      updateActiveNavLink();
    }
  
    window.addEventListener('scroll', handleScroll, { passive: true });
  
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  
    /* ---------- Mobile Navigation ---------- */
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
  
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
  
    // Close mobile nav on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  
    /* ---------- Active Nav Link ---------- */
    function updateActiveNavLink() {
      const sections = document.querySelectorAll('section[id]');
      const navLinkEls = document.querySelectorAll('.nav-link');
      let current = '';
  
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute('id');
        }
      });
  
      navLinkEls.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    }
  
    /* ---------- Scroll Animations ---------- */
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
  
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
  
          // Trigger counter animations
          if (entry.target.querySelector('.hero-stat-number') || 
              entry.target.classList.contains('achievement-card')) {
            animateCounters(entry.target);
          }
        }
      });
    }, observerOptions);
  
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      scrollObserver.observe(el);
    });
  
    /* ---------- Counter Animation ---------- */
    const animatedCounters = new Set();
  
    function animateCounters(container) {
      let counters;
      if (container.classList.contains('achievement-card')) {
        counters = [container.querySelector('.achievement-number')];
      } else {
        counters = container.querySelectorAll('.hero-stat-number');
      }
  
      counters.forEach(counter => {
        if (!counter || animatedCounters.has(counter)) return;
        animatedCounters.add(counter);
  
        const target = parseInt(counter.getAttribute('data-target'));
        if (isNaN(target)) return;
  
        const duration = 2000;
        const startTime = performance.now();
  
        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(eased * target);
          counter.textContent = current;
  
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target;
          }
        }
  
        requestAnimationFrame(updateCounter);
      });
    }
  
    /* ---------- Discography Tabs ---------- */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
  
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
  
        // Update active button
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
  
        // Update active content
        tabContents.forEach(content => content.classList.remove('active'));
        const targetContent = document.getElementById('tab-' + tabId);
        if (targetContent) {
          targetContent.classList.add('active');
          // Re-observe animations for new tab content
          targetContent.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.classList.remove('visible');
            scrollObserver.observe(el);
          });
          // Force visible after short delay for tab content
          setTimeout(() => {
            targetContent.querySelectorAll('.animate-on-scroll').forEach(el => {
              el.classList.add('visible');
            });
          }, 100);
        }
      });
    });
  
    /* ---------- BTS Quote Generator ---------- */
    const quotes = [
      { text: "Life is tough, and things don't always work out well, but we should be brave and go on with our lives.", author: "Suga" },
      { text: "If you don't work hard, there won't be good results.", author: "RM" },
      { text: "I'm the one I should love in this world.", author: "Jin" },
      { text: "I can make it right — we can make it right.", author: "J-Hope" },
      { text: "Don't be trapped in someone else's dream.", author: "V" },
      { text: "I still have a long way to go, but I'm not going to stop.", author: "Jimin" },
      { text: "Effort makes you. You get frustrated and you become better.", author: "Jungkook" },
      { text: "No matter who you are, where you're from, your skin color, gender identity — speak yourself.", author: "RM (UN Speech)" },
      { text: "The only time you should ever look back is to see how far you've come.", author: "Jin" },
      { text: "When we don't have a goal, even when we win, we don't feel anything.", author: "Suga" },
      { text: "It's not an easy path, but I chose it. So I must endure it.", author: "J-Hope" },
      { text: "Love yourself, speak yourself.", author: "RM" },
      { text: "If I'm the sun, you're the moon. I'm ARMY's sun, ARMY is my moon.", author: "V" },
      { text: "We are not perfect, but that's what makes us BTS.", author: "Jimin" },
      { text: "I'd rather die than live without passion.", author: "Suga" },
    ];
  
    const quoteText = document.getElementById('quoteText');
    const quoteAuthor = document.getElementById('quoteAuthor');
    const newQuoteBtn = document.getElementById('newQuoteBtn');
  
    let lastQuoteIndex = -1;
  
    newQuoteBtn.addEventListener('click', () => {
      let index;
      do {
        index = Math.floor(Math.random() * quotes.length);
      } while (index === lastQuoteIndex);
      lastQuoteIndex = index;
  
      const quote = quotes[index];
      quoteText.style.opacity = 0;
      quoteAuthor.style.opacity = 0;
  
      setTimeout(() => {
        quoteText.textContent = '"' + quote.text + '"';
        quoteAuthor.textContent = '— ' + quote.author;
        quoteText.style.opacity = 1;
        quoteAuthor.style.opacity = 1;
      }, 300);
    });
  
    quoteText.style.transition = 'opacity 0.3s ease';
    quoteAuthor.style.transition = 'opacity 0.3s ease';
  
    /* ---------- Which Member Are You ---------- */
    const memberProfiles = [
      { name: "RM", trait: "You're a natural leader with a brilliant mind. You think deeply and inspire others with your words." },
      { name: "Jin", trait: "You're the life of the party — confident, funny, and incredibly caring. Worldwide Handsome energy!" },
      { name: "Suga", trait: "You're a creative genius with a passion that burns quietly. Your dedication and honesty inspire everyone around you." },
      { name: "J-Hope", trait: "You radiate sunshine! Your energy is infectious, your talent is boundless, and you make everyone around you smile." },
      { name: "Jimin", trait: "You're a perfectionist with a heart of gold. Your dedication to your craft and your caring nature make you truly special." },
      { name: "V", trait: "You're a unique soul — artistic, charming, and unapologetically yourself. The world sees your magic!" },
      { name: "Jungkook", trait: "You're the Golden one — talented at everything you try, driven, and endlessly improving. The sky's the limit!" },
    ];
  
    const revealMemberBtn = document.getElementById('revealMemberBtn');
    const memberResult = document.getElementById('memberResult');
    const memberResultName = document.getElementById('memberResultName');
    const memberResultTrait = document.getElementById('memberResultTrait');
  
    revealMemberBtn.addEventListener('click', () => {
      const profile = memberProfiles[Math.floor(Math.random() * memberProfiles.length)];
      
      memberResult.style.display = 'block';
      memberResultName.textContent = profile.name;
      memberResultTrait.textContent = profile.trait;
      
      // Reset animation
      memberResult.style.animation = 'none';
      memberResult.offsetHeight; // Trigger reflow
      memberResult.style.animation = 'fadeIn 0.5s ease';
      
      revealMemberBtn.textContent = 'Try Again 🔄';
    });
  
    /* ---------- ARMY Pledge Counter ---------- */
    const pledgeBtn = document.getElementById('pledgeBtn');
    const armyCount = document.getElementById('armyCount');
    let currentCount = 7492381;
    let hasPledged = false;
  
    // Format number with commas
    function formatNumber(num) {
      return num.toLocaleString('en-US');
    }
  
    pledgeBtn.addEventListener('click', () => {
      if (!hasPledged) {
        currentCount++;
        hasPledged = true;
        armyCount.textContent = formatNumber(currentCount);
        pledgeBtn.textContent = '💜 You pledged!';
        pledgeBtn.style.background = 'linear-gradient(135deg, #8B5CF6, #E50914)';
  
        // Add a brief animation
        armyCount.style.transform = 'scale(1.2)';
        setTimeout(() => {
          armyCount.style.transform = 'scale(1)';
        }, 300);
      } else {
        // Simulate others pledging
        const addition = Math.floor(Math.random() * 5) + 1;
        currentCount += addition;
        armyCount.textContent = formatNumber(currentCount);
      }
    });
  
    armyCount.style.transition = 'transform 0.3s ease';
  
    /* ---------- BTS Trivia Quiz ---------- */
    const triviaQuestions = [
      {
        question: "What does BTS stand for?",
        options: ["Beyond The Scene", "Bangtan Sonyeondan", "Both A and B", "Boys That Sing"],
        correct: 2
      },
      {
        question: "Which member is known as the 'Golden Maknae'?",
        options: ["Jimin", "V", "Jungkook", "J-Hope"],
        correct: 2
      },
      {
        question: "What was BTS's debut single?",
        options: ["No More Dream", "2 Cool 4 Skool", "N.O", "We Are Bulletproof"],
        correct: 0
      },
      {
        question: "Which BTS song was their first #1 on the Billboard Hot 100?",
        options: ["Boy With Luv", "Dynamite", "Butter", "Savage Love"],
        correct: 1
      },
      {
        question: "What is the name of BTS's fandom?",
        options: ["Blinks", "ARMY", "Carat", "Once"],
        correct: 1
      },
      {
        question: "Who is the leader of BTS?",
        options: ["Jin", "Suga", "J-Hope", "RM"],
        correct: 3
      },
      {
        question: "Which member's solo name is 'Agust D'?",
        options: ["RM", "J-Hope", "Suga", "Jimin"],
        correct: 2
      },
      {
        question: "In what year did BTS debut?",
        options: ["2011", "2012", "2013", "2014"],
        correct: 2
      },
      {
        question: "Which BTS album features 'Spring Day'?",
        options: ["Wings", "You Never Walk Alone", "Love Yourself: Her", "Dark & Wild"],
        correct: 1
      },
      {
        question: "What is RM's real name?",
        options: ["Kim Seok-jin", "Kim Nam-joon", "Min Yoon-gi", "Jung Ho-seok"],
        correct: 1
      },
    ];
  
    const questionText = document.getElementById('questionText');
    const triviaOptions = document.getElementById('triviaOptions');
    const triviaScore = document.getElementById('triviaScore');
    const scoreText = document.getElementById('scoreText');
    const playAgainBtn = document.getElementById('playAgainBtn');
  
    let currentQuestion = 0;
    let score = 0;
    let shuffledQuestions = [];
  
    function shuffleArray(arr) {
      const shuffled = [...arr];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }
  
    function startTrivia() {
      currentQuestion = 0;
      score = 0;
      shuffledQuestions = shuffleArray(triviaQuestions).slice(0, 5);
      triviaScore.style.display = 'none';
      showQuestion();
    }
  
    function showQuestion() {
      if (currentQuestion >= shuffledQuestions.length) {
        showScore();
        return;
      }
  
      const q = shuffledQuestions[currentQuestion];
      questionText.textContent = `Q${currentQuestion + 1}/${shuffledQuestions.length}: ${q.question}`;
      triviaOptions.innerHTML = '';
  
      q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.classList.add('trivia-option');
        btn.textContent = option;
        btn.addEventListener('click', () => selectAnswer(index, q.correct));
        triviaOptions.appendChild(btn);
      });
    }
  
    function selectAnswer(selected, correct) {
      const options = triviaOptions.querySelectorAll('.trivia-option');
      
      // Disable all options
      options.forEach(opt => {
        opt.style.pointerEvents = 'none';
      });
  
      // Mark correct/wrong
      options[correct].classList.add('correct');
      if (selected === correct) {
        score++;
      } else {
        options[selected].classList.add('wrong');
      }
  
      // Move to next question after delay
      setTimeout(() => {
        currentQuestion++;
        showQuestion();
      }, 1200);
    }
  
    function showScore() {
      questionText.textContent = '';
      triviaOptions.innerHTML = '';
      triviaScore.style.display = 'block';
  
      let message = '';
      if (score === 5) message = '🏆 Perfect! You\'re a true BTS expert!';
      else if (score >= 3) message = '💜 Great job! You know your BTS well!';
      else if (score >= 1) message = '🎤 Not bad! Keep learning about BTS!';
      else message = '📚 Time to binge BTS content!';
  
      scoreText.textContent = `${score}/${shuffledQuestions.length} — ${message}`;
    }
  
    playAgainBtn.addEventListener('click', startTrivia);
  
    // Start trivia on load
    startTrivia();
  
    /* ---------- Lazy Loading Images ---------- */
    if ('IntersectionObserver' in window) {
      const lazyImages = document.querySelectorAll('img[loading="lazy"]');
      const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loaded');
            imgObserver.unobserve(img);
          }
        });
      }, { rootMargin: '100px' });
  
      lazyImages.forEach(img => imgObserver.observe(img));
    }
  
    /* ---------- Parallax Effect on Hero ---------- */
    const heroContent = document.querySelector('.hero-content');
    
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const heroHeight = document.querySelector('.hero').offsetHeight;
      
      if (scrollY < heroHeight && heroContent) {
        const parallaxOffset = scrollY * 0.4;
        heroContent.style.transform = `translateY(${parallaxOffset}px)`;
        heroContent.style.opacity = 1 - (scrollY / heroHeight) * 0.8;
      }
    }, { passive: true });
  
    /* ---------- Keyboard Navigation ---------- */
    document.addEventListener('keydown', (e) => {
      // Close mobile nav on Escape
      if (e.key === 'Escape') {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
      }
    });
  
    /* ---------- Theme Toggle ---------- */
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
  
    // Update the icon based on current theme state
    function updateThemeIcon() {
      const isLight = document.documentElement.classList.contains('light-mode');
      if (themeIcon) {
        themeIcon.textContent = isLight ? '☀️' : '🌙';
      }
    }
  
    // Set correct icon on page load
    updateThemeIcon();
  
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-mode');
        const isLight = document.documentElement.classList.contains('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        updateThemeIcon();
      });
    }
  
    /* ---------- Smooth Scroll for Anchor Links ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  
    /* ---------- Initialize ---------- */
    handleScroll(); // Initial state
  
    // Animate hero stats on load
    setTimeout(() => {
      document.querySelectorAll('.hero-stat-number').forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        if (isNaN(target)) return;
        
        const duration = 2000;
        const startTime = performance.now();
  
        function update(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = Math.floor(eased * target);
          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            counter.textContent = target;
          }
        }
  
        requestAnimationFrame(update);
      });
    }, 500);
  
    // Preload critical fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.as = 'style';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&family=Montserrat:wght@700;800;900&display=swap';
    document.head.appendChild(fontLink);
  
  });
