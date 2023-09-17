import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Form,
  FormField,
  Grommet,
  Select,
  Text,
  TextArea,
  TextInput
} from 'grommet';
import { useFirebase } from '../context/FirebaseContext';
import getPlanDetails from '../utils/getPlanDetails';


const options = {
  story_length: ['Very Short', 'Short', 'Medium', 'Long'],
  reading_difficulty_level: ['Beginner', 'Early Intermediate', 'Intermediate', 'Advanced', 'Proficient', 'Mastery'],
  story_genre: [
    "Drama",
    "Fable",
    "Fairy Tale",
    "Fantasy",
    "Fiction",
    "Fiction in Verse",
    "Folklore",
    "Historical Fiction",
    "Horror",
    "Humor",
    "Legend",
    "Mystery",
    "Mythology",
    "Poetry",
    "Realistic Fiction",
    "Science Fiction",
    "Tall Tale"
  ],
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




export default function ParamsForm({ formData, setFormData, onReset, onSubmit }) {

  const [languageOptions, setLanguageOptions] = useState(options.target_language)

  const { userData } = useFirebase()
  const isReadyToGenerate = useMemo(() => {
    if (!userData) return false

    const planDetails = getPlanDetails(userData.plan)

    return !!(userData.generations < planDetails.generations)
  }, [userData])

  return (
      <Box align="center" justify="center" pad={{ horizontal: 'medium', vertical: 'small' }}>
        <Box width="medium">
          <Form
            value={formData}
            onChange={(nextValue) => setFormData(nextValue)}
            onReset={onReset}
            onSubmit={onSubmit}
          >
            <FormField label={<Text weight='normal' size='16px' margin='-12px'>Story Topic:</Text>} htmlFor="story_topic" name="story_topic" required>
              <TextInput id="story_topic" name="story_topic" />
            </FormField>
            <FormField label={<Text weight='normal' size='16px' margin='-12px'>Story Length:</Text>} htmlFor="story_length" name="story_length" required>
              <Select
                id="story_length"
                aria-label="story_length"
                name="story_length"
                options={options.story_length}
              />
            </FormField>
            <FormField label={<Text weight='normal' size='16px' margin='-12px'>Reading Difficulty Level:</Text>} htmlFor="reading_difficulty_level" name="reading_difficulty_level" required>
              <Select
                id="reading_difficulty_level"
                aria-label="reading_difficulty_level"
                name="reading_difficulty_level"
                options={options.reading_difficulty_level}
              />
            </FormField>
            <FormField label={<Text weight='normal' size='16px' margin='-12px'>Story Genre:</Text>} htmlFor="story_genre" name="story_genre" required>
              <Select
                id="story_genre"
                aria-label="story_genre"
                name="story_genre"
                options={options.story_genre}
              />
            </FormField>
            <FormField label={<Text weight='normal' size='16px' margin='-12px'>Lesson Objectives:</Text>} htmlFor="lesson_objectives" name="lesson_objectives" required>
              <TextArea id="lesson_objectives" name="lesson_objectives" />
            </FormField>
            <FormField label={<Text weight='normal' size='16px' margin='-12px'>Target Language:</Text>} htmlFor="target_language" name="target_language" required>
              <Select
                id="target_language"
                aria-label="target_language"
                name="target_language"
                options={languageOptions}
                onClose={() => setLanguageOptions(options.target_language)}
                onSearch={(text) => {
                  const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
                  const exp = new RegExp(escapedText, 'i');
                  setLanguageOptions(options.target_language.filter((o) => exp.test(o)));
                }}
              />
            </FormField>
            <Box direction="row" justify="between" margin={{ vertical: 'small' }}>
              <Button type="reset" label="Reset" />
            <Button disabled={!isReadyToGenerate} type="submit" label="Generate" primary />
            </Box>
          </Form>
        </Box>
      </Box>
  )
}
