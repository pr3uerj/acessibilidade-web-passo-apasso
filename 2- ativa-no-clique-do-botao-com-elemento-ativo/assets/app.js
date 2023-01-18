    startDictation("speech-search","is-search-input-523", 'microphone-dictation' )


      function startDictation(formElement, inputElement, micElement) {

        //if (window.hasOwnProperty('webkitSpeechRecognition')) {

        var isActive = false, startTime, endTime;

        const endereco = new URL(window.location.href);

        const formSearch =  document.getElementById(formElement)
        const inputSearch = document.getElementById(inputElement)
        const microfone = document.getElementById(micElement)

        var transcription

        var cmd_acessar = "acessar"
        var cmd_pesquisar = "pesquisar por"

        var inputVazio = true

        console.log("Elemento ativo: " + document.activeElement)

        //microfone.focus()
        inputSearch.setAttribute("placeholder", "Fale para buscar")

        const recognition = new webkitSpeechRecognition() || new SpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "pt-BR";
        //recognition.start();

        recognition.onresult = (event) => {
            transcription =  event.results[0][0].transcript;
            if (transcription.includes(cmd_pesquisar) == true ) {
                      inputSearch.value = transcription.slice(13) // slice(13) - pega a string a partir do 13° caracter - ignorando o "Pesquisar por"
                //formSearch.action = `${endereco.hostname}/?s=${transcription.slice(13)}`
                formSearch.action = "http://www.pr3.uerj.br/?s=" + inputSearch.value
                inputVazio = false;
                console.log("Transcrição da voz: " + transcription)
                formSearch.submit();
            }
        };

        recognition.onerror = (evento) => {
            console.error("Erro detectado: " + evento.error);
            //Implementar mensagem para o usuário
            //recognition.stop();
        }

        recognition.onspeechend = () => {
            recognition.stop();
            console.log('Reconhecimento de fala pausado');
            console.log("Input vazio: " + inputVazio);
            //if (inputVazio == false )
        }

        recognition.onend = () => {
            //Implementar mensagem para o usuário
            console.log('Desconectado do serviço de reconhecimento de voz.');
        }

        micElement.onclick = () => {
            recognition.start();
        }

        document.onkeydown = (event) => {
            setTimeout(function () { // setTimeout aqui é usado apenas para debug e mostrar o elemento ativo no console, caso contrário, mostrará o penúltimo ativo
                var activeEl
                if (event.key === "Tab" ) {
                    activeEl = document.activeElement;
                    if (activeEl.id == "microphone-dictation") {
                        console.log("Microfone selecionado")
                        // O evento só vai funcionar quando apaertar e solatar o Enter no elemento ativo
                        document.onkeyup = function(event) {
                          if (event.key === "Enter") {
                              console.log("A tecla Enter foi pressionada no microfone. Reconhecimento de voz ativado")
                              recognition.start();
                          }
                        }
                        activeEl = null;
                    }
                }
            }, 100);
        };


        //}
     }


