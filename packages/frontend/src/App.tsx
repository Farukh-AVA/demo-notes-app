import 'react-toggle/style.css';
import Navbar from "react-bootstrap/Navbar";
import Routes from "./Routes.tsx";
import Nav from "react-bootstrap/Nav";
import Toggle from 'react-toggle';
import { BsBrightnessHigh, BsBrightnessHighFill  } from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";
import { useState, useEffect } from "react";
import { AppContext, AppContextType } from "./lib/contextLib";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import { onError } from "./lib/errorLib";
import CloudnoteDark from "./assets/CloudnoteDark.png"
import CloudnoteLight from "./assets/CloudnoteLight.png"
import "./App.css";
import "./index.css"

function App() {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  useEffect(() => {
    onLoad();
  }, []);

  useEffect(() => {
    if(darkMode){
      document.body.style.backgroundColor = '#333';
      document.documentElement.style.backgroundColor = '#333';
    } else {
      document.body.style.backgroundColor = '#ffffff';
      document.documentElement.style.backgroundColor = '#ffffff';
    }
  
  }, [darkMode]);


  const nav = useNavigate(); 
 
  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (error) {
      if (error !== "No current user") {
        onError(error);
      }
    }
  
    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();
  
    userHasAuthenticated(false);

    nav("/login");
  }

  function toggleDarkMode(){
    setDarkMode(!darkMode);
  }
//fw-bold text-muted
/* 
<LinkContainer to="/">
  <Navbar.Brand className={darkMode ? "WhiteHeader" : "fw-bold text-muted"}>CloudNotes</Navbar.Brand>
</LinkContainer>    
*/
  return (
    !isAuthenticating && (
      <div className="App container py-3">
        <Navbar collapseOnSelect bg={darkMode ? "dark" : "light"} expand="md" className="mb-3 px-3">
        <LinkContainer to="/">
          <Navbar.Brand >
              <img
                src={darkMode ? CloudnoteLight : CloudnoteDark}
                width="50"
                height="auto"
                alt="Cloud note logo"
              />
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle  className={darkMode ? "NavToggleWhiteFont" : ""}/>
          <Navbar.Collapse className="justify-content-end">
            <Nav activeKey={window.location.pathname}>
              {isAuthenticated ? (
              <>
                <LinkContainer to="/settings">
                  <Nav.Link className={darkMode ? "NavWhiteFont" : ""}>Settings</Nav.Link>
                </LinkContainer>
                <Nav.Link onClick={handleLogout} className={darkMode ? "NavWhiteFont" : ""}>Logout</Nav.Link>
              </>
              ) : (
                <>
                  <LinkContainer to="/signup">
                    <Nav.Link className={darkMode ? "NavWhiteFont" : ""}>Signup</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <Nav.Link className={darkMode ? "NavWhiteFont" : ""}>Login</Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
          <Toggle
                    checked={darkMode}
                    icons={{checked: <BsBrightnessHigh className="WhiteIcon" />, unchecked: <BsBrightnessHighFill className="BlackIcon" />}}
                    onChange={toggleDarkMode}
                    className="custom-toggle"
                  />
        </Navbar>
        <AppContext.Provider
          value={{ isAuthenticated, userHasAuthenticated, darkMode, setDarkMode} as AppContextType}
        >
          <Routes />
        </AppContext.Provider>
      </div>
    )
  );

}

export default App;