import React, { useContext, useState } from 'react';
import DarkModeContext from './Context/DarkModeContext';

const validationFirstName = (input) => {
  return input && input.match(/[a-zA-Z]+/g);
};

const validationPhoneNumber = (input) => {
  return input && input.match(/[0-9]{10}|[0-9]{3}-[0-9]{3}-[0-9]{4}/g);
};

const AddParticipant = ({ addParticipant, finalize }) => {
  const { darkMode } = useContext(DarkModeContext);

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nameAdded, setNameAdded] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');

  const onChangeFirstName = (e) => {
    setName(e.target.value);
    setNameError('');
  };

  const onBlurName = (e) => {
    const name = e.target.value;
    if (validationFirstName(name)) {
      setNameError('');
    } else {
      setNameError('Please enter a valid name.');
    }
  };

  const onChangePhoneNumber = (e) => {
    setPhoneNumber(e.target.value);
    setPhoneNumberError('' );
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
    if(name && phoneNumber && !nameError && !phoneNumberError){
    addParticipant(name, phoneNumber);
    setNameAdded(name);
    setName('');
    setNameError('');
    setPhoneNumber('');
    setPhoneNumberError('');
    setShowSuccessAlert(true);
    }
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
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              id="name"
              className={`form-control ${
                name === '' && nameError === ''
                  ? ''
                  : nameError
                  ? 'is-invalid'
                  : 'is-valid'
              }`}
              type="text"
              value={name}
              onChange={onChangeFirstName}
              onBlur={onBlurName}
            />
            {nameError && (
              <div className="invalid-feedback">{nameError}</div>
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
              disabled={nameError || phoneNumberError}
              onClick={onSubmit}
            >
              Add person
            </button>
            <button
              className="btn btn-success mb-3"
              style={{ float: 'right' }}
              disabled={nameError || phoneNumberError}
              onClick={finalize}
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
