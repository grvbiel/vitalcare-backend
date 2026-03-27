# 🏥 VitalCare API

Sistema de agendamento de consultas médicas para saúde pública no Brasil, desenvolvido com Node.js e padrão MVC com Service Layer.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Uso](#uso)
- [Endpoints da API](#endpoints-da-api)
- [Padrão MVC Implementado](#padrão-mvc-implementado)
- [Expansão Futura](#expansão-futura)
- [Guia de Implementação](#guia-de-implementação)

## 🎯 Visão Geral

O VitalCare é uma API RESTful que facilita o agendamento de consultas médicas no sistema de saúde pública brasileiro. A aplicação implementa um sistema robusto de autenticação e um painel administrativo para gerenciamento.

### Funcionalidades Principais

- ✅ Autenticação de usuários e administradores
- ✅ Dashboard administrativo com estatísticas
- ✅ Middleware de segurança e validação
- ✅ Estrutura MVC com Service Layer
- ✅ Simulação de banco de dados
- ✅ Logging e monitoramento

## 🛠 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **JavaScript ES6+** - Linguagem de programação
- **MVC Pattern** - Arquitetura de software
- **Service Layer** - Camada de negócios

## 📁 Estrutura do Projeto

```
windsurf-project/
├── controllers/          # Camada Controller
│   ├── AuthController.js
│   └── AdminController.js
├── services/            # Camada Service
│   ├── AuthService.js
│   └── AdminService.js
├── models/              # Camada Model
│   └── UserModel.js
├── middlewares/         # Middlewares
│   └── authMiddleware.js
├── routes/              # Rotas da API
│   └── routes.js
├── config/              # Configurações
├── app.js              # Arquivo principal
├── package.json        # Dependências
└── README.md           # Documentação
```

## 🚀 Instalação

### Pré-requisitos

- Node.js >= 16.0.0
- npm >= 8.0.0

### Passos

1. **Clone o repositório**
   ```bash
   git clone <repositório-url>
   cd windsurf-project
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente** (opcional)
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

4. **Inicie o servidor**
   ```bash
   # Modo desenvolvimento
   npm run dev
   
   # Modo produção
   npm start
   ```

5. **Verifique a instalação**
   ```bash
   curl http://localhost:3000/api/health
   ```

## 📡 Uso

### Autenticação

Para acessar as rotas protegidas, você precisa de um token JWT:

```bash
# Login (usuário comum)
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "joao@vitalcare.com", "password": "senha123"}'

# Login (administrador)
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@vitalcare.com", "password": "admin123"}'
```

### Acesso ao Dashboard Admin

```bash
# Use o token obtido no login
curl -X GET http://localhost:3000/api/admin/dashboard \
  -H "Authorization: Bearer <seu-token>"
```

## 🔗 Endpoints da API

### Autenticação

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/api/login` | Login de usuário | ❌ |
| POST | `/api/validate-token` | Valida token JWT | ❌ |
| GET | `/api/profile` | Perfil do usuário | ✅ |
| POST | `/api/logout` | Logout | ✅ |

### Administrativo

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/api/admin/dashboard` | Dashboard completo | ✅ Admin |
| GET | `/api/admin/stats` | Estatísticas | ✅ Admin |
| GET | `/api/admin/users` | Lista de usuários | ✅ Admin |
| GET | `/api/admin/appointments` | Lista de consultas | ✅ Admin |
| GET | `/api/admin/alerts` | Alertas do sistema | ✅ Admin |
| GET | `/api/admin/charts` | Dados para gráficos | ✅ Admin |
| GET | `/api/admin/health` | Health check admin | ✅ Admin |

### Público

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/api/health` | Health check público | ❌ |
| GET | `/api/` | Informações da API | ❌ |

## 🏗 Padrão MVC Implementado

### Model (Modelo)
**Arquivo:** `models/UserModel.js`

**Responsabilidades:**
- Gerenciar dados dos usuários e consultas
- Simular banco de dados com arrays
- Fornecer métodos para CRUD operations
- Calcular estatísticas e métricas

**Principais métodos:**
- `findByEmail()` - Busca usuário por email
- `findById()` - Busca usuário por ID
- `getDashboardStats()` - Calcula estatísticas
- `getAllUsers()` - Retorna todos os usuários
- `getAllAppointments()` - Retorna todas as consultas

### View (Visualização)
**Implementação:** Respostas JSON da API

**Responsabilidades:**
- Formatar dados de resposta
- Padronizar estrutura de respostas
- Fornecer metadados (timestamps, status)

### Controller (Controlador)
**Arquivos:** `controllers/AuthController.js`, `controllers/AdminController.js`

**Responsabilidades:**
- Receber requisições HTTP
- Validar dados de entrada
- Chamar os Services apropriados
- Retornar respostas HTTP
- Tratar erros de forma padronizada

**Regra importante:** Controllers não contêm lógica de negócio!

### Service Layer (Camada de Serviço)
**Arquivos:** `services/AuthService.js`, `services/AdminService.js`

**Responsabilidades:**
- Conter toda a lógica de negócio
- Validar regras de negócio
- Gerar tokens JWT
- Processar dados complexos
- Orquestrar operações entre Models

**Principais métodos:**
- `login()` - Valida credenciais e gera token
- `validateToken()` - Verifica validade do token
- `getDashboardData()` - Processa dados do dashboard
- `verifyAdminAccess()` - Verifica permissões de admin

### Middleware
**Arquivo:** `middlewares/authMiddleware.js`

**Responsabilidades:**
- Interceptação de requisições
- Validação de autenticação
- Verificação de permissões
- Logging de requisições

**Principais middlewares:**
- `authenticate()` - Verifica token JWT
- `requireAdmin()` - Verifica role admin
- `authenticateAndRequireAdmin()` - Combina ambos

### Routes (Rotas)
**Arquivo:** `routes/routes.js`

**Responsabilidades:**
- Definir endpoints da API
- Associar middlewares às rotas
- Organizar rotas por funcionalidade
- Tratar rotas não encontradas

## 🚀 Expansão Futura

### 1. Sistema de Agendamento de Consultas

**Novos arquivos a criar:**

```
controllers/
├── AppointmentController.js
├── DoctorController.js
└── SpecialtyController.js

services/
├── AppointmentService.js
├── DoctorService.js
└── SpecialtyService.js

models/
├── DoctorModel.js
├── SpecialtyModel.js
└── AppointmentModel.js
```

**Funcionalidades a implementar:**

- ✅ Listar médicos disponíveis
- ✅ Verificar disponibilidade por data
- ✅ Agendar consulta
- ✅ Cancelar consulta
- ✅ Histórico de consultas do usuário
- ✅ Notificações por email/SMS

### 2. Banco de Dados Real

**Substituir arrays por:**
- PostgreSQL ou MySQL
- MongoDB (se preferir NoSQL)
- Implementar ORM (Sequelize ou Mongoose)

### 3. Autenticação Avançada

- Implementar refresh tokens
- Recuperação de senha por email
- Autenticação de dois fatores
- OAuth2 (Google, Facebook)

### 4. Monitoramento e Logging

- Implementar Winston para logging
- Adicionar métricas com Prometheus
- Dashboard de monitoramento
- Alertas automáticos

## 📋 Guia de Implementação Passo a Passo

### Passo 1: Estrutura Base
```bash
mkdir controllers services models routes middlewares config
```

### Passo 2: Model Layer
1. Crie `UserModel.js` com dados simulados
2. Implemente métodos CRUD básicos
3. Adicione métodos de estatísticas

### Passo 3: Service Layer
1. Crie `AuthService.js` com lógica de autenticação
2. Implemente geração/validação de tokens
3. Crie `AdminService.js` com lógica administrativa

### Passo 4: Controller Layer
1. Crie `AuthController.js` para endpoints de auth
2. Crie `AdminController.js` para endpoints admin
3. Implemente tratamento de erros

### Passo 5: Middleware
1. Crie `authMiddleware.js` com validação JWT
2. Implemente verificação de permissões
3. Adicione logging de requisições

### Passo 6: Routes
1. Configure `routes.js` com todos os endpoints
2. Associe middlewares às rotas
3. Implemente tratamento de 404

### Passo 7: App Configuration
1. Configure `app.js` com Express
2. Adicione middlewares globais
3. Implemente tratamento de erros

### Passo 8: Package e Deploy
1. Crie `package.json` com dependências
2. Configure scripts de start/dev
3. Adicione configurações de produção

## 🔧 Testes

Para testar a API:

```bash
# Instale as dependências de teste
npm install

# Execute os testes
npm test

# Execute com coverage
npm run test:coverage
```

## 📝 Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. Fork o repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Contato

- **Email:** contato@vitalcare.com.br
- **Website:** https://vitalcare.com.br
- **Issues:** https://github.com/vitalcare/vitalcare-api/issues

---

**VitalCare © 2024 - Tecnologia para saúde pública brasileira** 🇧🇷
