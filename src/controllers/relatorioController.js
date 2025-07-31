import Usuario from "../models/usuarioModel.js";
import Evento from "../models/dataModel.js";
import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";

function alturaToCm(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return Number.POSITIVE_INFINITY; // vai para o final
  }
  const s = String(valor).replace(",", ".").trim();
  const n = parseFloat(s);
  if (Number.isNaN(n)) return Number.POSITIVE_INFINITY;
  return n < 3.5 ? Math.round(n * 100) : Math.round(n); // metros -> cm
}

class RelatorioController {

  static async gerarRelatorioExamePorEvento(req, res) {
  try {
    const { eventoId } = req.params;
    console.log("Recebido eventoId:", eventoId);

    const evento = await Evento.findById(eventoId).lean();
    if (!evento || !Array.isArray(evento.confirmados)) {
      console.log("Evento não encontrado ou campo confirmados inválido");
      return res.status(404).json({ message: "Evento não encontrado ou sem confirmados" });
    }

    const emailsConfirmados = evento.confirmados;
    console.log("Emails confirmados:", emailsConfirmados);

    const usuarios = await Usuario.find({ email: { $in: emailsConfirmados } }).lean();
    console.log("Usuários encontrados:", usuarios.length);
    usuarios.forEach((u) => {
      console.log(`Usuário: ${u.nome}, Email: ${u.email}, Nascimento: ${u.idade}, Faixa: ${u.corFaixa}`);
    });

    const hoje = new Date();

    // Faixas permitidas e sua ordem
    const faixasPermitidas = ["Branca", "Amarela", "Laranja", "Verde", "Roxa"];
    const ordemFaixas = {
      "Branca": 1,
      "Amarela": 2,
      "Laranja": 3,
      "Verde": 4,
      "Roxa": 5
    };

    const usuariosFiltrados = usuarios.filter((u) => {
      try {
        if (!faixasPermitidas.includes(u.corFaixa)) {
          return false;
        }

        const [dia, mes, ano] = u.idade.split("/").map(Number);
        const nascimento = new Date(ano, mes - 1, dia);

        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mesAtual = hoje.getMonth();
        const mesNascimento = nascimento.getMonth();
        const diaAtual = hoje.getDate();
        const diaNascimento = nascimento.getDate();

        if (mesNascimento > mesAtual || (mesNascimento === mesAtual && diaNascimento > diaAtual)) {
          idade -= 1;
        }

        console.log(`Usuário: ${u.nome} - Idade calculada: ${idade}`);

        return idade > 6; // Exclui quem tem até 6 anos
      } catch (e) {
        console.warn(`Erro ao calcular idade para ${u.nome}: ${e.message}`);
        return false;
      }
    });

    console.log("Usuários após filtros:", usuariosFiltrados.length);

    // Ordenar por faixa (usando o índice do mapa ordemFaixas)
    usuariosFiltrados.sort((a, b) => {
      const ordemA = ordemFaixas[a.corFaixa] || 999;
      const ordemB = ordemFaixas[b.corFaixa] || 999;
      return ordemA - ordemB;
    });

    // Carrega o template
    const caminhoTemplate = path.resolve("src/templates/exame.xlsx");
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(caminhoTemplate);

    const sheet = workbook.getWorksheet(1); // primeira aba da planilha

    usuariosFiltrados.forEach((usuario, index) => {
      const rowNumber = 8 + index;
      const row = sheet.getRow(rowNumber);

      row.getCell("A").value = index + 1; // número
      row.getCell("B").value = usuario.nome;
      row.getCell("C").value = usuario.corFaixa || "";
      row.getCell("D").value = usuario.altura || "";
      row.getCell("E").value = usuario.lesaoOuLaudosMedicos || "";

      row.commit();
      console.log(`Linha ${rowNumber} preenchida com:`, {
        nome: usuario.nome,
        faixa: usuario.corFaixa,
        altura: usuario.altura,
        lesoes: usuario.lesaoOuLaudosMedicos,
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", 'attachment; filename="exame-evento.xlsx"');

    await workbook.xlsx.write(res);
    res.status(200).end();
  } catch (error) {
    console.error("Erro ao gerar planilha de exame:", error);
    res.status(500).json({ message: `${error.message} - Erro ao gerar planilha de exame` });
  }
}


  static async gerarFilaEConeParaExame(req, res) {
    try {
      const usuarios = await Usuario.find({}).lean();

      // Agrupar por faixa
      const porFaixa = {};
      for (const u of usuarios) {
        const faixa = u.corFaixa || "Sem Faixa";
        if (!porFaixa[faixa]) porFaixa[faixa] = [];
        porFaixa[faixa].push(u);
      }

      const filas = ["A", "B"];     // ajuste se quiser mais filas
      const cones = [1, 2, 3];      // ajuste se quiser mais cones
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
        // 1) Agrupar por academia
        const porAcademia = new Map();
        for (const u of lista) {
          const acad = u.academia || "Sem Academia";
          if (!porAcademia.has(acad)) porAcademia.set(acad, []);
          porAcademia.get(acad).push(u);
        }

        // 2) Ordenar cada academia por altura crescente (empate: nome)
        for (const [acad, arr] of porAcademia.entries()) {
          arr.sort((a, b) => {
            const ha = alturaToCm(a.altura);
            const hb = alturaToCm(b.altura);
            if (ha !== hb) return ha - hb;
            return (a.nome || "").localeCompare(b.nome || "");
          });
        }

        // 3) Ordenar as academias por nome e concatenar, mantendo cada bloco junto
        const academiasOrdenadas = Array.from(porAcademia.keys()).sort((a, b) =>
          a.localeCompare(b)
        );

        const ordenado = [];
        for (const acad of academiasOrdenadas) {
          ordenado.push(...porAcademia.get(acad));
        }

        // 4) Distribuir cone/fila/chamada sobre a lista concatenada (sem reiniciar por academia)
        for (let pos = 0; pos < ordenado.length; pos++) {
          const u = ordenado[pos];

          const index = pos % totalComb;
          const chamadaAtual = Math.floor(pos / totalComb) + 1;

          const coneIndex = Math.floor(index / filas.length) % cones.length;
          const filaIndex = index % filas.length;

          const cone = cones[coneIndex];
          const fila = filas[filaIndex];

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
