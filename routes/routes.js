/**
 * routes.js - Configuração de rotas da API VitalCare
 * Define todos os endpoints da aplicação e seus respectivos middlewares
 * Organiza as rotas por funcionalidade (autenticação, admin, etc.)
 */

const express = require('express');
const AuthController = require('../controllers/AuthController');
const AdminController = require('../controllers/AdminController');
const AuthMiddleware = require('../middlewares/authMiddleware');

// Cria o router do Express
const router = express.Router();

// Importa controllers e middlewares
const authController = AuthController;
const adminController = AdminController;
const authMiddleware = AuthMiddleware;

/**
 * Rotas Públicas (sem autenticação)
 */

// Rota de login - POST /login
router.post('/login', authController.login);

// Rota de validação de token - POST /validate-token
router.post('/validate-token', authController.validateToken);

// Rota de health check - GET /health
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API VitalCare está funcionando',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

/**
 * Rotas de Autenticação (requerem token válido)
 */

// Middleware de autenticação para as rotas abaixo
router.use(authMiddleware.authenticate);

// Perfil do usuário - GET /profile
router.get('/profile', authController.getProfile);

// Logout - POST /logout
router.post('/logout', authController.logout);

/**
 * Rotas Administrativas (requerem autenticação + role admin)
 */

// Aplica middleware combinado: autenticação + verificação de admin
// Todas as rotas abaixo deste ponto requerem privilégios de administrador
router.use('/admin', authMiddleware.authenticateAndRequireAdmin);

// Dashboard administrativo - GET /admin/dashboard
router.get('/admin/dashboard', adminController.getDashboard);

// Estatísticas do sistema - GET /admin/stats
router.get('/admin/stats', adminController.getStats);

// Lista de usuários - GET /admin/users
router.get('/admin/users', adminController.getUsers);

// Lista de consultas - GET /admin/appointments
router.get('/admin/appointments', adminController.getAppointments);

// Alertas do sistema - GET /admin/alerts
router.get('/admin/alerts', adminController.getAlerts);

// Dados para gráficos - GET /admin/charts
router.get('/admin/charts', adminController.getCharts);

// Health check administrativo - GET /admin/health
router.get('/admin/health', adminController.healthCheck);

/**
 * Rotas Futuras (para implementação de agendamento de consultas)
 * Estas rotas estão comentadas mas servem como guia para expansão
 */

/*
// Rotas de agendamento (usuários autenticados)
router.get('/appointments', appointmentController.getUserAppointments);
router.post('/appointments', appointmentController.createAppointment);
router.put('/appointments/:id', appointmentController.updateAppointment);
router.delete('/appointments/:id', appointmentController.cancelAppointment);

// Rotas de médicos (públicas e administrativas)
router.get('/doctors', doctorController.getAllDoctors);
router.get('/doctors/:id', doctorController.getDoctorById);
router.post('/admin/doctors', adminController.createDoctor);
router.put('/admin/doctors/:id', adminController.updateDoctor);
router.delete('/admin/doctors/:id', adminController.deleteDoctor);

// Rotas de especialidades
router.get('/specialties', specialtyController.getAllSpecialties);
router.post('/admin/specialties', adminController.createSpecialty);

// Rotas de disponibilidade
router.get('/availability', availabilityController.getAvailability);
router.post('/admin/availability', adminController.setAvailability);
*/

/**
 * Middleware de tratamento de rotas não encontradas
 * Deve ser adicionado após todas as rotas definidas
 */
router.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
        timestamp: new Date().toISOString(),
        availableRoutes: [
            'POST /login - Login de usuário',
            'POST /validate-token - Validação de token',
            'GET /health - Health check público',
            'GET /profile - Perfil do usuário (requer auth)',
            'POST /logout - Logout (requer auth)',
            'GET /admin/dashboard - Dashboard admin (requer admin)',
            'GET /admin/stats - Estatísticas (requer admin)',
            'GET /admin/users - Lista de usuários (requer admin)',
            'GET /admin/appointments - Lista de consultas (requer admin)',
            'GET /admin/alerts - Alertas do sistema (requer admin)',
            'GET /admin/charts - Dados para gráficos (requer admin)',
            'GET /admin/health - Health check admin (requer admin)'
        ]
    });
});

/**
 * Middleware de tratamento global de erros
 * Captura erros não tratados nas rotas
 */
router.use((error, req, res, next) => {
    console.error('Erro capturado no router:', error);
    
    // Se o erro tiver status, usa-o. Caso contrário, 500
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({
        success: false,
        message: error.message || 'Erro interno do servidor',
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
});

module.exports = router;
