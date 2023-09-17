
const stripe = require('stripe')(process.env.STRIPE_API_KEY);


export const handler = async (event, context) => {
  const { sessionId } = JSON.parse(event.body);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status == "paid" && session.status === "complete") {
      return {
        statusCode: 200,
        body: JSON.stringify({
          isValid: true,
          subscriptionId: session.subscription,
          customerId: session.customer
        })
      }
    } else {
      throw new Error("Invalid Session ID")
    }

  } catch (e) {
    console.error('An error occurred:', e.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
}