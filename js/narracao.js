document.addEventListener('DOMContentLoaded', function() {
    
    // Seleciona todos os elementos cujos IDs começam com 'sound' (sound1, sound2, etc.)
    const botoesOuvir = document.querySelectorAll('[id^="sound"]');

    // Função auxiliar para atualizar o texto e ícone de UM botão
    function atualizarBotao(botao, falando) {
        if (falando) {
            botao.innerHTML = '<i class="bi bi-stop-fill"></i> Parar narração'; 
        } else {
            botao.innerHTML = '<i class="bi bi-volume-up-fill"></i> Ouvir narração'; 
        }
    }
    
    // Função para resetar o estado visual de TODOS os botões
    function resetarTodosBotoes() {
        botoesOuvir.forEach(btn => atualizarBotao(btn, false));
    }


    botoesOuvir.forEach(botaoOuvir => {
        // Inicializa o estado visual de cada botão
        atualizarBotao(botaoOuvir, false);

        // Mapeamento de ID
        const idNumero = botaoOuvir.id.replace('sound', ''); 
        const idSecao = `section${idNumero}`;
        const secaoTexto = document.getElementById(idSecao);

        if (!secaoTexto) return; 

        // Adiciona o ouvinte de evento para cada botão
        botaoOuvir.addEventListener('click', function() {
            
            const estaNoModoParar = this.innerHTML.includes('Parar narração');
            
            // --- Lógica de CANCELAMENTO MAIS SEGURA ---
            if (window.speechSynthesis.speaking) {
                
                // Cancela qualquer fala que esteja ocorrendo (globalmente)
                window.speechSynthesis.cancel();
                // Reseta a UI de todos os botões imediatamente
                resetarTodosBotoes();
                
                // SE o botão clicado estava no modo 'Parar', isso significa que a intenção era APENAS parar.
                // A função deve ser interrompida aqui para evitar a reinicialização.
                if (estaNoModoParar) {
                    return; // <--- PONTO CRUCIAL: Impede o reinício
                }
            }
            
            // --- Lógica de INÍCIO (Só chega aqui se a intenção for iniciar) ---
            const textoParaNarrar = secaoTexto.textContent.trim();

            if ('speechSynthesis' in window && textoParaNarrar.length > 0) {
                
                // Certifica-se de que todos os outros botões estão no estado 'Ouvir'
                resetarTodosBotoes(); 
                
                const narracao = new SpeechSynthesisUtterance(textoParaNarrar);

                // Configurações
                narracao.lang = 'pt-BR'; 
                const vozes = window.speechSynthesis.getVoices();
                const vozPortuguesa = vozes.find(voice => voice.lang.startsWith('pt'));
                if (vozPortuguesa) {
                    narracao.voice = vozPortuguesa;
                }

                // Inicia a narração
                window.speechSynthesis.speak(narracao);
                
                // Atualiza APENAS este botão para o estado 'Parar'
                atualizarBotao(this, true); 

                // Define o que acontece quando a narração termina naturalmente
                narracao.onend = function() {
                    atualizarBotao(botaoOuvir, false);
                };
            }
        });
    });
});