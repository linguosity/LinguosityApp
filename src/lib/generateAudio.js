const convertUrl = 'https://play.ht/api/v1/convert';
const getAudioUrl = 'https://play.ht/api/v1/articleStatus?transcriptionId=';

const options = {
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    AUTHORIZATION: import.meta.env.VITE_APP_PLAYHT_API_KEY,
    'X-USER-ID': import.meta.env.VITE_APP_PLAYHT_USER_ID
  }
};

export default async function generateAudio(params) {
  const { text = 'Default text', voice = 'en-US-JennyNeural' } = params

  try {
    const response = await fetch(convertUrl, {
      ...options,
      method: 'POST',
      body: JSON.stringify({
        content: [text],
        voice: voice
      })
    })
    const data = await response.json()
    const transcriptionId = data.transcriptionId

    let audioUrl
    while(true) {
      await new Promise(r => setTimeout(r, 2000))
      const responseB = await fetch(`${getAudioUrl}${transcriptionId}`, {
        ...options,
        method: 'GET',
      })
      const dataB = await responseB.json()
      if (dataB.converted) {
        audioUrl = dataB.audioUrl
        break
      }
    }

    if (!audioUrl) {
      throw new Error('Failed to retrieve the audio URL.');
    }

    console.log('Generated audio URL:', audioUrl);
    return audioUrl
    // return {
    //   statusCode: 200,
    //   body: JSON.stringify({ url: audioUrl }),
    // };

  } catch (e) {
    console.error('An error occurred:', e.message);
    return null
    // return {
    //   statusCode: 500,
    //   body: JSON.stringify({ error: e.message }),
    // };
  }
}