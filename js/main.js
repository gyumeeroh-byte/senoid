document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '1rem 0';
            navbar.style.background = 'rgba(5, 5, 5, 0.95)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.8)';
            navbar.style.borderBottom = '1px solid rgba(230, 185, 64, 0.2)';
        } else {
            navbar.style.padding = '1.5rem 0';
            navbar.style.background = 'rgba(5, 5, 5, 0.7)';
            navbar.style.boxShadow = 'none';
            navbar.style.borderBottom = '1px solid rgba(230, 185, 64, 0.1)';
        }
    });

    // 2. Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                     top: offsetPosition,
                     behavior: "smooth"
                });
            }
        });
    });

    // 3. Scroll Reveal Animation
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll, .science-block').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // 4. Gold Particle Effect on Canvas
    initParticles();
    
    // 5. BGM & Premium Intro Overlay Integration
    initBgmAndIntro();
});

function initTypewriter() {
    const titleElement = document.getElementById('typewriter-title');
    if (!titleElement) return;

    const text1 = "시간의 방향을 바꾸다";
    const text2 = "차세대 ";
    const text3 = "세놀리틱";
    const text4 = " 솔루션";
    
    let htmlContent = "";
    titleElement.innerHTML = '<span class="type-cursor"></span>';
    
    let i = 0;
    let phase = 1;
    let speed = 80; // ms per char

    function type() {
        if (phase === 1) {
            if (i === 0) htmlContent += '<span class="hero-line1">';
            if (i < text1.length) {
                htmlContent += text1.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                htmlContent += "</span><br><span class='hero-line2'>";
                i = 0;
                phase = 2;
                setTimeout(type, speed + 200); // pause at line break
            }
        } else if (phase === 2) {
            if (i < text2.length) {
                htmlContent += text2.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                htmlContent += '<span class="gold-gradient">';
                i = 0;
                phase = 3;
                setTimeout(type, speed);
            }
        } else if (phase === 3) {
            if (i < text3.length) {
                htmlContent += text3.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                htmlContent += '</span>';
                i = 0;
                phase = 4;
                setTimeout(type, speed);
            }
        } else if (phase === 4) {
            if (i < text4.length) {
                htmlContent += text4.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                htmlContent += "</span>"; // close hero-line2
            }
        }
        titleElement.innerHTML = htmlContent + '<span class="type-cursor"></span>';
    }
    
    // Start typing after initial load animation
    setTimeout(type, 1000);
}

function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width, height, particles;
    
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    window.addEventListener('resize', resize);
    resize();
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5; // Small shiny particles
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            // Gold colors
            const colors = ['#e6b940', '#f9d976', '#b8860b', '#ffffff'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.alpha = Math.random();
            this.alphaChange = Math.random() * 0.02 - 0.01;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Twinkle effect
            this.alpha += this.alphaChange;
            if(this.alpha <= 0.1 || this.alpha >= 1) {
                this.alphaChange = -this.alphaChange;
            }
            
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.restore();
        }
    }
    
    class MobiusStar {
        constructor(phaseOffset) {
            this.t = phaseOffset;
            this.speed = 0.0225; // 기존 대비 1.5배 더 빠르게
            this.history = [];
            this.maxHistory = 80; // 속도에 맞춰 꼬리 길이 적절히 조정
        }
        
        update() {
            this.t += this.speed;
            
            // Lemniscate of Bernoulli (Infinity symbol)
            const scaleX = width * 0.45;
            const scaleY = height * 0.35;
            
            const denominator = Math.sin(this.t) ** 2 + 1;
            this.x = width / 2 + (scaleX * Math.cos(this.t)) / denominator;
            this.y = height / 2 + (scaleY * Math.cos(this.t) * Math.sin(this.t)) / denominator;
            
            this.history.unshift({x: this.x, y: this.y});
            if (this.history.length > this.maxHistory) {
                this.history.pop();
            }
        }
        
        draw() {
            if (this.history.length < 2) return;
            
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.lineCap = "round";
            
            // Draw path segments for perfect curve fading
            for (let i = 0; i < this.history.length - 1; i++) {
                ctx.beginPath();
                ctx.moveTo(this.history[i].x, this.history[i].y);
                ctx.lineTo(this.history[i+1].x, this.history[i+1].y);
                
                const ratio = i / this.history.length;
                const opacity = Math.pow(1 - ratio, 1.5); // non-linear fade
                
                if (i < 10) {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                    ctx.lineWidth = 3 - (i * 0.1);
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = '#ffffff';
                } else {
                    ctx.strokeStyle = `rgba(249, 217, 118, ${opacity * 0.8})`;
                    ctx.lineWidth = 2;
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = '#e6b940';
                }
                ctx.stroke();
            }
            
            // Star core (head)
            const head = this.history[0];
            ctx.beginPath();
            ctx.arc(head.x, head.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#ffffff';
            ctx.fill();
            
            ctx.restore();
        }
    }
    
    let mobiusStars = [];
    function createParticles() {
        particles = [];
        const numParticles = Math.min(window.innerWidth / 10, 100);
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
        
        // Two mobius stars on opposite sides of the infinity loop
        mobiusStars = [
            new MobiusStar(0),
            new MobiusStar(Math.PI)
        ];
    }
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        for (let i = 0; i < mobiusStars.length; i++) {
            mobiusStars[i].update();
            mobiusStars[i].draw();
        }
        requestAnimationFrame(animate);
    }
    
    createParticles();
    animate();
}

function initBgmAndIntro() {
    const introOverlay = document.getElementById('introOverlay');
    const enterBtn = document.getElementById('enterBtn');
    const bgmAudio = document.getElementById('bgmAudio');
    const soundToggle = document.getElementById('soundToggle');
    const soundText = soundToggle ? soundToggle.querySelector('.sound-text') : null;
    
    if (!introOverlay || !enterBtn || !bgmAudio || !soundToggle) return;

    let isPlaying = false;

    // Helper to start playback
    async function playAudio() {
        try {
            await bgmAudio.play();
            isPlaying = true;
            soundToggle.classList.add('playing');
            if (soundText) soundText.textContent = "SOUND ON";
        } catch (err) {
            console.log("Audio play failed, user interaction might be required: ", err);
            isPlaying = false;
            soundToggle.classList.remove('playing');
            if (soundText) soundText.textContent = "SOUND OFF";
        }
    }

    // Helper to pause playback
    function pauseAudio() {
        bgmAudio.pause();
        isPlaying = false;
        soundToggle.classList.remove('playing');
        if (soundText) soundText.textContent = "SOUND OFF";
    }

    // 1. Enter Experience Button Handler
    enterBtn.addEventListener('click', () => {
        // Start playing music
        playAudio();
        
        // Cinematic fade-out of overlay
        introOverlay.classList.add('fade-out');
        
        // Remove overlay from DOM after animation completes (1.2s)
        setTimeout(() => {
            introOverlay.remove();
        }, 1200);

        // DELAYED TRIGGER: Start the typewriter effect only when entering
        // This ensures the user witnesses the typewriter effect dynamically
        setTimeout(() => {
            initTypewriter();
        }, 800);
    });

    // 2. Sound Toggle Button Handler
    soundToggle.addEventListener('click', () => {
        if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    });

    // 3. Smart Visibility API Handler
    // When tab loses focus, pause music. When focus returns, resume music (if it was playing).
    let wasPlayingBeforeHidden = false;
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (isPlaying) {
                wasPlayingBeforeHidden = true;
                pauseAudio();
            } else {
                wasPlayingBeforeHidden = false;
            }
        } else {
            if (wasPlayingBeforeHidden) {
                playAudio();
            }
        }
    });
}
