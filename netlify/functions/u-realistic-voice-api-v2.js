const fetch = require('node-fetch');
const url = 'https://play.ht/api/v2/tts';

const options = {
  method: 'POST',
  headers: {
    accept: 'text/event-stream',
    'content-type': 'application/json',
    AUTHORIZATION: process.env.VITE_APP_PLAYHT_API_KEY,
    'X-USER-ID': process.env.VITE_APP_PLAYHT_USER_I
  }
};

export const handler = async (event, context) => {
  const { text = 'Default text', voice = 'larry' } = JSON.parse(event.body);

  try {
    const response = await fetch(url, {
      ...options,
      body: JSON.stringify({ text, voice })
    })
    let audioUrl
    for await (const chunk of response.body) {
      const textChunk = new TextDecoder().decode(chunk)
      if (textChunk.includes('event: completed')) {
        const match = textChunk.match(/\"url\":\"(.*?)\"/);
        if (match) {
          audioUrl = match[1];
        }
        break;
      }
    }

    if (!audioUrl) {
      throw new Error('Failed to retrieve the audio URL.');
    }

    console.log('Generated audio URL:', audioUrl);

    return {
      statusCode: 200,
      body: JSON.stringify({ url: audioUrl }),
    };

  } catch (e) {
    console.error('An error occurred:', e.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }

}
