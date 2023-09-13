export default function PreReading({ preReading }) {
  // Splitting by lines
  const lines = preReading.split('\n');

  // Splitting anticipation guide and glossary
 // Find the indices for anticipation guide and glossary
 const anticipationGuideIndex = lines.findIndex(line => line.trim() === 'Anticipation Guide');
 const glossaryIndex = lines.findIndex(line => line.trim() === 'Glossary');
 
  const anticipationGuideLines = lines.slice(anticipationGuideIndex + 1, glossaryIndex);
  const glossaryLines = lines.slice(glossaryIndex + 1);

  const anticipationGuideQuestions = anticipationGuideLines.join(' ').split(/\d+\./).slice(1).map((item, index) => `${index + 1}.${item.trim()}`);
  const glossaryItems = glossaryLines.join(' ').split(/\d+\./).slice(1).map((item, index) => `${index + 1}.${item.trim()}`);

  console.log('Anticipation Guide Lines:', anticipationGuideLines);
  console.log('Glossary Lines:', glossaryLines);


  return (
    <div id="pre-reading-window">
      {anticipationGuideQuestions.length > 0 && (
        <div>
          <h1>PRE-READING ANTICIPATION GUIDE</h1>
          <p>
            <ul>
              {anticipationGuideQuestions.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ul>
          </p>
        </div>
      )}
      {glossaryItems.length > 0 && (
        <div>
          <h1>PRE-READING GLOSSARY</h1>
            <p>
              <ul>
                {glossaryItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </p>
        </div>
      )}
    </div>
  );
};