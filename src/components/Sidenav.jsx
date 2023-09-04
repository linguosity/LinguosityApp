import { useFirebaseAuth } from "../context/FirebaseContext";
import { BiLogOut } from "react-icons/bi"
import { AiOutlineFilePdf, AiOutlineForm } from "react-icons/ai"
import { PiFileAudioDuotone } from "react-icons/pi"
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useAudioMagnament } from "../context/AudioMagnament";



export default function Sidenav({ story, handleOpenForm, pdfDocument }) {
  const { logout } = useFirebaseAuth()
  const { audioUrl } = useAudioMagnament()
  return (
    <div className="sidenav-wrapper">
      <div className="nav-logo-wrap">
        <a href="#" className="brand w-nav-brand">
          <img width="25" src="https://uploads-ssl.webflow.com/643f1edf85eba707f45ddfc3/646255f5e004cd49868bd0df_linguosity_logo.svg" alt="Linguosity logo" className="logo-image" />
          <div className="brand_name">Linguosity</div>
        </a>

      </div>

      <div className="footer-content">
        <div className="toolbar">
          {pdfDocument && (
            <PDFDownloadLink
              document={pdfDocument}
              fileName='document.pdf'
            >
              <AiOutlineFilePdf />
            </PDFDownloadLink>
          )}
          {audioUrl && (
            <a href={audioUrl} download="story.mp3">
              <PiFileAudioDuotone />
            </a>
          )}
          <AiOutlineForm onClick={handleOpenForm} />
          <BiLogOut onClick={logout} />
        </div>
      </div>
    </div>
  );

}