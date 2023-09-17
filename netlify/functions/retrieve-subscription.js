
const stripe = require('stripe')(process.env.STRIPE_API_KEY);

export const handler = async (event, context) => {
  const { subscriptionId } = JSON.parse(event.body);

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    return {
      statusCode: 200,
      body: JSON.stringify(subscription)
    }

  } catch (e) {
    console.error('An error occurred:', e.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
}