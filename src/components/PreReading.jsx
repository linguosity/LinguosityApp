export default function PreReading({ preReading }) {
  // Splitting by lines
  const lines = preReading.split('\n');

  // Find the indices for anticipation guide and glossary using regular expression
  const anticipationGuideIndex = lines.findIndex(line => /^Anticipation Guide$/.test(line.trim()));
  const glossaryIndex = lines.findIndex(line => /^Glossary$/.test(line.trim()));

  // Log the found indices for debugging
  console.log('Anticipation Guide Index:', anticipationGuideIndex);
  console.log('Glossary Index:', glossaryIndex);
  
  // Extract anticipation guide and glossary lines, filtering out empty lines
  const anticipationGuideLines = lines.slice(anticipationGuideIndex + 1, glossaryIndex).filter(line => line.trim() !== '');
  const glossaryLines = lines.slice(glossaryIndex + 1).filter(line => line.trim() !== '');

  // Process the extracted lines to get questions and glossary items
  const anticipationGuideQuestions = anticipationGuideLines.join(' ').split(/\d+\./).slice(1).map((item, index) => `${index + 1}.${item.trim()}`);
  const glossaryItems = glossaryLines.join(' ').split(/\d+\./).slice(1).map((item, index) => `${index + 1}.${item.trim()}`);

  // Log the processed lines for debugging
  console.log('Anticipation Guide Lines:', anticipationGuideLines);
  console.log('Glossary Lines:', glossaryLines);

  return (
    <div id="pre-reading-window">
      {anticipationGuideQuestions.length > 0 && (
        <div>
          <h1>PRE-READING ANTICIPATION GUIDE</h1>
          <ul>
            {anticipationGuideQuestions.map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ul>
        </div>
      )}
      {glossaryItems.length > 0 && (
        <div>
          <h1>PRE-READING GLOSSARY</h1>
          <ul>
            {glossaryItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
