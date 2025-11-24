// Welcome Screen Logic
window.addEventListener('load', () => {
    const welcomeScreen = document.getElementById('welcome-screen');
    if (welcomeScreen) {
        setTimeout(() => {
            welcomeScreen.style.opacity = '0';
            welcomeScreen.style.visibility = 'hidden';
            initScrollAnimations();
        }, 2500);
    }
});

// Hamburger Menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.project-card, .section h2, .hero-content').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(el);
    });
}

// Project Codes Data
const projectCodes = {
    amazon: {
        title: 'Amazon Clone',
        language: 'HTML',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Amazon Clone</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <nav class="navbar">
            <div class="logo"><img src="amazon-logo.png" alt="Amazon"></div>
            <div class="search-bar"><input type="text" placeholder="Search Amazon"><button>Search</button></div>
            <div class="nav-links"><a href="#">Account</a><a href="#">Cart</a></div>
        </nav>
    </header>
    <main>
        <section class="hero"><h1>Welcome to Amazon Clone</h1><p>Shop the best products at amazing prices</p></section>
        <section class="products"><!-- Product cards here --></section>
    </main>
    <script src="script.js"><\/script>
</body>
</html>`,
        preview: 'https://github.com/ramagl'
    },
    flowcode: {
        title: 'Flowcode',
        language: 'JavaScript',
        code: `// FlowCode - Advanced C to Flowchart Converter
const codeInput = document.getElementById('codeInput');
const generateBtn = document.getElementById('generateBtn');
const flowchartCanvas = document.getElementById('flowchartCanvas');

generateBtn.addEventListener('click', () => {
    const code = codeInput.value.trim();
    if (!code) { alert('⚠️ Please enter some C code first!'); return; }
    generateFlowchart(code);
});

function generateFlowchart(code) {
    // Simplified logic for display purposes
    const container = document.getElementById('flowchartCanvas');
    container.innerHTML = '<div class="flowchart">Flowchart generated for: ' + code.substring(0, 20) + '...</div>';
}
`,
        preview: 'flowcode/index.html'
    },
    portfolio: {
        title: 'Portfolio Website',
        language: 'HTML',
        code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav>
        <div class="logo">Portfolio</div>
        <ul class="nav-links">
            <li><a href="#about">About</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
    </nav>
    <section class="hero">
        <h1>Hi, I'm <span>Your Name</span></h1>
        <p>Full Stack Developer & Designer</p>
        <a href="#projects" class="cta-btn">View My Work</a>
    </section>
    <section id="projects">
        <h2>My Projects</h2>
        <div class="project-grid"><!-- Project cards here --></div>
    </section>
    <script src="script.js"><\/script>
</body>
</html>`,
        preview: 'index.html'
    }
};

// Modal Functions
function viewCode(projectName) {
    const project = projectCodes[projectName];
    if (!project) return;
    
    const modalTitle = document.getElementById('modalTitle');
    const codeLanguage = document.getElementById('codeLanguage');
    const codeContent = document.getElementById('codeContent');
    const codeModal = document.getElementById('codeModal');

    if (modalTitle) modalTitle.textContent = project.title + ' - Code';
    if (codeLanguage) codeLanguage.textContent = project.language;
    if (codeContent) codeContent.textContent = project.code;
    if (codeModal) codeModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const codeModal = document.getElementById('codeModal');
    if (codeModal) codeModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function copyCode() {
    const codeContent = document.getElementById('codeContent');
    if (!codeContent) return;
    
    navigator.clipboard.writeText(codeContent.textContent).then(() => {
        const btn = document.querySelector('.copy-code-btn');
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            btn.style.background = 'var(--primary-purple)';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = 'rgba(124, 58, 237, 0.2)';
            }, 2000);
        }
    });
}

function downloadCode(projectName) {
    const project = projectCodes[projectName];
    if (!project) return;
    
    const blob = new Blob([project.code], {type: 'text/html'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName}-clone.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    alert(`✅ ${project.title} code downloaded successfully!`);
}

function previewProject(projectName) {
    const project = projectCodes[projectName];
    if (!project) return;
    window.open(project.preview, '_blank');
}

// Modal Event Listeners
window.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('codeModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'codeModal') {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});
