/**
 * AuthController - Camada Controller do padrão MVC
 * Responsável por gerenciar as requisições HTTP relacionadas à autenticação
 * Não contém lógica de negócio, apenas orquestra as chamadas aos services
 */

const AuthService = require('../services/AuthService');

class AuthController {
    constructor() {
        this.authService = AuthService;
    }

    /**
     * Realiza o login do usuário
     * Endpoint: POST /login
     * @param {Object} req - Objeto de requisição Express
     * @param {Object} res - Objeto de resposta Express
     */
    async login(req, res) {
        try {
            // Extrai dados do corpo da requisição
            const { email, password } = req.body;

            // Chama o service para processar a lógica de autenticação
            const result = await this.authService.login(email, password);

            if (!result.success) {
                // Retorna erro de autenticação
                return res.status(401).json({
                    success: false,
                    message: result.message,
                    timestamp: new Date().toISOString()
                });
            }

            // Atualiza o último login do usuário
            this.authService.updateLastLogin(result.user.id);

            // Retorna sucesso com dados do usuário e token
            res.status(200).json({
                success: true,
                message: 'Login realizado com sucesso',
                data: {
                    user: result.user,
                    token: result.token,
                    expiresIn: result.expiresIn
                },
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            // Trata erros inesperados do servidor
            console.error('Erro no controller de login:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Valida um token JWT (endpoint utilitário)
     * Endpoint: POST /validate-token
     * @param {Object} req - Objeto de requisição Express
     * @param {Object} res - Objeto de resposta Express
     */
    async validateToken(req, res) {
        try {
            const { token } = req.body;

            if (!token) {
                return res.status(400).json({
                    success: false,
                    message: 'Token é obrigatório',
                    timestamp: new Date().toISOString()
                });
            }

            const result = this.authService.validateToken(token);

            if (!result.valid) {
                return res.status(401).json({
                    success: false,
                    message: result.message,
                    timestamp: new Date().toISOString()
                });
            }

            res.status(200).json({
                success: true,
                message: 'Token válido',
                data: {
                    payload: result.payload
                },
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('Erro na validação do token:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Realiza o logout do usuário
     * Endpoint: POST /logout
     * Em um ambiente real, isso adicionaria o token a uma blacklist
     * @param {Object} req - Objeto de requisição Express
     * @param {Object} res - Objeto de resposta Express
     */
    async logout(req, res) {
        try {
            // Em um ambiente real, implementar blacklist de tokens
            // Por enquanto, apenas retornamos sucesso
            
            res.status(200).json({
                success: true,
                message: 'Logout realizado com sucesso',
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('Erro no logout:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Obtém informações do usuário autenticado
     * Endpoint: GET /profile
     * @param {Object} req - Objeto de requisição Express
     * @param {Object} res - Objeto de resposta Express
     */
    async getProfile(req, res) {
        try {
            // O middleware de autenticação adiciona os dados do usuário ao req
            const userData = req.user;

            if (!userData) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuário não autenticado',
                    timestamp: new Date().toISOString()
                });
            }

            res.status(200).json({
                success: true,
                message: 'Perfil do usuário',
                data: {
                    user: userData
                },
                timestamp: new Date().toISOString()
            });

        } catch (error) {
            console.error('Erro ao obter perfil:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                timestamp: new Date().toISOString()
            });
        }
    }
}

module.exports = new AuthController();
