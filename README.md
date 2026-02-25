# 🚀 TaskMaster API

Este é um projeto de API Backend para gerenciamento de tarefas (To-Do List), evoluído de um CRUD básico para uma arquitetura profissional utilizando **Node.js**, **Express 5** e **TypeScript**.

## 🛠️ Evoluções Implementadas

Diferente de um CRUD comum, este projeto aplica padrões de mercado para garantir escalabilidade e manutenção:

- **Service Layer**: Toda a lógica de persistência e regras de negócio foi movida para `services/`, isolando-a dos Controllers.
- **Global Error Handling**: Implementação de um middleware customizado para captura centralizada de erros, eliminando a necessidade de blocos `try/catch` repetitivos nos controllers.
- **Express 5 Native Async**: Aproveitamento do suporte nativo a Promises do Express 5 para um código mais limpo.
- **Validação com Zod**: Esquemas rigorosos para garantir que apenas dados válidos (Payload e URL Params) cheguem à camada de serviço.
- **Persistência Atômica**: Gerenciamento de IDs robusto e manipulação de arquivos JSON via `fs.promises`.

## 📂 Estrutura de Pastas

```text
src/
├── controllers/    # Recebe as requisições e envia respostas
├── services/       # Contém a lógica de negócio e manipulação de dados
├── schemas/        # Definições de tipos e validações Zod
├── middlewares/    # Filtros globais (como o de erro)
├── errors/         # Classes de erro customizadas (AppError)
├── routes/         # Definição dos endpoints
└── app.ts          # Configuração e inicialização do servidor
```

## Como Rodar o Projeto

- Instale as dependências: npm install
- Inicie o servidor: npm run dev
- A API estará disponível em http://localhost:3333
