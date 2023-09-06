import { useFirebaseAuth } from "../context/FirebaseContext";
import { BiLogOut } from "react-icons/bi"
import { AiOutlineFilePdf, AiOutlineForm } from "react-icons/ai"
import { PiFileAudioDuotone } from "react-icons/pi"
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useAudioMagnament } from "../context/AudioMagnament";



export default function Sidenav({ story, toggleForm, pdfDocument }) {
  const { logout } = useFirebaseAuth()
  const { audioUrl } = useAudioMagnament()
  return (
    <div className="sidenav-wrapper">
      <div className="nav-logo-wrap">
        <a href="#" className="brand w-nav-brand">
          <img width="36" src="https://uploads-ssl.webflow.com/643f1edf85eba707f45ddfc3/646255f5e004cd49868bd0df_linguosity_logo.svg" alt="Linguosity logo" className="logo-image" />
          <div>Linguosity</div>
        </a>
      </div>

      <div className="footer-content">
        <div className="toolbar">
          <div className="home-nav-icon">
            <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" viewBox="0 0 24 24" id="homepage"><path d="M19.9794922,7.9521484l-6-5.2666016c-1.1339111-0.9902344-2.8250732-0.9902344-3.9589844,0l-6,5.2666016C3.3717041,8.5219116,2.9998169,9.3435669,3,10.2069702V19c0.0018311,1.6561279,1.3438721,2.9981689,3,3h2.5h7c0.0001831,0,0.0003662,0,0.0006104,0H18c1.6561279-0.0018311,2.9981689-1.3438721,3-3v-8.7930298C21.0001831,9.3435669,20.6282959,8.5219116,19.9794922,7.9521484z M15,21H9v-6c0.0014038-1.1040039,0.8959961-1.9985962,2-2h2c1.1040039,0.0014038,1.9985962,0.8959961,2,2V21z M20,19c-0.0014038,1.1040039-0.8959961,1.9985962-2,2h-2v-6c-0.0018311-1.6561279-1.3438721-2.9981689-3-3h-2c-1.6561279,0.0018311-2.9981689,1.3438721-3,3v6H6c-1.1040039-0.0014038-1.9985962-0.8959961-2-2v-8.7930298C3.9997559,9.6313477,4.2478027,9.0836182,4.6806641,8.7041016l6-5.2666016C11.0455933,3.1174927,11.5146484,2.9414673,12,2.9423828c0.4853516-0.0009155,0.9544067,0.1751099,1.3193359,0.4951172l6,5.2665405C19.7521973,9.0835571,20.0002441,9.6313477,20,10.2069702V19z"></path></svg>
            <div> home</div>
          </div>
          <div className="build-story" onClick={toggleForm}>
            <div>
              <AiOutlineForm />
            </div>
            <div>Build story</div>
          </div>
          {pdfDocument && (
            <PDFDownloadLink
              document={pdfDocument}
              fileName='document.pdf'
              style={{ textDecoration: 'none', color: 'inherit'}}
            >
              <div className="story-maker">
                <div>
                  <AiOutlineFilePdf />
                </div>

                <div> Print Story </div>
              </div>
            </PDFDownloadLink>
          )}
          {audioUrl && (
            <div className="save-music">
              <a href={audioUrl} download="story.mp3">
                <PiFileAudioDuotone />
              </a>
              <div> Save audio </div>
            </div>
          )}

          <div className="log-out">
            <div>
              <BiLogOut onClick={logout} />
            </div>
            <div> Log out</div>
          </div>

        </div>
      </div>
    </div >
  );

}