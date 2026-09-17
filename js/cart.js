/**
 * HOUSE 28 BURGUER — Carrinho
 * ============================
 * Gerencia estado do carrinho via localStorage.
 */

const Cart = (() => {
  const STORAGE_KEY = "house28_cart";

  let _items = [];
  let _listeners = [];

  function _load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      _items = raw ? JSON.parse(raw) : [];
    } catch {
      _items = [];
    }
  }

  function _save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(_items));
  }

  function _notify() {
    _listeners.forEach((fn) => fn(_items));
  }

  function init() {
    _load();
  }

  function onChange(fn) {
    _listeners.push(fn);
  }

  /**
   * Adiciona ou incrementa item no carrinho.
   * @param {Object} produto - produto do catálogo
   * @param {number} qty     - quantidade
   * @param {Array}  adicionais - [{ id, nome, preco }]
   * @param {string} obs     - observação do cliente
   */
  function add(produto, qty = 1, adicionais = [], obs = "") {
    const precoAdicionais = adicionais.reduce((s, a) => s + a.preco, 0);
    const precoUnitario = produto.preco + precoAdicionais;

    // Cada adição cria uma linha própria (permite customizações diferentes)
    const item = {
      _cartId: `${produto.id}_${Date.now()}`,
      produtoId: produto.id,
      nome: produto.nome,
      preco: precoUnitario,
      precoBase: produto.preco,
      adicionais,
      obs,
      quantidade: qty,
      imagem: produto.imagem,
    };

    _items.push(item);
    _save();
    _notify();
    return item;
  }

  function remove(cartId) {
    _items = _items.filter((i) => i._cartId !== cartId);
    _save();
    _notify();
  }

  function setQty(cartId, qty) {
    const item = _items.find((i) => i._cartId === cartId);
    if (!item) return;
    if (qty <= 0) {
      remove(cartId);
      return;
    }
    item.quantidade = qty;
    _save();
    _notify();
  }

  function clear() {
    _items = [];
    _save();
    _notify();
  }

  function getItems() {
    return [..._items];
  }

  function getCount() {
    return _items.reduce((s, i) => s + i.quantidade, 0);
  }

  function getSubtotal() {
    return _items.reduce((s, i) => s + i.preco * i.quantidade, 0);
  }

  return { init, onChange, add, remove, setQty, clear, getItems, getCount, getSubtotal };
})();
