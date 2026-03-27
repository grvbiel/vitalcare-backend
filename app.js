/**
 * app.js - Arquivo principal da aplicação VitalCare
 * Configuração do servidor Express e inicialização da API
 * Ponto de entrada da aplicação que conecta todos os componentes
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Importa as rotas da aplicação
const routes = require('./routes/routes');

// Configurações da aplicação
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Cria a instância do Express
const app = express();

/**
 * Middlewares Globais
 * Configurações aplicadas a todas as requisições
 */

// Middleware de segurança (Helmet)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// Middleware de CORS (Cross-Origin Resource Sharing)
app.use(cors({
    origin: NODE_ENV === 'production' 
        ? ['https://vitalcare.com.br'] // Domínios permitidos em produção
        : ['http://localhost:3000', 'http://localhost:3001'], // Desenvolvimento
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware de logging (Morgan)
if (NODE_ENV === 'development') {
    app.use(morgan('dev')); // Logging detalhado em desenvolvimento
} else {
    app.use(morgan('combined')); // Logging padrão em produção
}

// Middleware para parsing de JSON
app.use(express.json({ 
    limit: '10mb', // Limite de tamanho do payload
    strict: true   // Apenas arrays e objetos permitidos
}));

// Middleware para parsing de dados de formulário
app.use(express.urlencoded({ 
    extended: true, 
    limit: '10mb' 
}));

/**
 * Middleware personalizado para logging de requisições
 * Registra informações detalhadas sobre cada requisição
 */
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const clientIP = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    
    console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${clientIP} - User-Agent: ${userAgent}`);
    
    // Adiciona tempo de início para medição de performance
    req.startTime = Date.now();
    
    next();
});

/**
 * Middleware para medição de tempo de resposta
 * Calcula e loga o tempo de processamento de cada requisição
 */
app.use((req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
        const responseTime = Date.now() - req.startTime;
        console.log(`[${new Date().toISOString()}] Response time: ${responseTime}ms - Status: ${res.statusCode}`);
        
        // Adiciona headers de resposta personalizados
        res.set('X-Response-Time', `${responseTime}ms`);
        res.set('X-API-Version', '1.0.0');
        res.set('X-Powered-By', 'VitalCare-API');
        
        originalSend.call(this, data);
    };
    
    next();
});

/**
 * Configuração de rotas
 * Todas as rotas da API são definidas no arquivo routes.js
 */

// Rota raiz - informações da API
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Bem-vindo à API VitalCare',
        version: '1.0.0',
        description: 'Sistema de agendamento de consultas médicas',
        endpoints: {
            auth: {
                login: 'POST /login',
                validateToken: 'POST /validate-token',
                profile: 'GET /profile',
                logout: 'POST /logout'
            },
            admin: {
                dashboard: 'GET /admin/dashboard',
                stats: 'GET /admin/stats',
                users: 'GET /admin/users',
                appointments: 'GET /admin/appointments',
                alerts: 'GET /admin/alerts',
                charts: 'GET /admin/charts',
                health: 'GET /admin/health'
            },
            public: {
                health: 'GET /health'
            }
        },
        documentation: 'https://api.vitalcare.com.br/docs',
        timestamp: new Date().toISOString()
    });
});

// Aplica as rotas da aplicação
app.use('/api', routes);

// Rota alternativa sem prefixo /api (compatibilidade)
app.use('/', routes);

/**
 * Middleware para tratamento de erros 404 (rotas não encontradas)
 * Deve ser configurado após todas as rotas
 */
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
        timestamp: new Date().toISOString(),
        suggestions: [
            'Verifique se a URL está correta',
            'Consulte a documentação da API em GET /',
            'Use POST /login para autenticação',
            'Use GET /health para verificar o status da API'
        ]
    });
});

/**
 * Middleware global de tratamento de erros
 * Captura erros não tratados em qualquer parte da aplicação
 */
app.use((error, req, res, next) => {
    console.error('Erro global capturado:', error);
    
    // Determina o status code do erro
    const statusCode = error.statusCode || error.status || 500;
    
    // Prepara a resposta de erro
    const errorResponse = {
        success: false,
        message: error.message || 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
        method: req.method
    };
    
    // Em desenvolvimento, inclui mais detalhes do erro
    if (NODE_ENV === 'development') {
        errorResponse.stack = error.stack;
        errorResponse.details = error.details || null;
    }
    
    res.status(statusCode).json(errorResponse);
});

/**
 * Tratamento de exceções não capturadas
 * Evita que a aplicação quebre completamente
 */
process.on('uncaughtException', (error) => {
    console.error('Exceção não capturada:', error);
    // Em produção, você pode querer reiniciar o processo aqui
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Rejeição não tratada em:', promise, 'razão:', reason);
    // Em produção, você pode querer reiniciar o processo aqui
});

/**
 * Inicialização do servidor
 * Inicia o servidor Express na porta configurada
 */
const server = app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    🏥 VITALCARE API                          ║
║                Sistema de Saúde Pública                      ║
╠══════════════════════════════════════════════════════════════╣
║  Status: 🟢 Online                                            ║
║  Porta: ${PORT.toString().padEnd(53)} ║
║  Ambiente: ${NODE_ENV.padEnd(49)} ║
║  Timestamp: ${new Date().toISOString().padEnd(46)} ║
╠══════════════════════════════════════════════════════════════╣
║  Endpoints Disponíveis:                                       ║
║  • POST /api/login - Autenticação                            ║
║  • GET /api/health - Health Check                            ║
║  • GET /api/admin/dashboard - Dashboard Admin                ║
║  • GET /api/ - Informações da API                            ║
╚══════════════════════════════════════════════════════════════╝
    `);
});

/**
 * Graceful shutdown - Desligamento elegante do servidor
 * Permite finalizar requisições em andamento antes de encerrar
 */
process.on('SIGTERM', () => {
    console.log('SIGTERM recebido. Iniciando graceful shutdown...');
    
    server.close(() => {
        console.log('Servidor encerrado com sucesso.');
        process.exit(0);
    });
    
    // Força o encerramento após 10 segundos
    setTimeout(() => {
        console.error('Forçando encerramento após timeout.');
        process.exit(1);
    }, 10000);
});

process.on('SIGINT', () => {
    console.log('SIGINT recebido. Iniciando graceful shutdown...');
    
    server.close(() => {
        console.log('Servidor encerrado com sucesso.');
        process.exit(0);
    });
    
    // Força o encerramento após 10 segundos
    setTimeout(() => {
        console.error('Forçando encerramento após timeout.');
        process.exit(1);
    }, 10000);
});

// Exporta a aplicação para testes
module.exports = app;
