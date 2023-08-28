import React, { useMemo } from 'react';
import './ParamsForm.css'; // Importa el archivo CSS

const options = {
  story_length: ['Short', 'Medium', 'Long'],
  reading_difficulty_level: ['Beginner', 'Intermediate', 'Advanced'],
  story_genre: ['Action', 'Drama', 'Comedy', 'Horror', 'Thriller'],
  educational_objectives: ['Grammar', 'Vocabulary', 'Pronunciation', 'Reading Comprehension'],
  target_language: [
    "English (US)",
    "English (UK)",
    "English (Welsh)",
    "Welsh",
    "Danish",
    "German",
    "English (AU)",
    "English (India)",
    "Spanish",
    "French (Canada)",
    "French",
    "Icelandic",
    "Italian",
    "Japanese",
    "Norwegian",
    "Dutch",
    "Polish",
    "Portuguese (BR)",
    "Portuguese",
    "Romanian",
    "Russian",
    "Swedish",
    "Turkish",
    "Spanish (US)",
    "Arabic",
    "Chinese",
    "Hindi",
    "Korean",
    "Spanish (MX)",
    "French (Canadian)",
    "English (New Zealand)",
    "English (South Africa)",
    "Vietnamese",
    "Filipino",
    "Indonesian",
    "Czech",
    "Greek",
    "Hungarian",
    "Slovak",
    "Ukrainian",
    "Finnish",
    "Bengali (India)",
    "Gujarati (India)",
    "Kannada (India)",
    "Malayalam (India)",
    "Chinese (TW)",
    "Tamil (India)",
    "Telugu (India)",
    "Thai",
    "Chinese (Cantonese)",
    "Afrikaans",
    "Bulgarian",
    "Catalan",
    "Latvian",
    "Serbian",
    "Malay",
    "Dutch (Belgium)",
    "Punjabi (India)",
    "English (Australia)",
    "Portuguese (Brazil)",
    "Swedish (Sweden)",
    "Arabic (Egypt)",
    "Arabic (Saudi Arabia)",
    "English (Canada)",
    "Croatian",
    "English (Ireland)",
    "French (Switzerland)",
    "German (Austria)",
    "German (Switzerland)",
    "Hebrew",
    "Slovenian",
    "Maltese",
    "Lithuanian",
    "Estonian",
    "Irish",
    "English (Philippines)",
    "French (Belgium)",
    "Urdu",
    "English (Hong Kong)",
    "English (Singapore)",
    "Marathi (India)",
    "Spanish (Argentina)",
    "Spanish (Colombia)",
    "Swahili (Kenya)",
    "Amharic",
    "Arabic (Algeria)",
    "Arabic (Bahrain)",
    "Arabic (Iraq)",
    "Arabic (Jordan)",
    "Arabic (Kuwait)",
    "Arabic (Libya)",
    "Arabic (Morocco)",
    "Arabic (Qatar)",
    "Arabic (Syria)",
    "Arabic (Tunisia)",
    "Arabic (United Arab Emirates)",
    "Arabic (Yemen)",
    "Bengali",
    "Burmese",
    "English (Kenya)",
    "English (Nigeria)",
    "English (Tanzania)",
    "Galician",
    "Javanese",
    "Khmer",
    "Persian",
    "Somali",
    "Spanish (Bolivia)",
    "Spanish (Chile)",
    "Spanish (Costa Rica)",
    "Spanish (Cuba)",
    "Spanish (Dominican Republic)",
    "Spanish (Ecuador)",
    "Spanish (El Salvador)",
    "Spanish (Equatorial Guinea)",
    "Spanish (Guatemala)",
    "Spanish (Honduras)",
    "Spanish (Nicaragua)",
    "Spanish (Panama)",
    "Spanish (Paraguay)",
    "Spanish (Peru)",
    "Spanish (Puerto Rico)",
    "Spanish (Uruguay)",
    "Spanish (Venezuela)",
    "Sundanese",
    "Swahili (Tanzania)",
    "Tamil (Singapore)",
    "Tamil (Sri Lanka)",
    "Urdu (India)",
    "Uzbek",
    "Zulu",
    "Kazakh (Kazakhstan)",
    "Lao (Laos)",
    "Macedonian",
    "Pashto (Afghanistan)",
    "Sinhala (Sri Lanka)",
    "Albanian (Albania)",
    "Arabic (Lebanon)",
    "Arabic (Oman)",
    "Azerbaijani (Azerbaijan)",
    "Bosnian (Bosnia and Herzegovina)",
    "Georgian (Georgia)",
    "Mongolian (Mongolia)",
    "Nepali (Nepal)",
    "Tamil (Malaysia)",
    "Chinese (Mandarin, Simplified)",
    "Italian (Italy)",
    "Spanish (Mexico)"
  ]
};

function ParamsForm({ formData, setFormData, handleSubmit }) {
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };


  const isGenerateReady = useMemo(() => {
    return !!(
      formData.story_topic &&
      formData.story_length &&
      formData.reading_difficulty_level &&
      formData.story_genre &&
      formData.educational_objectives &&
      formData.target_language
    )
  }, [formData])

  return (
    <form className="params-form" onSubmit={handleSubmit}>
      <label>
        <h3>Story Topic:</h3>
        <input
          type="text"
          name="story_topic"
          value={formData.story_topic}
          onChange={handleInputChange}
        />
      </label>
      <label>
        <h3>Story Length:</h3>
        <select name="story_length" value={formData.story_length} onChange={handleInputChange}>
          <option value="">Select an option</option>
          {options.story_length.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <label>
        <h3>Reading Difficulty Level:</h3>
        <select name="reading_difficulty_level" value={formData.reading_difficulty_level} onChange={handleInputChange}>
          <option value="">Select an option</option>
          {options.reading_difficulty_level.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <label>
        <h3>Story Genre:</h3>
        <select name="story_genre" value={formData.story_genre} onChange={handleInputChange}>
          <option value="">Select an option</option>
          {options.story_genre.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <label>
        <h3>Educational Objectives:</h3>
        <select name="educational_objectives" value={formData.educational_objectives} onChange={handleInputChange}>
          <option value="">Select an option</option>
          {options.educational_objectives.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <label>
        <h3>Target Language:</h3>
        <select name="target_language" value={formData.target_language} onChange={handleInputChange}>
          <option value="">Select an option</option>
          {options.target_language.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <button disabled={!isGenerateReady} type="submit">Generate</button>
    </form>
  );
}

export default ParamsForm;
