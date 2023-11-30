import React, { useState } from 'react';
import Navigation from './Navigation';
import DarkModeContext from './Context/DarkModeContext';
import AddParticipant from './AddParticipant';
import ParticipantList from './ParticipantList';

const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [participants, setParticipants] = useState([]);

  const addParticipant = (firstName, phoneNumber) => {
    setParticipants([
      ...participants,
      { firstName, phoneNumber, doNoMatchWith: [] },
    ]);
  };

  const removeParticipant = (index) => {
    setParticipants(participants.filter((_p, i) => i !== index));
  };

  const addDoNotMatch = (index, doNotMatchWith = []) => {
    setParticipants(
      newParticipants.map((p, i) =>
        i === index ? { ...p, doNotMatchWith } : p
      )
    );
  };

  const value = { darkMode, setDarkMode };

  return (
    <DarkModeContext.Provider value={value}>
      <Navigation />
      <main>
        <AddParticipant addParticipant={addParticipant} />
        <ParticipantList
          participants={participants}
          removeParticipant={removeParticipant}
          addDoNotMatch={addDoNotMatch}
        />
      </main>
    </DarkModeContext.Provider>
  );
};

export default App;
