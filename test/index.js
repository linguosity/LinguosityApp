function extractAndParseButtons(input) {
  const regex = /buttons=\[(.*?)\]/;
  const match = input.match(regex);
  if (match && match[1]) {
    try {
      let buttonsArray = null
      // Elimina los espacios en blanco y convierte la cadena en un array JSON
      buttonsArray = JSON.parse(`[${match[1]}]`);

      return {
        buttons: buttonsArray,
        replacedInput: input.replace(match[1], '').replace('buttons=', '')
      };
    } catch (error) {
      console.error('Error al analizar el array de botones:', error);
    }
  }

  return null;
}

// Ejemplo de uso
const inputText = `Welcome to our storytelling journey! Your story... buttons=[{"label": "Pre Reading", "value": "1"}, {"label": "Story Text", "value": "2"}, {"label": "Post Reading", "value": "3"}]`;

const buttons = extractAndParseButtons(inputText);

if (buttons) {
  console.log(buttons);
} else {
  console.log('No se encontró un array de botones válido en el texto.');
}
