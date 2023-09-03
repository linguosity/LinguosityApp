
const API_KEY = import.meta.env.VITE_APP_OPENAI_API_KEY

export default async function callOpenAI(
  messages, 
  functions, 
  model = "gpt-4-0613", 
  temperature = 0.9
) {

  const apiRequestBody = {
    model,
    messages,
    temperature,
    functions,
    //max_tokens: 8000,
    //function_call: 'write_story_activities'
  }

  
  try {
    const result = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    })
    const json = await result.json()
    return json.choices[0]
  } catch (error) {
    console.log('Error on callOpenAI', error)
    return null
  }


}