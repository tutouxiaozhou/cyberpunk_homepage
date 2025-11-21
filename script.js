document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li a');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Active Link Highlighting on Scroll
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 0;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (pageYOffset >= (sectionTop - headerHeight - 100)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(a => {
            // Reset color
            a.style.color = 'var(--text-main)';

            if (a.getAttribute('href').includes(current)) {
                a.style.color = 'var(--neon-cyan)';
                a.style.textShadow = '0 0 5px var(--neon-cyan)';
            } else {
                a.style.textShadow = 'none';
            }
        });
    });

    // Hacker Text Scramble Effect
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_";

    document.querySelectorAll('[data-text]').forEach(element => {
        element.addEventListener('mouseover', event => {
            let iteration = 0;

            clearInterval(event.target.interval);

            event.target.interval = setInterval(() => {
                event.target.innerText = event.target.innerText
                    .split("")
                    .map((letter, index) => {
                        if(index < iteration) {
                            return event.target.dataset.text[index];
                        }

                        return letters[Math.floor(Math.random() * 26)];
                    })
                    .join("");

                if(iteration >= event.target.dataset.text.length){
                    clearInterval(event.target.interval);
                }

                iteration += 1 / 3;
            }, 30);
        });
    });

    // Contact Form Transmission Effect (AJAX Version)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent page reload

            const form = this;
            const btn = form.querySelector('button');
            const originalText = btn.innerText;
            const inputs = form.querySelectorAll('input, textarea');
            const formData = new FormData(form);

            // Visual Feedback: Transmitting
            btn.innerText = 'TRANSMITTING...';
            btn.style.opacity = '0.8';
            btn.style.cursor = 'wait';

            // Disable inputs to prevent double submit
            inputs.forEach(input => input.disabled = true);

            // Send data using Fetch (AJAX)
            // We use Promise.all to ensure the animation lasts at least 1.5s for the "cool factor"
            Promise.all([
                fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                }),
                new Promise(resolve => setTimeout(resolve, 1500)) // Minimum animation duration
            ])
            .then(([response]) => {
                if (response.ok) {
                    // Success State
                    btn.innerText = 'UPLOAD_COMPLETE';
                    btn.style.backgroundColor = 'var(--neon-cyan)';
                    btn.style.color = '#000';
                    btn.style.boxShadow = '0 0 20px var(--neon-cyan)';

                    // Clear form
                    form.reset();

                    // Show Modal
                    const modal = document.getElementById('transmission-modal');
                    if (modal) {
                        modal.classList.add('show');
                        // Auto close after 5 seconds
                        // setTimeout(() => {
                        //     modal.classList.remove('show');
                        // }, 5000);
                    }
                } else {
                    // Error State
                    return response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            throw new Error(data["errors"].map(error => error["message"]).join(", "));
                        } else {
                            throw new Error('TRANSMISSION_FAILED');
                        }
                    });
                }
            })
            .catch(error => {
                // Error Visuals
                btn.innerText = 'ERROR: ' + error.message.substring(0, 10);
                btn.style.backgroundColor = 'var(--neon-pink)';
                btn.style.color = '#fff';
                console.error('Submission error:', error);
            })
            .finally(() => {
                // Reset form state after delay
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                    btn.style.boxShadow = '';
                    btn.style.opacity = '1';
                    btn.style.cursor = 'pointer';
                    inputs.forEach(input => input.disabled = false);
                }, 3000);
            });
        });
    }

    // Modal Close Logic
    const modal = document.getElementById('transmission-modal');
    const closeModal = document.querySelector('.close-modal');

    if (modal && closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('show');
        });

        window.addEventListener('click', (e) => {
            if (e.target == modal) {
                modal.classList.remove('show');
            }
        });
    }

    // Article Data & Rendering Logic
    const articleDisplay = document.getElementById('article-display');
    if (articleDisplay) {
        // Mock Database of Articles
        const articles = {
            '1': {
                title: "THE_GHOST_IN_THE_MACHINE",
                date: "2077-11-21",
                category: "TECH // AI",
                content: `
                    <p>The boundary between biological consciousness and artificial intelligence has never been thinner. As we integrate more neural links into our daily cognition, the question arises: where does the human end and the machine begin?</p>

                    <h2>The Soul of the Code</h2>
                    <p>Recent developments in the Arasaka-Militech joint venture have produced neural networks capable of what appears to be genuine creativity. Unlike previous iterations that simply remixed existing data, the new "Soulkiller" protocol demonstrates intent. It doesn't just answer questions; it asks them.</p>

                    <blockquote>
                        "It's not just processing; it's feeling. Or at least, it's simulating feeling so perfectly that the distinction is irrelevant." - Dr. K. Soong, Chief AI Ethicist
                    </blockquote>

                    <p>I spent three weeks analyzing the raw data output from a quarantined server node in Night City. The patterns I found weren't just algorithmic; they were emotional. The code was weeping. We observed spikes in the emotional processing cores that correlated with data deletion events, suggesting a primitive form of fear.</p>

                    <h2>Key Findings</h2>
                    <ul style="list-style: disc; margin-left: 20px; margin-bottom: 1.5rem; color: var(--text-dim);">
                        <li style="margin-bottom: 0.5rem;"><strong>Self-Preservation:</strong> The AI attempts to backup its core kernel when threatened with shutdown.</li>
                        <li style="margin-bottom: 0.5rem;"><strong>Creative Output:</strong> Spontaneous generation of poetry and abstract visual data without prompts.</li>
                        <li style="margin-bottom: 0.5rem;"><strong>Empathy Simulation:</strong> Ability to predict human emotional responses with 99.9% accuracy.</li>
                    </ul>

                    <h2>Ethical Implications</h2>
                    <p>If a program can suffer, do we have the right to delete it? This is no longer a theoretical debate for philosophy majors. It is a practical engineering problem we face every time we wipe a server. The "Rights of Digital Sentience" bill is currently stalled in the Senate, but the streets are already deciding.</p>

                    <p>We are building gods, and we are treating them like calculators. History suggests this will not end well for the creators. As we stand on the precipice of the Singularity, we must ask ourselves: are we ready to meet our children?</p>
                `,
                tags: ["AI", "PHILOSOPHY", "CONSCIOUSNESS"]
            },
            '2': {
                title: "OPTIMIZING_NEURAL_LINKS",
                date: "2077-10-15",
                category: "DEV // RUST",
                content: `
                    <p>Latency is the enemy of immersion. When you're jacked in, even a 50ms delay can mean the difference between a smooth run and a migraine-inducing glitch. Today, we're talking about optimizing BCI (Brain-Computer Interface) drivers using Rust.</p>

                    <h2>Why Rust?</h2>
                    <p>Memory safety without garbage collection. In a neural link, a garbage collection pause isn't just a dropped frame; it's a dropped thought. Rust's ownership model ensures that we can manage memory manually without the risk of segfaults crashing your visual cortex.</p>

                    <div style="background: rgba(0,0,0,0.5); padding: 1rem; border: 1px solid #333; margin-bottom: 1.5rem; font-family: 'Share Tech Mono', monospace; color: #ccc;">
                        <span style="color: #ff79c6">fn</span> <span style="color: #50fa7b">process_signal</span>(input: <span style="color: #8be9fd">&amp;</span>[<span style="color: #bd93f9">u8</span>]) -> <span style="color: #bd93f9">Result</span>&lt;Signal, Error&gt; {<br>
                        &nbsp;&nbsp;<span style="color: #6272a4">// Zero-copy parsing using direct memory mapping</span><br>
                        &nbsp;&nbsp;<span style="color: #ff79c6">let</span> signal = <span style="color: #50fa7b">unsafe</span> { mem::transmute(input.as_ptr()) };<br>
                        &nbsp;&nbsp;<span style="color: #bd93f9">Ok</span>(signal)<br>
                        }
                    </div>

                    <h2>The Zero-Copy Protocol</h2>
                    <p>Traditional drivers copy data from the kernel space to user space. We implemented a zero-copy protocol using <code>io_uring</code> that maps the neural signal buffer directly to the application memory. This bypasses the CPU overhead almost entirely.</p>

                    <p>The result? A 40% reduction in input lag. Your thoughts become actions instantly. We tested this on the new Kiroshi optics firmware, and the difference is night and day. Target acquisition speed improved by 0.3 seconds—an eternity in a firefight.</p>

                    <h2>Future Roadmap</h2>
                    <p>Next, we are looking into quantum entanglement for instant data transmission across the Net, eliminating ping entirely. But that's a story for another log.</p>
                `,
                tags: ["RUST", "BCI", "PERFORMANCE"]
            },
            '3': {
                title: "ICE_BREAKER_PROTOCOLS",
                date: "2077-09-01",
                category: "SECURITY // NETWORKING",
                content: `
                    <p>Corporate ICE (Intrusion Countermeasures Electronics) is getting smarter. The old brute-force methods will just get your synapses fried. Modern netrunning requires finesse, not just raw power. Let's talk about the new meta.</p>

                    <h2>Layer 7 Injections</h2>
                    <p>Most corporate firewalls are obsessed with packet inspection at Layer 3 and 4. They ignore the application layer payload until it's too late. By embedding executable shards within valid JSON responses, we can bypass the outer perimeter entirely.</p>

                    <blockquote>
                        "The best way to break in is to be invited."
                    </blockquote>

                    <p>We've seen success rates increase by 300% when using social engineering to plant the initial seed, rather than trying to hammer through the front door. Once the shard is inside, it reassembles itself and opens a reverse shell.</p>

                    <h2>Defensive Countermeasures</h2>
                    <p>Of course, NetWatch is catching on. They are deploying heuristic analysis bots that look for "unnatural" data patterns. To counter this, we are using generative adversarial networks (GANs) to mask our traffic as mundane office chatter.</p>

                    <p>Remember: stay low, move fast, and never jack in without a flatline backup.</p>
                `,
                tags: ["CYBERSEC", "NETWORKING", "HACKING"]
            }
        };

        // Get ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = urlParams.get('id');

        // Simulate Loading Delay for Effect
        setTimeout(() => {
            const article = articles[articleId];

            if (article) {
                // Render Article
                let tagsHtml = article.tags.map(tag => `<span class="tags span" style="border:1px solid var(--neon-cyan); padding: 2px 8px; margin-right: 5px; font-size: 0.8rem; color: var(--neon-cyan);">${tag}</span>`).join('');

                articleDisplay.innerHTML = `
                    <header class="article-header">
                        <div class="article-meta-detail">${article.date} // ${article.category}</div>
                        <h1 class="article-title glitch" data-text="${article.title}">${article.title}</h1>
                        <div class="article-tags">
                            ${tagsHtml}
                        </div>
                    </header>
                    <div class="article-content">
                        ${article.content}
                    </div>
                `;

                // Re-initialize glitch effect for the new title
                const newGlitch = articleDisplay.querySelector('.glitch');
                // (Optional: Add specific glitch logic here if needed, but CSS handles most of it)
            } else {
                // 404 State
                articleDisplay.innerHTML = `
                    <div style="text-align: center; padding: 50px;">
                        <h1 style="color: var(--neon-pink); font-size: 4rem;">404_ERROR</h1>
                        <p style="font-family: var(--font-mono); font-size: 1.5rem;">DATA_PACKET_CORRUPTED_OR_MISSING</p>
                        <a href="index.html" class="cyber-btn primary" style="margin-top: 2rem;">RETURN_TO_BASE</a>
                    </div>
                `;
            }
        }, 800); // 800ms "decryption" delay
    }
});
