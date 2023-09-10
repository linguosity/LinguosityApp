import { useFirebaseAuth } from "../context/FirebaseContext";
import { BiLogOut } from "react-icons/bi"
import { AiOutlineFilePdf, AiOutlineForm } from "react-icons/ai"
import { PiFileAudioDuotone } from "react-icons/pi"
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useAudioMagnament } from "../context/AudioMagnament";
import { useContext } from "react";
import { Box, DropButton, ResponsiveContext } from "grommet";
import useShow from "../hooks/useShow";


function IconMenu(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" height="1em" width="1em" {...props}>
      <path
        fill="currentColor"
        d="M2 6a1 1 0 011-1h18a1 1 0 110 2H3a1 1 0 01-1-1zM2 12.032a1 1 0 011-1h18a1 1 0 110 2H3a1 1 0 01-1-1zM3 17.064a1 1 0 100 2h18a1 1 0 000-2H3z"
      />
    </svg>
  );
}

const Toolbar = ({ toggleForm, pdfDocument }) => {
  const { logout } = useFirebaseAuth()
  const { audioUrl } = useAudioMagnament()


  return (
    <div className="toolbar">
      <div className="sidenav-button bg-focus">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          height="1em"
          width="1em"
        >
          <path
            fillRule="evenodd"
            d="M11.03 2.59a1.5 1.5 0 011.94 0l7.5 6.363a1.5 1.5 0 01.53 1.144V19.5a1.5 1.5 0 01-1.5 1.5h-5.75a.75.75 0 01-.75-.75V14h-2v6.25a.75.75 0 01-.75.75H4.5A1.5 1.5 0 013 19.5v-9.403c0-.44.194-.859.53-1.144l7.5-6.363zM12 3.734l-7.5 6.363V19.5h5v-6.25a.75.75 0 01.75-.75h3.5a.75.75 0 01.75.75v6.25h5v-9.403L12 3.734z"
          />
        </svg>
        <span>Home</span>
      </div>
      <div className="sidenav-button" onClick={toggleForm}>
        <AiOutlineForm />
        <span>Build story</span>
      </div>
      {pdfDocument && (
        <PDFDownloadLink
          className="sidenav-button"
          document={pdfDocument}
          fileName='document.pdf'
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <AiOutlineFilePdf />
          <span>Print Story</span>
        </PDFDownloadLink>
      )}
      {audioUrl && (
        <a href={audioUrl} className="sidenav-button" download="story.mp3">
          <PiFileAudioDuotone />
          <span> Save audio </span>
        </a>
      )}
      <div className="sidenav-button">
        <BiLogOut onClick={logout} />
        <span> Log out</span>
      </div>
    </div>
  )
}

export default function Sidenav({ toggleForm, pdfDocument }) {
  const size = useContext(ResponsiveContext)
  return (

    <div className="sidenav-wrapper">
      <a href="#" className="nav-logo-wrap">
        <img width="36" src="https://uploads-ssl.webflow.com/643f1edf85eba707f45ddfc3/646255f5e004cd49868bd0df_linguosity_logo.svg" alt="Linguosity logo" className="logo-image" />
        Linguosity
      </a>

      {
        size === "small" ?
          <Box>
            <DropButton label={<IconMenu />} dropContent={<Toolbar pdfDocument={pdfDocument} toggleForm={toggleForm} />} />
          </Box>
          :
          <div className="footer-content">
            <Toolbar pdfDocument={pdfDocument} toggleForm={toggleForm} />
          </div>
      }
    </div >
  );

}