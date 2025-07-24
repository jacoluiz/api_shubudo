import admin from '../config/firebase.js';

const enviarPushParaUsuario = async (token, titulo, corpo) => {
    const mensagem = {
        notification: {
            title: titulo,
            body: corpo,
        },
        token: token,
    };

    try {
        const response = await admin.messaging().send(mensagem);
        console.log("✅ Notificação enviada:", response);
        return response;
    } catch (error) {
        console.error("❌ Erro ao enviar notificação:", error);
        throw error;
    }
};


const notificacoesController = {
    enviarNotificacao: async (req, res) => {
        const { titulo, conteudo, tokens } = req.body;

        if (!titulo || !conteudo || !tokens || !Array.isArray(tokens)) {
            return res.status(400).json({ erro: 'Campos obrigatórios: titulo, conteudo, tokens[]' });
        }

        try {
            const resultados = [];

            for (const token of tokens) {
                const resultado = await enviarPushParaUsuario(token, titulo, conteudo);
                resultados.push(resultado);
            }

            res.status(200).json({ mensagem: 'Notificações enviadas com sucesso', resultados });
        } catch (error) {
            res.status(500).json({ erro: 'Erro ao enviar notificação', detalhe: error.message });
        }
    }
};

export default notificacoesController;
