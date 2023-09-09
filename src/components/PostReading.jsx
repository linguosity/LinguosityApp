export default function PostReading({ postReading }) {
  const lines = postReading.split('\n');
  const heading = lines[0].trim();

  // Join the rest of the lines and split by numbers followed by a dot.
  const items = lines.slice(1).join(' ').split(/\d+\./).slice(1).map((item, index) => `${index + 1}.${item.trim()}`);

  return (
    <div id="post-reading-window">
      {heading && <h1>{heading}</h1>}
      {items.length > 0 && (
        <p>
          <ul>
            {items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </p>
      )}
    </div>
  );
};
