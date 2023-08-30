export default function getWordsCount(option) {
  switch (option) {
    case 'Very Short':
      return 50;
    case 'Short':
      return 200;
    case 'Medium':
      return 500;
    case 'Long':
      return 900;
    default:
      return 50;
  }
}