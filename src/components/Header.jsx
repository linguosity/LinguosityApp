import { Box, Button } from "grommet";
import { Link } from "react-router-dom";

export default function Header() { //hello
  return (
    <Box direction="row" height='96px' justify="between" pad='medium' align="center">
      <a href="/" className="nav-logo-wrap">
        <img src="https://uploads-ssl.webflow.com/643f1edf85eba707f45ddfc3/646255f5e004cd49868bd0df_linguosity_logo.svg" alt="Linguosity logo" className="logo-image" />
        Linguosity
      </a>
      <Box direction="row" gap="medium">
        <Link to='/pricing'>Pricing</Link>
        <Link to='/login'>Sign in</Link>
        <Link to='/app'>App</Link>
      </Box>

    </Box>
  );
}