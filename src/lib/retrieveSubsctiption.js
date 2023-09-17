
export default async function retrieveSubscription(subscriptionId) {
  try {
    const result = await fetch('/.netlify/functions/retrieve-subscription', {
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