/**
 * AuthService - Camada Service do padrão MVC
 * Responsável pela lógica de negócio relacionada à autenticação
 * Contém as regras de validação e geração de tokens
 */

const UserModel = require('../models/UserModel');

class AuthService {
    constructor() {
        this.userModel = UserModel;
    }

    /**
     * Realiza o login do usuário
     * @param {string} email - Email do usuário
     * @param {string} password - Senha do usuário
     * @returns {Object} - Resultado da autenticação
     */
    async login(email, password) {
        try {
            // Validação dos campos de entrada
            if (!email || !password) {
                throw new Error('Email e senha são obrigatórios');
            }

            // Validação do formato do email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error('Email inválido');
            }

            // Busca usuário no banco de dados (simulado)
            const user = this.userModel.findByEmail(email);
            
            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            // Validação da senha (em produção, usar bcrypt ou similar)
            if (user.password !== password) {
                throw new Error('Senha incorreta');
            }

            // Gera token JWT simulado
            const token = this.generateToken(user);

            // Retorna dados do usuário (sem senha) e token
            const { password: _, ...userWithoutPassword } = user;
            
            return {
                success: true,
                user: userWithoutPassword,
                token: token,
                expiresIn: '24h'
            };

        } catch (error) {
            return {
                success: false,
                message: error.message
            };
        }
    }

    /**
     * Gera um token JWT simulado
     * Em produção, usar biblioteca como jsonwebtoken
     * @param {Object} user - Dados do usuário
     * @returns {string} - Token JWT simulado
     */
    generateToken(user) {
        // Simulação de token JWT
        // Em produção, usar: jwt.sign({ userId: user.id, role: user.role }, secret, { expiresIn: '24h' })
        
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
            iat: Math.floor(Date.now() / 1000), // Issued at
            exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // Expires in 24h
        };

        // Simulação de token codificado em base64
        const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
        const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString('base64');
        const signature = Buffer.from('vitalcare_signature_' + user.id).toString('base64');

        return `${header}.${payloadEncoded}.${signature}`;
    }

    /**
     * Valida e decodifica um token JWT simulado
     * @param {string} token - Token JWT
     * @returns {Object} - Payload do token ou erro
     */
    validateToken(token) {
        try {
            if (!token) {
                throw new Error('Token não fornecido');
            }

            // Simulação de validação de token
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Token inválido');
            }

            // Decodifica payload
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
            
            // Verifica expiração
            if (payload.exp < Math.floor(Date.now() / 1000)) {
                throw new Error('Token expirado');
            }

            // Verifica se o usuário ainda existe
            const user = this.userModel.findById(payload.userId);
            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            return {
                valid: true,
                payload: payload
            };

        } catch (error) {
            return {
                valid: false,
                message: error.message
            };
        }
    }

    /**
     * Verifica se o usuário tem permissão de administrador
     * @param {string} token - Token JWT
     * @returns {Object} - Resultado da verificação
     */
    async verifyAdminAccess(token) {
        try {
            const tokenValidation = this.validateToken(token);
            
            if (!tokenValidation.valid) {
                throw new Error(tokenValidation.message);
            }

            const user = this.userModel.findById(tokenValidation.payload.userId);
            
            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            if (user.role !== 'admin') {
                throw new Error('Acesso negado: usuário não é administrador');
            }

            return {
                valid: true,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            };

        } catch (error) {
            return {
                valid: false,
                message: error.message
            };
        }
    }

    /**
     * Atualiza o último login do usuário
     * @param {number} userId - ID do usuário
     * @returns {boolean} - Sucesso da operação
     */
    updateLastLogin(userId) {
        try {
            // Em um ambiente real, isso atualizaria o banco de dados
            // Por enquanto, apenas simulamos a operação
            console.log(`Último login atualizado para usuário ${userId}`);
            return true;
        } catch (error) {
            console.error('Erro ao atualizar último login:', error);
            return false;
        }
    }
}

module.exports = new AuthService();
