import Replicate from "replicate";

const replicate = new Replicate({
  auth: import.meta.env.VITE_APP_REPLICATE_API_TOKEN,
});

console.log("API Token:", import.meta.env.VITE_APP_REPLICATE_API_TOKEN);

export const runModel = async (promptText) => {
  const output = await replicate.run(
    "suno-ai/bark:b76242b40d67c76ab6742e987628a2a9ac019e11d56ab96c4e91ce03b79b2787",
    {
      input: {
        prompt: promptText,
      },
    }
  );
  return output;
};

export const createPredictionWithWebhook = async (promptText, webhookURL) => {
  const prediction = await replicate.predictions.create({
    version: "b76242b40d67c76ab6742e987628a2a9ac019e11d56ab96c4e91ce03b79b2787",
    input: {
      prompt: promptText,
    },
    webhook: webhookURL,
    webhook_events_filter: ["completed"],
  });
  return prediction;
};
