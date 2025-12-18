// Welcome Screen Logic
const welcomeScreen = document.getElementById('welcome-screen');
const enterBtn = document.getElementById('enter-portfolio');

if (enterBtn && welcomeScreen) {
    enterBtn.addEventListener('click', () => {
        welcomeScreen.classList.add('hidden');
        document.body.classList.add('portfolio-active');
        // Enable scrolling after entry
        document.body.style.overflow = 'auto';

        // Remove from DOM calculation after animation
        setTimeout(() => {
            welcomeScreen.style.display = 'none';
        }, 1000);
    });
}

// Initial state: prevent scrolling while welcome screen is active
document.body.style.overflow = 'hidden';

// Navigation Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });
}

// Project Modal Logic (Keeping it compatible with new design)
const projectCodes = {
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
    }
};

function viewCode(projectName) {
    const project = projectCodes[projectName];
    if (!project) return;

    // Check if modal exists in HTML, if not, we can skip for now or alert
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

function previewProject(projectName) {
    const project = projectCodes[projectName];
    if (!project) return;
    window.open(project.preview, '_blank');
}
