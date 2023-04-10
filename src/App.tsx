import React, { useState } from "react";

const ANIME_ID_KEY = "randomizerAnimeIds";

interface Anime {
  id: string;
  name: string;
}

function App() {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [currentAnime, setCurrentAnime] = useState<Partial<Anime>>({});

  const handleAddAnime = () => {
    if (currentAnime.id === "" || currentAnime.name === "") return;
    setAnimes([...animes, currentAnime as Anime]);
  };

  return (
    <div className="App">
      <div>
        <input
          type="text"
          value={currentAnime.id}
          placeholder="Anime ID"
          onChange={(e) =>
            setCurrentAnime({ ...currentAnime, id: e.target.value })
          }
        />
        <input
          type="text"
          value={currentAnime.name}
          placeholder="Anime Name"
          onChange={(e) =>
            setCurrentAnime({ ...currentAnime, name: e.target.value })
          }
        />

        <button onClick={() => handleAddAnime()}>Add</button>
      </div>
    </div>
  );
}

export default App;
