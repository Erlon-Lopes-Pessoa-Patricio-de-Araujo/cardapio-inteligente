/**
 * HOUSE 28 BURGUER — Data Service
 * ================================
 * Camada de abstração de dados.
 * Para ativar Google Sheets: altere SHEET_MODE para "sheets"
 * e preencha SHEET_BASE_URL com a URL publicada da planilha.
 *
 * Google Sheets → publicar como CSV:
 *   Arquivo → Compartilhar → Publicar na web → CSV → Copiar link
 *
 * URL base do CSV:
 *   https://docs.google.com/spreadsheets/d/[ID]/gviz/tq?tqx=out:csv&sheet=[ABA]
 */

const DATA_CONFIG = {
  // "mock" | "sheets"
  SHEET_MODE: "sheets",

  // URL da aba "produtos" exportada como CSV
  SHEET_PRODUTOS_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS0JzkNKxHO14gaRD33UeXYdysFcaoE8uh-xjYaCqFN8vHoPBevOG2fioTiKCEHk7k-MEOJutvbi60E/pub?gid=0&single=true&output=csv",

  // URL da aba "banners" exportada como CSV
  SHEET_BANNERS_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS0JzkNKxHO14gaRD33UeXYdysFcaoE8uh-xjYaCqFN8vHoPBevOG2fioTiKCEHk7k-MEOJutvbi60E/pub?gid=880238455&single=true&output=csv",

  // URL da aba "config" (opcional - crie a aba "config" na planilha se desejar)
  SHEET_CONFIG_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS0JzkNKxHO14gaRD33UeXYdysFcaoE8uh-xjYaCqFN8vHoPBevOG2fioTiKCEHk7k-MEOJutvbi60E/pubhtml?gid=1293485012&single=true",
};

/* ────────────────────────────────────────────
   Parser CSV robusto (trata aspas, vírgulas e campos vazios)
   ──────────────────────────────────────────── */
function parseCSV(csvText) {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  function parseLine(text) {
    const result = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c === '"') {
        if (inQuotes && text[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        result.push(cur.trim());
        cur = "";
      } else {
        cur += c;
      }
    }
    result.push(cur.trim());
    return result;
  }

  const headers = parseLine(lines[0]).map((h) => h.toLowerCase().replace(/"/g, "").trim());

  return lines.slice(1).filter((line) => line.trim().length > 0).map((line) => {
    const values = parseLine(line);
    const obj = {};
    headers.forEach((h, i) => {
      let val = values[i] || "";
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.substring(1, val.length - 1).replace(/""/g, '"');
      }
      obj[h] = val.trim();
    });
    return obj;
  });
}

function parsePreco(val) {
  if (!val) return null;
  const str = String(val).replace("R$", "").replace(/\s/g, "").replace(",", ".");
  const num = parseFloat(str);
  return isNaN(num) ? null : num;
}

function normalizeCategoria(cat) {
  if (!cat) return "hamburgueres";
  const slug = cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  if (slug.includes("hamburguer")) return "hamburgueres";
  if (slug.includes("combo")) return "combos";
  if (slug.includes("porcao") || slug.includes("porcoes")) return "porcoes";
  if (slug.includes("bebida")) return "bebidas";
  if (slug.includes("sobremesa")) return "sobremesas";
  return slug;
}

const DEFAULT_PRODUTO_IMG = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1000&h=750&fit=crop&q=80";
const DEFAULT_BANNER_DESK = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1600&h=900&fit=crop&q=85";
const DEFAULT_BANNER_MOB = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1080&h=1350&fit=crop&q=85";

/* ────────────────────────────────────────────
   Normaliza linha CSV para o schema interno
   ──────────────────────────────────────────── */
function normalizeProduto(row) {
  let img = row.imagem;
  if (!img || img.toUpperCase().includes("URL") || img.toUpperCase().includes("IRL") || !img.startsWith("http")) {
    img = DEFAULT_PRODUTO_IMG;
  }

  return {
    id: row.id || String(Math.random()),
    nome: row.nome || "Produto sem nome",
    categoria: normalizeCategoria(row.categoria),
    descricao: row.descricao || "",
    preco: parsePreco(row.preco) || 0,
    preco_antigo: parsePreco(row.preco_antigo),
    imagem: img,
    disponivel: row.disponivel?.toUpperCase() === "SIM",
    destaque: row.destaque?.toUpperCase() === "SIM",
    promocao: row.promocao?.toUpperCase() === "SIM",
    badge: row.badge || null,
    ordem: parseInt(row.ordem) || 99,
  };
}

function normalizeBanner(row) {
  let deskImg = row.imagem_desktop;
  let mobImg = row.imagem_mobile;

  if (!deskImg || deskImg.toUpperCase().includes("URL") || deskImg.toUpperCase().includes("IRL") || !deskImg.startsWith("http")) deskImg = DEFAULT_BANNER_DESK;
  if (!mobImg || mobImg.toUpperCase().includes("URL") || mobImg.toUpperCase().includes("IRL") || !mobImg.startsWith("http")) mobImg = DEFAULT_BANNER_MOB;

  return {
    id: row.id || String(Math.random()),
    titulo: row.titulo || "",
    descricao: row.descricao || "",
    imagem_desktop: deskImg,
    imagem_mobile: mobImg,
    botao: row.botao || "Ver Cardápio",
    ativo: row.ativo?.toUpperCase() === "SIM",
    ordem: parseInt(row.ordem) || 99,
  };
}

/* ────────────────────────────────────────────
   API pública do dataService
   ──────────────────────────────────────────── */
const dataService = {
  async getProdutos() {
    if (DATA_CONFIG.SHEET_MODE === "sheets" && DATA_CONFIG.SHEET_PRODUTOS_URL) {
      try {
        const res = await fetch(DATA_CONFIG.SHEET_PRODUTOS_URL);
        const csv = await res.text();
        const produtos = parseCSV(csv)
          .map(normalizeProduto)
          .filter((p) => p.disponivel)
          .sort((a, b) => a.ordem - b.ordem);

        if (produtos.length > 0) return produtos;
      } catch (err) {
        console.warn("[dataService] Falha ao carregar Sheets, usando mock.", err);
      }
    }
    // Fallback mock
    return PRODUTOS.filter((p) => p.disponivel).sort((a, b) => a.ordem - b.ordem);
  },

  async getBanners() {
    if (DATA_CONFIG.SHEET_MODE === "sheets" && DATA_CONFIG.SHEET_BANNERS_URL) {
      try {
        const res = await fetch(DATA_CONFIG.SHEET_BANNERS_URL);
        const csv = await res.text();
        const banners = parseCSV(csv)
          .map(normalizeBanner)
          .filter((b) => b.ativo)
          .sort((a, b) => a.ordem - b.ordem);

        if (banners.length > 0) return banners;
      } catch (err) {
        console.warn("[dataService] Falha ao carregar banners Sheets, usando mock.", err);
      }
    }
    return BANNERS.filter((b) => b.ativo).sort((a, b) => a.ordem - b.ordem);
  },

  async getCategorias() {
    return CATEGORIAS;
  },

  getAdicionais() {
    return ADICIONAIS;
  },

  async getConfig() {
    const configPadrao = {
      status_texto: "Aberto agora · Tracunhaém-PE · Fecha às 23:30",
      tempo_entrega: "🛵 Entrega: 35–50 min",
      frete_gratis: "📦 Grátis acima de R$ 50",
      status_aberto: true,
    };

    if (DATA_CONFIG.SHEET_MODE === "sheets" && DATA_CONFIG.SHEET_CONFIG_URL) {
      try {
        const res = await fetch(DATA_CONFIG.SHEET_CONFIG_URL);
        const csv = await res.text();
        const rows = parseCSV(csv);
        
        if (rows.length > 0) {
          // Detecta se a tabela está no formato Vertical (colunas: chave, valor)
          if ("chave" in rows[0] || "key" in rows[0] || "item" in rows[0]) {
            rows.forEach((r) => {
              const key = (r.chave || r.key || r.item || "").toLowerCase().trim();
              const val = r.valor || r.value || r.conteudo || "";
              if (key && val) {
                configPadrao[key] = val.trim();
              }
            });
          } else {
            // Formato Horizontal (cabeçalhos são as chaves)
            const firstRow = rows[0];
            Object.keys(firstRow).forEach((key) => {
              if (firstRow[key] !== undefined && firstRow[key] !== "") {
                configPadrao[key.toLowerCase().trim()] = firstRow[key].trim();
              }
            });
          }
        }
      } catch (err) {
        console.warn("[dataService] Falha ao carregar config Sheets, usando padrão.", err);
      }
    }
    return configPadrao;
  },
};

