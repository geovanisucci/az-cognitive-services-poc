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

function conversar(){
    var speechConfig = SpeechSDK.SpeechConfig.fromSubscription("54f558ca585747efa85d517e1c15bcbb", "brazilsouth");
    speechConfig.speechSynthesisLanguage = "pt-BR"; 
    speechConfig.speechSynthesisVoiceName = "pt-BR-FranciscaNeural";
    recognizer = new SpeechSDK.IntentRecognizer(speechConfig);

    //Adicionar intenções
    //Oi Lia.
    recognizer.addIntent("Oi, LIA.", "OiLIA");

    recognizer.recognizeOnceAsync(
      function (result) {
        window.console.log(result);
        switch (result.reason) {

          case SpeechSDK.ResultReason.RecognizedSpeech:
            falar("Oi, o que deseja fazer?");
            break;

          case SpeechSDK.ResultReason.RecognizedIntent:
            falar("Oi, o que deseja fazer?");
            break;

          case SpeechSDK.ResultReason.NoMatch:
            var noMatchDetail = SpeechSDK.NoMatchDetails.fromResult(result);
            window.console.log(" NoMatchReason: " + SpeechSDK.NoMatchReason[noMatchDetail.reason]);
            break;
            
          case SpeechSDK.ResultReason.Canceled:
            var cancelDetails = SpeechSDK.CancellationDetails.fromResult(result);
            window.console.log(" CancellationReason: " + SpeechSDK.CancellationReason[cancelDetails.reason]);
            if (cancelDetails.reason === SpeechSDK.CancellationReason.Error) {
              window.console.log(": " + cancelDetails.errorDetails);
            }
            break;
        }
      },
      function (err) {
        window.console.log(err);
    });
    
}

function iniciar(){

    saudacoesLizy();

    var speechConfig = SpeechSDK.SpeechConfig.fromSubscription("54f558ca585747efa85d517e1c15bcbb", "brazilsouth");
    speechConfig.speechRecognitionLanguage = "pt-BR"; 
    var audioConfig  = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    //recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
    recognizer = new SpeechSDK.IntentRecognizer(speechConfig, audioConfig);

    //Adicionar intenções
     recognizer.addIntent("Oi Lia", "OiLia_I1");
     recognizer.addIntent("Oi, Lia.", "OiLia_I2");
     recognizer.addIntent("Oi, lia.", "OiLia_I3");

    recognizer.startContinuousRecognitionAsync();

    recognizer.recognized = (reco, e) => {


        switch (e.result.reason) {

            case SpeechSDK.ResultReason.RecognizedSpeech:
                if(e.result.text == "Oi, Lia." || e.result.text == "Oi Lia" || e.result.text == "Oi, lia."){
                    falar("Oi, o que deseja fazer?");
                }
                window.console.log(e.result.text);
                break;
    
              case SpeechSDK.ResultReason.RecognizedIntent:
                if(e.result.intentId == "OiLia_I1" || e.result.intentId == "OiLia_I2" || e.result.intentId == "OiLia_I3"){
                    falar("Oi, o que deseja fazer?");
                }
                break;
    
              case SpeechSDK.ResultReason.NoMatch:
                var noMatchDetail = SpeechSDK.NoMatchDetails.fromResult(result);
                window.console.log(" NoMatchReason: " + SpeechSDK.NoMatchReason[noMatchDetail.reason]);
                break;
                
              case SpeechSDK.ResultReason.Canceled:
                var cancelDetails = SpeechSDK.CancellationDetails.fromResult(result);
                window.console.log(" CancellationReason: " + SpeechSDK.CancellationReason[cancelDetails.reason]);
                if (cancelDetails.reason === SpeechSDK.CancellationReason.Error) {
                  window.console.log(": " + cancelDetails.errorDetails);
                }
                break;
        }
      };

      document.getElementById('stopSpeakTextAsyncButton').addEventListener("click", function () {
        recognizer.stopContinuousRecognitionAsync();
      });
    
}