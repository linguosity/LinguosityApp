import { useFirebaseAuth } from "../context/FirebaseContext";
import { BiLogOut } from "react-icons/bi"
import { AiOutlineFilePdf, AiOutlineForm } from "react-icons/ai"
import { PiFileAudioDuotone } from "react-icons/pi"
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useAudioMagnament } from "../context/AudioMagnament";
import { useContext } from "react";
import { Box, DropButton, ResponsiveContext } from "grommet";
import { useNavigate } from "react-router-dom";


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
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }
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
        <span>Build Story</span>
      </div>
      <div className="sidenav-button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" id="chatbot"><path d="M47.3 125.1c.5 1.1 1.6 1.9 2.8 1.9h36.2c22.2 0 40.4-17.7 40.7-39.5.1-11.1-4.4-21.9-12.5-29.6-8.2-7.8-19-11.6-30.3-10.8-19.8 1.4-35.8 17.4-37.1 37.2-.7 10.6 2.8 20.9 9.6 28.9l-8.8 8.7c-.8.8-1.1 2.1-.6 3.2zm5.8-40.4c1.1-16.8 14.7-30.4 31.5-31.6 9.6-.7 18.8 2.6 25.8 9.2 6.9 6.5 10.8 15.7 10.7 25.2-.3 18.5-15.9 33.5-34.8 33.5h-29l5.7-5.7c.6-.6.9-1.3.9-2.1s-.3-1.6-.9-2.1c-7.1-7.1-10.6-16.4-9.9-26.4z"></path><path d="M72 83h30c1.7 0 3-1.3 3-3s-1.3-3-3-3H72c-1.7 0-3 1.3-3 3s1.3 3 3 3z"></path><path d="M114 1H14C6.8 1 1 6.8 1 14v100c0 7.2 5.8 13 13 13h10.1c1.6 0 2.9-1.3 2.9-2.9v-.1c0-1.6-1.3-3-3-3H14c-3.9 0-7-3.1-7-7V35h114v8c0 1.9 1.8 3.3 3.6 2.9h.1c1.4-.3 2.3-1.5 2.3-2.9V14c0-7.2-5.8-13-13-13zm7 28H7V14c0-3.9 3.1-7 7-7h100c3.9 0 7 3.1 7 7v15z"></path><path d="M22 15h-4c-1.7 0-3 1.3-3 3s1.3 3 3 3h4c1.7 0 3-1.3 3-3s-1.3-3-3-3zm16 0h-4c-1.7 0-3 1.3-3 3s1.3 3 3 3h4c1.7 0 3-1.3 3-3s-1.3-3-3-3zm34 82h13c1.7 0 3-1.3 3-3s-1.3-3-3-3H72c-1.7 0-3 1.3-3 3s1.3 3 3 3zm30-6h-5c-1.7 0-3 1.3-3 3s1.3 3 3 3h5c1.7 0 3-1.3 3-3s-1.3-3-3-3z"></path></svg>
        <span> Chat Guide </span>
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
      <div className="border-vertical">
      {
        user && <div className="sidenav-button padding-sm justify-center border-vertical">
          {
            user.avatar ?
              <img src={user.avatar} alt="" /> :
              <IconCircleUser />
          }
          <span className="text-sm font-bold">{user.name}</span>
        </div>
      }
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