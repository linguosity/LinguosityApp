const fetch = require('node-fetch');

export const handler = async function (event, context) {
  const { text = 'Default text', voice = 'larry' } = JSON.parse(event.body);

  // Logging the values
  console.log('Text:', text);
  console.log('Voice:', voice);

  const options = {
    method: 'POST',
    headers: {
      accept: 'text/event-stream',
      'content-type': 'application/json',
      AUTHORIZATION: `Bearer ${process.env.VITE_APP_PLAYHT_API_KEY}`,
      'X-USER-ID': process.env.VITE_APP_PLAYHT_USER_ID,
    },
    body: JSON.stringify({
      text,
      voice,
      quality: 'draft',
      output_format: 'mp3',
      speed: 1,
      sample_rate: 24000,
    }),
  };

  try {
    const response = await fetch('https://play.ht/api/v2/tts?format=event-stream', options);
    
    // Extract URL from the event stream
    let audioUrl = null;
    for await (const chunk of response.body) {
      const textChunk = chunk.toString('utf8');
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

    return {
      statusCode: 200,
      body: JSON.stringify({ url: audioUrl }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
