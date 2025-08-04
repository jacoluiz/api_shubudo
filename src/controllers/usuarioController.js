import jwt from "jsonwebtoken";
import Usuario from "../models/usuarioModel.js";

const SECRET_KEY = process.env.SECRET_KEY;;

class UsuarioController {
    static async login(req, res) {
        const { username, email, fcmToken } = req.body;

        try {
            const usuario = await Usuario.findOne({
                $or: [{ username }, { email }]
            });

            if (!usuario) {
                return res.status(404).json({ message: "Usuário não encontrado." });
            }

            if (fcmToken && fcmToken !== usuario.fcmToken) {
                usuario.fcmToken = fcmToken;
                await usuario.save();
            }

            const token = jwt.sign(
                { id: usuario._id, username: usuario.username, email: usuario.email },
                SECRET_KEY,
                { expiresIn: "24h" }
            );

            const usuarioResponse = { ...usuario.toObject() };

            res.status(200).json({
                message: "Login realizado com sucesso.",
                token,
                usuario: usuarioResponse
            });
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - Erro ao realizar login.` });
        }
    }

    static async listarUsuarios(req, res) {
        try {
            const usuarios = await Usuario.find();
            res.status(200).json(usuarios);
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - Erro ao listar usuários.` });
        }
    }

    static async listarUsuariosPorAcademia(req, res) {
        try {
            const { academiaId } = req.query;

            if (!academiaId) {
                return res.status(400).json({ message: "Parâmetro 'academiaId' é obrigatório." });
            }

            const usuarios = await Usuario.find({ academiaId });

            res.status(200).json(usuarios);
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - Erro ao listar usuários por academia.` });
        }
    }


    static async buscarUsuarioPorId(req, res) {
        try {
            const usuario = await Usuario.findById(req.params.id);
            if (usuario) {
                res.status(200).json(usuario);
            } else {
                res.status(404).json({ message: "Usuário não encontrado." });
            }
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - Erro ao buscar usuário.` });
        }
    }

    static async cadastrarUsuario(req, res) {
        try {
            const { email } = req.body;

            const usuarioExistente = await Usuario.findOne({ email });
            if (usuarioExistente) {
                return res.status(400).json({ message: "E-mail já está em uso." });
            }

            const novoUsuario = new Usuario(req.body);
            await novoUsuario.save();

            res.status(201).json({
                message: "Usuário criado com sucesso.",
                usuario: novoUsuario
            });
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - Erro ao cadastrar usuário.` });
        }
    }

    static async atualizarUsuario(req, res) {
        try {
            const { id } = req.params;

            if (req.body.username) {
                const usuarioExistente = await Usuario.findOne({ username: req.body.username });
                if (usuarioExistente && usuarioExistente._id.toString() !== id) {
                    return res.status(400).json({ message: "Nome de usuário já está em uso." });
                }
            }

            const usuarioAtualizado = await Usuario.findByIdAndUpdate(id, req.body, { new: true });

            if (!usuarioAtualizado) {
                return res.status(404).json({ message: "Usuário não encontrado." });
            }

            res.status(200).json(usuarioAtualizado);
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - Erro ao atualizar usuário.` });
        }
    }

    static async excluirUsuario(req, res) {
        try {
            await Usuario.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: "Usuário excluído com sucesso." });
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - Erro ao excluir usuário.` });
        }
    }

    static async buscarFaixaDoUsuario(req, res) {
        try {
            const { id, email } = req.query;
            let usuario;

            if (id) {
                usuario = await Usuario.findById(id);
            } else if (email) {
                usuario = await Usuario.findOne({ email });
            }

            if (!usuario) {
                return res.status(404).json({ message: "Usuário não encontrado." });
            }

            res.status(200).json({ corFaixa: usuario.corFaixa });
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - Erro ao buscar faixa do usuário.` });
        }
    }
}

export default UsuarioController;
