import React, { useContext, useState } from 'react';
import DarkModeContext from './Context/DarkModeContext';

const validationFirstName = (input) => {
  return input && input.match(/[a-zA-Z]+/g);
};

const validationPhoneNumber = (input) => {
  return input && input.match(/[0-9]{10}|[0-9]{3}-[0-9]{3}-[0-9]{4}/g);
};

const AddParticipant = ({ addParticipant }) => {
  const { darkMode } = useContext(DarkModeContext);

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nameAdded, setNameAdded] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');

  const onChangeFirstName = (e) => {
    setFirstName(e.target.value);
  };

  const onBlurFirstName = (e) => {
    const name = e.target.value;
    if (validationFirstName(name)) {
      setFirstNameError('');
    } else {
      setFirstNameError('Please enter a valid first name.');
    }
  };

  const onChangePhoneNumber = (e) => {
    setPhoneNumber(e.target.value);
  };

  const onBlurPhoneNumber = (e) => {
    const phone = e.target.value;
    if (validationPhoneNumber(phone)) {
      setPhoneNumberError('');
    } else {
      setPhoneNumberError('Please enter a valid phone number.');
    }
  };

  const onSubmit = () => {
    addParticipant(firstName, phoneNumber);
    setNameAdded(firstName);
    setFirstName('');
    setFirstNameError('');
    setPhoneNumber('');
    setPhoneNumberError('');
    setShowSuccessAlert(true);
  };

  return (
    <div className="row" style={{ margin: '15px' }}>
      <div className="card" data-bs-theme={darkMode ? 'dark' : 'light'}>
        <div className="card-body">
          {showSuccessAlert && (
            <div
              className="alert alert-success alert-dismissible fade show"
              role="alert"
            >
              You have accessfully added {nameAdded}!
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
              ></button>
            </div>
          )}
          <h3 className="card-title">Secret Santa Generator</h3>
          <div className="mb-3">
            <label htmlFor="firstName" className="form-label">
              First name
            </label>
            <input
              id="firstName"
              className={`form-control ${
                firstName === '' && firstNameError === ''
                  ? ''
                  : firstNameError
                  ? 'is-invalid'
                  : 'is-valid'
              }`}
              type="text"
              value={firstName}
              onChange={onChangeFirstName}
              onBlur={onBlurFirstName}
            />
            {firstNameError && (
              <div className="invalid-feedback">{firstNameError}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="phoneNumber" className="form-label">
              Phone number
            </label>
            <input
              id="phoneNumber"
              className={`form-control ${
                phoneNumber === '' && phoneNumberError === ''
                  ? ''
                  : phoneNumberError
                  ? 'is-invalid'
                  : 'is-valid'
              }`}
              type="text"
              value={phoneNumber}
              onChange={onChangePhoneNumber}
              onBlur={onBlurPhoneNumber}
            />
            {phoneNumberError && (
              <div className="invalid-feedback">{phoneNumberError}</div>
            )}
          </div>
          <div className="mb-3">
            <button
              className="btn btn-secondary mb-3"
              disabled={firstNameError || phoneNumberError}
              onClick={onSubmit}
            >
              Add person
            </button>
            <button
              className="btn btn-success mb-3"
              style={{ float: 'right' }}
              disabled={firstNameError || phoneNumberError}
              onClick={onSubmit}
            >
              Finalize
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddParticipant;
