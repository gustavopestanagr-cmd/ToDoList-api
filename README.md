# TaskMaster API: Secure Edition

Este projeto é uma API de gerenciamento de tarefas (To-Do List) que evoluiu de um CRUD básico para uma arquitetura profissional e segura, utilizando Node.js, Express 5 e TypeScript.

O diferencial deste projeto é a mentalidade Security by Design: a segurança não foi um "adendo", mas parte do planejamento estrutural.

## Camadas de Segurança (AppSec Focus)

Este projeto demonstra a implementação prática de defesas contra vulnerabilidades do OWASP Top 10:

- **Autenticação JWT (Broken Access Control)**: Implementação de tokens JSON Web Token para garantir que apenas usuários autenticados acessem o sistema.

- **Prevenção de IDOR (Insecure Direct Object Reference)**: Validação rigorosa de propriedade. O sistema cruza o userId extraído do token com o dono do recurso no banco de dados antes de qualquer GET, PATCH ou DELETE.

- **Criptografia com Bcrypt**: Senhas nunca são armazenadas em texto plano. Utilizamos hashing com fator de custo (Salt) para proteger a base de dados contra ataques de dicionário.

- **Input Sanitization (Zod)**: Proteção contra dados malformados e tentativas de injeção através de esquemas de validação rigorosos para Body e URL Params.

- **Fail-Safe Error Handling**: Middleware global que captura exceções e impede o vazamento de informações sensíveis do servidor (stack traces) em respostas HTTP 500.

## Evoluções de Arquitetura

Além da segurança, o código segue padrões de mercado para escalabilidade:

- **Service Layer**: Isolamento total da lógica de persistência e regras de negócio, facilitando testes e manutenção.

- **Express 5 Native Async**: Código limpo e moderno, aproveitando o suporte nativo a Promises para evitar o "callback hell".

- **Persistência Atômica**: Gerenciamento robusto de IDs e manipulação assíncrona de arquivos JSON via fs.promises.

## Estrutura do Projeto

```text
src/
├── controllers/    # Orquestração de requisições e respostas
├── services/       # Core: Lógica de negócio e regras de segurança
├── schemas/        # Contratos de dados e validações (Zod)
├── middlewares/    # Filtros de segurança (Auth) e tratamento de erros
├── errors/         # Definição de erros semânticos (AppError)
├── routes/         # Mapa de endpoints públicos e protegidos
└── app.ts          # Setup do servidor e pipeline de middlewares
```

## Como Testar (Foco no Fluxo Seguro)

- Instale as dependências: npm install
- Inicie o servidor: npm run dev
- A API estará disponível em http://localhost:3333

- **Registro & Login**: Use as rotas /auth/registrar e /auth/login para obter seu Token.

- **Bearer Auth**: No Postman, utilize o token na aba Authorization para acessar as rotas de /tarefas.

- **Teste de Permissão**: Tente editar uma tarefa de outro usuário e observe o sistema retornar 403 Forbidden, provando a eficácia da proteção contra IDOR.
