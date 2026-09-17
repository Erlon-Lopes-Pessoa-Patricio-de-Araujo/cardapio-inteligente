/**
 * HOUSE 28 BURGUER — WhatsApp
 * ============================
 * Gera a mensagem formatada e abre o WhatsApp.
 *
 * ⚠️  IMPORTANTE: Altere WHATSAPP_NUMBER para o número real da House 28.
 *     Formato: código do país + DDD + número (só dígitos)
 *     Exemplo: 5581999999999
 */

const WHATSAPP_NUMBER = "5581999999999";

function gerarMensagemPedido({ cliente, telefone, tipoEntrega, endereco, pagamento, obs, items, subtotal, taxaEntrega }) {
  const total = subtotal + taxaEntrega;

  const linhasItens = items
    .map((item) => {
      let linha = `${item.quantidade}x ${item.nome} — R$ ${fmt(item.preco * item.quantidade)}`;
      if (item.adicionais && item.adicionais.length > 0) {
        const ads = item.adicionais.map((a) => `   + ${a.nome} (R$ ${fmt(a.preco)})`).join("\n");
        linha += `\n${ads}`;
      }
      if (item.obs) {
        linha += `\n   📝 ${item.obs}`;
      }
      return linha;
    })
    .join("\n");

  const enderecoLinha = tipoEntrega === "entrega"
    ? `📍 Endereço: ${endereco}`
    : `🏠 Retirada no local`;

  const taxaLinha = taxaEntrega === 0
    ? `Taxa de entrega: GRÁTIS`
    : `Taxa de entrega: R$ ${fmt(taxaEntrega)}`;

  const msg =
`*NOVO PEDIDO — HOUSE 28 BURGUER* 🍔

👤 Cliente: ${cliente}
📱 Telefone: ${telefone}
${enderecoLinha}
💳 Pagamento: ${pagamento}

─────────────────────
*ITENS DO PEDIDO:*

${linhasItens}

─────────────────────
${taxaLinha}
*TOTAL: R$ ${fmt(total)}*
${obs ? `\n📋 Obs gerais: ${obs}` : ""}`;

  return msg.trim();
}

function enviarPedidoWhatsApp(dadosPedido) {
  const mensagem = gerarMensagemPedido(dadosPedido);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");
}

function fmt(valor) {
  return valor.toFixed(2).replace(".", ",");
}
