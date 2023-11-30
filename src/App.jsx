import React, { useState } from 'react';
import Navigation from './Navigation';
import DarkModeContext from './Context/DarkModeContext';
import AddParticipant from './AddParticipant';
import ParticipantList from './ParticipantList';
import finalizeMatching from './Matching';
import ShowMatchesBanner from './ShowMatchesBanner';

const App = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [participants, setParticipants] = useState([]);
  const [matches, setMatches] = useState([]);
  const [shouldShowMatchesBanner, setShouldShowMatchesBanner] = useState(false);

  const addParticipant = (name, phoneNumber) => {
    setParticipants([
      ...participants,
      { name, phoneNumber, doNoMatchWith: [] },
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

  const finalize = () => {
    const matches = finalizeMatching(participants);
    setMatches(matches);
    // setShowMatchesBanner(true);
  };

  const value = { darkMode, setDarkMode };

  return (
    <DarkModeContext.Provider value={value}>
      <Navigation />
      <main>
        <AddParticipant finalize={finalize} addParticipant={addParticipant} />
        <ParticipantList
          participants={participants}
          removeParticipant={removeParticipant}
          addDoNotMatch={addDoNotMatch}
        />
        {shouldShowMatchesBanner &&
          <ShowMatchesBanner
            setShouldShowMatchesBanner={setShouldShowMatchesBanner}
            matches={matches}
          />}
      </main>
    </DarkModeContext.Provider>
  );
};

export default App;
