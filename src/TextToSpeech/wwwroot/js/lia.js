function helloFromLizy(){
    var speechConfig = SpeechSDK.SpeechConfig.fromSubscription("54f558ca585747efa85d517e1c15bcbb", "brazilsouth"); 
    speechConfig.speechSynthesisLanguage = "pt-BR"; 
    speechConfig.speechSynthesisVoiceName = "pt-BR-FranciscaNeural";

    synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);
    synthesizer.speakTextAsync(
      "Oi! Eu sou a LIA, a inteligência artificial do Lizy ERP. O que você gostaria de fazer?",
      function (result) {
        startSpeakTextAsyncButton.disabled = false;
        if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
          console.log("synthesis finished for [" + "Oi! O que gostaria que eu fizesse para você?" + "].\n");
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