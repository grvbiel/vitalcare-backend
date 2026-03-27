/**
 * AdminController - Camada Controller do padrão MVC
 * Responsável por gerenciar as requisições HTTP relacionadas ao painel administrativo
 * Não contém lógica de negócio, apenas orquestra as chamadas aos services
 */

const AdminService = require('../services/AdminService');

class AdminController {
    constructor() {
        this.adminService = AdminService;
    }

    /**
     * Obtém dados do dashboard administrativo
     * Endpoint: GET /admin/dashboard
     * @param {Object} req - Objeto de requisição Express
     * @param {Object} res - Objeto de resposta Express
     */
    async getDashboard(req, res) {
        try {
            // Chama o service para obter dados do dashboard
            const result = await this.adminService.getDashboardData();

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    message: result.message,
                    timestamp: new Date().toISOString()
                });
            }

            // Retorna dados do dashboard
            res.status(200).json({
                success: true,
                message: 'Dados do dashboard obtidos com sucesso',
                data: result.data,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('Erro ao obter dashboard:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Obtém lista de todos os usuários
     * Endpoint: GET /admin/users
     * @param {Object} req - Objeto de requisição Express
     * @param {Object} res - Objeto de resposta Express
     */
    async getUsers(req, res) {
        try {
            const result = await this.adminService.getAllUsers();

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    message: result.message,
                    timestamp: new Date().toISOString()
                });
            }

            res.status(200).json({
                success: true,
                message: 'Lista de usuários obtida com sucesso',
                data: result.data,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('Erro ao obter usuários:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Obtém lista de todas as consultas
     * Endpoint: GET /admin/appointments
     * @param {Object} req - Objeto de requisição Express
     * @param {Object} res - Objeto de resposta Express
     */
    async getAppointments(req, res) {
        try {
            const result = await this.adminService.getAllAppointments();

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    message: result.message,
                    timestamp: new Date().toISOString()
                });
            }

            res.status(200).json({
                success: true,
                message: 'Lista de consultas obtida com sucesso',
                data: result.data,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('Erro ao obter consultas:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Obtém estatísticas detalhadas do sistema
     * Endpoint: GET /admin/stats
     * @param {Object} req - Objeto de requisição Express
     * @param {Object} res - Objeto de resposta Express
     */
    async getStats(req, res) {
        try {
            const result = await this.adminService.getDashboardData();

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    message: result.message,
                    timestamp: new Date().toISOString()
                });
            }

            // Retorna apenas as estatísticas
            res.status(200).json({
                success: true,
                message: 'Estatísticas obtidas com sucesso',
                data: {
                    totalUsers: result.data.totalUsers,
                    totalAppointments: result.data.totalAppointments,
                    appointmentsByStatus: result.data.appointmentsByStatus,
                    usersByRole: result.data.usersByRole,
                    metrics: result.data.metrics
                },
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('Erro ao obter estatísticas:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Obtém alertas do sistema
     * Endpoint: GET /admin/alerts
     * @param {Object} req - Objeto de requisição Express
     * @param {Object} res - Objeto de resposta Express
     */
    async getAlerts(req, res) {
        try {
            const result = await this.adminService.getDashboardData();

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    message: result.message,
                    timestamp: new Date().toISOString()
                });
            }

            res.status(200).json({
                success: true,
                message: 'Alertas obtidos com sucesso',
                data: result.data.alerts,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('Erro ao obter alertas:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Obtém dados para gráficos do dashboard
     * Endpoint: GET /admin/charts
     * @param {Object} req - Objeto de requisição Express
     * @param {Object} res - Objeto de resposta Express
     */
    async getCharts(req, res) {
        try {
            const result = await this.adminService.getDashboardData();

            if (!result.success) {
                return res.status(500).json({
                    success: false,
                    message: result.message,
                    timestamp: new Date().toISOString()
                });
            }

            res.status(200).json({
                success: true,
                message: 'Dados para gráficos obtidos com sucesso',
                data: result.data.charts,
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('Erro ao obter dados para gráficos:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Endpoint de verificação de saúde do sistema
     * Endpoint: GET /admin/health
     * @param {Object} req - Objeto de requisição Express
     * @param {Object} res - Objeto de resposta Express
     */
    async healthCheck(req, res) {
        try {
            const health = {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                version: process.version,
                environment: process.env.NODE_ENV || 'development'
            };

            res.status(200).json({
                success: true,
                message: 'Sistema saudável',
                data: health
            });

        } catch (error) {
            console.error('Erro no health check:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                timestamp: new Date().toISOString()
            });
        }
    }
}

module.exports = new AdminController();
