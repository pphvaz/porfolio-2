// API base URL
const API_URL = 'http://localhost:3000';

// DOM Elements
const projectsContainer = document.getElementById('projects-container');
const skillsContainer = document.getElementById('skills-container');
const contactForm = document.getElementById('contact-form');

// Fetch and display projects
async function fetchProjects() {
    try {
        const response = await fetch(`${API_URL}/projetos`);
        const projects = await response.json();
        
        projectsContainer.innerHTML = projects.map(project => `
            <div class="project-card">
                <img src="${project.imagem_url || 'https://via.placeholder.com/300x200'}" 
                     alt="${project.nome}" 
                     class="project-image">
                <div class="project-info">
                    <h3>${project.nome}</h3>
                    <p>${project.descricao}</p>
                    <div class="project-tags">
                        ${project.habilidades ? project.habilidades.split(',').map(skill => 
                            `<span class="project-tag">${skill.trim()}</span>`
                        ).join('') : ''}
                    </div>
                    ${project.link_projeto ? `
                        <a href="${project.link_projeto}" target="_blank" class="cta-button" style="margin-top: 1rem;">
                            Ver Projeto
                        </a>
                    ` : ''}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar projetos:', error);
        projectsContainer.innerHTML = '<p>Erro ao carregar projetos. Por favor, tente novamente mais tarde.</p>';
    }
}

// Fetch and display skills
async function fetchSkills() {
    try {
        const response = await fetch(`${API_URL}/habilidades`);
        const skills = await response.json();
        
        skillsContainer.innerHTML = skills.map(skill => `
            <div class="skill-card">
                <i class="fas fa-code"></i>
                <h3>${skill.nome}</h3>
                <p>Nível: ${skill.nivel}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar habilidades:', error);
        skillsContainer.innerHTML = '<p>Erro ao carregar habilidades. Por favor, tente novamente mais tarde.</p>';
    }
}

// Handle contact form submission
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    try {
        // Aqui você pode implementar o envio do formulário para um endpoint
        console.log('Dados do formulário:', formData);
        alert('Mensagem enviada com sucesso!');
        contactForm.reset();
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        alert('Erro ao enviar mensagem. Por favor, tente novamente mais tarde.');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    fetchProjects();
    fetchSkills();
});

// Add scroll event listener for navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    } else {
        navbar.style.backgroundColor = 'var(--white)';
    }
}); 