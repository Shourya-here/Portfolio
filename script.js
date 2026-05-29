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
        'Secure APIs',
        'Data Science Solutions'
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
    // Custom Chatbot Logic — Premium NLP v3
    // ==========================================
    const chatbotWidget = document.getElementById('chatbotWidget');
    const chatToggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatWindow');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatMessages = document.getElementById('chatMessages');
    const chatNotification = document.getElementById('chatNotification');
    const chatClearBtn = document.getElementById('chatClearBtn');
    const chatDynamicSuggestions = document.getElementById('chatDynamicSuggestions');
    const chatCharCount = document.getElementById('chatCharCount');
    const chatMsgCount = document.getElementById('chatMsgCount');
    const chatUnreadBadge = document.getElementById('chatUnreadBadge');
    
    // Conversation State
    let state = {
        history: [],
        currentTopic: 'general', // general, niyuktisetu, irrigo, skills, research, contact, education
        unreadCount: 0,
        isThinking: false
    };

    // Predefined QA Dataset (Advanced Matcher)
    const qaDataset = [
        {
            id: 'greeting',
            topics: ['general'],
            keywords: ['hi', 'hello', 'hey', 'start', 'greetings', 'morning', 'evening', 'yo', 'sup'],
            variations: [
                "Hello! I'm Shourya's AI assistant. 🌟 I can guide you through his projects, research, technical skills, or help you contact him. What are you looking for today?",
                "Hi there! Nice to meet you. 👋 I'm here to answer any questions about Shourya's ML engineering background and research publications. How can I help you?",
                "Hey! Welcome to Shourya's portfolio. I'm his virtual assistant. Let me know what you'd like to explore: projects, skills, certifications, or publications!"
            ],
            chips: ["Tell me about NiyuktiSetu 🔐", "What are his technical skills? 💻", "Show me his research papers 📄", "How can I contact him? 📱"]
        },
        {
            id: 'about_bot',
            topics: ['general'],
            keywords: ['who', 'you', 'identity', 'bot', 'assistant', 'name', 'purpose'],
            variations: [
                "I'm Shourya's virtual concierge, a custom NLP assistant designed to help recruiters and collaborators learn more about his work in machine learning and computer vision. Ask me anything!"
            ],
            chips: ["Tell me about his projects 🚀", "Show me his resume info 📄"]
        },
        {
            id: 'skills',
            topics: ['skills'],
            keywords: ['skill', 'tech', 'stack', 'language', 'program', 'arsenal', 'tools', 'know', 'python', 'sql', 'libraries', 'frameworks'],
            variations: [
                "Shourya is a Machine Learning Engineer specializing in computer vision and deep learning. Here is his technical stack:<br><br>💻 <strong>Programming:</strong> Python, SQL<br>🧠 <strong>Frameworks:</strong> PyTorch, TensorFlow, Scikit-learn, Keras, HuggingFace Transformers<br>👁️ <strong>Computer Vision:</strong> OpenCV, MTCNN, ArcFace, Real-time Liveness Detection<br>☁️ <strong>Cloud & DevOps:</strong> Google Cloud Platform (GCP), Docker, REST APIs, Git/GitHub"
            ],
            chips: ["Tell me about NiyuktiSetu 🔐", "Tell me about Irrigo 🌾", "GATE DA 2026 Qualification 🎯"]
        },
        {
            id: 'projects',
            topics: ['general'],
            keywords: ['project', 'work', 'portfolio', 'build', 'made', 'created', 'applications', 'systems'],
            variations: [
                "Shourya has built production-grade systems in biometric security and agricultural intelligence:<br><br>1. 🔐 <strong>NiyuktiSetu</strong>: AI-based government recruitment authentication system with a 96.8% TAR biometric pipeline.<br>2. 🌾 <strong>Irrigo</strong>: An intelligent IoT crop & water management system saving 15-20% water.<br><br>Which project would you like to explore in detail?"
            ],
            chips: ["Explain NiyuktiSetu 🔐", "Explain Irrigo 🌾", "Show me his patent 📜"]
        },
        {
            id: 'niyuktisetu',
            topics: ['niyuktisetu'],
            keywords: ['niyukti', 'setu', 'recruitment', 'authentication', 'biometric', 'face', 'accuracy', 'embeddings', 'arcface', 'liveness', 'spoof', 'encryption'],
            variations: [
                "<strong>NiyuktiSetu</strong> is an AI-powered government recruitment authentication system. It secures exams via a 3-stage biometric pipeline:<br>• <strong>MTCNN</strong> for real-time face detection.<br>• <strong>512-D ArcFace/PyTorch</strong> embeddings for high-fidelity face recognition.<br>• Dual-path <strong>CNN liveness classifier</strong> to block spoofing attempts.<br><br>🔒 <strong>Security:</strong> All biometric & personal data is protected using hybrid <strong>AES-RSA encryption</strong> during inference and storage."
            ],
            card: {
                title: "NiyuktiSetu Biometric Pipeline",
                desc: "Achieved 96.8% True Acceptance Rate across 120 users & 96.2% spoof rejection. Deployed via Flask REST APIs with sub-500ms response latency.",
                linkText: "View NiyuktiSetu Source Code",
                url: "https://github.com/Shourya-here/Niyukti_setu"
            },
            chips: ["Show performance metrics 📊", "Explain Irrigo 🌾", "How was it deployed? ☁️"]
        },
        {
            id: 'niyuktisetu_more',
            topics: ['niyuktisetu'],
            keywords: ['metric', 'performance', 'stat', 'deployment', 'latency', 'api', 'flask', 'hybrid', 'aes', 'rsa'],
            variations: [
                "For <strong>NiyuktiSetu</strong>:<br>• 📈 **Spoof Rejection:** 96.2% accuracy over 80 adversarial attempts (printed, digital spoof).<br>• ⚡ **Latency:** Sub-500ms response time per inference.<br>• 🛡️ **Encryption:** Biometric vectors are encrypted using 256-bit AES, and the key is wrapped with a 2048-bit RSA public key, ensuring complete privacy."
            ],
            chips: ["View GitHub repository 💻", "Explain Irrigo 🌾", "Technical Skills 💻"]
        },
        {
            id: 'irrigo',
            topics: ['irrigo'],
            keywords: ['irrig', 'water', 'crop', 'management', 'iot', 'sensor', 'agriculture', 'farm', 'random forest', 'predict', 'recommendation', 'soil', 'humidity'],
            variations: [
                "<strong>Irrigo</strong> is an AI-driven agricultural system that optimizes irrigation and fertilizer usage.<br>• Built a real-time <strong>3-sensor IoT data pipeline</strong> monitoring soil moisture, temperature, and humidity.<br>• Used <strong>NumPy & Pandas</strong> for time-series feature engineering at 5-minute intervals.<br>• Trained a multi-class <strong>Random Forest classifier</strong> (Scikit-learn) to recommend exact crop schedules, reducing estimated water consumption by 15-20%."
            ],
            card: {
                title: "Irrigo Crop Optimizer",
                desc: "Tuned on 6 simulated crop cycle datasets. Built as an end-to-end data pipeline prototyped in Jupyter Notebook and versioned via Git.",
                linkText: "View Irrigo Source Code",
                url: "https://github.com/Shourya-here/irrigo_model"
            },
            chips: ["Tell me about NiyuktiSetu 🔐", "Show research patent 📜", "Contact Shourya 📱"]
        },
        {
            id: 'achievements',
            topics: ['general'],
            keywords: ['achieve', 'award', 'hackathon', 'sih', 'anveshna', 'finalist', 'recogni', 'competition', 'qualified', 'winner', 'gate'],
            variations: [
                "Here are Shourya's major professional highlights:<br><br>🎯 <strong>GATE DA 2026 Qualified</strong>: Qualified in Data Science & AI.<br>🏆 <strong>SIH 2024 Finalist</strong>: Finalist in the Smart India Hackathon.<br>🔬 <strong>Anveshna 2024 Finalist</strong>: Selected in the national research and innovation competition.<br>📄 <strong>IEEE NGISE Conference Speaker</strong>: Presented research on next-gen information systems."
            ],
            chips: ["GATE DA Details 🎯", "Show his publications 📘", "Tell me about his patent 📜"]
        },
        {
            id: 'gate',
            topics: ['general'],
            keywords: ['gate', 'exam', 'da', 'qualified', 'data science', 'artificial intelligence', 'score', 'iit'],
            variations: [
                "Shourya successfully qualified the prestigious <strong>GATE DA 2026</strong> (Graduate Aptitude Test in Engineering) examination in the <strong>Data Science & Artificial Intelligence</strong> discipline. This demonstrates strong academic and practical fundamentals in mathematical modeling, machine learning, probability, statistics, and data structures."
            ],
            chips: ["Technical Skills 💻", "Education Background 🎓"]
        },
        {
            id: 'research',
            topics: ['research'],
            keywords: ['research', 'publish', 'book', 'paper', 'chapter', 'author', 'healthcare', 'genai', 'generative', 'publication', 'crc press', 'ieee', 'patent'],
            variations: [
                "Shourya is active in research at the intersection of AI, agriculture, and healthcare:<br><br>📘 <strong>Book Chapter (CRC Press, Jul 2026):</strong> \"Generative Artificial Intelligence in Healthcare Application\" (ISBN 9781032784847) covering synthetic medical data generation and LLM decision systems.<br>📜 <strong>Patent (Feb 2025):</strong> \"Data-Driven Agricultural Management System for Resource Optimization\" (Application No: 202511017657) optimizing crop recommendations and direct buyer marketplace pipelines."
            ],
            chips: ["View Patent Details 🌾", "View CRC Publication 📘", "SIH 2024 final 🏆"]
        },
        {
            id: 'patent_details',
            topics: ['research'],
            keywords: ['patent', 'farming', '202511017657', 'agricultural', 'optimize', 'system'],
            variations: [
                "Shourya's patent filed in February 2025 covers an intelligent farming system that integrates <strong>IoT sensors & AI</strong>. Key innovations include:<br>• Direct farmer-to-buyer connectivity to ensure fair crop pricing.<br>• Real-time local government policy awareness via automated text feeds.<br>• Data-driven location-based fertilizer and crop recommendations based on soil health metrics."
            ],
            card: {
                title: "Agricultural Management System Patent",
                desc: "Application No. 202511017657, filed to optimize farming resource allocation, pricing transparency, and advisory delivery.",
                linkText: "View Patent Document",
                url: "https://drive.google.com/file/d/1HBSP9cMlAOFvojX0eMOvHeo8dddAeJot/view"
            },
            chips: ["View Healthcare Publication 📘", "Tell me about Irrigo 🌾"]
        },
        {
            id: 'healthcare_details',
            topics: ['research'],
            keywords: ['crc', 'healthcare', 'isbn', 'generative', 'medical', 'synthetic', 'diagnostic'],
            variations: [
                "His CRC Press book chapter covering **Generative AI in Healthcare** discusses:<br>• 🏥 High-accuracy diagnostic GAN pipelines.<br>• 🔐 Generation of high-fidelity synthetic medical datasets to bypass patient privacy laws while training robust diagnostic models.<br>• 🤖 LLM-based intelligent clinical decision support systems for general practitioners."
            ],
            card: {
                title: "Generative AI in Healthcare (CRC Press)",
                desc: "Published Chapter (ISBN 9781032784847) discussing advanced clinical architectures, synthetic diagnostics, and privacy protection.",
                linkText: "Taylor & Francis Publishing",
                url: "https://www.taylorfrancis.com/chapters/edit/10.1201/9781003488255-11/generative-adversarial-networks-healthcare-applications-shourya-kumar-shreya-goel-shikha-agarwal-sanjay-kumar-sonker-ankit-bansal-ruchi-bansal"
            },
            chips: ["View Patent Details 📜", "Explain NiyuktiSetu 🔐"]
        },
        {
            id: 'education',
            topics: ['education'],
            keywords: ['edu', 'study', 'college', 'degree', 'university', 'btech', 'cgpa', 'graduat', 'student', 'aktu', 'lucknow', 'coursework'],
            variations: [
                "Shourya is pursuing a <strong>B.Tech in Computer Science and Information Technology</strong> (2022 – 2026) at <strong>Dr. A. P. J. Abdul Kalam Technical University (AKTU)</strong>, Lucknow, India.<br>📈 **Current CGPA:** 7.10/10<br>📚 **Core Coursework:** Artificial Intelligence & Machine Learning, Data Structures & Algorithms, Database Management Systems, Operating Systems, Computer Networks."
            ],
            chips: ["GATE DA 2026 🎯", "Projects 🚀", "Technical Skills 💻"]
        },
        {
            id: 'contact',
            topics: ['contact'],
            keywords: ['contact', 'email', 'phone', 'call', 'reach', 'hire', 'message', 'interview', 'linkedin', 'gmail', 'mail'],
            variations: [
                "Let's connect! Here are Shourya's verified direct contact channels:<br><br>📧 **Email:** <a href='mailto:shourya.writes1@gmail.com'>shourya.writes1@gmail.com</a><br>📱 **Phone / WhatsApp:** +91 9410002547<br>💼 **LinkedIn:** <a href='https://linkedin.com/in/shourya-kumar-here/' target='_blank'>linkedin.com/in/shourya-kumar-here</a><br>💻 **GitHub:** <a href='https://github.com/Shourya-here' target='_blank'>github.com/Shourya-here</a><br>🧩 **LeetCode:** <a href='https://leetcode.com/u/shourya-here' target='_blank'>leetcode.com/u/shourya-here</a>"
            ],
            chips: ["Send him an email 📧", "Connect on LinkedIn 💼", "What roles is he seeking? 👔"]
        },
        {
            id: 'hiring',
            topics: ['contact'],
            keywords: ['intern', 'job', 'hiring', 'opportunity', 'career', 'availab', 'role', 'seeking', 'position'],
            variations: [
                "Shourya is actively seeking <strong>ML Engineer or Software Engineering internships & entry-level roles (B.Tech Graduating April 2026)</strong>. He is fully set up to build secure inference systems, clean up IoT raw data, optimize heavy DL pipelines, and help teams build production-grade biometric or AI features."
            ],
            chips: ["How to contact him? 📱", "Show his resume stats 📊"]
        },
        {
            id: 'location',
            topics: ['general'],
            keywords: ['locat', 'where', 'city', 'live', 'noida', 'india', 'based', 'address'],
            variations: [
                "Shourya is currently based in <strong>Noida, Uttar Pradesh, India</strong> (Delhi NCR), and is open to hybrid, on-site, or remote roles."
            ],
            chips: ["How to contact him? 📱", "Technical Skills 💻"]
        },
        {
            id: 'thanks',
            topics: ['general'],
            keywords: ['thanks', 'thank you', 'cool', 'awesome', 'good', 'nice', 'great', 'perfect', 'bye', 'exit'],
            variations: [
                "You're very welcome! I'm glad I could assist. Let me know if there's anything else you'd like to check about Shourya's portfolio!",
                "Happy to help! 👍 Feel free to ask about any other project or download his contact info if you're done."
            ],
            chips: ["Say Hello 👋", "How to contact him? 📱"]
        }
    ];

    const fallbacks = [
        "I'm not quite sure I understand that query. 🤖 Try asking about his **skills**, **projects (NiyuktiSetu, Irrigo)**, **patent/publications**, or **how to contact him**!",
        "Hmm, I don't have that specific information in Shourya's database. Try asking: 'What projects has he built?' or 'Show me his contact details!'",
        "Could you rephrase that? You can ask about Shourya's **GATE DA 2026 score**, his **biometric authentication system**, or his **agricultural patent**!"
    ];

    // Helpers
    function sanitize(text) {
        const temp = document.createElement('div');
        temp.textContent = text;
        return temp.innerHTML;
    }

    function formatTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Dynamic Suggestion Chips Renderer
    function renderSuggestions(chips) {
        chatDynamicSuggestions.innerHTML = '';
        if (!chips || chips.length === 0) return;
        
        chips.forEach(chipText => {
            const btn = document.createElement('button');
            btn.className = 'suggestion-btn';
            btn.textContent = chipText;
            btn.addEventListener('click', () => {
                chatInput.value = chipText.replace(/[🔐🌾💻📄🚀📊🏆📜📱👔📧💼👋]/g, '').trim();
                handleUserInput();
            });
            chatDynamicSuggestions.appendChild(btn);
        });
    }

    // Scroll to bottom of chat
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Persistent Storage integration
    function saveHistory() {
        localStorage.setItem('shourya_chat_state', JSON.stringify({
            history: state.history,
            currentTopic: state.currentTopic
        }));
    }

    function loadHistory() {
        const saved = localStorage.getItem('shourya_chat_state');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                state.history = parsed.history || [];
                state.currentTopic = parsed.currentTopic || 'general';
                
                // Redraw
                chatMessages.innerHTML = '';
                state.history.forEach(msg => {
                    drawMessageElement(msg.text, msg.sender, msg.time, msg.card);
                });
                
                // Show dynamic chips based on last bot reply or general greeting
                const lastBotMsg = [...state.history].reverse().find(m => m.sender === 'bot');
                if (lastBotMsg) {
                    const match = qaDataset.find(item => item.variations.some(v => v.includes(lastBotMsg.text.substring(0, 15))));
                    if (match && match.chips) {
                        renderSuggestions(match.chips);
                    } else {
                        renderSuggestions(qaDataset[0].chips);
                    }
                } else {
                    sendBotGreeting();
                }
            } catch (e) {
                localStorage.removeItem('shourya_chat_state');
                sendBotGreeting();
            }
        } else {
            sendBotGreeting();
        }
        updateFooterCount();
    }

    function updateFooterCount() {
        const count = state.history.length;
        chatMsgCount.textContent = `${count} message${count !== 1 ? 's' : ''}`;
    }

    // Renders one message to the screen
    function drawMessageElement(text, sender, time, cardData) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}-message`;
        
        let content = `<div>${text}</div>`;
        
        // Render rich card if present
        if (cardData) {
            content += `
                <div class="chat-rich-card">
                    <div class="chat-rich-card-title">🔗 ${sanitize(cardData.title)}</div>
                    <div class="chat-rich-card-desc">${sanitize(cardData.desc)}</div>
                    <a class="chat-rich-card-link" href="${cardData.url}" target="_blank">
                        ${sanitize(cardData.linkText)}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                        </svg>
                    </a>
                </div>
            `;
        }
        
        content += `<span class="msg-time">${time}</span>`;
        msgDiv.innerHTML = content;
        
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    // Add new message to history array and screen
    function pushMessage(text, sender, card = null) {
        const time = formatTime();
        const msg = { text, sender, time, card };
        state.history.push(msg);
        drawMessageElement(text, sender, time, card);
        saveHistory();
        updateFooterCount();
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
        const ind = document.getElementById('typingIndicator');
        if (ind) ind.remove();
    }

    // Advanced Tokenizer and Scoring Engine
    function getBestNLPResponse(userInput) {
        const cleanInput = userInput.toLowerCase().replace(/[^\w\s]/g, ' ');
        const tokens = cleanInput.split(/\s+/).filter(t => t.length > 1);
        
        // Synonym mappings
        const synonymMap = {
            'cv': 'contact', 'resume': 'contact', 'mail': 'contact', 'email': 'contact',
            'letter': 'contact', 'phone': 'contact', 'call': 'contact', 'number': 'contact',
            'mobile': 'contact', 'whatsapp': 'contact', 'linkedin': 'contact',
            'github': 'contact', 'git': 'contact', 'repo': 'contact', 'code': 'contact',
            'leet': 'contact', 'leetcode': 'contact', 'hiring': 'hiring', 'job': 'hiring',
            'intern': 'hiring', 'internship': 'hiring', 'role': 'hiring', 'career': 'hiring',
            'location': 'location', 'live': 'location', 'address': 'location', 'noida': 'location',
            'delhi': 'location', 'place': 'location', 'where': 'location',
            'niyuktisetu': 'niyuktisetu', 'recruitment': 'niyuktisetu', 'biometric': 'niyuktisetu',
            'liveness': 'niyuktisetu', 'face': 'niyuktisetu', 'spoof': 'niyuktisetu',
            'irrigo': 'irrigo', 'water': 'irrigo', 'crop': 'irrigo', 'farm': 'irrigo',
            'agriculture': 'irrigo', 'soil': 'irrigo', 'iot': 'irrigo',
            'patent': 'research', 'paper': 'research', 'publish': 'research',
            'publication': 'research', 'crc': 'research', 'chapter': 'research',
            'gate': 'gate', 'da': 'gate', 'score': 'gate', 'exam': 'gate',
            'marks': 'gate', 'aktu': 'education', 'college': 'education',
            'degree': 'education', 'cgpa': 'education', 'marksheet': 'education'
        };

        // Context resolve (for short ambiguous phrases e.g. "tell me more", "code", "show repository")
        const isFollowUp = tokens.includes('more') || tokens.includes('code') || tokens.includes('explain') || tokens.includes('show') || tokens.includes('repo') || tokens.includes('link');
        if (isFollowUp && state.currentTopic !== 'general') {
            const contextMatches = qaDataset.filter(item => item.topics.includes(state.currentTopic));
            // Find specific sub-intent
            if (tokens.includes('metric') || tokens.includes('stat') || tokens.includes('performance') || tokens.includes('latency')) {
                const subMatch = contextMatches.find(c => c.id.includes('more'));
                if (subMatch) return subMatch;
            }
            if (contextMatches.length > 0) {
                // Return primary context match or detailed subtopic
                return contextMatches[0];
            }
        }

        let bestMatch = null;
        let highestScore = 0;

        qaDataset.forEach(item => {
            let score = 0;
            
            // Score based on keywords
            item.keywords.forEach(kw => {
                if (cleanInput.includes(kw)) {
                    score += 3;
                }
            });

            // Score based on tokens & synonyms
            tokens.forEach(tok => {
                if (item.keywords.includes(tok)) {
                    score += 2;
                }
                const syn = synonymMap[tok];
                if (syn && item.topics.includes(syn)) {
                    score += 2;
                }
            });

            // Score based on current topic context
            if (item.topics.includes(state.currentTopic)) {
                score += 1;
            }

            if (score > highestScore) {
                highestScore = score;
                bestMatch = item;
            }
        });

        // Threshold matching score
        if (highestScore >= 2) {
            return bestMatch;
        }

        return null;
    }

    function sendBotGreeting() {
        const greetingData = qaDataset[0];
        const randomGreeting = greetingData.variations[Math.floor(Math.random() * greetingData.variations.length)];
        pushMessage(randomGreeting, 'bot');
        renderSuggestions(greetingData.chips);
    }

    function handleUserInput() {
        if (state.isThinking) return;
        const text = chatInput.value.trim();
        if (!text) return;

        // Reset input and counter
        chatInput.value = '';
        chatCharCount.textContent = '0/300';
        chatCharCount.style.color = '';

        // Add user message
        pushMessage(text, 'user');

        state.isThinking = true;
        showTypingIndicator();

        // Process response
        const match = getBestNLPResponse(text);
        
        // Dynamic thinking latency simulation
        const responseText = match 
            ? match.variations[Math.floor(Math.random() * match.variations.length)] 
            : fallbacks[Math.floor(Math.random() * fallbacks.length)];
            
        const delay = Math.min(Math.max(responseText.length * 12, 600), 1600);

        setTimeout(() => {
            removeTypingIndicator();
            state.isThinking = false;
            
            if (match) {
                // Update conversation context topic
                if (match.topics[0] !== 'general') {
                    state.currentTopic = match.topics[0];
                }
                pushMessage(responseText, 'bot', match.card || null);
                renderSuggestions(match.chips);
            } else {
                pushMessage(responseText, 'bot');
                renderSuggestions(["What are his technical skills? 💻", "Explain NiyuktiSetu 🔐", "Explain Irrigo 🌾", "How to contact him? 📱"]);
            }

            // If minimized, increment unread badge count
            if (!chatbotWidget.classList.contains('open')) {
                state.unreadCount++;
                chatUnreadBadge.textContent = state.unreadCount;
                chatUnreadBadge.style.display = 'flex';
            }
        }, delay);
    }

    // Toggle Chat Window
    function toggleChat() {
        const isOpen = chatbotWidget.classList.contains('open');
        
        if (isOpen) {
            chatbotWidget.classList.remove('open');
            chatNotification.classList.add('show');
        } else {
            chatbotWidget.classList.add('open');
            chatNotification.classList.remove('show');
            
            // Clear unread counts
            state.unreadCount = 0;
            chatUnreadBadge.style.display = 'none';
            
            setTimeout(() => chatInput.focus(), 300);
        }
    }

    // UI Listeners
    chatToggle.addEventListener('click', toggleChat);
    chatSendBtn.addEventListener('click', handleUserInput);
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserInput();
        }
    });

    // Real-time Character Counter
    chatInput.addEventListener('input', () => {
        const len = chatInput.value.length;
        chatCharCount.textContent = `${len}/300`;
        if (len >= 270) {
            chatCharCount.style.color = '#ef4444';
        } else {
            chatCharCount.style.color = '';
        }
    });

    // Clear Conversation History
    chatClearBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to clear your conversation history?")) {
            localStorage.removeItem('shourya_chat_state');
            state.history = [];
            state.currentTopic = 'general';
            chatMessages.innerHTML = '';
            sendBotGreeting();
            updateFooterCount();
        }
    });

    // Init Chat History
    loadHistory();

    // Auto notification after 5 seconds
    setTimeout(() => {
        if (!chatbotWidget.classList.contains('open') && state.history.length <= 1) {
            chatNotification.classList.add('show');
        }
    }, 5000);

});
