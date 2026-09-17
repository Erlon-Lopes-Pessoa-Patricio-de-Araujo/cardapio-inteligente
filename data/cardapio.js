/**
 * HOUSE 28 BURGUER — Dados do Cardápio
 * ====================================
 * Estrutura preparada para substituição por Google Sheets.
 *
 * SCHEMA DE PRODUTOS:
 *   id, nome, categoria, descricao, preco, preco_antigo,
 *   imagem, disponivel, destaque, promocao, badge, ordem
 *
 * SCHEMA DE BANNERS:
 *   id, titulo, descricao, imagem_desktop, imagem_mobile,
 *   botao, ativo, ordem
 *
 * GUIA DE IMAGENS:
 *   Banner Desktop : 1600 × 900  (16:9)
 *   Banner Mobile  : 1080 × 1350 (4:5)
 *   Produtos       : 1000 × 750  (4:3)
 *   Logo           : 1000 × 1000 (1:1)
 *   Categorias     : 500  × 500  (1:1)
 */

const CATEGORIAS = [
  { id: "hamburgueres",   nome: "Hambúrgueres",   icone: "🍔" },
  { id: "combos",         nome: "Combos",          icone: "🍟" },
  { id: "porcoes",        nome: "Porções",         icone: "🍗" },
  { id: "bebidas",        nome: "Bebidas",         icone: "🥤" },
  { id: "sobremesas",     nome: "Sobremesas",      icone: "🍦" },
];

const BANNERS = [
  {
    id: "b1",
    titulo: "SEU BURGER FAVORITO",
    descricao: "Artesanal, suculento, feito na chapa. Carne de verdade em Tracunhaém.",
    imagem_desktop: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1600&h=900&fit=crop&q=85",
    imagem_mobile:  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1080&h=1350&fit=crop&q=85",
    botao: "Ver Cardápio",
    ativo: true,
    ordem: 1
  },
  {
    id: "b2",
    titulo: "COMBOS QUE ENCHEM",
    descricao: "Burger + batata rústica + bebida. Preço justo, porção generosa.",
    imagem_desktop: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=1600&h=900&fit=crop&q=85",
    imagem_mobile:  "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=1080&h=1350&fit=crop&q=85",
    botao: "Ver Combos",
    ativo: true,
    ordem: 2
  },
  {
    id: "b3",
    titulo: "PORÇÕES PARA DIVIDIR",
    descricao: "Batata rústica, onion rings e muito mais pra compartilhar.",
    imagem_desktop: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=1600&h=900&fit=crop&q=85",
    imagem_mobile:  "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=1080&h=1350&fit=crop&q=85",
    botao: "Ver Porções",
    ativo: true,
    ordem: 3
  }
];

const ADICIONAIS = [
  { id: "a1", nome: "Bacon crocante",        preco: 4.00 },
  { id: "a2", nome: "Cheddar extra",         preco: 3.00 },
  { id: "a3", nome: "Ovo caipira",           preco: 2.00 },
  { id: "a4", nome: "Molho especial House",  preco: 2.00 },
  { id: "a5", nome: "Picles agridoce",       preco: 2.00 },
  { id: "a6", nome: "Jalapeño",              preco: 2.00 },
  { id: "a7", nome: "Cebola caramelizada",   preco: 3.00 },
];

const PRODUTOS = [
  // ── HAMBÚRGUERES ──────────────────────────────────────────────
  {
    id: "h1",
    nome: "House 28",
    categoria: "hamburgueres",
    descricao: "Dois discos de blend bovino 100g cada, queijo cheddar inglês, alface americana, tomate, maionese da casa e pão de brioche tostado.",
    preco: 24.90,
    preco_antigo: null,
    imagem: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1000&h=750&fit=crop&q=80",
    disponivel: true,
    destaque: true,
    promocao: false,
    badge: "MAIS PEDIDO",
    ordem: 1
  },
  {
    id: "h2",
    nome: "Smash Bacon",
    categoria: "hamburgueres",
    descricao: "Smash duplo 100g, cheddar cremoso derretido, bacon defumado fatiado, cebola caramelizada e molho especial da house.",
    preco: 28.90,
    preco_antigo: null,
    imagem: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=1000&h=750&fit=crop&q=80",
    disponivel: true,
    destaque: true,
    promocao: false,
    badge: "DESTAQUE",
    ordem: 2
  },
  {
    id: "h3",
    nome: "Crispy Frango",
    categoria: "hamburgueres",
    descricao: "Filé de frango empanado crocante, queijo prato derretido, alface, tomate, maionese de alho e pão de brioche.",
    preco: 22.90,
    preco_antigo: 26.90,
    imagem: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=1000&h=750&fit=crop&q=80",
    disponivel: true,
    destaque: true,
    promocao: true,
    badge: "OFERTA",
    ordem: 3
  },
  {
    id: "h4",
    nome: "Double Smash",
    categoria: "hamburgueres",
    descricao: "Quatro discos de smash bovino, três fatias de cheddar, bacon, picles, alface e molho defumado. Para quem não brinca.",
    preco: 36.90,
    preco_antigo: null,
    imagem: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=1000&h=750&fit=crop&q=80",
    disponivel: true,
    destaque: false,
    promocao: false,
    badge: null,
    ordem: 4
  },
  {
    id: "h5",
    nome: "Veggie 28",
    categoria: "hamburgueres",
    descricao: "Burger de grão-de-bico e legumes, queijo prato, rúcula, tomate confit, maionese de ervas e pão integral.",
    preco: 21.90,
    preco_antigo: null,
    imagem: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=1000&h=750&fit=crop&q=80",
    disponivel: true,
    destaque: false,
    promocao: false,
    badge: null,
    ordem: 5
  },
  {
    id: "h6",
    nome: "BBQ Defumado",
    categoria: "hamburgueres",
    descricao: "Blend bovino 150g, molho barbecue defumado, anéis de cebola crocantes, queijo gouda e picles.",
    preco: 29.90,
    preco_antigo: null,
    imagem: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1000&h=750&fit=crop&q=80",
    disponivel: true,
    destaque: false,
    promocao: false,
    badge: null,
    ordem: 6
  },

  // ── COMBOS ────────────────────────────────────────────────────
  {
    id: "c1",
    nome: "Combo House 28",
    categoria: "combos",
    descricao: "House 28 + Batata Rústica P + Refrigerante lata 350ml.",
    preco: 34.90,
    preco_antigo: 39.90,
    imagem: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=1000&h=750&fit=crop&q=80",
    disponivel: true,
    destaque: true,
    promocao: true,
    badge: "ECONOMIA",
    ordem: 1
  },
  {
    id: "c2",
    nome: "Combo Smash Bacon",
    categoria: "combos",
    descricao: "Smash Bacon + Batata Rústica M + Refrigerante lata 350ml.",
    preco: 39.90,
    preco_antigo: null,
    imagem: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1000&h=750&fit=crop&q=80",
    disponivel: true,
    destaque: false,
    promocao: false,
    badge: null,
    ordem: 2
  },
  {
    id: "c3",
    nome: "Combo Família",
    categoria: "combos",
    descricao: "2x House 28 + 2x Batata Rústica M + 2x Refrigerante lata. Para a turma.",
    preco: 79.90,
    preco_antigo: 89.90,
    imagem: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=1000&h=750&fit=crop&q=80",
    disponivel: true,
    destaque: false,
    promocao: true,
    badge: "FAMÍLIA",
    ordem: 3
  },

  // ── PORÇÕES ───────────────────────────────────────────────────
  {
    id: "p1",
    nome: "Batata Rústica P",
    categoria: "porcoes",
    descricao: "Batata palito com casca, temperada com alecrim e páprica defumada. Acompanha molho especial.",
    preco: 12.00,
    preco_antigo: null,
    imagem: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=1000&h=750&fit=crop&q=80",
    disponivel: true,
    destaque: true,
    promocao: false,
    badge: null,
    ordem: 1
  },
  {
    id: "p2",
    nome: "Batata Rústica G",
    categoria: "porcoes",
    descricao: "Porção grande de batata palito com casca. Temperada com alecrim e páprica. Para 2 a 3 pessoas.",
    preco: 20.00,
    preco_antigo: null,
    imagem: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=1000&h=750&fit=crop&q=80",
    disponivel: true,
    destaque: false,
    promocao: false,
    badge: null,
    ordem: 2
  },
  {
    id: "p3",
    nome: "Onion Rings",
    categoria: "porcoes",
    descricao: "Anéis de cebola empanados com farinha temperada, fritos na hora. Crocantes e saborosos.",
    preco: 14.00,
    preco_antigo: null,
    imagem: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=1000&h=750&fit=crop&q=80",
    disponivel: true,
    destaque: false,
    promocao: false,
    badge: null,
    ordem: 3
  },
  {
    id: "p4",
    nome: "Nuggets (10 un)",
    categoria: "porcoes",
    descricao: "10 nuggets de frango artesanais, empanados frescos. Acompanha molho de mostarda e mel.",
    preco: 16.00,
    preco_antigo: null,
    imagem: "https://images.unsplash.com/photo-1562802378-063ec186a863?w=1000&h=750&fit=crop&q=80",
    disponivel: true,
    destaque: false,
    promocao: false,
    badge: null,
    ordem: 4
  },

  // ── BEBIDAS ───────────────────────────────────────────────────
  {
    id: "bv1",
    nome: "Coca-Cola Lata 350ml",
    categoria: "bebidas",
    descricao: "Coca-Cola gelada, lata 350ml.",
    preco: 6.00,
    preco_antigo: null,
    imagem: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=1000&h=750&fit=crop&q=80",
    disponivel: true,
    destaque: false,
    promocao: false,
    badge: null,
    ordem: 1
  },
  {
    id: "bv2",
    nome: "Guaraná Antarctica 350ml",
    categoria: "bebidas",
    descricao: "Guaraná gelado, lata 350ml.",
    preco: 6.00,
    preco_antigo: null,
    imagem: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=1000&h=750&fit=crop&q=80",
    disponivel: true,
    destaque: false,
    promocao: false,
    badge: null,
    ordem: 2
  },
  {
    id: "bv3",
    nome: "Suco de Laranja Natural",
    categoria: "bebidas",
    descricao: "Suco de laranja espremido na hora, 400ml.",
    preco: 9.00,
    preco_antigo: null,
    imagem: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=1000&h=750&fit=crop&q=80",
    disponivel: true,
    destaque: false,
    promocao: false,
    badge: null,
    ordem: 3
  },
  {
    id: "bv4",
    nome: "Água Mineral 500ml",
    categoria: "bebidas",
    descricao: "Água mineral natural ou com gás, gelada.",
    preco: 4.00,
    preco_antigo: null,
    imagem: "https://images.unsplash.com/photo-1564419320461-6870880221ad?w=1000&h=750&fit=crop&q=80",
    disponivel: true,
    destaque: false,
    promocao: false,
    badge: null,
    ordem: 4
  },
  {
    id: "bv5",
    nome: "Milk Shake Chocolate",
    categoria: "bebidas",
    descricao: "Milk shake cremoso de chocolate com chantilly. 400ml.",
    preco: 14.00,
    preco_antigo: null,
    imagem: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=1000&h=750&fit=crop&q=80",
    disponivel: true,
    destaque: true,
    promocao: false,
    badge: null,
    ordem: 5
  },

  // ── SOBREMESAS ────────────────────────────────────────────────
  {
    id: "s1",
    nome: "Brownie com Sorvete",
    categoria: "sobremesas",
    descricao: "Brownie de chocolate quente com bola de sorvete de creme e calda de chocolate.",
    preco: 12.00,
    preco_antigo: null,
    imagem: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1000&h=750&fit=crop&q=80",
    disponivel: true,
    destaque: false,
    promocao: false,
    badge: null,
    ordem: 1
  },
  {
    id: "s2",
    nome: "Sundae Caramelo",
    categoria: "sobremesas",
    descricao: "Sorvete de baunilha com calda de caramelo e amendoim crocante.",
    preco: 10.00,
    preco_antigo: null,
    imagem: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1000&h=750&fit=crop&q=80",
    disponivel: true,
    destaque: false,
    promocao: false,
    badge: null,
    ordem: 2
  }
];
