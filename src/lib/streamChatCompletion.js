export default async function streamChatCompletion(
  messages,
  callback,
  temperature = 0.8,
  model = "gpt-3.5-turbo"
) {
  const apiRequestBody = {
    messages,
    temperature,
    model,
    stream: true
  }


  try {
    const result = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    })
    const decoder = new TextDecoder('utf-8');

    const stream = result.body.pipeThrough(new TextDecoder('utf-8'))
    for await ( const item of stream) {
      console.log(item)
    }
    // let message
    // while (true) {
    //   const { done, value } = await reader.read();
    //   console.log('value', value)
    //   if (done) break;

    // }
    //   callback(prev => {
    //     const newArray = [...prev];

    //     // Verificamos que haya al menos un elemento en el array
    //     const lastIndex = newArray.length - 1;
    //     newArray[newArray.length - 1] = {
    //       ...newArray[lastIndex],
    //       content: newArray[lastIndex].content + message,
    //     }
    //     return newArray;
    //   })
    //   await new Promise(r => setTimeout(r, 250))
    // }
    // console.log(chunk)
    // const chunkObj = JSON.parse(chunk.split('data: ')[1]);
    // message = chunkObj.choices[0].delta.content


  } catch (e) {
    console.log(e)
  }
}