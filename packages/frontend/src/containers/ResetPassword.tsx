import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import { FormGroup, FormControl } from "react-bootstrap";
import { BsFillEyeFill, BsFillEyeSlashFill} from "react-icons/bs";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import { useFormFields } from "../lib/hooksLib";
import { onError } from "../lib/errorLib";
import { useAppContext } from "../lib/contextLib";
import "./ResetPassword.css";
import "./dark-mode-form.css"

export default function ResetPassword() {
  const [fields, handleFieldChange] = useFormFields({
    code: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [codeSent, setCodeSent] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  const { darkMode } = useAppContext();

  function validateCodeForm() {
    return fields.email.length > 0;
  }

  function togglePassword(){
    setShowPassword(prevShowPassword => !prevShowPassword)
  }

  function validateResetForm() {
    return (
      fields.code.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }

  async function handleSendCodeClick(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSendingCode(true);

    try {
      await Auth.forgotPassword(fields.email);
      setCodeSent(true);
    } catch (error) {
      onError(error);
      setIsSendingCode(false);
    }
  }

  async function handleConfirmClick(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsConfirming(true);

    try {
      await Auth.forgotPasswordSubmit(
        fields.email,
        fields.code,
        fields.password
      );
      setConfirmed(true);
    } catch (error) {
      onError(error);
      setIsConfirming(false);
    }
  }

  const darkModeButtonStyles = {
    backgroundColor: '#555',
    color: 'white',
  };
  const emptyStyles = {};

  function renderRequestCodeForm() {
    return (
      <form onSubmit={handleSendCodeClick} className={darkMode? "dark-mode-form" : ""}>
        <FormGroup controlId="email">
          <Form.Text style={darkMode ? { color: 'white', fontSize: '20px' } : {fontSize: '20px'}}>Email</Form.Text>
          <FormControl
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
            style={darkMode ? darkModeButtonStyles : emptyStyles}
          />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          isLoading={isSendingCode}
          disabled={!validateCodeForm()}
        >
          Send Confirmation
        </LoaderButton>
      </form>
    );
  }

  function renderConfirmationForm() {
    return (
      <form onSubmit={handleConfirmClick} className={darkMode? "dark-mode-form" : ""}>
        <FormGroup controlId="code">
          <Form.Label>Confirmation Code</Form.Label>
          <FormControl
            autoFocus
            type="tel"
            value={fields.code}
            onChange={handleFieldChange}
            style={darkMode ? darkModeButtonStyles : emptyStyles}
          />
          <Form.Text style={darkMode ? { color: 'white'} : emptyStyles}>
            Please check your email ({fields.email}) for the confirmation code.
          </Form.Text>
        </FormGroup>
        <hr />
        <FormGroup controlId="password">
            <Form.Label>
              New Password {showPassword ? <BsFillEyeFill className="ResetIcon" onClick={togglePassword}/> : 
              <BsFillEyeSlashFill className="ResetIcon" onClick={togglePassword}/>}
            </Form.Label>
          <FormControl
            type={showPassword? "text" : "password"}
            value={fields.password}
            onChange={handleFieldChange}
            style={darkMode ? darkModeButtonStyles : emptyStyles}
          />
        </FormGroup>
        <FormGroup controlId="confirmPassword">
            <Form.Label>
              Confirm Password 
            </Form.Label>
          <FormControl
            type={showPassword? "text" : "password"}
            value={fields.confirmPassword}
            onChange={handleFieldChange}
            style={darkMode ? darkModeButtonStyles : emptyStyles}
          />
        </FormGroup>
        <LoaderButton
          block
          type="submit"
          bsSize="large"
          isLoading={isConfirming}
          disabled={!validateResetForm()}
        >
          Confirm
        </LoaderButton>
      </form>
    );
  }

  function renderSuccessMessage() {
    return (
      <div className="success">
        <p>Your password has been reset.</p>
        <p>
          <Link to="/login">
            Click here to login with your new credentials.
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="ResetPassword">
      {!codeSent
        ? renderRequestCodeForm()
        : !confirmed
        ? renderConfirmationForm()
        : renderSuccessMessage()}
    </div>
  );
}