export default function extractAndParseButtons(input) {
  const regex = /buttons=\[(.*?)\]/;
  const match = input.match(regex);
  if (match && match[1]) {
    try {
      const buttonsArray = JSON.parse(`[${match[1]}]`);
      const replacedInput = input.replace(match[0], ''); // Reemplazar toda la coincidencia, incluyendo 'buttons=[...]'

      return {
        buttons: buttonsArray,
        replacedInput: replacedInput
      };
    } catch (error) {
      console.error('Error al analizar el array de botones:', error);
    }
  }

  return null;
}