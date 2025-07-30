import Usuario from "../models/usuarioModel.js";
import ExcelJS from "exceljs";

class RelatorioController {
  static async gerarRelatorioOrganizado(req, res) {
    try {
      const usuarios = await Usuario.find({}).lean();

      // Agrupar por faixa
      const porFaixa = {};
      for (const user of usuarios) {
        const faixa = user.corFaixa || "Sem Faixa";
        if (!porFaixa[faixa]) porFaixa[faixa] = [];
        porFaixa[faixa].push(user);
      }

      const filas = "AB".split(""); // Pode ajustar conforme necessário
      const cones = [1, 2, 3];

      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Organização");

      sheet.columns = [
        { header: "Nome", key: "nome", width: 30 },
        { header: "Academia", key: "academia", width: 25 },
        { header: "Faixa", key: "corFaixa", width: 15 },
        { header: "Altura (cm)", key: "altura", width: 15 },
        { header: "Cone", key: "cone", width: 10 },
        { header: "Fila", key: "fila", width: 10 },
        { header: "Chamada", key: "chamada", width: 15 },
      ];

      for (const [faixa, lista] of Object.entries(porFaixa)) {
        // Ordenar por academia, depois por altura
        const ordenado = lista
          .sort((a, b) => {
            const ac = (a.academia || "").localeCompare(b.academia || "");
            if (ac !== 0) return ac;
            return (a.altura || 999) - (b.altura || 999);
          });

        let chamada = 1;
        let filaIndex = 0;
        let coneIndex = 0;
        const totalComb = filas.length * cones.length;
        let posicao = 0;

        for (const usuario of ordenado) {
          const fila = filas[filaIndex];
          const cone = cones[coneIndex];

          sheet.addRow({
            nome: usuario.nome,
            academia: usuario.academia || "",
            corFaixa: faixa,
            altura: usuario.altura || "",
            cone,
            fila,
            chamada: `Chamada ${chamada}`
          });

          // Atualizar posição
          posicao++;
          if (posicao % totalComb === 0) {
            chamada++;
            filaIndex = 0;
            coneIndex = 0;
          } else {
            coneIndex++;
            if (coneIndex >= cones.length) {
              coneIndex = 0;
              filaIndex++;
            }
          }
        }
      }

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=relatorio-organizado.xlsx"
      );

      await workbook.xlsx.write(res);
      res.status(200).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: `${error.message} - Erro ao gerar relatório`
      });
    }
  }
}

export default RelatorioController;
