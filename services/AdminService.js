/**
 * AdminService - Camada Service do padrão MVC
 * Responsável pela lógica de negócio relacionada ao painel administrativo
 * Contém as regras para gerenciamento do sistema VitalCare
 */

const UserModel = require('../models/UserModel');

class AdminService {
    constructor() {
        this.userModel = UserModel;
    }

    /**
     * Obtém dados do dashboard administrativo
     * @returns {Object} - Dados completos do dashboard
     */
    async getDashboardData() {
        try {
            // Obtém estatísticas básicas do modelo
            const stats = this.userModel.getDashboardStats();
            
            // Enriquece os dados com informações adicionais
            const dashboardData = {
                ...stats,
                // Métricas adicionais calculadas
                metrics: {
                    appointmentsGrowth: this.calculateAppointmentsGrowth(),
                    usersGrowth: this.calculateUsersGrowth(),
                    averageAppointmentsPerUser: this.calculateAverageAppointmentsPerUser(),
                    mostRequestedSpecialties: this.getMostRequestedSpecialties()
                },
                // Dados para gráficos
                charts: {
                    appointmentsByMonth: this.getAppointmentsByMonth(),
                    usersByMonth: this.getUsersByMonth(),
                    appointmentsByStatus: stats.appointmentsByStatus,
                    usersByRole: stats.usersByRole
                },
                // Alertas e notificações
                alerts: this.generateSystemAlerts()
            };

            return {
                success: true,
                data: dashboardData
            };

        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Calcula o crescimento de consultas (simulação)
     * @returns {number} - Percentual de crescimento
     */
    calculateAppointmentsGrowth() {
        // Simulação de cálculo de crescimento
        const currentMonth = new Date().getMonth();
        const appointments = this.userModel.getAllAppointments();
        
        const currentMonthAppointments = appointments.filter(apt => 
            new Date(apt.date).getMonth() === currentMonth
        ).length;
        
        const lastMonthAppointments = appointments.filter(apt => 
            new Date(apt.date).getMonth() === currentMonth - 1
        ).length;
        
        if (lastMonthAppointments === 0) return 100;
        
        return Math.round(((currentMonthAppointments - lastMonthAppointments) / lastMonthAppointments) * 100);
    }

    /**
     * Calcula o crescimento de usuários (simulação)
     * @returns {number} - Percentual de crescimento
     */
    calculateUsersGrowth() {
        const users = this.userModel.getAllUsers();
        const currentMonth = new Date().getMonth();
        
        const currentMonthUsers = users.filter(user => 
            new Date(user.createdAt).getMonth() === currentMonth
        ).length;
        
        const lastMonthUsers = users.filter(user => 
            new Date(user.createdAt).getMonth() === currentMonth - 1
        ).length;
        
        if (lastMonthUsers === 0) return 100;
        
        return Math.round(((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100);
    }

    /**
     * Calcula a média de consultas por usuário
     * @returns {number} - Média de consultas por usuário
     */
    calculateAverageAppointmentsPerUser() {
        const totalUsers = this.userModel.getAllUsers().length;
        const totalAppointments = this.userModel.getAllAppointments().length;
        
        if (totalUsers === 0) return 0;
        
        return Math.round((totalAppointments / totalUsers) * 10) / 10;
    }

    /**
     * Obtém as especialidades mais requisitadas
     * @returns {Array} - Array com especialidades e contagem
     */
    getMostRequestedSpecialties() {
        const appointments = this.userModel.getAllAppointments();
        const specialties = {};
        
        appointments.forEach(apt => {
            if (apt.specialty) {
                specialties[apt.specialty] = (specialties[apt.specialty] || 0) + 1;
            }
        });
        
        return Object.entries(specialties)
            .sort(([,a], [,b]) => b - a)
            .map(([specialty, count]) => ({ specialty, count }));
    }

    /**
     * Obtém consultas agrupadas por mês (simulação)
     * @returns {Array} - Array com dados mensais
     */
    getAppointmentsByMonth() {
        const appointments = this.userModel.getAllAppointments();
        const monthlyData = {};
        
        // Inicializa últimos 6 meses
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthlyData[monthKey] = 0;
        }
        
        // Conta consultas por mês
        appointments.forEach(apt => {
            const date = new Date(apt.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (monthlyData.hasOwnProperty(monthKey)) {
                monthlyData[monthKey]++;
            }
        });
        
        return Object.entries(monthlyData).map(([month, count]) => ({
            month,
            count
        }));
    }

    /**
     * Obtém usuários cadastrados por mês (simulação)
     * @returns {Array} - Array com dados mensais
     */
    getUsersByMonth() {
        const users = this.userModel.getAllUsers();
        const monthlyData = {};
        
        // Inicializa últimos 6 meses
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthlyData[monthKey] = 0;
        }
        
        // Conta usuários por mês
        users.forEach(user => {
            const date = new Date(user.createdAt);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (monthlyData.hasOwnProperty(monthKey)) {
                monthlyData[monthKey]++;
            }
        });
        
        return Object.entries(monthlyData).map(([month, count]) => ({
            month,
            count
        }));
    }

    /**
     * Gera alertas do sistema
     * @returns {Array} - Array com alertas
     */
    generateSystemAlerts() {
        const alerts = [];
        const stats = this.userModel.getDashboardStats();
        
        // Alerta de crescimento negativo
        const appointmentsGrowth = this.calculateAppointmentsGrowth();
        if (appointmentsGrowth < 0) {
            alerts.push({
                type: 'warning',
                message: `Queda de ${Math.abs(appointmentsGrowth)}% nas consultas este mês`,
                priority: 'medium'
            });
        }
        
        // Alerta de baixa atividade
        if (stats.totalAppointments < 5) {
            alerts.push({
                type: 'info',
                message: 'Baixo número de consultas cadastradas',
                priority: 'low'
            });
        }
        
        // Alerta de novo usuário
        if (stats.recentUsers.length > 0) {
            const recentUser = stats.recentUsers[0];
            const daysSinceCreation = Math.floor((new Date() - new Date(recentUser.createdAt)) / (1000 * 60 * 60 * 24));
            if (daysSinceCreation <= 1) {
                alerts.push({
                    type: 'success',
                    message: `Novo usuário cadastrado: ${recentUser.name}`,
                    priority: 'low'
                });
            }
        }
        
        return alerts;
    }

    /**
     * Obtém lista de todos os usuários para administração
     * @returns {Object} - Lista de usuários
     */
    async getAllUsers() {
        try {
            const users = this.userModel.getAllUsers();
            
            // Remove senhas da resposta
            const usersWithoutPasswords = users.map(user => {
                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword;
            });
            
            return {
                success: true,
                data: usersWithoutPasswords
            };
            
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Obtém lista de todas as consultas para administração
     * @returns {Object} - Lista de consultas
     */
    async getAllAppointments() {
        try {
            const appointments = this.userModel.getAllAppointments();
            
            // Enriquece dados com informações do usuário
            const enrichedAppointments = appointments.map(apt => {
                const user = this.userModel.findById(apt.userId);
                return {
                    ...apt,
                    userName: user ? user.name : 'Usuário não encontrado',
                    userEmail: user ? user.email : 'N/A'
                };
            });
            
            return {
                success: true,
                data: enrichedAppointments
            };
            
        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }
}

module.exports = new AdminService();
