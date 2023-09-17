

export default async function validateCheckoutSession(sessionId) {
 try {
   const result = await fetch('/.netlify/functions/validate-checkout-session', {
     method: "POST",
     body: JSON.stringify({ sessionId })
   })

   const data = await result.json()
   return data
 } catch (error) {
    console.log('error on Validate Session')
    return null
 }
}