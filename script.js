/* ===================================================================
   SHOURYA KUMAR — PORTFOLIO JAVASCRIPT v2
   Enhanced Particles | Typing | Scroll Animations | Premium Interactions
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // Loading Screen
    // ==========================================
    const loader = document.getElementById('loader');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        initAnimations();
    }, 1800);

    // ==========================================
    // Custom Cursor Glow
    // ==========================================
    const cursorGlow = document.getElementById('cursorGlow');
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        glowX += (mouseX - glowX) * 0.06;
        glowY += (mouseY - glowY) * 0.06;
        if (cursorGlow) {
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // ==========================================
    // Particle System — Enhanced
    // ==========================================
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.3;
            this.baseSpeedX = (Math.random() - 0.5) * 0.4;
            this.baseSpeedY = (Math.random() - 0.5) * 0.4;
            this.speedX = this.baseSpeedX;
            this.speedY = this.baseSpeedY;
            this.opacity = Math.random() * 0.5 + 0.15;
            this.baseOpacity = this.opacity;
            // Color variety: cyan, purple, or pink
            const colorChoice = Math.random();
            if (colorChoice < 0.5) {
                this.hue = 187; // cyan
                this.sat = 100;
                this.light = 50;
            } else if (colorChoice < 0.85) {
                this.hue = 271; // purple
                this.sat = 91;
                this.light = 65;
            } else {
                this.hue = 330; // pink
                this.sat = 90;
                this.light = 70;
            }
            this.pulseOffset = Math.random() * Math.PI * 2;
            this.pulseSpeed = 0.002 + Math.random() * 0.003;
        }
        update(time) {
            // Gentle pulsing
            this.opacity = this.baseOpacity + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.1;
            this.x += this.speedX;
            this.y += this.speedY;

            // Slowly return to base speed
            this.speedX += (this.baseSpeedX - this.speedX) * 0.02;
            this.speedY += (this.baseSpeedY - this.speedY) * 0.02;

            if (this.x < -10) this.x = canvas.width + 10;
            if (this.x > canvas.width + 10) this.x = -10;
            if (this.y < -10) this.y = canvas.height + 10;
            if (this.y > canvas.height + 10) this.y = -10;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, ${this.sat}%, ${this.light}%, ${Math.max(0, this.opacity)})`;
            ctx.fill();

            // Glow effect for larger particles
            if (this.size > 1.5) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, ${this.sat}%, ${this.light}%, ${Math.max(0, this.opacity * 0.08)})`;
                ctx.fill();
            }
        }
    }

    function initParticles() {
        const count = Math.min(100, Math.floor(window.innerWidth / 12));
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const distance = dx * dx + dy * dy;

                if (distance < 18000) { // ~134px radius
                    const opacity = (1 - distance / 18000) * 0.12;
                    ctx.beginPath();
                    const gradient = ctx.createLinearGradient(
                        particles[a].x, particles[a].y,
                        particles[b].x, particles[b].y
                    );
                    gradient.addColorStop(0, `hsla(${particles[a].hue}, 80%, 60%, ${opacity})`);
                    gradient.addColorStop(1, `hsla(${particles[b].hue}, 80%, 60%, ${opacity})`);
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    let time = 0;
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        time++;
        particles.forEach(p => {
            p.update(time);
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // Mouse repulsion
    canvas.addEventListener('mousemove', (e) => {
        const mx = e.clientX;
        const my = e.clientY;
        particles.forEach(p => {
            const dx = p.x - mx;
            const dy = p.y - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                const force = (120 - dist) / 120;
                p.speedX += (dx / dist) * force * 1.5;
                p.speedY += (dy / dist) * force * 1.5;
            }
        });
    });

    // ==========================================
    // Typing Effect
    // ==========================================
    const typingElement = document.getElementById('typingText');
    const phrases = [
        'ML Systems',
        'Computer Vision',
        'Deep Learning Models',
        'Biometric Pipelines',
        'AI for Healthcare',
        'IoT Intelligence',
        'Secure APIs'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function typeEffect() {
        if (!typingElement) return;
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 35;
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 75;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2200;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 400;
        }

        setTimeout(typeEffect, typingSpeed);
    }

    // ==========================================
    // Scroll Animations via IntersectionObserver
    // ==========================================
    function initAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    // Trigger skill bars inside observed elements
                    const skillBars = entry.target.querySelectorAll('.skill-bar');
                    skillBars.forEach(bar => {
                        const width = bar.getAttribute('data-width');
                        setTimeout(() => { bar.style.width = width + '%'; }, 200);
                    });
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
        });

        document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

        // Skill cards bar observer
        document.querySelectorAll('.skill-card').forEach(card => {
            const barObs = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const bar = entry.target.querySelector('.skill-bar');
                        if (bar) {
                            const w = bar.getAttribute('data-width');
                            setTimeout(() => { bar.style.width = w + '%'; }, 400);
                        }
                    }
                });
            }, { threshold: 0.2 });
            barObs.observe(card);
        });
    }

    // ==========================================
    // Animated Counters
    // ==========================================
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseFloat(counter.getAttribute('data-target'));
                    const isDecimal = target % 1 !== 0;
                    const duration = 2200;
                    const start = performance.now();

                    function update(now) {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 4);
                        const current = eased * target;
                        counter.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
                        if (progress < 1) {
                            requestAnimationFrame(update);
                        } else {
                            counter.textContent = isDecimal ? target.toFixed(1) : target;
                        }
                    }
                    requestAnimationFrame(update);
                    obs.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(c => obs.observe(c));
    }
    animateCounters();

    // ==========================================
    // Navbar
    // ==========================================
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ==========================================
    // Mobile Nav Toggle
    // ==========================================
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // ==========================================
    // Smooth Scroll
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // Magnetic Button Effect
    // ==========================================
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // ==========================================
    // 3D Tilt on Project Cards
    // ==========================================
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const tiltX = (y - 0.5) * 8;
            const tiltY = (x - 0.5) * -8;
            card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ==========================================
    // Contact card radial hover
    // ==========================================
    document.querySelectorAll('.contact-card').forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0, 229, 255, 0.05), var(--bg-card))`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.background = '';
        });
    });

    // ==========================================
    // Active nav link highlight on scroll
    // ==========================================
    const sections = document.querySelectorAll('.section');
    const allNavLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            if (window.pageYOffset >= section.offsetTop - 120) {
                current = section.getAttribute('id');
            }
        });
        allNavLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === '#' + current) {
                link.style.color = 'var(--accent-cyan)';
            }
        });
    });

    // ==========================================
    // Parallax hero content
    // ==========================================
    const heroContent = document.querySelector('.hero-content');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        if (heroContent && scrolled < window.innerHeight) {
            const factor = scrolled / window.innerHeight;
            heroContent.style.transform = `translateY(${scrolled * 0.35}px)`;
            heroContent.style.opacity = 1 - factor * 1.2;
        }
    });

    // ==========================================
    // Skill card stagger animation
    // ==========================================
    document.querySelectorAll('.skill-card').forEach((card, i) => {
        card.style.transitionDelay = `${i * 0.08}s`;
    });

    // Start typing
    setTimeout(typeEffect, 2200);

    // ==========================================
    // Custom Chatbot Logic
    // ==========================================
    const chatToggle = document.getElementById('chatToggle');
    const chatbotWidget = document.querySelector('.chatbot-widget');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatMessages = document.getElementById('chatMessages');
    const suggestionBtns = document.querySelectorAll('.suggestion-btn');
    const chatNotification = document.getElementById('chatNotification');

    // Show notification after 4 seconds
    setTimeout(() => {
        if (!chatbotWidget.classList.contains('open')) {
            chatNotification.classList.add('show');
        }
    }, 4000);

    // Predefined QA Dataset (Keyword-based matching)
    const qaDatabase = [
        {
            keywords: ['hi', 'hello', 'hey', 'start', 'greetings', 'morning', 'evening'],
            answer: "Hello! I'm Shourya's virtual assistant. I'm here to help you navigate his portfolio. Ask me about his <strong>skills</strong>, <strong>projects</strong>, <strong>achievements</strong>, or how to <strong>contact</strong> him."
        },
        {
            keywords: ['who', 'you', 'identity', 'bot', 'assistant'],
            answer: "I'm a custom-built AI assistant designed to provide information about Shourya's professional background, skills, and projects. Type a question or use the suggestion buttons below to get started!"
        },
        {
            keywords: ['skill', 'tech', 'stack', 'language', 'program', 'arsenal', 'tools', 'know', 'python', 'sql'],
            answer: "Shourya is a Machine Learning Engineer with a strong technical arsenal:<br>• <strong>Core</strong>: Python, SQL, C++, Data Structures & Algorithms<br>• <strong>ML Frameworks</strong>: PyTorch, TensorFlow, Scikit-learn, HuggingFace<br>• <strong>Specialties</strong>: Computer Vision (MTCNN, ArcFace), NLP, Deep Learning<br>• <strong>Deployment</strong>: Flask, REST APIs, AES-RSA Encryption"
        },
        {
            keywords: ['project', 'work', 'portfolio', 'build', 'made', 'created', 'niyukti', 'irrigo'],
            answer: "His featured projects are:<br>• <strong>NiyuktiSetu</strong>: AI-based biometric authentication for recruitment (96.8% accuracy).<br>• <strong>Irrigo</strong>: IoT-driven crop and water management system (15-20% water saving).<br>Which one would you like to know more about?"
        },
        {
            keywords: ['niyukt', 'setu', 'biometric', 'government', 'recruitment', 'auth', 'face', 'accuracy'],
            answer: "<strong>NiyuktiSetu</strong> is a production-grade biometric system. It uses a 3-stage pipeline: MTCNN for face detection, 128-D ArcFace embeddings for recognition, and a dual-path liveness classifier. It features AES-RSA encrypted inference for maximum security and is deployed via Flask REST APIs with sub-500ms latency."
        },
        {
            keywords: ['irrig', 'water', 'crop', 'management', 'iot', 'sensor', 'agriculture', 'farm'],
            answer: "<strong>Irrigo</strong> is an agricultural intelligence system. It uses a real-time IoT pipeline with soil moisture, temperature, and humidity sensors. A multi-class ML model provides irrigation and fertilizer recommendations. It successfully filtered ~18% noisy readings in testing and reduced estimated water usage by 15-20%."
        },
        {
            keywords: ['achieve', 'award', 'hackathon', 'sih', 'anveshna', 'finalist', 'recogni', 'competition'],
            answer: "Shourya has an impressive record of recognition:<br>• 🏆 <strong>SIH 2024 Finalist</strong>: Smart India Hackathon<br>• 🔬 <strong>Anveshna 2024 Finalist</strong>: Research & Innovation competition<br>• 📄 <strong>IEEE NGISE Presenter</strong>: Conference speaker on Next Generation Information Systems"
        },
        {
            keywords: ['research', 'publish', 'book', 'paper', 'chapter', 'author', 'healthcare', 'genai', 'generative', 'publication', 'patent'],
            answer: "Shourya is a published researcher and inventor!<br>• 📜 <strong>Patent</strong>: Data-Driven Agricultural Management System for Resource Optimization (2025).<br>• 📘 <strong>Book Chapter</strong>: \"Generative AI in Healthcare Application\" (CRC Press, 2026). <a href='https://www.taylorfrancis.com/chapters/edit/10.1201/9781003488255-11/generative-adversarial-networks-healthcare-applications-shourya-kumar-shreya-goel-shikha-agarwal-sanjay-kumar-sonker-ankit-bansal-ruchi-bansal' target='_blank' style='color:var(--accent-cyan)'>[View Here]</a><br>Which one would you like to hear more about?"
        },
        {
            keywords: ['patent', 'agriculture', 'farming', 'resource', 'optimization', 'invention', '202511017657'],
            answer: "Shourya's patent (No. 202511017657) is for a <strong>Data-Driven Agricultural Management System</strong>. It optimizes resources like water and fertilizers using IoT analytics, provides location-based crop suggestions, and connects farmers directly to buyers for fair pricing. It's a complete ecosystem for sustainable farming."
        },
        {
            keywords: ['edu', 'study', 'college', 'degree', 'university', 'btech', 'cgpa', 'graduat', 'student'],
            answer: "Shourya is currently pursuing a <strong>B.Tech in Computer Science & IT</strong> (batch 2022-2026) at Dr. A.P.J. Abdul Kalam Technical University, Lucknow. He maintains a solid CGPA of <strong>7.38/10</strong>."
        },
        {
            keywords: ['contact', 'email', 'phone', 'call', 'reach', 'hire', 'message', 'interview', 'linkedin'],
            answer: "You can reach Shourya directly through these channels:<br>• 📧 Email: <a href='mailto:shourya.writes1@gmail.com' style='color:var(--accent-cyan)'>shourya.writes1@gmail.com</a><br>• 📱 Phone: +91 9410002547<br>• 💼 LinkedIn: <a href='https://linkedin.com/in/shourya-kumar-here/' target='_blank' style='color:var(--accent-cyan)'>shourya-kumar-here</a>"
        },
        {
            keywords: ['intern', 'job', 'hiring', 'opportunity', 'career', 'availab', 'role', 'recruit'],
            answer: "Shourya is actively seeking <strong>ML Engineer or Software Engineering internships</strong> where he can apply his computer vision and deep learning expertise. He's available for projects and professional collaborations. Feel free to contact him via email or LinkedIn!"
        },
        {
            keywords: ['locat', 'where', 'city', 'live', 'noida', 'india', 'based'],
            answer: "He is based in <strong>Noida, Uttar Pradesh, India</strong>."
        },
        {
            keywords: ['hobby', 'interest', 'outside', 'life', 'write', 'fun'],
            answer: "Beyond coding, Shourya is passionate about technology research and writing. You can see his analytical and writing skills in his published book chapter and research presentations."
        },
        {
            keywords: ['github', 'git', 'repo', 'code', 'source'],
            answer: "You can find his open-source work on GitHub: <a href='https://github.com/Shourya-here' target='_blank' style='color:var(--accent-cyan)'>github.com/Shourya-here</a>. It includes the code for his major ML projects."
        },
        {
            keywords: ['site', 'navigat', 'dark', 'theme', 'color', 'animation', 'ux', 'design'],
            answer: "This portfolio is designed with a premium dark theme and glassmorphism. It features an interactive particle system, scroll-triggered animations (Intersection Observer), and 3D tilt effects on project cards."
        },
        {
            keywords: ['thanks', 'thank you', 'cool', 'awesome', 'good', 'nice'],
            answer: "You're welcome! I'm glad I could help. Let me know if you have any more questions about Shourya's work!"
        }
    ];

    const fallbackAnswer = "I'm not quite sure about that. Try asking about his <strong>skills</strong>, <strong>projects</strong>, <strong>education</strong>, or <strong>contact info</strong>!";

    function toggleChat() {
        chatbotWidget.classList.toggle('open');
        if (chatbotWidget.classList.contains('open')) {
            chatNotification.classList.remove('show');
            setTimeout(() => chatInput.focus(), 300);
        } else {
            // Re-show notification when chat is closed
            chatNotification.classList.add('show');
        }
    }

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}-message`;
        msgDiv.innerHTML = text;

        // Remove suggestions once a new message is sent
        const suggestions = document.getElementById('chatSuggestions');
        if (suggestions && sender === 'user') {
            suggestions.style.display = 'none';
        }

        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.id = 'typingIndicator';
        indicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        chatMessages.appendChild(indicator);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getBotResponse(input) {
        const lowerInput = input.toLowerCase();
        let bestMatch = fallbackAnswer;
        let maxMatches = 0;

        for (const item of qaDatabase) {
            let matchCount = 0;
            for (const keyword of item.keywords) {
                if (lowerInput.includes(keyword)) {
                    matchCount++;
                }
            }
            if (matchCount > maxMatches) {
                maxMatches = matchCount;
                bestMatch = item.answer;
            }
        }
        return bestMatch;
    }

    function handleUserInput() {
        const text = chatInput.value.trim();
        if (!text) return;

        // Reset input
        chatInput.value = '';

        // User message
        addMessage(text, 'user');

        // Show typing indicator
        showTypingIndicator();

        // Simulate thinking delay based on response length
        const response = getBotResponse(text);
        const delay = Math.min(Math.max(response.length * 15, 600), 1500);

        setTimeout(() => {
            removeTypingIndicator();
            addMessage(response, 'bot');
        }, delay);
    }

    // Event Listeners for Chat
    chatToggle.addEventListener('click', toggleChat);

    chatSendBtn.addEventListener('click', handleUserInput);

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserInput();
        }
    });

    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            chatInput.value = btn.textContent;
            handleUserInput();
        });
    });

});
