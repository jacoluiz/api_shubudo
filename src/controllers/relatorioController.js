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

      const filas = "AB".split("");
      const cones = [1, 2, 3];
      const totalComb = filas.length * cones.length;

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
        // Ordenar globalmente por altura (e usar academia como critério de desempate)
        const ordenado = lista.sort((a, b) => {
          const alturaA = a.altura || 999;
          const alturaB = b.altura || 999;
          if (alturaA !== alturaB) return alturaA - alturaB;
          return (a.academia || "").localeCompare(b.academia || "");
        });

        // Distribuição contínua
        let posicao = 0;
        for (const usuario of ordenado) {
          const index = posicao % totalComb;
          const chamadaAtual = Math.floor(posicao / totalComb) + 1;

          const filaIndex = Math.floor(index / cones.length);
          const coneIndex = index % cones.length;

          const fila = filas[filaIndex];
          const cone = cones[coneIndex];

          sheet.addRow({
            nome: usuario.nome,
            academia: usuario.academia || "",
            corFaixa: faixa,
            altura: usuario.altura || "",
            cone,
            fila,
            chamada: `Chamada ${chamadaAtual}`,
          });

          posicao++;
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
