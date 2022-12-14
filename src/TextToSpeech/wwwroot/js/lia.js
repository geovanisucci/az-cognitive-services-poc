async function falar(text) {
  var speechConfig = SpeechSDK.SpeechConfig.fromSubscription("54f558ca585747efa85d517e1c15bcbb", "brazilsouth");
  speechConfig.speechSynthesisLanguage = "pt-BR";
  speechConfig.speechSynthesisVoiceName = "pt-BR-FranciscaNeural";

  synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);
  await synthesizer.speakTextAsync(
    text,
    function (result) {
      startSpeakTextAsyncButton.disabled = false;
      if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
        console.log("synthesis finished for [" + text + "].\n");
      } else if (result.reason === SpeechSDK.ResultReason.Canceled) {
        console.log("synthesis failed. Error detail: " + result.errorDetails + "\n");
      }
      window.console.log(result);
      synthesizer.close();
      synthesizer = undefined;
    },
    function (err) {
      startSpeakTextAsyncButton.disabled = false;
      window.console.log(err);

      synthesizer.close();
      synthesizer = undefined;
    });
}

function saudacoesLizy() {
  falar(SAUDACOES_LIZY);
}

function ouvir() {
  saudacoesLizy();

  setTimeout(function () {
    var speechConfig = SpeechSDK.SpeechConfig.fromSubscription("54f558ca585747efa85d517e1c15bcbb", "brazilsouth");
    speechConfig.speechRecognitionLanguage = "pt-BR";
    var audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

    let permiteFalar = false;
    let emitirNFe = false;
    let emitirNFSe = false;

    recognizer.startContinuousRecognitionAsync();

    recognizer.recognized = async (reco, e) => {

      if (isInArray(e.result.text, POSSIBILIDADES_FRASE_OI_LIA)) {
        await falar(RESPOSTA_O_QUE_DESEJA_FAZER);
        permiteFalar = true;
        emitirNFe = false;
        emitirNFSe = false;
      }

      //INTERACAO EMISSAO DE NOTA - INICIO
      if (permiteFalar) {
        if (isInArray(e.result.text.toLowerCase(), POSSIBILIDADES_FRASE_EMITIR_NOTA)) {
          falar(RESPOSTA_NOTA_SERVICO_OU_VENDA)
        }
        else if (isInArray(e.result.text.toLowerCase(), POSSIBILIDADES_FRASE_EMITIR_NOTA_VENDA)) {
          falar(RESPOSTA_EMISSAO_NFE_PEGUNTAR_NUMERO_VENDA);
          emitirNFe = true;
        }
        else if (isInArray(e.result.text.toLowerCase(), POSSIBILIDADES_FRASE_EMITIR_NOTA_SERVICO)) {
          falar(RESPOSTA_EMISSAO_NFSE_PEGUNTAR_NUMERO_VENDA_SERVICO);
          emitirNFSe = true;
        }
        else if (isNumeric(e.result.text)) {
          if (emitirNFe) {

            await falar(RESPOSTA_EMISSAO);

            await postEmitirNFe(e.result.text);

            await falar(RESPOSTA_NFE_EMITIDA);

            emitirNFSe = false;
            emitirNFe = false;
            permiteFalar = false;

          }
          else if (emitirNFSe) {

            falar(RESPOSTA_EMISSAO);

            var delayInMilliseconds = 6000; //1 second

            setTimeout(function () {
              falar(RESPOSTA_NFSE_EMITIDA);
              emitirNFe = false;
              permiteFalar = false;
              //your code to be executed after 1 second
            }, delayInMilliseconds);

          }
        }

      }
      //INTERA????O EMISSAO NOTA - FINAL

    };
  }, 5000);




  document.getElementById('stopSpeakTextAsyncButton').addEventListener("click", function () {
    recognizer.stopContinuousRecognitionAsync();
    permiteFalar = false;
  });

}