/**
 * UserModel - Camada Model do padrão MVC
 * Responsável por gerenciar os dados dos usuários
 * Em um ambiente real, este modelo interagiria com um banco de dados
 * Para este projeto, estamos simulando com arrays em memória
 */

class UserModel {
    constructor() {
        // Simulação de banco de dados com usuários pré-cadastrados
        this.users = [
            {
                id: 1,
                name: "João Silva",
                email: "joao@vitalcare.com",
                password: "senha123", // Em produção, usar hash
                role: "user",
                createdAt: new Date('2024-01-15')
            },
            {
                id: 2,
                name: "Maria Santos",
                email: "maria@vitalcare.com",
                password: "senha456", // Em produção, usar hash
                role: "user",
                createdAt: new Date('2024-01-20')
            },
            {
                id: 3,
                name: "Admin VitalCare",
                email: "admin@vitalcare.com",
                password: "admin123", // Em produção, usar hash
                role: "admin",
                createdAt: new Date('2024-01-01')
            }
        ];

        // Simulação de consultas médicas
        this.appointments = [
            {
                id: 1,
                userId: 1,
                doctorName: "Dr. Carlos Mendes",
                specialty: "Cardiologia",
                date: new Date('2024-03-28'),
                status: "agendada",
                createdAt: new Date('2024-03-20')
            },
            {
                id: 2,
                userId: 2,
                doctorName: "Dra. Ana Oliveira",
                specialty: "Ginecologia",
                date: new Date('2024-03-30'),
                status: "agendada",
                createdAt: new Date('2024-03-22')
            },
            {
                id: 3,
                userId: 1,
                doctorName: "Dr. Roberto Costa",
                specialty: "Ortopedia",
                date: new Date('2024-03-25'),
                status: "realizada",
                createdAt: new Date('2024-03-15')
            }
        ];
    }

    /**
     * Busca usuário por email
     * @param {string} email - Email do usuário
     * @returns {Object|null} - Objeto do usuário ou null se não encontrado
     */
    findByEmail(email) {
        return this.users.find(user => user.email === email) || null;
    }

    /**
     * Busca usuário por ID
     * @param {number} id - ID do usuário
     * @returns {Object|null} - Objeto do usuário ou null se não encontrado
     */
    findById(id) {
        return this.users.find(user => user.id === id) || null;
    }

    /**
     * Retorna todos os usuários
     * @returns {Array} - Array com todos os usuários
     */
    getAllUsers() {
        return this.users;
    }

    /**
     * Retorna todas as consultas
     * @returns {Array} - Array com todas as consultas
     */
    getAllAppointments() {
        return this.appointments;
    }

    /**
     * Busca consultas por usuário
     * @param {number} userId - ID do usuário
     * @returns {Array} - Array com consultas do usuário
     */
    getAppointmentsByUser(userId) {
        return this.appointments.filter(apt => apt.userId === userId);
    }

    /**
     * Adiciona novo usuário (simulação)
     * @param {Object} userData - Dados do novo usuário
     * @returns {Object} - Usuário criado
     */
    createUser(userData) {
        const newUser = {
            id: this.users.length + 1,
            ...userData,
            createdAt: new Date()
        };
        this.users.push(newUser);
        return newUser;
    }

    /**
     * Adiciona nova consulta (simulação)
     * @param {Object} appointmentData - Dados da nova consulta
     * @returns {Object} - Consulta criada
     */
    createAppointment(appointmentData) {
        const newAppointment = {
            id: this.appointments.length + 1,
            ...appointmentData,
            status: "agendada",
            createdAt: new Date()
        };
        this.appointments.push(newAppointment);
        return newAppointment;
    }

    /**
     * Retorna estatísticas para o dashboard admin
     * @returns {Object} - Dados estatísticos
     */
    getDashboardStats() {
        const totalUsers = this.users.length;
        const totalAppointments = this.appointments.length;
        const appointmentsByStatus = {
            agendadas: this.appointments.filter(apt => apt.status === "agendada").length,
            realizadas: this.appointments.filter(apt => apt.status === "realizada").length,
            canceladas: this.appointments.filter(apt => apt.status === "cancelada").length
        };
        const usersByRole = {
            admin: this.users.filter(user => user.role === "admin").length,
            user: this.users.filter(user => user.role === "user").length
        };

        return {
            totalUsers,
            totalAppointments,
            appointmentsByStatus,
            usersByRole,
            recentUsers: this.users.slice(-5).reverse(),
            recentAppointments: this.appointments.slice(-5).reverse()
        };
    }
}

// Exporta uma instância única do modelo (Singleton pattern)
module.exports = new UserModel();
