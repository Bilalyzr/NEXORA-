/**
 * NEXORA Professional Landing Page Logic
 * Enhanced animations and interactions
 */

document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // 0. Loading Screen
    // ============================================
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 600);
    }, 2200);

    // ============================================
    // 1. Navigation Enhancement
    // ============================================
    const nav = document.querySelector('#main-nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            nav.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4)';
            nav.style.background = 'rgba(11, 18, 33, 0.96)';
            nav.style.padding = '0';
        } else {
            nav.style.boxShadow = 'none';
            nav.style.background = 'rgba(11, 18, 33, 0.92)';
        }

        lastScroll = currentScroll;
    });

    // ============================================
    // 2. Mobile Menu Toggle
    // ============================================
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });

    // ============================================
    // 3. Enhanced Scroll Animations
    // ============================================
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(el => {
        scrollObserver.observe(el);
    });

    // ============================================
    // 4. Smooth Scroll with Offset
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerOffset = 85;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // ============================================
    // 5. Gallery Modal with Keyboard Support
    // ============================================
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const closeBtn = document.querySelector('.close-modal');
    const prevBtn = document.getElementById('modal-prev');
    const nextBtn = document.getElementById('modal-next');
    const launchBtn = document.getElementById('launch-preview');
    const galleryItems = document.querySelectorAll('.gallery-item');

    const galleryData = Array.from(galleryItems).map(item => ({
        src: item.querySelector('img').src,
        title: item.querySelector('.item-overlay span').textContent
    }));

    let currentIndex = 0;

    function openModal(index) {
        currentIndex = index;
        updateModal();
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        modal.style.animation = 'fadeIn 0.3s ease';
    }

    function updateModal() {
        modalImg.style.opacity = '0';
        setTimeout(() => {
            modalImg.src = galleryData[currentIndex].src;
            modalTitle.textContent = galleryData[currentIndex].title;
            modalImg.style.opacity = '1';
        }, 200);
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openModal(index));
    });

    if (launchBtn) {
        launchBtn.addEventListener('click', () => openModal(0));
    }

    closeBtn.addEventListener('click', () => {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    });

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
        updateModal();
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % galleryData.length;
        updateModal();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeBtn.click();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'block') {
            if (e.key === 'ArrowLeft') prevBtn.click();
            if (e.key === 'ArrowRight') nextBtn.click();
            if (e.key === 'Escape') closeBtn.click();
        }
    });

    // Add CSS animation for modal
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // 6. Theme Toggle with Local Storage
    // ============================================
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme
    const savedTheme = localStorage.getItem('nexora-theme');
    if (savedTheme === 'light') {
        body.classList.replace('dark-mode', 'light-mode');
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            body.classList.replace('dark-mode', 'light-mode');
            localStorage.setItem('nexora-theme', 'light');
        } else {
            body.classList.replace('light-mode', 'dark-mode');
            localStorage.setItem('nexora-theme', 'dark');
        }
    });

    // ============================================
    // 7. Enhanced Particle Network Animation
    // ============================================
    const canvas = document.getElementById('bg-animation');
    const ctx = canvas.getContext('2d');

    let particles = [];
    const particleCount = 70;
    let animationId;

    function initCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
            this.pulseOffset = Math.random() * Math.PI * 2;
        }

        update(time) {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Pulse effect
            this.currentOpacity = this.opacity + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.15;
        }

        draw(accentColor) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = accentColor;
            ctx.globalAlpha = Math.max(0.1, this.currentOpacity);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    let time = 0;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const isLight = body.classList.contains('light-mode');
        const accentColor = isLight ? '#B8860B' : '#D4A853';

        particles.forEach((p, i) => {
            p.update(time);
            p.draw(accentColor);

            // Draw connections
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 160) {
                    ctx.beginPath();
                    ctx.strokeStyle = accentColor;
                    ctx.globalAlpha = (1 - dist / 160) * 0.18;
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        });

        time += 1;
        animationId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        initCanvas();
        createParticles();
    });

    initCanvas();
    createParticles();
    animate();

    // ============================================
    // 8. Animate Monitor Stats on Load
    // ============================================
    setTimeout(() => {
        const statValues = document.querySelectorAll('.stat-value');
        statValues.forEach(stat => {
            const finalValue = stat.textContent;
            if (!finalValue.includes('%')) return;

            const target = parseInt(finalValue);
            if (isNaN(target)) return;

            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = finalValue;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current) + '%';
                }
            }, 30);
        });
    }, 1500);

    // ============================================
    // 9. Real-time Zone Status Simulation
    // ============================================
    function simulateZoneActivity() {
        const plots = document.querySelectorAll('.plot');
        plots.forEach(plot => {
            if (Math.random() > 0.95) {
                plot.style.transform = 'scale(1.15)';
                setTimeout(() => {
                    plot.style.transform = '';
                }, 500);
            }
        });
    }

    setInterval(simulateZoneActivity, 3000);

    // ============================================
    // 10. Typing Effect for Hero Badge
    // ============================================
    const heroBadge = document.querySelector('.hero-badge');
    if (heroBadge) {
        const originalText = heroBadge.innerHTML;
        heroBadge.style.opacity = '0';

        setTimeout(() => {
            heroBadge.style.transition = 'opacity 0.8s ease';
            heroBadge.style.opacity = '1';
        }, 500);
    }

    // ============================================
    // 11. Stagger Animation for Feature Cards
    // ============================================
    const featureCards = document.querySelectorAll('.feature-category');
    featureCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // ============================================
    // 12. Mouse Follow Glow Effect on Cards
    // ============================================
    const cards = document.querySelectorAll('.problem-card, .feature-category');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(212, 168, 83, 0.08), var(--card-bg))`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.background = 'var(--card-bg)';
        });
    });

    // ============================================
    // 13. Scroll Progress Indicator
    // ============================================
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #D4A853, #e5c07b);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

    // ============================================
    // 14. Navbar Active Link Highlight
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks_items = document.querySelectorAll('.nav-links a[href^="#"]');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks_items.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${current}`) {
                link.style.color = 'var(--accent)';
            }
        });
    });

    // ============================================
    // 15. Parallax Effect for Orbs
    // ============================================
    document.addEventListener('mousemove', (e) => {
        const orbs = document.querySelectorAll('.glow-orb');
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 20;
            orb.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
        });
    });

    // ============================================
    // 16. Form/Contact Button Ripple Effect
    // ============================================
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                background: rgba(255, 255, 255, 0.4);
                border-radius: 50%;
                pointer-events: none;
                width: 100px;
                height: 100px;
                left: ${x - 50}px;
                top: ${y - 50}px;
                transform: scale(0);
                animation: rippleEffect 0.6s ease-out;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes rippleEffect {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

});
