import getPlanDetails from "../utils/getPlanDetails"

export default async function createCheckoutSession(plan, customerEmail) {
  const planDetails = getPlanDetails(plan)
  const result = await fetch('/.netlify/functions/create-checkout-session', {
    method: "POST",
    body: JSON.stringify({
      plan,
      priceId: planDetails.stripePriceId,
      customerEmail
    })
  })

  const data = await result.json()
  if (data.sessionUrl) {
    window.location.href = data.sessionUrl
  }
}