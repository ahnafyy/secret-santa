import React, { useState } from 'react';
import Navigation from './Navigation';
import DarkModeContext from './Context/DarkModeContext';
import AddParticipant from './AddParticipant';
import ParticipantList from './ParticipantList';

const App = () => {
  const [participants, setParticipants] = useState([]);

  const addParticipant = (firstName, phoneNumber) => {
    setParticipants([...participants, { firstName, phoneNumber }]);
  };

  const removeParticipant = (index) => {
    setParticipants(participants.filter((_p, i) => i !== index));
  };

  return (
    <DarkModeContext.Provider value="dark">
      <Navigation />
      <main>
        <AddParticipant addParticipant={addParticipant} />
        <ParticipantList
          participants={participants}
          removeParticipant={removeParticipant}
        />
      </main>
    </DarkModeContext.Provider>
  );
};

export default App;
