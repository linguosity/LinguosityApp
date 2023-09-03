export default async function generateImage(client, prompt) {
  try {
    const additionalText = ` in the style of a graphic novel`;
    const modifiedPrompt = `${prompt} ${additionalText}`;

    const res = await client.createImage({
      prompt: modifiedPrompt,
      n: 1,
      size: "256x256",
    });

    return res.data.data[0].url;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}