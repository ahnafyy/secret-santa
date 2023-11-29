import React from 'react';

const ParticipantList = ({ participants = [], removeParticipant }) => {
  return (
    <div className="row" style={{ margin: '15px' }}>
      <div className="card" data-bs-theme="dark">
        <div className="card-body">
          <h3 className="card-title">Participants</h3>
          {participants.length === 0 && (
            <div className="alert alert-warning" role="alert">
              You have no participants added yet!
            </div>
          )}
          <ul className="list-group">
            {participants.map((p, i) => (
              <>
                <li className="list-group-item" key={`item-${i}`}>
                  <span>
                    <strong>First Name:</strong> {p.firstName}
                  </span>
                  <br />
                  <span>
                    <strong>Phone Number:</strong> {p.phoneNumber}
                  </span>
                  <button
                    style={{ float: 'right' }}
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => removeParticipant(i)}
                  ></button>
                </li>
              </>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ParticipantList;
