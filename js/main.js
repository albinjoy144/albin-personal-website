// ==========================================================================
// ALBIN JOY - PORTFOLIO INTERACTION CONTROLLER
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCursorGlow();
  initProjects();
  initStatsCounter();
  initContactForm();
  initModal();
});

/* --- 1. Navbar Sticky & Mobile Menu --- */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky navbar on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    updateActiveNav();
  });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('ph-list');
        icon.classList.toggle('ph-x');
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // Active section tracker (ScrollSpy)
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

/* --- 2. Ambient Cursor Glow Follower --- */
function initCursorGlow() {
  const cursorGlow = document.getElementById('cursorGlow');
  if (!cursorGlow) return;

  // Track mouse movements smoothly
  window.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
  });
}

/* --- 3. Projects Rendering & Filter Logic --- */
function initProjects() {
  const grid = document.getElementById('projectsGrid');
  const filterBtns = document.querySelectorAll('.filter-btn');

  if (!grid || typeof portfolioProjects === 'undefined') return;

  function renderProjects(category = 'all') {
    grid.innerHTML = '';
    
    const filtered = category === 'all' 
      ? portfolioProjects 
      : portfolioProjects.filter(p => p.category === category);

    filtered.forEach(project => {
      const card = document.createElement('div');
      card.className = 'project-card glass-card';
      card.setAttribute('data-id', project.id);

      card.innerHTML = `
        <div class="project-img-wrapper">
          <img src="${project.image}" alt="${project.title}" class="project-img" loading="lazy" />
          <span class="project-overlay-badge">${project.role}</span>
        </div>
        <div class="project-content">
          <div class="project-tags">
            ${project.tags.map(t => `<span class="tag-badge">${t}</span>`).join('')}
          </div>
          <h3 class="project-title">
            ${project.title}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </h3>
          <p class="project-summary">${project.summary}</p>
          <div class="project-footer">
            <span class="project-client">${project.client}</span>
            <span class="project-metrics">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
              ${project.metric}
            </span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => openProjectModal(project));
      grid.appendChild(card);
    });
  }

  // Initial render
  renderProjects('all');

  // Filter button handlers
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const category = btn.getAttribute('data-filter');
      renderProjects(category);
    });
  });
}

/* --- 4. Case Study Modal Dialog --- */
function initModal() {
  const modalBackdrop = document.getElementById('projectModal');
  const closeBtn = document.getElementById('modalCloseBtn');

  if (!modalBackdrop) return;

  function closeModal() {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });
}

function openProjectModal(project) {
  const modalBackdrop = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalDynamicContent');
  if (!modalBackdrop || !modalBody) return;

  modalBody.innerHTML = `
    <img src="${project.image}" alt="${project.title}" class="modal-hero-img" />
    <div class="modal-body">
      <div class="modal-header">
        <div class="project-tags" style="margin-bottom: 0.8rem;">
          ${project.tags.map(t => `<span class="tag-badge">${t}</span>`).join('')}
        </div>
        <h2 class="modal-title">${project.title}</h2>
        <p style="font-size: 1.1rem; color: var(--text-secondary);">${project.summary}</p>
      </div>

      <div class="modal-grid-details">
        <div class="modal-meta-item">
          <h5>Client / Company</h5>
          <p>${project.client}</p>
        </div>
        <div class="modal-meta-item">
          <h5>My Role</h5>
          <p>${project.role}</p>
        </div>
        <div class="modal-meta-item">
          <h5>Key Result</h5>
          <p style="color: var(--accent-cyan);">${project.metric}</p>
        </div>
      </div>

      <div class="case-section">
        <h4>Overview & Background</h4>
        <p>${project.overview}</p>
      </div>

      <div class="case-section">
        <h4>The Challenge</h4>
        <p>${project.challenge}</p>
      </div>

      <div class="case-section">
        <h4>Design Solution & Approach</h4>
        <p>${project.solution}</p>
      </div>

      <div class="case-section">
        <h4>Impact & Results</h4>
        <p>${project.impact}</p>
      </div>

      <div class="case-section" style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--card-border);">
        <h4>Tools & Technologies Used</h4>
        <div style="display: flex; gap: 0.6rem; flex-wrap: wrap; margin-top: 0.6rem;">
          ${project.tools.map(tool => `<span class="skill-pill" style="padding: 0.4rem 1rem; font-size: 0.85rem;">${tool}</span>`).join('')}
        </div>
      </div>
    </div>
  `;

  modalBackdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/* --- 5. Interactive Number Counters --- */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach(stat => {
          const target = +stat.getAttribute('data-target');
          const prefix = stat.getAttribute('data-prefix') || '';
          const suffix = stat.getAttribute('data-suffix') || '';
          let count = 0;
          const duration = 1500;
          const stepTime = Math.abs(Math.floor(duration / target));

          const timer = setInterval(() => {
            count += 1;
            stat.textContent = `${prefix}${count}${suffix}`;
            if (count >= target) {
              clearInterval(timer);
              stat.textContent = `${prefix}${target}${suffix}`;
            }
          }, Math.max(stepTime, 20));
        });
      }
    });
  }, { threshold: 0.5 });

  const statsStrip = document.querySelector('.hero-stats-strip');
  if (statsStrip) observer.observe(statsStrip);
}

/* --- 6. Contact Form & Quick Copy Email --- */
function initContactForm() {
  const copyBtn = document.getElementById('copyEmailBtn');
  const contactForm = document.getElementById('contactForm');

  if (copyBtn) {
    copyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = "albinjoy69@gmail.com";
      navigator.clipboard.writeText(email).then(() => {
        showToast("Email copied to clipboard! (albinjoy69@gmail.com)");
      }).catch(() => {
        showToast("Email: albinjoy69@gmail.com");
      });
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName').value;
      showToast(`Thank you, ${name}! Your message has been sent.`);
      contactForm.reset();
    });
  }
}

/* --- Toast Feedback Utility --- */
function showToast(message) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}
