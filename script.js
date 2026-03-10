function mudarQtd(botao, valor) {
    const inputContainer = botao.parentElement;
    const input = inputContainer.querySelector('.input-qtd');
    let qtdAtual = parseInt(input.value);
    let novaQtd = qtdAtual + valor;
    if (novaQtd < 0) novaQtd = 0;
    input.value = novaQtd;
}

function mostrarInfoPagamento(tipo) {
    document.getElementById('bloco-pix').style.display = 'none';
    document.getElementById('bloco-cartao').style.display = 'none';
    document.getElementById('bloco-dinheiro').style.display = 'none';

    if (tipo === 'Pix') {
        document.getElementById('bloco-pix').style.display = 'block';
    } else if (tipo === 'Cartão (Maquininha)') {
        document.getElementById('bloco-cartao').style.display = 'block';
    } else if (tipo === 'Dinheiro') {
        document.getElementById('bloco-dinheiro').style.display = 'block';
    }
}

function copiarPix() {
    const chave = document.getElementById('pix-chave').textContent;
    navigator.clipboard.writeText(chave).then(() => {
        const btn = document.querySelector('.btn-copiar');
        btn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
        btn.style.background = '#27ae60';
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-copy"></i> Copiar';
            btn.style.background = '';
        }, 2000);
    });
}

document.getElementById('formPedido').addEventListener('submit', function(evento) {
    evento.preventDefault();

    const nome = document.getElementById('nomeCliente').value.trim();
    const endereco = document.getElementById('enderecoCliente').value.trim();
    const pagamento = document.getElementById('pagamento').value;
    const trocoEl = document.getElementById('trocoCliente');
    const troco = trocoEl ? trocoEl.value.trim() : '';

    let resumoPedido = "";
    let itensParaPainel = "";
    let totalItens = 0;
    const itensMenu = document.querySelectorAll('.menu-item');

    itensMenu.forEach(function(item) {
        const nomeSalgado = item.getAttribute('data-nome');
        const quantidade = parseInt(item.querySelector('.input-qtd').value);
        if (quantidade > 0) {
            resumoPedido += `<strong>${quantidade}x</strong> ${nomeSalgado}<br>`;
            itensParaPainel += `${quantidade}x ${nomeSalgado}, `;
            totalItens += quantidade;
        }
    });

    if (totalItens === 0) {
        alert("Escolha pelo menos um salgado!");
        return;
    }

    const numeroPedido = Math.floor(Math.random() * 900) + 100;

    let pagamentoCompleto = pagamento;
    if (pagamento === 'Dinheiro' && troco) {
        pagamentoCompleto += ` (troco p/ ${troco})`;
    }

    // Envia para o painel
    const mensagemProPainel = `Pedido #${numeroPedido}|${nome}|${itensParaPainel}|${endereco}|${pagamentoCompleto}`;
    fetch('https://ntfy.sh/xsalgados_senai_2026', {
        method: 'POST',
        body: mensagemProPainel
    });

    document.getElementById('formPedido').style.display = 'none';
    document.getElementById('telaSucesso').style.display = 'block';

    // Resumo do pedido na tela de sucesso
    let trocoInfo = (pagamento === 'Dinheiro' && troco) ? `<br><small><strong>Troco para:</strong> ${troco}</small>` : '';
    document.getElementById('infoPedidoGerado').innerHTML = `
        <strong>Pedido #${numeroPedido}</strong><br>
        <div style="color: #ff6b00; margin: 10px 0;">${resumoPedido}</div>
        <small><strong>Entrega:</strong> ${endereco}</small><br>
        <small><strong>Pagamento:</strong> ${pagamentoCompleto}</small>${trocoInfo}
    `;

    // Instrução de pagamento pós-envio
    const instrucaoDiv = document.getElementById('instrucao-pagamento');
    if (pagamento === 'Pix') {
        instrucaoDiv.innerHTML = `
            <div class="instrucao-pix">
                💸 Realize o Pix para: <strong>11999999999</strong><br>
                <span style="font-size:13px;">Envie o comprovante pelo WhatsApp após pagar.</span>
            </div>`;
    } else if (pagamento === 'Cartão (Maquininha)') {
        instrucaoDiv.innerHTML = `
            <div class="instrucao-cartao">
                💳 Maquininha na entrega. Débito e crédito aceitos!
            </div>`;
    } else if (pagamento === 'Dinheiro') {
        instrucaoDiv.innerHTML = `
            <div class="instrucao-dinheiro">
                💵 Separe o dinheiro para o entregador.
                ${troco ? `<br>Troco para <strong>${troco}</strong>.` : ''}
            </div>`;
    }

    // Rastreamento simulado
    setTimeout(() => document.getElementById('step-2').classList.add('active'), 4000);
    setTimeout(() => document.getElementById('step-3').classList.add('active'), 8000);
    setTimeout(() => document.getElementById('step-4').classList.add('active'), 12000);
});
