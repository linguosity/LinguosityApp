export default function getPlanDetails(plan) {
  switch (plan) {
    case 'free':
      return {
        price: 0,
        generations: 2,
      }
    case 'basic':
      return {
        price: 9,
        generations: 20,
      }
    case 'pro':
      return {
        price: 29,
        generations: 100,
      }
    default:
      break;
  }
}