import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { BsFillEyeFill, BsFillEyeSlashFill} from "react-icons/bs";
import LoaderButton from "../components/LoaderButton.tsx";
import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import { useAppContext } from "../lib/contextLib";
import { onError } from "../lib/errorLib";
import { useFormFields } from "../lib/hooksLib";
import "./Login.css";
import "./dark-mode-form.css"

export default function Login() {
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    password: "",
  });
  const { userHasAuthenticated, darkMode } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 

  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  function togglePassword(){
    setShowPassword(prevShowPassword => !prevShowPassword)
  }

async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);

    try {
        await Auth.signIn(fields.email, fields.password);
        userHasAuthenticated(true);
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
      
    
}

const darkModeButtonStyles = {
  backgroundColor: '#555',
  color: 'white',
};

const emptyStyles = {};
  return (
    <div className="Login">
      <Form onSubmit={handleSubmit} className={darkMode? "dark-mode-form" : ""}>
        <Stack gap={3}>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              autoFocus
              size="lg"
              type="email"
              value={fields.email}
              onChange={handleFieldChange}
              style={darkMode ? darkModeButtonStyles : emptyStyles}
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>
              Password {showPassword ? <BsFillEyeFill className="Icon" onClick={togglePassword}/> : 
              <BsFillEyeSlashFill className="Icon" onClick={togglePassword}/>}
            </Form.Label>
            <Form.Control
              size="lg"
              type={showPassword? "text" : "password"}
              value={fields.password}
              onChange={handleFieldChange}
              style={darkMode ? darkModeButtonStyles : emptyStyles}
              
            /> 
          </Form.Group>
          <Link to="/login/reset">Forgot password?</Link>
          <LoaderButton
            size="lg"
            type="submit"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
          Login
        </LoaderButton>
        </Stack>
      </Form>
    </div>
  );
}