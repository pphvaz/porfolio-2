# Portfolio Tech

Um portfólio profissional moderno e responsivo desenvolvido com Node.js, Express e MySQL.

## 🎥 Demonstração

[![Demo do Portfolio](https://img.youtube.com/vi/6q8WBR_V-7s/0.jpg)](https://youtu.be/6q8WBR_V-7s)

## 🚀 Tecnologias Utilizadas

- **Frontend:**
  - HTML5
  - CSS3
  - JavaScript
  - Font Awesome (ícones)
  - Google Fonts (Poppins)

- **Backend:**
  - Node.js
  - Express.js
  - MySQL

## ✨ Funcionalidades

- Design responsivo e moderno
- Seção de apresentação profissional
- Galeria de projetos
- Lista de habilidades técnicas
- Formulário de contato
- Integração com redes sociais (GitHub e LinkedIn)
- Sistema de categorização de projetos
- Banco de dados MySQL para gerenciamento de conteúdo

## 🛠️ Configuração do Ambiente

1. Clone o repositório:
```bash
git clone https://github.com/pphvaz/porfolio-2.git
cd porfolio-2
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o banco de dados MySQL:
- Crie um banco de dados chamado `portfolio_db`
- Configure as credenciais no arquivo `app.js`

4. Inicie o servidor:
```bash
node app.js
```

O servidor estará rodando em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
portfolio-2/
├── app.js              # Servidor Express e configurações
├── public/             # Arquivos estáticos
│   ├── images/        # Imagens do projeto
│   ├── index.html     # Página principal
│   ├── styles.css     # Estilos
│   └── script.js      # JavaScript do cliente
├── package.json        # Dependências do projeto
└── README.md          # Este arquivo
```

## 🔧 Configuração do Banco de Dados

O projeto utiliza as seguintes tabelas:
- `categorias`: Categorias dos projetos
- `projetos`: Informações dos projetos
- `habilidades`: Habilidades técnicas
- `projeto_habilidades`: Relação entre projetos e habilidades

## 👨‍💻 Autor

Pedro Alves
- GitHub: [@pphvaz](https://github.com/pphvaz)
- LinkedIn: [Pedro Alves](https://www.linkedin.com/in/pedro-alves-579a93140/)

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 