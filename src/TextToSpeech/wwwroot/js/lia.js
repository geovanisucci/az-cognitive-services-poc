function falar(text){
    var speechConfig = SpeechSDK.SpeechConfig.fromSubscription("54f558ca585747efa85d517e1c15bcbb", "brazilsouth"); 
    speechConfig.speechSynthesisLanguage = "pt-BR"; 
    speechConfig.speechSynthesisVoiceName = "pt-BR-FranciscaNeural";

    synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);
    synthesizer.speakTextAsync(
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

function saudacoesLizy(){
     falar(SAUDACOES_LIZY);
}

function ouvir(){

    saudacoesLizy();

    var speechConfig = SpeechSDK.SpeechConfig.fromSubscription("54f558ca585747efa85d517e1c15bcbb", "brazilsouth");
    speechConfig.speechRecognitionLanguage = "pt-BR"; 
    var audioConfig  = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
    //recognizer = new SpeechSDK.IntentRecognizer(speechConfig, audioConfig);

    // //Adicionar intenções
    //  recognizer.addIntent("Oi Lia", "OiLia_I1");
    //  recognizer.addIntent("Oi, Lia.", "OiLia_I2");
    //  recognizer.addIntent("Oi, lia.", "OiLia_I3");
     let permiteFalar = false;
     let emitirNFe = false;

    recognizer.startContinuousRecognitionAsync();

    recognizer.recognized = (reco, e) => {

      if(isInArray(e.result.text, POSSIBILIDADES_FRASE_OI_LIA)){
        falar(RESPOSTA_O_QUE_DESEJA_FAZER);
        permiteFalar = true;
        emitirNFe = false;
      }

      //INTERACAO EMISSAO DE NOTA - INICIO
      if(permiteFalar){
        if(isInArray(e.result.text.toLowerCase(), POSSIBILIDADES_FRASE_EMITIR_NOTA)){
          falar(RESPOSTA_NOTA_SERVICO_OU_VENDA)
        }
        else if(isInArray(e.result.text.toLowerCase(), POSSIBILIDADES_FRASE_EMITIR_NOTA_VENDA)){
          falar(RESPOSTA_EMISSAO_NFE_PEGUNTAR_NUMERO_VENDA);
          emitirNFe = true;
        }
        else if(isNumeric(e.result.text)){
          if(emitirNFe){
            
          falar(RESPOSTA_EMISSAO_NFE);

          var delayInMilliseconds = 6000; //1 second

          setTimeout(function() {
          falar(RESPOSTA_NFE_EMITIDA);
          emitirNFe = false;
          permiteFalar = false;
            //your code to be executed after 1 second
          }, delayInMilliseconds);

          }
        }
  
      }

        // switch (e.result.reason) {

        //     case SpeechSDK.ResultReason.RecognizedSpeech:
        //         if(e.result.text == "Oi, Lia." || e.result.text == "Oi Lia" || e.result.text == "Oi, lia."){
        //             falar("Oi, o que deseja fazer?");
        //         }
        //         window.console.log(e.result.text);
        //         break;
    
        //       case SpeechSDK.ResultReason.RecognizedIntent:
        //         if(e.result.intentId == "OiLia_I1" || e.result.intentId == "OiLia_I2" || e.result.intentId == "OiLia_I3"){
        //             falar("Oi, o que deseja fazer?");
        //         }
        //         break;
    
        //       case SpeechSDK.ResultReason.NoMatch:
        //         var noMatchDetail = SpeechSDK.NoMatchDetails.fromResult(result);
        //         window.console.log(" NoMatchReason: " + SpeechSDK.NoMatchReason[noMatchDetail.reason]);
        //         break;
                
        //       case SpeechSDK.ResultReason.Canceled:
        //         var cancelDetails = SpeechSDK.CancellationDetails.fromResult(result);
        //         window.console.log(" CancellationReason: " + SpeechSDK.CancellationReason[cancelDetails.reason]);
        //         if (cancelDetails.reason === SpeechSDK.CancellationReason.Error) {
        //           window.console.log(": " + cancelDetails.errorDetails);
        //         }
        //         break;
        // }
      };

      document.getElementById('stopSpeakTextAsyncButton').addEventListener("click", function () {
        recognizer.stopContinuousRecognitionAsync();
        permiteFalar = false;
      });
    
}