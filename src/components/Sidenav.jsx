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

function IconCircleUser(props) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M256 112c-48.6 0-88 39.4-88 88s39.4 88 88 88 88-39.4 88-88-39.4-88-88-88zm0 128c-22.06 0-40-17.95-40-40 0-22.1 17.9-40 40-40s40 17.94 40 40c0 22.1-17.9 40-40 40zm0-240C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zm0 464c-46.73 0-89.76-15.68-124.5-41.79C148.8 389 182.4 368 220.2 368h71.69c37.75 0 71.31 21.01 88.68 54.21C345.8 448.3 302.7 464 256 464zm160.2-75.5c-27-42.2-73-68.5-124.4-68.5h-71.6c-51.36 0-97.35 26.25-124.4 68.48C65.96 352.5 48 306.3 48 256c0-114.7 93.31-208 208-208s208 93.31 208 208c0 50.3-18 96.5-47.8 132.5z" />
    </svg>
  );
}

const Toolbar = ({ toggleForm, pdfDocument }) => {
  const { user, logout } = useFirebaseAuth()
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
      <div className="sidenav-button padding-sm justify-center border-vertical">
        {
          user.avatar ?
            <img src={user.avatar} alt="" /> :
            <IconCircleUser />
        }
        <span className="text-sm font-bold">{user.name}</span>
      </div>
      <div className="sidenav-button" onClick={logout}>
        <BiLogOut />
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
        <img src="https://uploads-ssl.webflow.com/643f1edf85eba707f45ddfc3/646255f5e004cd49868bd0df_linguosity_logo.svg" alt="Linguosity logo" className="logo-image" />
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