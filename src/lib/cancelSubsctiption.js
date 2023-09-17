
export default async function cancelSubscription(subscriptionId) {
  try {
    const result = await fetch('/.netlify/functions/cancel-subscription', {
      method: "POST",
      body: JSON.stringify({ subscriptionId })
    })

    const data = await result.json()
    return data
  } catch (error) {
    console.log('error on retrieveSubscription', error)
    return null
  }
}