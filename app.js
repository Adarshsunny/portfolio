document.addEventListener('DOMContentLoaded', () => {
    // Scroll Navigation logic
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');

    // Add scroll-animate class to relevant elements dynamically
    const elementsToAnimate = document.querySelectorAll('.hero-content, .section-title, .glass-card, .bio-content, .filter-container, .timeline-item');
    elementsToAnimate.forEach((el, index) => {
        el.classList.add('scroll-animate');
        // Add staggered delays for grids
        if (el.classList.contains('glass-card') || el.classList.contains('timeline-item')) {
            el.classList.add(`delay-${(index % 4) + 1}`);
        }
    });

    // Scroll Animations Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    let skillBarsAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');

                // Trigger skill bars when bio content is visible
                if (entry.target.classList.contains('bio-content') && !skillBarsAnimated) {
                    animateSkillBars();
                    skillBarsAnimated = true;
                }

                // Optional: Stop observing once shown
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));

    // Handle link clicks for smooth scrolling
    const footerLinks = document.querySelectorAll('.footer-links a');
    const allLinks = [...navLinks, ...heroButtons, ...footerLinks];
    allLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                history.pushState(null, null, href);

                if (href === '#contact') {
                    window.location.href = "mailto:example@example.com";
                    return;
                }

                const targetSection = document.querySelector(href);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }

                // Close mobile menu if open
                const navLinksContainer = document.querySelector('.nav-links');
                if (navLinksContainer.classList.contains('active')) {
                    navLinksContainer.classList.remove('active');
                    document.querySelector('.hamburger').innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });

    // Active link highlighting on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        pages.forEach(page => {
            const sectionTop = page.offsetTop;
            const sectionHeight = page.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = '#' + page.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === current) {
                link.classList.add('active');
            }
        });
    });

    // Skill bar animation function
    function animateSkillBars() {
        const fills = document.querySelectorAll('.skill-fill');
        fills.forEach(fill => {
            const targetWidth = fill.getAttribute('data-width');
            // Reset to 0 then animate
            fill.style.width = '0%';
            setTimeout(() => {
                fill.style.width = targetWidth;
                fill.style.transition = 'width 1.5s cubic-bezier(0.1, 0.5, 0.1, 1)';
            }, 100);
        });
    }

    // Modal & Lightbox Logic
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.querySelector('.close-btn');

    function openModal(contentHtml) {
        modalBody.innerHTML = contentHtml;
        modal.classList.add('active');
    }

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        modalBody.innerHTML = '';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            modalBody.innerHTML = '';
        }
    });

    // Achievements View Details
    const viewBtns = document.querySelectorAll('.achievement-card .view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.achievement-card');
            const title = card.querySelector('h3').innerText;
            const year = card.querySelector('.year').innerText;
            const icon = card.querySelector('.achievement-icon').innerHTML;

            const content = `
                <div style="text-align: center;">
                    <div style="font-size: 3rem; color: var(--accent-red); margin-bottom: 1rem;">${icon}</div>
                    <h2 style="margin-bottom: 0.5rem; color: var(--text-light);">${title}</h2>
                    <h4 style="color: var(--accent-red); margin-bottom: 1rem;">${year}</h4>
                    <p style="color: var(--text-gray); font-size: 1.1rem; line-height: 1.6;">Detailed description of ${title}. Exceptional performance during this period leading to top honors.</p>
                </div>
            `;
            openModal(content);
        });
    });

    // Filtering Logic for Achievements & Gallery
    function setupFilters(containerSelector, itemSelector) {
        const filterBtns = document.querySelectorAll(`${containerSelector} .filter-btn`);
        const items = document.querySelectorAll(itemSelector);

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                items.forEach(item => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                        // Simple animation reset
                        item.style.animation = 'none';
                        item.offsetHeight; /* trigger reflow */
                        item.style.animation = 'fadeIn 0.5s ease forwards';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    setupFilters('.filter-container', '.achievement-card');
    setupFilters('.gallery-filters', '.gallery-item');

    // Gallery Lightbox
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) {
                const contentHtml = `
                 <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; padding: 1rem;">
                     <img src="${img.src}" alt="${img.alt}" style="max-width:100%; max-height:80vh; border-radius: 8px; object-fit: contain;">
                 </div>`;
                openModal(contentHtml);
            }
        });
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        if (navLinksContainer.classList.contains('active')) {
            hamburger.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
});
