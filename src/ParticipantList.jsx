import React, { useContext } from 'react';
import DarkModeContext from './Context/DarkModeContext';

const ParticipantList = ({
  participants = [],
  removeParticipant,
  addDoNotMatch,
}) => {
  const { darkMode } = useContext(DarkModeContext);

  console.log(participants);

  return (
    <div className="row" style={{ margin: '15px' }}>
      <div className="card" data-bs-theme={darkMode ? 'dark' : 'light'}>
        <div className="card-body">
          <h3 className="card-title">Participants</h3>
          {participants.length === 0 && (
            <div className="alert alert-warning" role="alert">
              You have no participants added yet!
            </div>
          )}
          <div className="row">
            {participants.map((p, i) => (
              <>
                <div className="card col-sm-6 col-md-4">
                  <div className="card-body">
                    <span>
                      <strong>First Name:</strong> {p.firstName}
                    </span>
                    <br />
                    <span>
                      <strong>Phone Number:</strong> {p.phoneNumber}
                    </span>
                    <br />
                    <label
                      htmlFor={`doNotPairWith-${i}`}
                      className="form-label"
                    >
                      <strong>Do not pair with:</strong>
                    </label>
                    <div className="input-group">
                      <select
                        id={`doNotPairWith-${i}`}
                        className="form-control"
                        onChange={(e) => addDoNotMatch(i, e.target.value)}
                      >
                        {participants
                          .filter((_p, innerIndex) => i !== innerIndex)
                          .map((p) => (
                            <option>{p.firstName}</option>
                          ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      className="btn btn-danger"
                      style={{ float: 'right', marginTop: '10px' }}
                      onClick={(e) => removeParticipant(i, e.target.value)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantList;
