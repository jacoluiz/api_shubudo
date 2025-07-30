import Usuario from "../models/usuarioModel.js";
import ExcelJS from "exceljs";

function alturaToCm(valor) {
  // Retorna número em centímetros ou +Infinity (para ir ao final)
  if (valor === null || valor === undefined || valor === "") return Number.POSITIVE_INFINITY;

  // transforma em string, troca vírgula por ponto e remove espaços
  const s = String(valor).replace(",", ".").trim();
  const n = parseFloat(s);
  if (Number.isNaN(n)) return Number.POSITIVE_INFINITY;

  // se for < 3.5, assumimos metros (ex: 1.73), caso contrário já está em cm (ex: 173)
  return n < 3.5 ? Math.round(n * 100) : Math.round(n);
}

class RelatorioController {
  static async gerarRelatorioOrganizado(req, res) {
    try {
      const usuarios = await Usuario.find({}).lean();

      // Agrupar por faixa
      const porFaixa = {};
      for (const u of usuarios) {
        const faixa = u.corFaixa || "Sem Faixa";
        if (!porFaixa[faixa]) porFaixa[faixa] = [];
        porFaixa[faixa].push(u);
      }

      const filas = ["A", "B"];      // ajuste se quiser mais filas
      const cones = [1, 2, 3];       // ajuste se quiser mais cones
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
        // 1) Ordenar por altura (cm) crescente. Empate: academia, depois nome.
        const ordenado = [...lista].sort((a, b) => {
          const ha = alturaToCm(a.altura);
          const hb = alturaToCm(b.altura);
          if (ha !== hb) return ha - hb;
          const acad = (a.academia || "").localeCompare(b.academia || "");
          if (acad !== 0) return acad;
          return (a.nome || "").localeCompare(b.nome || "");
        });

        // 2) Distribuir cone/fila/chamada sobre a lista já ordenada
        for (let pos = 0; pos < ordenado.length; pos++) {
          const u = ordenado[pos];

          const index = pos % totalComb;
          const chamadaAtual = Math.floor(pos / totalComb) + 1;

          // padrão: 1A, 2A, 3A, 1B, 2B, 3B...
          const filaIndex = Math.floor(index / cones.length);
          const coneIndex = index % cones.length;

          const fila = filas[filaIndex];
          const cone = cones[coneIndex];

          // exibimos a altura como veio (para manter o formato do banco),
          // mas a ordenação foi feita com a altura normalizada
          sheet.addRow({
            nome: u.nome,
            academia: u.academia || "",
            corFaixa: faixa,
            altura: u.altura ?? "",
            cone,
            fila,
            chamada: `Chamada ${chamadaAtual}`,
          });
        }
      }

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        'attachment; filename="relatorio-organizado.xlsx"'
      );

      await workbook.xlsx.write(res);
      res.status(200).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: `${error.message} - Erro ao gerar relatório` });
    }
  }
}

export default RelatorioController;
