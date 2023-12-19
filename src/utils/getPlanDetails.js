
export const plans = {
  free: {
    title: "Free Trial",
    description: "No-cost option that provides basic access to our platform's features for trial purposes",
    price: 0,
    features: [
      "10 story generations",
      "text to speech",
      "download story pdf",
      "download mp3 audio",
      "virtual tutor"
    ],
    generations: 50,
    textToSpeech: true,
    downloadStoryPDF: true,
    downloadMP3: true,
  }, 
  basic: {
    title: "Basic",
    description: "Offers enhanced access to our platform's features at an affordable price",
    price: 9,
    stripePriceId: "price_1NrMlFJzayTJWh9p4g1mahIE",
    features: [
      "20 story generations",
      "text to speech",
      "download story pdf",
    ],
    generations: 20,
    textToSpeech: true,
    downloadStoryPDF: true,
    downloadMP3: false,
  },
  pro: {
    title: "Premium",
    description: "Access to all our platform's features and benefits",
    price: 29,
    stripePriceId: "price_1NrMm0JzayTJWh9pIIaQJgIa",
    features: [
      "100 story generations",
      "text to speech",
      "download story pdf",
      "download mp3 audio",
      "virtual tutor"
    ],
    generations: 100,
    textToSpeech: true,
    downloadStoryPDF: true,
    downloadMP3: true,
  }
}


export default function getPlanDetails(plan) {
  switch (plan) {
    case 'free':
      return plans[plan]
    case 'basic':
      return plans[plan]
    case 'pro':
      return plans[plan]
    default:
      break;
  }
}