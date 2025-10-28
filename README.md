### DevBills - BackEnd

Este é o backend do projeto DevBills, uma aplicação de controle financeiro pessoal desenvolvida para praticar TypeScript, Prisma, MongoDB e Fastify.
O objetivo é gerenciar entradas e saídas financeiras, permitindo que o frontend se comunique com uma API organizada e validada.

### 📘 Sobre o Projeto

O DevBills é um sistema de controle financeiro que permite cadastrar e gerenciar transações (entradas e saídas), oferecendo uma base sólida para estudos de arquitetura backend moderna com Node.js.

Este backend foi construído com:

- Fastify como servidor HTTP

- Prisma como ORM

- MongoDB como banco de dados

- Zod para validação de dados

- Arquitetura MVC (Model-View-Controller) para melhor organização do código

### O frontend do projeto está disponível em:
👉 [DevBills - FrontEnd](https://github.com/PolyannaMeira/DevBills-FrontEnd)
Frontend desenvolvido em React + TypeScript + Tailwind:

### ⚙️ Tecnologias Utilizadas

- Node.js;
- TypeScript;
- Fastify;
- Prisma;
- MongoDB;
- Zod;
- Arquitetura MVC;

### 🚀 Como Instalar e Executar
1. Clonar o repositório
git clone https://github.com/PolyannaMeira/DevBills-BackEnd.git

2. Acessar a pasta do projeto
 - cd DevBills-BackEnd

3. Instalar as dependências
- npm install

4. Configurar as variáveis de ambiente

- Crie um arquivo .env na raiz do projeto com as variáveis abaixo:

DATABASE_URL="mongodb+srv://<usuario>:<senha>@<cluster>/<database>?retryWrites=true&w=majority"
PORT=3333

5. Gerar o cliente Prisma
- npx prisma generate

6. Executar o servidor
- npm run dev


### O servidor será iniciado em:

http://localhost:3333

### 🧠 Funcionalidades Principais

- Cadastro de transações (entradas e saídas)
- Listagem de transações;
- Atualização e exclusão de registros;
- Validação de dados com Zod;
- Integração completa com o frontend DevBills.

### 🧾 Objetivo de Aprendizado

Este projeto foi desenvolvido com o propósito de praticar e aprofundar o conhecimento em:

- Arquitetura MVC;
- APIs RESTful;
- ORM com Prisma e MongoDB;
- Validação de dados com Zod;
- Boas práticas com TypeScript e Fastify.

