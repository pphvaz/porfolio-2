// API base URL
const API_URL = 'http://localhost:3000';

// DOM Elements
const projectsContainer = document.getElementById('projects-container');
const skillsContainer = document.getElementById('skills-container');
const contactForm = document.getElementById('contact-form');
const newProjectBtn = document.getElementById('new-project-btn');
const projectModal = document.getElementById('project-modal');
const projectForm = document.getElementById('project-form');
const modalTitle = document.getElementById('modal-title');
const closeModal = document.querySelector('.close-modal');

// Fetch and display projects
async function fetchProjects() {
    try {
        const response = await fetch(`${API_URL}/projetos`);
        const projects = await response.json();
        
        projectsContainer.innerHTML = projects.map(project => `
            <div class="project-card" data-id="${project.id}">
                <div class="card-actions">
                    <button class="edit-btn" onclick="editProject(${project.id})" title="Editar projeto">
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteProject(${project.id})" title="Excluir projeto">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
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

// Funções auxiliares
function showModal() {
    projectModal.style.display = 'block';
}

function hideModal() {
    projectModal.style.display = 'none';
    projectForm.reset();
}

function createProjectCard(project) {
    return `
        <div class="project-card" data-id="${project.id}">
            <img src="${project.imagem_url}" alt="${project.nome}" class="project-image">
            <div class="project-info">
                <h3>${project.nome}</h3>
                <p>${project.descricao}</p>
                <div class="project-tags">
                    <span class="project-tag">${project.categoria_nome || 'Sem categoria'}</span>
                </div>
                <div class="card-actions">
                    <button class="edit-btn" onclick="editProject(${project.id})">Editar</button>
                    <button class="delete-btn" onclick="deleteProject(${project.id})">Excluir</button>
                </div>
            </div>
        </div>
    `;
}

// Carregar categorias
async function loadCategories() {
    try {
        const response = await fetch(`${API_URL}/categorias`);
        const categories = await response.json();
        const categorySelect = document.getElementById('project-category');
        categorySelect.innerHTML = `
            <option value="">Selecione uma Categoria</option>
            ${categories.map(cat => `<option value="${cat.id}">${cat.nome}</option>`).join('')}
        `;
    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
    }
}

// Criar novo projeto
async function createProject(projectData) {
    try {
        const response = await fetch(`${API_URL}/projetos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectData)
        });
        if (response.ok) {
            hideModal();
            fetchProjects();
        }
    } catch (error) {
        console.error('Erro ao criar projeto:', error);
    }
}

// Editar projeto
async function editProject(id) {
    try {
        const response = await fetch(`${API_URL}/projetos/${id}`);
        const project = await response.json();
        
        document.getElementById('project-id').value = project.id;
        document.getElementById('project-name').value = project.nome;
        document.getElementById('project-description').value = project.descricao;
        document.getElementById('project-image').value = project.imagem_url;
        document.getElementById('project-link').value = project.link_projeto;
        document.getElementById('project-category').value = project.categoria_id;
        
        modalTitle.textContent = 'Editar Projeto';
        showModal();
    } catch (error) {
        console.error('Erro ao carregar projeto:', error);
    }
}

// Atualizar projeto
async function updateProject(id, projectData) {
    try {
        const response = await fetch(`${API_URL}/projetos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectData)
        });
        if (response.ok) {
            hideModal();
            fetchProjects();
        }
    } catch (error) {
        console.error('Erro ao atualizar projeto:', error);
    }
}

// Excluir projeto
async function deleteProject(id) {
    if (confirm('Tem certeza que deseja excluir este projeto?')) {
        try {
            const response = await fetch(`${API_URL}/projetos/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchProjects();
            }
        } catch (error) {
            console.error('Erro ao excluir projeto:', error);
        }
    }
}

// Event Listeners
newProjectBtn.addEventListener('click', () => {
    modalTitle.textContent = 'Novo Projeto';
    projectForm.reset();
    showModal();
});

closeModal.addEventListener('click', hideModal);

window.addEventListener('click', (e) => {
    if (e.target === projectModal) {
        hideModal();
    }
});

projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const projectData = {
        nome: document.getElementById('project-name').value,
        descricao: document.getElementById('project-description').value,
        imagem_url: document.getElementById('project-image').value,
        link_projeto: document.getElementById('project-link').value,
        categoria_id: document.getElementById('project-category').value
    };

    const projectId = document.getElementById('project-id').value;
    
    if (projectId) {
        await updateProject(projectId, projectData);
    } else {
        await createProject(projectData);
    }
}); 