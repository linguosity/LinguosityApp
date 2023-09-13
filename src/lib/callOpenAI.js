import OpenAI from "openai";

const API_KEY = import.meta.env.VITE_APP_OPENAI_API_KEY

const openai = new OpenAI({
  dangerouslyAllowBrowser: true,
  apiKey: API_KEY
});

export default async function callOpenAI(
  messages,
  functions,
  temperature = 0.9,
  model = "gpt-4-0613",
  stream = false,
  function_call = "none"
) {

  try {
    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      stream,
      functions,
      max_tokens: 6700,
      function_call
    });

    if (stream) {
      return response
      
    } else {
      return response.choices[0]
    }

  } catch (error) {
    console.log('Error on callOpenAI', error)
    return null
  }

}

