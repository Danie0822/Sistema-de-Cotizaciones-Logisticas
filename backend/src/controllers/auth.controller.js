const { User } = require('../models');
const catchErrors = require('../utils/tryCatch');
const ApiResponse = require('../utils/apiResponse');
const { generateToken } = require('../auth'); // Module with functions: asignarToken, verificarToken
const { comparePassword } = require('../utils/password'); // Function to compare plain and hashed passwords

class AuthController {
    // Rutas de autenticación
    static routes = '/auth/login';
    static login = catchErrors(async (req, res) => {
        const { email, password } = req.body;


        const user = await User.findOne({ where: { email } });
        if (!user) {
            return ApiResponse.error(res, {
                error: 'Invalid credentials',
                route: this.routes,
                status: 401,
            });
        }

        const isValid = await comparePassword(password, user.password);
        if (!isValid) {
            return ApiResponse.error(res, {
                error: 'Invalid credentials',
                route: this.routes,
                status: 401,
            });
        }
        // Generar token JWT
        const token = generateToken(
            {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
            },
            user.rol
        );
        // Responder con el token y la información del usuario
        return ApiResponse.success(
            res,
            {
                data: {
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        full_name: user.full_name,
                        rol: user.rol,
                    },
                },
                message: 'User logged in',
                status: 200,
                route: this.routes
            },

        );
    });
}

module.exports = AuthController;