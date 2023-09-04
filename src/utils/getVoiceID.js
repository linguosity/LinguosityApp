import { voicesData } from './voicesData'; // Adjust the path as needed

export default function getVoiceID(targetLanguage) {
  console.log("Target Language:", targetLanguage); // Log the input
  for (let voice of voicesData[0].voices) {
    console.log("Checking Voice Language:", voice.language); // Log each voice language
    if (voice.language === targetLanguage) {
      console.log("Match Found:", voice.value);
      return voice.value;
    }
  }
  console.log("No Match Found"); // Log if no match is found
  return null;
}