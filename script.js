function mudarQtd(botao, valor) {
    const inputContainer = botao.parentElement;
    const input = inputContainer.querySelector('.input-qtd');
    let qtdAtual = parseInt(input.value);
    
    let novaQtd = qtdAtual + valor;
    if (novaQtd < 0) novaQtd = 0; 
    
    input.value = novaQtd;
}

document.getElementById('formPedido').addEventListener('submit', function(evento) {
    evento.preventDefault(); 

    const nome = document.getElementById('nomeCliente').value;
    
    let resumoPedido = "";
    let itensParaPainel = ""; // Lista limpa para mandar pro computador
    let totalItens = 0;
    const itensMenu = document.querySelectorAll('.menu-item');
    
    itensMenu.forEach(function(item) {
        const nomeSalgado = item.getAttribute('data-nome');
        const quantidade = parseInt(item.querySelector('.input-qtd').value);
        
        if (quantidade > 0) {
            resumoPedido += `<strong>${quantidade}x</strong> ${nomeSalgado}<br>`;
            itensParaPainel += `${quantidade}x ${nomeSalgado},`; // Separa por vírgula
            totalItens += quantidade;
        }
    });

    if (totalItens === 0) {
        alert("Por favor, escolha pelo menos um item do cardápio!");
        return;
    }

    const numeroPedido = Math.floor(Math.random() * 900) + 100;

    // --- A MÁGICA: MANDANDO O PEDIDO PARA A TELA DO COMPUTADOR ---
    const mensagemProPainel = `Pedido #${numeroPedido}|${nome}|${itensParaPainel}`;
    fetch('https://ntfy.sh/xsalgados_senai_2026', {
        method: 'POST',
        body: mensagemProPainel
    });
    // -------------------------------------------------------------

    document.getElementById('formPedido').style.display = 'none';
    document.getElementById('telaSucesso').style.display = 'block';
    
    document.getElementById('infoPedidoGerado').innerHTML = `
        <strong>Pedido #${numeroPedido}</strong><br><br>
        <div style="color: #ff6b00; font-size: 15px;">${resumoPedido}</div>
        <br><strong>Cliente:</strong> ${nome}
    `;

    setTimeout(function() { document.getElementById('step-2').classList.add('active'); }, 4000);
    setTimeout(function() { document.getElementById('step-3').classList.add('active'); }, 8000);
    setTimeout(function() { document.getElementById('step-4').classList.add('active'); }, 12000);
});