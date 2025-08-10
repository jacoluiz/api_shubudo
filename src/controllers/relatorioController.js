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

  static async gerarRelatorioPrimeiraInfanciaPorEvento(req, res) {
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

      const hoje = new Date();
      const novaGraduacaoPorIdade = {
        3: "FAIXA BRANCA 1 MÉRITO",
        4: "FAIXA BRANCA 2 MÉRITOS",
        5: "FAIXA BRANCA PONTA AMARELA",
        6: "FAIXA AMARELA"
      };

      const usuariosFiltrados = [];

      for (const u of usuarios) {
        try {
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

          if (idade >= 3 && idade <= 6) {
            usuariosFiltrados.push({
              nome: u.nome,
              faixaAtual: u.corFaixa || "",
              novaGraduacao: novaGraduacaoPorIdade[idade] || "",
              obs: ""
            });
          }
        } catch (e) {
          console.warn(`Erro ao calcular idade para ${u.nome}: ${e.message}`);
        }
      }

      console.log("Usuários após filtro por idade <= 6:", usuariosFiltrados.length);

      const caminhoTemplate = path.resolve("src/templates/primeira_infancia_exame.xlsx");
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(caminhoTemplate);
      const sheet = workbook.getWorksheet(1);

      usuariosFiltrados.forEach((usuario, index) => {
        const rowNumber = 6 + index;
        const row = sheet.getRow(rowNumber);

        row.getCell("A").value = index + 1; // Nº
        row.getCell("B").value = usuario.nome;
        row.getCell("C").value = usuario.faixaAtual;
        row.getCell("D").value = usuario.novaGraduacao;
        row.getCell("E").value = usuario.obs;

        row.commit();

        console.log(`Linha ${rowNumber} preenchida com:`, usuario);
      });

      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", 'attachment; filename="primeira-infancia-exame.xlsx"');
      await workbook.xlsx.write(res);
      res.status(200).end();
    } catch (error) {
      console.error("Erro ao gerar planilha da 1ª infância:", error);
      res.status(500).json({ message: `${error.message} - Erro ao gerar planilha da 1ª infância` });
    }
  }


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
    const { eventoId } = req.params;

    // 🔍 DEBUG: Recebendo parâmetros da query
    // Exemplo de URL: /gerar-fila-cone/123?ateCone=5&ateFila=C
    const ateCone = Number(req.query.ateCone || 3);
    const ateFila = String(req.query.ateFila || "B").toUpperCase();
    console.log("Parâmetros recebidos:", {
      ateConeOriginal: req.query.ateCone,
      ateFilaOriginal: req.query.ateFila,
      ateConeFinal: ateCone,
      ateFilaFinal: ateFila
    });

    // 🔍 Validação de eventoId
    if (!eventoId) {
      return res.status(400).json({ message: "Parâmetro eventoId é obrigatório" });
    }

    // 🔍 Validação de ateCone — pode estar caindo aqui se o query param for string inválida
    if (!Number.isFinite(ateCone) || ateCone < 1) {
      return res.status(400).json({ message: "Parâmetro ateCone inválido" });
    }

    // 🔍 Validação de ateFila — garante que é uma letra única
    if (!/^[A-Z]$/.test(ateFila)) {
      return res.status(400).json({ message: "Parâmetro ateFila deve ser uma letra (A..Z)" });
    }

    // 🔍 Geração de cones e filas com base nos parâmetros
    const cones = Array.from({ length: ateCone }, (_, i) => i + 1); // [1..ateCone]
    const filas = Array.from(
      { length: ateFila.charCodeAt(0) - "A".charCodeAt(0) + 1 },
      (_, i) => String.fromCharCode("A".charCodeAt(0) + i)
    ); // ["A"..ateFila]
    console.log("Cones gerados:", cones, "Filas geradas:", filas);

    const totalComb = filas.length * cones.length;
    console.log("Total de combinações:", totalComb);

    // ---- Evento e presenças (SOMENTE confirmadas pelo professor) ----
    const evento = await Evento.findById(eventoId).lean();
    if (!evento || !Array.isArray(evento.presencas)) {
      return res.status(404).json({ message: "Evento não encontrado ou sem presenças" });
    }

    // 🔍 Filtrando apenas os confirmados pelo professor
    const emailsConfirmados = evento.presencas
      .filter(p => p && p.confirmadoProfessor === true && typeof p.email === "string")
      .map(p => p.email);
    console.log("Emails confirmados:", emailsConfirmados);

    if (emailsConfirmados.length === 0) {
      return res.status(200).json({ message: "Nenhum usuário confirmado pelo professor" });
    }

    const usuarios = await Usuario.find({ email: { $in: emailsConfirmados } }).lean();
    console.log("Usuários encontrados:", usuarios.length);

    // ---- Agrupar por faixa ----
    const porFaixa = {};
    for (const u of usuarios) {
      const faixa = u.corFaixa || "Sem Faixa";
      if (!porFaixa[faixa]) porFaixa[faixa] = [];
      porFaixa[faixa].push(u);
    }

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
      // Agrupar por academia
      const porAcademia = new Map();
      for (const u of lista) {
        const acad = u.academia || "Sem Academia";
        if (!porAcademia.has(acad)) porAcademia.set(acad, []);
        porAcademia.get(acad).push(u);
      }

      // Ordenar por altura e nome
      for (const [acad, arr] of porAcademia.entries()) {
        arr.sort((a, b) => {
          const ha = alturaToCm(a.altura);
          const hb = alturaToCm(b.altura);
          if (ha !== hb) return ha - hb;
          return (a.nome || "").localeCompare(b.nome || "");
        });
      }

      // Academias ordenadas
      const academiasOrdenadas = Array.from(porAcademia.keys()).sort((a, b) => a.localeCompare(b));
      const ordenado = [];
      for (const acad of academiasOrdenadas) {
        ordenado.push(...porAcademia.get(acad));
      }

      // 🔍 Distribuição Cone/Fila — é aqui que os parâmetros realmente são usados
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
      `attachment; filename="relatorio-organizado-${eventoId}.xlsx"`
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
