import React from 'react';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';


class AzureTTSComponent extends React.Component {
    synthesizeSpeech = () => {
        const speechConfig = sdk.SpeechConfig.fromSubscription(import.meta.env.VITE_APP_AZURE_API_KEY, "westcentralus");
        speechConfig.setProperty(sdk.PropertyId.SpeechServiceConnection_EnableLanguageId, 'true');
        // Specify the audio configuration
        const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();
        const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
        // Set the voice
        const autoDetectConfig = sdk.AutoDetectSourceLanguageConfig.fromLanguages(['en-US', 'fr-FR']); // Specify the supported languages
        
        synthesizer.speakTextAsync(
            this.props.text,
            result => {
                if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                    console.log("Speech synthesis completed");
                } else if (result.reason === sdk.ResultReason.Canceled) {
                    const cancellation = sdk.SpeechSynthesisCancellationDetails.fromResult(result);
                    console.log(`CANCELED: Reason=${cancellation.reason}`);
                    
                    if (cancellation.reason === sdk.CancellationReason.Error) {
                        console.error(`CANCELED: ErrorCode=${cancellation.errorCode}`);
                        console.error(`CANCELED: ErrorDetails=${cancellation.errorDetails}`);
                    }
                }
                
                synthesizer.close();
            },
            error => {
                console.error(`Error in speech synthesis: ${error}`);
                synthesizer.close();
            }
        );
    }
    
  
    render() {
      return (
        <button onClick={this.synthesizeSpeech}>Play Text</button>
      );
    }
  }
  
  export default AzureTTSComponent;