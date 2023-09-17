
const stripe = require('stripe')(process.env.STRIPE_API_KEY);

const url = "http://localhost:8888"

export const handler = async (event, context) => {
  const { plan, priceId, customerEmail } = JSON.parse(event.body);

  try {
    const customer = await stripe.customers.list({
      email: customerEmail
    })

    const sessionObject = {
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${url}/app?from=stripe&plan=${plan}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${url}/pricing?from=stripe&status=cancelled`,
    }

    const customerObject = customer.data[0] ? { customer: customer.data[0].id } : { customer_email: customerEmail }

    const session = await stripe.checkout.sessions.create({
      ...sessionObject,
      ...customerObject
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        sessionUrl: session.url
      })
    }

  } catch (e) {
    console.error('An error occurred:', e.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
}