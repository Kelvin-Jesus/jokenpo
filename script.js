const $jogadaJogador = document.querySelector('.jogada-do-jogador');
const $jogadaCPU = document.querySelector('.jogada-do-cpu');
const opcoes = ['pedra', 'papel', 'tesoura'];
const PONTOS_PARA_VENCER = 3; // MD5 = 3 | MD3 = 2
const PAUSA_ANTES_DO_RESULTADO = 510;

const jogadaVencedora = {
    'pedra': 'tesoura',
    'papel': 'pedra',
    'tesoura': 'papel',
};

const estado = {
    rodada: 1,
    pontos: {
        jogador: 0,
        cpu: 0,
    },
    jogada: {
        jogador: '',
        cpu: ''
    }
}

window.onload = () => document.querySelector('.pontos-vencer').innerText = PONTOS_PARA_VENCER;

document.querySelector('button.comecar').addEventListener('click', () => {
    document.querySelector('.inicio').classList.add('esconde');
    document.querySelector('.tela-principal').classList.remove('esconde');
})

document.querySelector('.opcoes').addEventListener('click', evento => {
    const elementoClicado = evento.target.closest('button');
    const opcaoEscolhida = elementoClicado?.classList[0];

    if (!opcoes.includes(opcaoEscolhida)) {
        return; /* opcao invalida */
    }

    estado.jogada.jogador = opcaoEscolhida;
    estado.jogada.cpu = jogadaDaCPU();
    let ganhador;

    if (estado.jogada.jogador === estado.jogada.cpu) {
        ganhador = 'empate';
    }
    //jogador seleciona a opção que ganha da CPU
    else if (jogadaVencedora[estado.jogada.jogador] === estado.jogada.cpu) {
        ganhador = 'jogador';
    }
    else {
        ganhador = 'cpu';
    }

    atualizaJogada(ganhador);
});

const desenharPlacar = () => {
    document.querySelector('.placar-jogador .pontos').innerText = estado.pontos.jogador;
    document.querySelector('.placar-cpu .pontos').innerText = estado.pontos.cpu;
    document.querySelector('.rodada-atual').innerText = estado.rodada;
}

const atualizaJogada = (ganhador) => {
    opcoesClicaveis(false);
    toggleBalancando(true);

    $jogadaJogador.addEventListener('animationend', () => {
        toggleBalancando(false);

        mostraJogada($jogadaJogador, estado.jogada.jogador);
        mostraJogada($jogadaCPU, estado.jogada.cpu);
        atualizaPlacar(ganhador);

        if (
            estado.pontos.jogador === PONTOS_PARA_VENCER
            || estado.pontos.cpu === PONTOS_PARA_VENCER
        ) setTimeout(desenhaResultado, PAUSA_ANTES_DO_RESULTADO);
        else opcoesClicaveis(true);
    }, { once: true })
};

const toggleBalancando = (adiciona) => [$jogadaJogador, $jogadaCPU].forEach(elemento => elemento.classList.toggle('balancando', adiciona))

const mostraJogada = (container, jogada) => mostraSomente(container.querySelectorAll('.jogada div'), jogada);

// IA me ajudou nessa função, por repetir demais essa lógica
const mostraSomente = (elementos, nome) => {
    for (const elemento of elementos) {
        elemento.classList.toggle('esconde', !elemento.classList.contains(nome));
    }
}

const atualizaPlacar = (ganhador) => {
    if (ganhador !== 'empate') estado.pontos[ganhador]++;

    desenhaFraseDaRodada(ganhador);

    estado.rodada++;
    desenharPlacar();
};

const desenhaFraseDaRodada = (resultado) => {
    const $frases = document.querySelector('.frases');
    mostraSomente($frases.children, resultado === 'empate' ? 'empate' : 'quem-ganhou');

    if (resultado === 'empate') return;

    const vencedora = estado.jogada[resultado];
    $frases.querySelector('.jogador-ou-cpu').innerText = resultado === 'jogador' ? 'do Jogador' : 'da CPU';
    $frases.querySelector('.opcao1').innerText = vencedora;
    $frases.querySelector('.opcao2').innerText = jogadaVencedora[vencedora];
}

const opcoesClicaveis = (ehClicavel) => document
    .querySelectorAll('.opcoes button')
    .forEach(btn => (btn.disabled = !ehClicavel));

const desenhaResultado = () => {
    document.querySelector('.resultado').classList.remove('esconde');
    document.querySelector('.tela-principal').classList.add('esconde');

    document.querySelector('.vencedor').innerText = (estado.pontos.jogador > estado.pontos.cpu ? 'Você' : 'CPU');
    document.querySelector('.seu-resultado').innerText = estado.pontos.jogador;
    document.querySelector('.cpu-resultado').innerText = estado.pontos.cpu;
    document.querySelector('.qtd-rodadas').innerText = estado.rodada - 1;
}

const resetar = () => {
    estado.rodada = 1;
    estado.pontos = { jogador: 0, cpu: 0 };
    estado.jogada = { jogador: '', cpu: '' };

    mostraSomente(document.querySelectorAll('.inicio, .tela-principal, .resultado'), 'tela-principal')
    mostraSomente(document.querySelector('.frases').children, 'primeira-jogada')

    desenharPlacar()
    opcoesClicaveis(true)

    mostraJogada($jogadaJogador, 'vazio');
    mostraJogada($jogadaCPU, 'vazio');
}

document.querySelector('.resultado button').addEventListener('click', resetar);

const jogadaDaCPU = () => opcoes[Math.floor(Math.random() * opcoes.length)];
