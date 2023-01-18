      startDictation("speech-search","is-search-input-523", 'microphone-dictation', 'mapa-do-site',  'primary-menu')


      function startDictation(formElement, inputElement, micElement, siteMap, menu) {

        //if (window.hasOwnProperty('webkitSpeechRecognition')) {

        var micIsActive = false, startTime, endTime;

        const endereco = new URL(window.location.href);

        const navigationToElements = {
            content: "conteúdo principal",
            mainMenu: "menu principal",
            toTop: "voltar para o topo",
            siteMap: "mapa do site"
        }

        const content = document.getElementById("content")
        const mainMenu = document.getElementById(menu)
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
            if (transcription.includes(cmd_acessar) == true && micIsActive == false) { //impede de usar o comando acessar quando o microfone da busca estiver ativo
                console.log("Transcrição da voz: " + transcription)
                console.log("Transcrição da voz sem o comando: " + transcription.slice(8))
                if (transcription.slice(8) == navigationToElements.content)  // slice(8) - pega a string a partir do 7° caracter - ignorando o "acessar"
                    content.scrollIntoView({behavior: "smooth"})
                else if (transcription.slice(8) == navigationToElements.toTop)
                    content.scrollIntoView({behavior: "smooth"})
                else if (transcription.slice(8) == navigationToElements.mainMenu)
                    mainMenu.scrollIntoView({behavior: "smooth"})
                else if (transcription.slice(8) == navigationToElements.siteMap)
                   // window.location.href = `${endereco.hostname}/siteMap`;
                   window.location.href = "http://www.pr3.uerj.br/index.php/" + siteMap
                   console.log("http://www.pr3.uerj.br/index.php/" + siteMap)
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

            var audioEnter = new Audio();
            //audioEnter.src = "file_name.mp3";

            /* código para pegar o tempo da tecla pressionada. Esse código é usado em conjunto com o método onkeyup
            para fazer o Endtime -startTime
            */
            if( event.ctrlKey) {
                var date = new Date();
                startTime = date.getTime();

                console.log("Tempo keydown: " + startTime);
            }

            setTimeout(function () { // setTimeout aqui é usado apenas para debug e mostrar o elemento ativo no console, caso contrário, mostrará o penúltimo ativo
                var activeEl, mensagem;
                mensagem = "";
                if (event.key === "Tab" ) {
                    activeEl = document.activeElement;
                    if (activeEl) {
                        mensagem += activeEl.id
                    }
                    console.log(mensagem);
                    if (activeEl.id == "microphone-dictation") {
                        //audioEnter.play(); Aperte Enter par acionar o comando de busca por voz
                        console.log("Elemento ativo: " + activeEl)
                        /* ao invés de trabalhar com onkeyup aqui, vamos mudar o status dessa varável global para TRUE
                           Assim podemos usar o onkeyup fora do onkeydown e usuá-lo para outras ocosiões
                        */
                        micIsActive = true
                    }
                    activeEl = null;
                }
            }, 100);
        };


        document.onkeyup = function(event) {
            //elemento ativo capturado pelo método onkeydown
            if (micIsActive == true && event.key === "Enter") {
                console.log("A tecla Enter foi pressionada no microfone")
                recognition.start();
            }

           // código para pegar o tempo da tecla liberada. Esse código é usado em conjunto com o método onkeydown
           // para fazer o Endtime -startTime
           if( event.key == "Control" || event.code == "ControlLeft" || event.code == "ControlRight") {
          	var date = new Date();
          	endTime = date.getTime();
            var timeTaken = endTime - startTime;

          	console.log(`Tempo keyup: ${startTime}`);
            console.log(event.code)
            if (timeTaken >= 3000){
                console.log("Tempo pressionado: " + (timeTaken / 1000).toFixed(1) + "s");
                recognition.start();

            }
          }
        }


        //}
     }

