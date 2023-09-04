export default function Footer({ story, audioUrl }) {
  return (
    <div>
      <footer style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0px' }}>
        <div className="footer-content">
          <div className="toolbar">
            {/* <PDFDownloadLink document={<MyDocument text={story} />} fileName="story.pdf">
              {({ blob, url, loading, error }) =>
                loading ? 'Loading document...' : <AiOutlineFilePdf />
              }
            </PDFDownloadLink>
            <div id="audio-playback">
              <button onClick={() => {
                if (audioUrl) {
                  const audio = new Audio(audioUrl);
                  audio.play();
                }
              }}>
                Replay
              </button>

              {audioUrl && (
                <a href={audioUrl} download="story.mp3">
                  Download Audio
                </a>
              )}
            */}
          </div>
        </div>
      </footer>
    </div>
  );
}