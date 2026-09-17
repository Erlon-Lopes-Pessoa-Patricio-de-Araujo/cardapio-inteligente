/**
 * HOUSE 28 BURGUER — App Principal
 * ==================================
 * Orquestra toda a aplicação.
 * Depende de: cart.js, whatsapp.js, data/cardapio.js, services/dataService.js
 */

/* ════════════════════════════════════════════════
   ESTADO GLOBAL DA UI
   ════════════════════════════════════════════════ */
const UI = {
  categoriaAtiva: "todos",
  termoBusca: "",
  bannerAtual: 0,
  bannerTimer: null,
  produtos: [],
  banners: [],
  categorias: [],
  config: null,
  produtoSelecionado: null,
  adicionaisSelecionados: [],
  qtdModal: 1,
  obsModal: "",
  // checkout
  tipoEntrega: "retirada",
  pagamento: "Pix",
};

/* ════════════════════════════════════════════════
   REFS DOS ELEMENTOS
   ════════════════════════════════════════════════ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ════════════════════════════════════════════════
   INICIALIZAÇÃO
   ════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", async () => {
  Cart.init();

  // Carrega dados
  [UI.produtos, UI.banners, UI.categorias, UI.config] = await Promise.all([
    dataService.getProdutos(),
    dataService.getBanners(),
    dataService.getCategorias(),
    dataService.getConfig(),
  ]);

  renderStoreInfo(UI.config);
  renderBanner();
  renderCategorias();
  renderDestaques();
  renderCardapio();
  iniciarBannerAuto();
  atualizarCarrinhoUI();

  Cart.onChange(() => {
    atualizarCarrinhoUI();
    renderCarrinhoItens();
    renderCheckoutResumo();
  });

  bindEvents();
});

function renderStoreInfo(config) {
  if (!config) return;

  const infoStatusEl = $("#info-status-texto");
  if (infoStatusEl && config.status_texto) {
    infoStatusEl.textContent = config.status_texto;
  }

  const tempoEntregaEl = $("#info-tempo-entrega");
  if (tempoEntregaEl && config.tempo_entrega) {
    tempoEntregaEl.textContent = config.tempo_entrega;
  }

  const freteGratisEl = $("#info-frete-gratis");
  if (freteGratisEl && config.frete_gratis) {
    freteGratisEl.textContent = config.frete_gratis;
  }

  const sideMenuStatusEl = $("#side-menu-status");
  if (sideMenuStatusEl && config.status_texto) {
    sideMenuStatusEl.textContent = config.status_texto;
  }

  const headerStatusDotEl = $("#header-status-dot");
  const barStatusDotEl = $("#bar-status-dot");
  if (config.status_aberto === "NAO" || config.status_aberto === false || config.status_aberto === "NÃO") {
    if (headerStatusDotEl) headerStatusDotEl.style.background = "#ef4444";
    if (barStatusDotEl) barStatusDotEl.style.background = "#ef4444";
  }
}

/* ════════════════════════════════════════════════
   BANNER CARROSSEL
   ════════════════════════════════════════════════ */
function renderBanner() {
  const track = $("#banner-track");
  const dotsWrap = $("#banner-dots");
  if (!track || !dotsWrap) return;

  track.innerHTML = UI.banners
    .map(
      (b, i) => `
    <div class="banner__slide" data-slide="${i}">
      <picture>
        <source media="(min-width: 768px)" srcset="${b.imagem_desktop}">
        <img
          class="banner__img"
          src="${b.imagem_mobile}"
          alt="${escapeHtml(b.titulo)}"
          loading="${i === 0 ? 'eager' : 'lazy'}"
        >
      </picture>
      <div class="banner__overlay"></div>
      <div class="banner__conteudo">
        <h2 class="banner__titulo">${formatarTituloBanner(b.titulo)}</h2>
        <p class="banner__desc">${escapeHtml(b.descricao)}</p>
        <button class="banner__btn" data-banner-categoria="${b.id}" onclick="scrollParaCardapio()">
          ${escapeHtml(b.botao)}
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>`
    )
    .join("");

  dotsWrap.innerHTML = UI.banners
    .map((_, i) => `<button class="banner__dot ${i === 0 ? "ativo" : ""}" aria-label="Slide ${i + 1}" data-dot="${i}"></button>`)
    .join("");

  dotsWrap.addEventListener("click", (e) => {
    const dot = e.target.closest("[data-dot]");
    if (dot) irParaSlide(parseInt(dot.dataset.dot));
  });
}

function formatarTituloBanner(titulo) {
  const palavras = titulo.split(" ");
  const metade = Math.ceil(palavras.length / 2);
  const linha1 = palavras.slice(0, metade).join(" ");
  const linha2 = palavras.slice(metade).join(" ");
  return `${escapeHtml(linha1)} <span>${escapeHtml(linha2)}</span>`;
}

function irParaSlide(index) {
  UI.bannerAtual = index;
  const track = $("#banner-track");
  if (track) track.style.transform = `translateX(-${index * 100}%)`;
  $$(".banner__dot").forEach((d, i) => d.classList.toggle("ativo", i === index));
  reiniciarBannerAuto();
}

function proximo() {
  irParaSlide((UI.bannerAtual + 1) % UI.banners.length);
}

function iniciarBannerAuto() {
  if (UI.banners.length < 2) return;
  UI.bannerTimer = setInterval(proximo, 5000);
}

function reiniciarBannerAuto() {
  clearInterval(UI.bannerTimer);
  iniciarBannerAuto();
}

function scrollParaCardapio() {
  const el = $("#secao-cardapio");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ════════════════════════════════════════════════
   CATEGORIAS
   ════════════════════════════════════════════════ */
function renderCategorias() {
  const lista = $("#categorias-lista");
  if (!lista) return;

  const todosBtn = `
    <button class="categorias__item ativo" data-cat="todos">
      <span class="categorias__item-emoji">🍽️</span>
      <span>Tudo</span>
    </button>`;

  const catBtns = UI.categorias
    .map(
      (c) => `
    <button class="categorias__item" data-cat="${c.id}">
      <span class="categorias__item-emoji">${c.icone}</span>
      <span>${escapeHtml(c.nome)}</span>
    </button>`
    )
    .join("");

  lista.innerHTML = todosBtn + catBtns;

  lista.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cat]");
    if (!btn) return;
    const cat = btn.dataset.cat;
    UI.categoriaAtiva = cat;
    UI.termoBusca = "";
    const busca = $("#busca-input");
    if (busca) busca.value = "";
    $$(".categorias__item").forEach((b) => b.classList.remove("ativo"));
    btn.classList.add("ativo");
    renderCardapio();
  });
}

/* ════════════════════════════════════════════════
   DESTAQUES
   ════════════════════════════════════════════════ */
function renderDestaques() {
  const container = $("#destaques-scroll");
  if (!container) return;

  const destaques = UI.produtos.filter((p) => p.destaque);

  if (destaques.length === 0) {
    $("#secao-destaques")?.classList.add("hidden");
    return;
  }

  container.innerHTML = destaques
    .map(
      (p) => `
    <div class="card-destaque" data-pid="${p.id}" role="button" tabindex="0" aria-label="Ver ${escapeHtml(p.nome)}">
      <div class="card-destaque__foto-wrap">
        <img class="card-destaque__foto" src="${p.imagem}" alt="${escapeHtml(p.nome)}" loading="lazy">
        ${p.badge ? `<span class="card-destaque__badge">${escapeHtml(p.badge)}</span>` : ""}
      </div>
      <div class="card-destaque__corpo">
        <div class="card-destaque__nome">${escapeHtml(p.nome)}</div>
        <div class="card-destaque__desc">${escapeHtml(p.descricao)}</div>
        <div class="card-destaque__rodape">
          <div>
            ${p.preco_antigo ? `<span class="card-destaque__preco-antigo">R$ ${fmtPreco(p.preco_antigo)}</span>` : ""}
            <span class="card-destaque__preco">R$ ${fmtPreco(p.preco)}</span>
          </div>
          <button
            class="card-destaque__add"
            aria-label="Adicionar ${escapeHtml(p.nome)} ao pedido"
            data-add="${p.id}"
          >+</button>
        </div>
      </div>
    </div>`
    )
    .join("");

  container.addEventListener("click", (e) => {
    const addBtn = e.target.closest("[data-add]");
    if (addBtn) {
      e.stopPropagation();
      const prod = UI.produtos.find((p) => p.id === addBtn.dataset.add);
      if (prod) abrirModalProduto(prod);
      return;
    }
    const card = e.target.closest("[data-pid]");
    if (card) {
      const prod = UI.produtos.find((p) => p.id === card.dataset.pid);
      if (prod) abrirModalProduto(prod);
    }
  });
}

/* ════════════════════════════════════════════════
   CARDÁPIO
   ════════════════════════════════════════════════ */
function renderCardapio() {
  const container = $("#cardapio-grid");
  if (!container) return;

  let lista = UI.produtos;

  // Filtra categoria
  if (UI.categoriaAtiva !== "todos") {
    lista = lista.filter((p) => p.categoria === UI.categoriaAtiva);
  }

  // Filtra busca
  if (UI.termoBusca.trim()) {
    const termo = UI.termoBusca.toLowerCase().trim();
    lista = lista.filter(
      (p) =>
        p.nome.toLowerCase().includes(termo) ||
        p.descricao.toLowerCase().includes(termo) ||
        p.categoria.toLowerCase().includes(termo)
    );
  }

  // Nenhum resultado
  if (lista.length === 0) {
    container.innerHTML = `
      <div class="sem-resultados" style="grid-column: 1/-1;">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <p>Nenhum produto encontrado para <strong>"${escapeHtml(UI.termoBusca || UI.categoriaAtiva)}"</strong></p>
      </div>`;
    return;
  }

  container.innerHTML = lista.map(renderCardProduto).join("");

  // Eventos dos cards
  container.addEventListener("click", (e) => {
    const addBtn = e.target.closest("[data-add]");
    if (addBtn) {
      e.stopPropagation();
      const prod = UI.produtos.find((p) => p.id === addBtn.dataset.add);
      if (prod) abrirModalProduto(prod);
      return;
    }
    const card = e.target.closest("[data-pid]");
    if (card) {
      const prod = UI.produtos.find((p) => p.id === card.dataset.pid);
      if (prod) abrirModalProduto(prod);
    }
  });

  // Acessibilidade: teclado
  container.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      const card = e.target.closest("[data-pid]");
      if (card) {
        e.preventDefault();
        const prod = UI.produtos.find((p) => p.id === card.dataset.pid);
        if (prod) abrirModalProduto(prod);
      }
    }
  });
}

function renderCardProduto(p) {
  const badgeClass = badgeClasse(p.badge);
  return `
    <article
      class="card"
      data-pid="${p.id}"
      role="button"
      tabindex="0"
      aria-label="${escapeHtml(p.nome)}, R$ ${fmtPreco(p.preco)}"
    >
      <div class="card__foto-wrap">
        <img
          class="card__foto"
          src="${p.imagem}"
          alt="${escapeHtml(p.nome)}"
          loading="lazy"
        >
        ${p.badge ? `<span class="card__badge ${badgeClass}">${escapeHtml(p.badge)}</span>` : ""}
      </div>
      <div class="card__corpo">
        <h3 class="card__nome">${escapeHtml(p.nome)}</h3>
        <p class="card__desc">${escapeHtml(p.descricao)}</p>
        <div class="card__preco-wrap">
          <div class="card__preco-col">
            ${p.preco_antigo ? `<span class="card__preco-antigo">R$ ${fmtPreco(p.preco_antigo)}</span>` : ""}
            <span class="card__preco">R$ ${fmtPreco(p.preco)}</span>
          </div>
          <button
            class="card__btn-add"
            aria-label="Adicionar ${escapeHtml(p.nome)} ao pedido"
            data-add="${p.id}"
          >+</button>
        </div>
      </div>
    </article>`;
}

function badgeClasse(badge) {
  if (!badge) return "";
  const map = {
    "MAIS PEDIDO": "card__badge--destaque",
    "DESTAQUE": "card__badge--destaque",
    "OFERTA": "card__badge--oferta",
    "PROMOÇÃO": "card__badge--oferta",
    "ECONOMIA": "card__badge--oferta",
    "COMBO": "card__badge--combo",
    "FAMÍLIA": "card__badge--combo",
  };
  return map[badge] || "card__badge--padrao";
}

/* ════════════════════════════════════════════════
   MODAL DE PRODUTO
   ════════════════════════════════════════════════ */
function abrirModalProduto(produto) {
  UI.produtoSelecionado = produto;
  UI.adicionaisSelecionados = [];
  UI.qtdModal = 1;
  UI.obsModal = "";

  const overlay = $("#modal-produto");
  const adicionais = dataService.getAdicionais();

  // Foto e info
  $("#mp-foto").src = produto.imagem;
  $("#mp-foto").alt = produto.nome;
  $("#mp-nome").textContent = produto.nome;
  $("#mp-desc").textContent = produto.descricao;
  $("#mp-preco").textContent = `R$ ${fmtPreco(produto.preco)}`;

  const precoAntigo = $("#mp-preco-antigo");
  if (produto.preco_antigo) {
    precoAntigo.textContent = `R$ ${fmtPreco(produto.preco_antigo)}`;
    precoAntigo.classList.remove("hidden");
  } else {
    precoAntigo.classList.add("hidden");
  }

  // Adicionais
  const listaAds = $("#mp-adicionais");
  listaAds.innerHTML = adicionais
    .map(
      (a) => `
    <div class="adicional-item" data-aid="${a.id}" role="checkbox" aria-checked="false" tabindex="0">
      <label class="adicional-item__label">
        <div class="adicional-item__check" id="check-${a.id}"></div>
        <span class="adicional-item__nome">${escapeHtml(a.nome)}</span>
      </label>
      <span class="adicional-item__preco">+ R$ ${fmtPreco(a.preco)}</span>
    </div>`
    )
    .join("");

  // Bind clique adicionais
  listaAds.addEventListener("click", toggleAdicional);
  listaAds.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggleAdicional(e);
    }
  });

  // Qtd
  $("#mp-qtd").textContent = UI.qtdModal;
  atualizarTotalModal();

  // Obs
  const obs = $("#mp-obs");
  obs.value = "";
  obs.oninput = (e) => {
    UI.obsModal = e.target.value;
  };

  overlay.classList.add("aberto");
  document.body.classList.add("no-scroll");
}

function toggleAdicional(e) {
  const item = e.target.closest("[data-aid]");
  if (!item) return;
  const aid = item.dataset.aid;
  const adicionais = dataService.getAdicionais();
  const ad = adicionais.find((a) => a.id === aid);
  if (!ad) return;

  const idx = UI.adicionaisSelecionados.findIndex((a) => a.id === aid);
  const check = item.querySelector(".adicional-item__check");

  if (idx >= 0) {
    UI.adicionaisSelecionados.splice(idx, 1);
    check.classList.remove("checked");
    item.setAttribute("aria-checked", "false");
  } else {
    UI.adicionaisSelecionados.push(ad);
    check.classList.add("checked");
    item.setAttribute("aria-checked", "true");
  }

  atualizarTotalModal();
}

function atualizarTotalModal() {
  if (!UI.produtoSelecionado) return;
  const extraTotal = UI.adicionaisSelecionados.reduce((s, a) => s + a.preco, 0);
  const total = (UI.produtoSelecionado.preco + extraTotal) * UI.qtdModal;
  const btn = $("#mp-btn-add");
  if (btn) {
    const label = btn.querySelector(".btn-adicionar__label");
    const valor = btn.querySelector(".btn-adicionar__total");
    if (label) label.textContent = `Adicionar${UI.qtdModal > 1 ? ` (${UI.qtdModal})` : ""}`;
    if (valor) valor.textContent = `R$ ${fmtPreco(total)}`;
  }
}

function fecharModalProduto() {
  const overlay = $("#modal-produto");
  overlay.classList.remove("aberto");
  document.body.classList.remove("no-scroll");
  // Remove listener adicionais para evitar duplicatas
  const listaAds = $("#mp-adicionais");
  const clone = listaAds.cloneNode(true);
  listaAds.parentNode.replaceChild(clone, listaAds);
  UI.produtoSelecionado = null;
}

/* ════════════════════════════════════════════════
   MODAL CARRINHO
   ════════════════════════════════════════════════ */
function abrirModalCarrinho() {
  renderCarrinhoItens();
  $("#modal-carrinho").classList.add("aberto");
  document.body.classList.add("no-scroll");
}

function fecharModalCarrinho() {
  $("#modal-carrinho").classList.remove("aberto");
  document.body.classList.remove("no-scroll");
}

function renderCarrinhoItens() {
  const container = $("#carrinho-itens");
  if (!container) return;

  const items = Cart.getItems();

  if (items.length === 0) {
    container.innerHTML = `
      <div class="carrinho-vazio">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
        <p>Seu pedido está vazio.<br>Adicione itens do cardápio.</p>
      </div>`;
    return;
  }

  container.innerHTML = items.map((item) => `
    <div class="carrinho-item" data-cid="${item._cartId}">
      <img class="carrinho-item__foto" src="${item.imagem}" alt="${escapeHtml(item.nome)}" loading="lazy">
      <div class="carrinho-item__info">
        <div class="carrinho-item__nome">${escapeHtml(item.nome)}</div>
        ${item.adicionais?.length ? `<div class="carrinho-item__extras">+ ${item.adicionais.map((a) => escapeHtml(a.nome)).join(", ")}</div>` : ""}
        ${item.obs ? `<div class="carrinho-item__extras">📝 ${escapeHtml(item.obs)}</div>` : ""}
        <div class="carrinho-item__controles">
          <div class="qtd-ctrl">
            <button class="qtd-ctrl__btn" data-ctrl="dec" data-cid="${item._cartId}" aria-label="Diminuir quantidade">−</button>
            <span class="qtd-ctrl__num">${item.quantidade}</span>
            <button class="qtd-ctrl__btn" data-ctrl="inc" data-cid="${item._cartId}" aria-label="Aumentar quantidade">+</button>
          </div>
          <span class="carrinho-item__subtotal">R$ ${fmtPreco(item.preco * item.quantidade)}</span>
          <button class="carrinho-item__remover" data-remove="${item._cartId}" aria-label="Remover ${escapeHtml(item.nome)}">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </div>
    </div>`).join("");

  // Resumo
  const subtotal = Cart.getSubtotal();
  const resumo = $("#carrinho-resumo");
  if (resumo) {
    resumo.innerHTML = `
      <div class="carrinho__linha">
        <span>Subtotal (${Cart.getCount()} ${Cart.getCount() === 1 ? "item" : "itens"})</span>
        <span>R$ ${fmtPreco(subtotal)}</span>
      </div>
      <div class="carrinho__linha--total">
        <span>Total</span>
        <span class="valor">R$ ${fmtPreco(subtotal)}</span>
      </div>`;
  }

  // Bind controles
  container.addEventListener("click", (e) => {
    const removeBtn = e.target.closest("[data-remove]");
    if (removeBtn) {
      Cart.remove(removeBtn.dataset.remove);
      return;
    }
    const ctrlBtn = e.target.closest("[data-ctrl]");
    if (ctrlBtn) {
      const cid = ctrlBtn.dataset.cid;
      const item = Cart.getItems().find((i) => i._cartId === cid);
      if (!item) return;
      if (ctrlBtn.dataset.ctrl === "inc") Cart.setQty(cid, item.quantidade + 1);
      if (ctrlBtn.dataset.ctrl === "dec") Cart.setQty(cid, item.quantidade - 1);
    }
  });
}

/* ════════════════════════════════════════════════
   MODAL CHECKOUT
   ════════════════════════════════════════════════ */
function abrirModalCheckout() {
  fecharModalCarrinho();
  renderCheckoutResumo();
  const overlay = $("#modal-checkout");
  overlay.classList.add("aberto");
  document.body.classList.add("no-scroll");
}

function fecharModalCheckout() {
  $("#modal-checkout").classList.remove("aberto");
  document.body.classList.remove("no-scroll");
}

function renderCheckoutResumo() {
  const container = $("#checkout-resumo-itens");
  if (!container) return;

  const items = Cart.getItems();
  const subtotal = Cart.getSubtotal();
  const taxa = calcularTaxa();
  const total = subtotal + taxa;

  container.innerHTML = items.map((item) => `
    <div class="checkout-resumo__item">
      <span>${item.quantidade}x ${escapeHtml(item.nome)}</span>
      <span>R$ ${fmtPreco(item.preco * item.quantidade)}</span>
    </div>`).join("");

  const taxaEl = $("#checkout-taxa");
  if (taxaEl) taxaEl.textContent = taxa === 0 ? "Grátis" : `R$ ${fmtPreco(taxa)}`;

  const totalEl = $("#checkout-total");
  if (totalEl) totalEl.textContent = `R$ ${fmtPreco(total)}`;
}

function calcularTaxa() {
  if (UI.tipoEntrega === "retirada") return 0;
  // Grátis acima de R$50
  return Cart.getSubtotal() >= 50 ? 0 : 5.00;
}

/* ════════════════════════════════════════════════
   ATUALIZAR UI DO CARRINHO
   ════════════════════════════════════════════════ */
function atualizarCarrinhoUI() {
  const count = Cart.getCount();
  const subtotal = Cart.getSubtotal();

  // Badge header
  const badge = $("#header-cart-badge");
  if (badge) {
    badge.textContent = count;
    badge.classList.toggle("visible", count > 0);
  }

  // Barra mobile
  const barra = $("#barra-carrinho");
  if (barra) {
    barra.classList.toggle("visivel", count > 0);
    const barraItens = barra.querySelector(".barra-carrinho__itens");
    const barraTotal = barra.querySelector(".barra-carrinho__total");
    const barraBadge = barra.querySelector(".barra-carrinho__badge");
    if (barraItens) barraItens.textContent = `${count} ${count === 1 ? "item" : "itens"}`;
    if (barraTotal) barraTotal.textContent = `R$ ${fmtPreco(subtotal)}`;
    if (barraBadge) barraBadge.textContent = count;
  }
}

/* ════════════════════════════════════════════════
   BINDINGS DE EVENTOS
   ════════════════════════════════════════════════ */
function bindEvents() {
  // Busca
  const buscaInput = $("#busca-input");
  if (buscaInput) {
    buscaInput.addEventListener("input", (e) => {
      UI.termoBusca = e.target.value;
      UI.categoriaAtiva = "todos";
      $$(".categorias__item").forEach((b) => {
        b.classList.toggle("ativo", b.dataset.cat === "todos");
      });
      renderCardapio();
    });
  }

  // Busca mobile
  const buscaMobile = $("#busca-mobile");
  if (buscaMobile) {
    buscaMobile.addEventListener("input", (e) => {
      UI.termoBusca = e.target.value;
      UI.categoriaAtiva = "todos";
      $$(".categorias__item").forEach((b) => {
        b.classList.toggle("ativo", b.dataset.cat === "todos");
      });
      renderCardapio();
    });
  }

  // Menu hamburguer
  $("#btn-menu")?.addEventListener("click", () => {
    $("#menu-overlay").classList.add("aberto");
    $("#menu-lateral").classList.add("aberto");
    document.body.classList.add("no-scroll");
  });

  $("#menu-overlay")?.addEventListener("click", fecharMenu);
  $("#btn-fechar-menu")?.addEventListener("click", fecharMenu);

  // Links do menu lateral
  $$(".menu-lateral__link[data-cat]").forEach((link) => {
    link.addEventListener("click", () => {
      const cat = link.dataset.cat;
      UI.categoriaAtiva = cat;
      UI.termoBusca = "";
      $$(".categorias__item").forEach((b) => b.classList.toggle("ativo", b.dataset.cat === cat));
      renderCardapio();
      scrollParaCardapio();
      fecharMenu();
    });
  });

  // Botão header carrinho
  $("#btn-header-cart")?.addEventListener("click", abrirModalCarrinho);

  // Barra carrinho mobile
  $("#barra-carrinho")?.addEventListener("click", abrirModalCarrinho);

  // Banner: swipe mobile
  configurarSwipeBanner();

  // Modal produto: fechar
  $("#modal-produto-overlay")?.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) fecharModalProduto();
  });
  $("#mp-fechar")?.addEventListener("click", fecharModalProduto);

  // Modal produto: quantidade
  $("#mp-dec")?.addEventListener("click", () => {
    if (UI.qtdModal > 1) {
      UI.qtdModal--;
      $("#mp-qtd").textContent = UI.qtdModal;
      atualizarTotalModal();
    }
  });

  $("#mp-inc")?.addEventListener("click", () => {
    UI.qtdModal++;
    $("#mp-qtd").textContent = UI.qtdModal;
    atualizarTotalModal();
  });

  // Modal produto: adicionar
  $("#mp-btn-add")?.addEventListener("click", () => {
    if (!UI.produtoSelecionado) return;
    Cart.add(
      UI.produtoSelecionado,
      UI.qtdModal,
      [...UI.adicionaisSelecionados],
      UI.obsModal
    );
    fecharModalProduto();
    mostrarToast(`${UI.produtoSelecionado.nome} adicionado ao pedido!`);
  });

  // Modal carrinho: fechar
  $("#modal-carrinho-overlay")?.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) fecharModalCarrinho();
  });
  $("#carrinho-fechar")?.addEventListener("click", fecharModalCarrinho);
  $("#btn-finalizar")?.addEventListener("click", abrirModalCheckout);

  // Modal checkout: fechar
  $("#modal-checkout-overlay")?.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) fecharModalCheckout();
  });
  $("#checkout-fechar")?.addEventListener("click", fecharModalCheckout);

  // Checkout: tipo entrega
  $$("[data-entrega]").forEach((btn) => {
    btn.addEventListener("click", () => {
      UI.tipoEntrega = btn.dataset.entrega;
      $$("[data-entrega]").forEach((b) => b.classList.toggle("selecionado", b.dataset.entrega === UI.tipoEntrega));
      const campos = $("#campos-entrega");
      if (campos) campos.classList.toggle("hidden", UI.tipoEntrega !== "entrega");
      renderCheckoutResumo();
    });
  });

  // Checkout: pagamento
  $$("[data-pag]").forEach((btn) => {
    btn.addEventListener("click", () => {
      UI.pagamento = btn.dataset.pag;
      $$("[data-pag]").forEach((b) => b.classList.toggle("selecionado", b.dataset.pag === UI.pagamento));
    });
  });

  // Checkout: enviar WhatsApp
  $("#btn-whatsapp")?.addEventListener("click", () => {
    const nome = $("#checkout-nome")?.value?.trim();
    const telefone = $("#checkout-tel")?.value?.trim();

    if (!nome || !telefone) {
      alert("Por favor, preencha seu nome e telefone.");
      return;
    }

    if (Cart.getCount() === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }

    const endereco = UI.tipoEntrega === "entrega"
      ? [
          $("#checkout-rua")?.value,
          $("#checkout-num")?.value,
          $("#checkout-comp")?.value,
          $("#checkout-ref")?.value,
        ].filter(Boolean).join(", ")
      : "";

    const obs = $("#checkout-obs")?.value || "";
    const subtotal = Cart.getSubtotal();
    const taxa = calcularTaxa();

    enviarPedidoWhatsApp({
      cliente: nome,
      telefone,
      tipoEntrega: UI.tipoEntrega,
      endereco,
      pagamento: UI.pagamento,
      obs,
      items: Cart.getItems(),
      subtotal,
      taxaEntrega: taxa,
    });
  });

  // ESC fecha modais
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if ($("#modal-checkout").classList.contains("aberto")) fecharModalCheckout();
      else if ($("#modal-carrinho").classList.contains("aberto")) fecharModalCarrinho();
      else if ($("#modal-produto").classList.contains("aberto")) fecharModalProduto();
      else if ($("#menu-lateral").classList.contains("aberto")) fecharMenu();
    }
  });

  // Links de âncora do nav desktop
  $$("[data-scroll]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById(link.dataset.scroll);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });
}

/* ════════════════════════════════════════════════
   MENU LATERAL
   ════════════════════════════════════════════════ */
function fecharMenu() {
  $("#menu-overlay").classList.remove("aberto");
  $("#menu-lateral").classList.remove("aberto");
  document.body.classList.remove("no-scroll");
}

/* ════════════════════════════════════════════════
   SWIPE BANNER MOBILE
   ════════════════════════════════════════════════ */
function configurarSwipeBanner() {
  const track = $("#banner-track");
  if (!track) return;

  let startX = 0;
  let isDragging = false;

  track.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  track.addEventListener("touchend", (e) => {
    if (!isDragging) return;
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) proximo();
      else irParaSlide((UI.bannerAtual - 1 + UI.banners.length) % UI.banners.length);
    }
    isDragging = false;
  }, { passive: true });
}

/* ════════════════════════════════════════════════
   TOAST
   ════════════════════════════════════════════════ */
let toastTimer = null;

function mostrarToast(msg) {
  const toast = $("#toast");
  if (!toast) return;
  toast.querySelector(".toast__msg").textContent = msg;
  toast.classList.add("visivel");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visivel"), 2800);
}

/* ════════════════════════════════════════════════
   UTILITÁRIOS
   ════════════════════════════════════════════════ */
function fmtPreco(valor) {
  return valor.toFixed(2).replace(".", ",");
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
