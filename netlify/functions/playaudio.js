const fetch = require('node-fetch');

export const handler = async function(event, context) {
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
      'X-USER-ID': process.env.VITE_APP_PLAYHT_USER_ID

    },
    body: JSON.stringify({
      text,
      voice,
      quality: 'medium',
      output_format: 'mp3',
      speed: 1,
      sample_rate: 24000
    })
  };

  try {
    const response = await fetch('https://play.ht/api/v2/tts', options);
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
