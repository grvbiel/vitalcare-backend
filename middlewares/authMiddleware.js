/**
 * authMiddleware - Middleware de autenticação
 * Responsável por verificar tokens JWT e controlar acesso às rotas protegidas
 * Intercepta requisições e valida autenticação antes de passar para os controllers
 */

const AuthService = require('../services/AuthService');

class AuthMiddleware {
    constructor() {
        this.authService = AuthService;
    }

    /**
     * Middleware de autenticação básica
     * Verifica se o token JWT é válido
     * @param {Object} req - Objeto de requisição Express
     * @param {Object} res - Objeto de resposta Express
     * @param {Function} next - Função next do Express
     */
    authenticate(req, res, next) {
        try {
            // Obtém o token do header Authorization
            const authHeader = req.headers.authorization;
            const token = this.extractTokenFromHeader(authHeader);

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Token de autenticação não fornecido',
                    timestamp: new Date().toISOString()
                });
            }

            // Valida o token usando o AuthService
            const tokenValidation = this.authService.validateToken(token);

            if (!tokenValidation.valid) {
                return res.status(401).json({
                    success: false,
                    message: tokenValidation.message,
                    timestamp: new Date().toISOString()
                });
            }

            // Adiciona os dados do usuário ao objeto req para uso nos controllers
            req.user = tokenValidation.payload;
            req.token = token;

            // Continua para o próximo middleware/controller
            next();

        } catch (error) {
            console.error('Erro no middleware de autenticação:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Middleware de autorização para administradores
     * Verifica se o usuário autenticado tem role 'admin'
     * @param {Object} req - Objeto de requisição Express
     * @param {Object} res - Objeto de resposta Express
     * @param {Function} next - Função next do Express
     */
    requireAdmin(req, res, next) {
        try {
            // Primeiro verifica se o usuário está autenticado
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuário não autenticado',
                    timestamp: new Date().toISOString()
                });
            }

            // Verifica se o usuário tem role de administrador
            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Acesso negado: privilégios de administrador necessários',
                    timestamp: new Date().toISOString()
                });
            }

            // Continua para o próximo middleware/controller
            next();

        } catch (error) {
            console.error('Erro no middleware de autorização:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Middleware combinado: autenticação + autorização de admin
     * Executa ambos os middlewares em sequência
     * @param {Object} req - Objeto de requisição Express
     * @param {Object} res - Objeto de resposta Express
     * @param {Function} next - Função next do Express
     */
    authenticateAndRequireAdmin(req, res, next) {
        try {
            // Obtém o token do header Authorization
            const authHeader = req.headers.authorization;
            const token = this.extractTokenFromHeader(authHeader);

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Token de autenticação não fornecido',
                    timestamp: new Date().toISOString()
                });
            }

            // Valida o token
            const tokenValidation = this.authService.validateToken(token);

            if (!tokenValidation.valid) {
                return res.status(401).json({
                    success: false,
                    message: tokenValidation.message,
                    timestamp: new Date().toISOString()
                });
            }

            // Verifica se é administrador
            if (tokenValidation.payload.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Acesso negado: privilégios de administrador necessários',
                    timestamp: new Date().toISOString()
                });
            }

            // Adiciona dados do usuário à requisição
            req.user = tokenValidation.payload;
            req.token = token;

            next();

        } catch (error) {
            console.error('Erro no middleware combinado:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Middleware opcional de autenticação
     * Não retorna erro se não houver token, mas adiciona dados do usuário se houver
     * @param {Object} req - Objeto de requisição Express
     * @param {Object} res - Objeto de resposta Express
     * @param {Function} next - Função next do Express
     */
    optionalAuth(req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            const token = this.extractTokenFromHeader(authHeader);

            if (token) {
                // Se houver token, valida e adiciona dados do usuário
                const tokenValidation = this.authService.validateToken(token);
                
                if (tokenValidation.valid) {
                    req.user = tokenValidation.payload;
                    req.token = token;
                }
            }

            // Continua independentemente de ter token ou não
            next();

        } catch (error) {
            console.error('Erro no middleware opcional:', error);
            // Não retorna erro, apenas continua
            next();
        }
    }

    /**
     * Extrai token do header Authorization
     * Suporta formatos: "Bearer token" ou "token"
     * @param {string} authHeader - Header Authorization
     * @returns {string|null} - Token extraído ou null
     */
    extractTokenFromHeader(authHeader) {
        if (!authHeader) {
            return null;
        }

        // Formato "Bearer token"
        if (authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7);
        }

        // Formato direto "token"
        return authHeader;
    }

    /**
     * Middleware para validar formato do token
     * @param {Object} req - Objeto de requisição Express
     * @param {Object} res - Objeto de resposta Express
     * @param {Function} next - Função next do Express
     */
    validateTokenFormat(req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            const token = this.extractTokenFromHeader(authHeader);

            if (token && !this.isValidTokenFormat(token)) {
                return res.status(400).json({
                    success: false,
                    message: 'Formato de token inválido',
                    timestamp: new Date().toISOString()
                });
            }

            next();

        } catch (error) {
            console.error('Erro na validação de formato:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Verifica se o token tem formato JWT válido (3 partes separadas por .)
     * @param {string} token - Token a ser validado
     * @returns {boolean} - True se formato for válido
     */
    isValidTokenFormat(token) {
        if (!token || typeof token !== 'string') {
            return false;
        }

        const parts = token.split('.');
        return parts.length === 3;
    }

    /**
     * Middleware para logging de requisições autenticadas
     * @param {Object} req - Objeto de requisição Express
     * @param {Object} res - Objeto de resposta Express
     * @param {Function} next - Função next do Express
     */
    logAuthenticatedRequest(req, res, next) {
        if (req.user) {
            console.log(`[${new Date().toISOString()}] ${req.user.email} (${req.user.role}) acessando ${req.method} ${req.path}`);
        }
        next();
    }
}

// Exporta instância única do middleware
module.exports = new AuthMiddleware();
