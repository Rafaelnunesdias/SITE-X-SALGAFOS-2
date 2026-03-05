
// Essa função PRECISA estar no seu script.js
function mudarQtd(botao, valor) {
    const inputContainer = botao.parentElement;
    const input = inputContainer.querySelector('.input-qtd');
    let qtdAtual = parseInt(input.value);
    
    let novaQtd = qtdAtual + valor;
    
    // Não deixa ficar negativo
    if (novaQtd < 0) novaQtd = 0; 
    
    input.value = novaQtd;
}
// Quando o professor clica em "Enviar Pedido"
document.getElementById('formPedido').addEventListener('submit', function(evento) {
    evento.preventDefault(); 

    const nome = document.getElementById('nomeCliente').value;
    
    // Varre o cardápio para ver o que a pessoa escolheu
    let resumoPedido = "";
    let totalItens = 0;
    const itensMenu = document.querySelectorAll('.menu-item');
    
    itensMenu.forEach(function(item) {
        const nomeSalgado = item.getAttribute('data-nome');
        const quantidade = parseInt(item.querySelector('.input-qtd').value);
        
        if (quantidade > 0) {
            resumoPedido += `<strong>${quantidade}x</strong> ${nomeSalgado}<br>`;
            totalItens += quantidade;
        }
    });

    // Se a pessoa não escolheu nada e tentou enviar:
    if (totalItens === 0) {
        alert("Por favor, escolha pelo menos um item do cardápio!");
        return; // Para a função aqui e não envia
    }

    const numeroPedido = Math.floor(Math.random() * 900) + 100;

    // Esconde o formulário e mostra a tela de Acompanhamento
    document.getElementById('formPedido').style.display = 'none';
    document.getElementById('telaSucesso').style.display = 'block';
    
    // Imprime a lista de tudo o que ele pediu
    document.getElementById('infoPedidoGerado').innerHTML = `
        <strong>Pedido #${numeroPedido}</strong><br><br>
        <div style="color: #ff6b00; font-size: 15px;">
            ${resumoPedido}
        </div>
        <br>
        <strong>Cliente:</strong> ${nome}
    `;

    // --- A MÁGICA DA SIMULAÇÃO DO STATUS ---
    // Depois de 4 segundos, muda para "Preparando"
    setTimeout(function() {
        document.getElementById('step-2').classList.add('active');
    }, 4000);

    // Depois de 8 segundos, muda para "Finalizando"
    setTimeout(function() {
        document.getElementById('step-3').classList.add('active');
    }, 8000);

    // Depois de 12 segundos, muda para "Aguardando Motoboy"
    setTimeout(function() {
        document.getElementById('step-4').classList.add('active');
    }, 12000);
});