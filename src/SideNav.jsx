/*import React from 'react';
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Document, Page, Text } from "@react-pdf/renderer";

const SideNav = ({story, audioUrl}) => {
  const styles = {
    width: "25%",
    paddingTop: "20px"
  };
  
  const MyDocument = ({ text }) => (
    <Document>
      <Page>
        <Text>{text}</Text>
      </Page>
    </Document>
  );

  return (
    <div className="sidenav" style={styles}>
      <a href="#section">About</a>
      <a href="#section">Services</a>
      <a href="#section">Clients</a>
      <a href="#section">Contact</a>
      <PDFDownloadLink document={<MyDocument text={story} />} fileName="story.pdf">
        {({ blob, url, loading, error }) =>
          loading ? 'Loading document...' : 'Download PDF'
        }
      </PDFDownloadLink>
      <button onClick={() => {
        if (audioUrl) {
          const audio = new Audio(audioUrl);
          audio.play();
        }
      }}>Replay</button>
      {audioUrl && (
        <a href={audioUrl} download="story.mp3">Download Audio</a>
      )}
    </div>
  );
};

export default SideNav;
*/