export default async function generateImage(prompt) {
  try {
    const additionalText = ` in the style of a graphic novel`;
    const modifiedPrompt = `${prompt} ${additionalText}`;

    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_APP_OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: modifiedPrompt,
        n: 1,
        size: '1024x1024'
      })
    });

    const data = await res.json();

    return data.data[0].url;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}