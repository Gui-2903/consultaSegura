# 🔍 Consulta Segura - Analisador de URLs Profissional

O **Consulta Segura** é uma aplicação Full Stack de segurança cibernética que permite aos usuários verificar a confiabilidade de links em tempo real. Utilizando a robusta infraestrutura da API do **VirusTotal**, o sistema processa URLs através de dezenas de motores de busca (como Avast, Google Safebrowsing e Kaspersky) para detectar ameaças, phishing e malwares.

---

## 🌐 Arquitetura do Projeto

Para garantir a segurança das chaves de API e contornar problemas de CORS, o projeto foi dividido em duas partes independentes:

1.  **Frontend (Este Repositório):** Interface moderna construída com foco em UX/UI, utilizando HTML5, CSS3 e JavaScript Vanilla.
2.  **Backend:** Servidor Proxy desenvolvido em Node.js que intermedia as requisições entre o cliente e o VirusTotal. 
    * 🔗 **Repositório do Back:** [vt-backend-consultaSegura](https://github.com/Gui-2903/vt-backend-consultaSegura/blob/F0r4zT31R0-patch-1/server.js)

Toda a infraestrutura está hospedada e operacional na plataforma **Render**.

---

## ✨ Funcionalidades em Destaque

- **Interface Dark Mode:** Design moderno com foco em legibilidade e estética profissional.
- **Análise Dinâmica (Polling):** O frontend gerencia o estado da análise, consultando o servidor automaticamente até que o relatório final esteja pronto.
- **Destaque de Ameaças:** Cartões de estatísticas com ícones e cores semânticas (Verde para seguro, Amarelo para suspeito, Vermelho para malicioso).
- **Lista Detalhada:** Exibição técnica de cada motor de análise e seu respectivo veredito.
- **Botões Interativos:** Feedback visual avançado com efeitos de escala e brilho ao passar o mouse.

---

## 🛠️ Tecnologias e Ferramentas

### Frontend
- **HTML5 & CSS3:** Uso intensivo de CSS Grid e Flexbox para responsividade.
- **JavaScript (ES6+):** Manipulação de DOM, consumo de APIs assíncronas (`fetch`) e lógica de temporização.

### Backend (Node.js)
- **Express:** Framework para roteamento de requisições.
- **Axios:** Cliente HTTP para comunicação com a API externa.
- **Multer:** Middleware para manipulação de `multipart/form-data`.
- **CORS:** Gerenciamento de permissões de acesso entre domínios.

---

## 🚀 Como Executar o Projeto

1.  Clone o repositório:
    ```bash
    git clone [https://github.com/Gui-2903/consulta-segura.git](https://github.com/Gui-2903/consulta-segura.git)
    ```
2.  Navegue até o diretório:
    ```bash
    cd consulta-segura
    ```
3.  Execute o `index.html`:
    * Você pode abrir o arquivo diretamente no navegador ou utilizar a extensão **Live Server** no VS Code para uma melhor experiência.

> **Importante:** O frontend já está configurado para apontar para o backend hospedado no Render. Caso queira rodar o servidor localmente, altere a constante `BASE_URL` no arquivo `script.js`.

---

## 👨‍💻 Sobre o Desenvolvedor

**Guilherme e Joao pedro**
Estudante de **Sistemas de Informação** na **UEMG**.
Atualmente no 6º semestre, com interesse em automação de processos, performance de software e desenvolvimento web moderno. 

---