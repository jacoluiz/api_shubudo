import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Usuario from "../models/usuarioModel.js";

const SECRET_KEY = "sua_chave_secreta"; // Substitua por uma chave segura


class UsuarioController {

    static async login(req, res) {
        const { username, email, senha } = req.body;
    
        try {
            // Buscar usuário por e-mail ou nome de usuário
            const usuario = await Usuario.findOne({
                $or: [{ username }, { email }]
            });
    
            if (!usuario) {
                return res.status(404).json({ message: "Usuário não encontrado." });
            }
    
            // Validar senha
            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                return res.status(401).json({ message: "Credenciais inválidas." });
            }
    
            // Gerar token JWT
            const token = jwt.sign(
                { id: usuario._id, username: usuario.username, email: usuario.email },
                SECRET_KEY,
                { expiresIn: "24h" } // Token válido por 1 hora
            );
    
            // Exclui a senha do objeto retornado para segurança
            const usuarioResponse = { ...usuario.toObject() };
    
            res.status(200).json({
                message: "Login realizado com sucesso.",
                token,
                usuario: usuarioResponse // Inclui o objeto do usuário na resposta
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
            const { username, senha } = req.body;
    
            // Verifica se o nome de usuário já existe
            const usuarioExistente = await Usuario.findOne({ username });
            if (usuarioExistente) {
                return res.status(400).json({ message: "Nome de usuário já está em uso." });
            }
    
            // Criptografar senha antes de salvar
            const salt = await bcrypt.genSalt(10);
            const senhaHash = await bcrypt.hash(senha, salt);
    
            // Substitui a senha no objeto antes de salvar
            const novoUsuario = new Usuario({ ...req.body, senha: senhaHash });
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
    
            // Verifica se o nome de usuário é único, caso esteja sendo atualizado
            if (req.body.username) {
                const usuarioExistente = await Usuario.findOne({ username: req.body.username });
                if (usuarioExistente && usuarioExistente._id.toString() !== id) {
                    return res.status(400).json({ message: "Nome de usuário já está em uso." });
                }
            }
    
            // Usa { new: true } para retornar o documento após a atualização
            const usuarioAtualizado = await Usuario.findByIdAndUpdate(id, req.body, { new: true });
    
            if (!usuarioAtualizado) {
                return res.status(404).json({ message: "Usuário não encontrado." });
            }
    
            // Se quiser remover a senha do objeto antes de enviar:
            const usuarioResponse = usuarioAtualizado.toObject();
            if (usuarioResponse.senha) {
                delete usuarioResponse.senha;
            }
    
            // Retorna o usuário atualizado no response
            res.status(200).json(usuarioResponse);
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
