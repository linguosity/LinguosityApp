const fetch = require('node-fetch');

export const handler = async function (event, context) {
  const { text = 'Default text', voice = 'larry' } = JSON.parse(event.body);

  // Logging the values
  console.log('Received text:', text);
    console.log('Received voice:', voice);

  const options = {
    method: 'POST',
    headers: {
      accept: 'text/event-stream',
      'content-type': 'application/json',
      AUTHORIZATION: process.env.VITE_APP_PLAYHT_API_KEY,
      'X-USER-ID': process.env.VITE_APP_PLAYHT_USER_ID,
    },
    body: JSON.stringify({
      content: [text],
      voice: voice,
    }),
  };

  try {
    const response = await fetch('https://play.ht/api/v1/convert', options);
    
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

    console.log('Generated audio URL:', audioUrl);

    return {
      statusCode: 200,
      body: JSON.stringify({ url: audioUrl }),
    };
  } catch (err) {
    console.error('An error occurred:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
