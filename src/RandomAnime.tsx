import { useEffect, useState } from "react";

interface Anime {
  id: string;
  name: string;
}

interface Character {
  id: string;
  name: string;
  anime: string;
}

const ANIME_ID_KEY = "randomizerAnimeIds";

export const RandomAnime = () => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [newAnime, setNewAnime] = useState<string>();
  const [randomCharacter, setRandomCharacter] = useState<Character | null>(
    null
  );

  useEffect(() => {
    const storedAnimes = localStorage.getItem(ANIME_ID_KEY);
    if (storedAnimes) {
      setAnimes(JSON.parse(storedAnimes));
    }
  }, []);

  const getAnimeInfo = async (animeId: string) => {
    const response = await fetch(
      `https://www.animecharactersdatabase.com/api_series_characters.php?anime_id=${animeId}`,
      { headers: { "User-Agent": "random-character-script:v0.0.1" } }
    );
    const data = await response.json();
    return data;
  };

  const handleAddAnime = async () => {
    if (!newAnime) return;

    const info = await getAnimeInfo(newAnime);
    const name = info["anime_name"];

    setAnimes([...animes, { id: newAnime, name }]);
    setNewAnime("");
    localStorage.setItem(ANIME_ID_KEY, JSON.stringify(animes));
  };

  const randomItem = (arr: any[]) => {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  };

  const handleGetRandom = async () => {
    const randomAnime = randomItem(animes);
    const char = await getRandomCharacter(randomAnime);
    setRandomCharacter(char);
  };

  const getRandomCharacter = async (anime: Anime) => {
    const info = await getAnimeInfo(anime.id);
    const characters = info.characters;

    const char = randomItem(characters);
    return {
      id: char.id,
      name: char.name,
      anime: char.anime_name,
    };
  };

  return (
    <>
      <div className="flex gap-2">
        <input
          type="text"
          className="border"
          value={newAnime}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              handleAddAnime();
            }
          }}
          placeholder="Anime ID"
          onChange={(e) => setNewAnime(e.target.value)}
        />
        <button onClick={() => handleAddAnime()}>Add</button>
      </div>

      <div className="flex flex-col gap-4 items-start">
        <div className="flex flex-col gap-2">
          {animes.map((anime) => (
            <a
              key={anime.id}
              target="_blank"
              href={
                "https://www.animecharactersdatabase.com/source.php?id=" +
                anime.id
              }
              rel="noreferrer"
            >
              {anime.name} ({anime.id})
            </a>
          ))}
        </div>

        <button onClick={() => handleGetRandom()}>Get Random</button>

        {randomCharacter && (
          <a
            href={
              "https://www.animecharactersdatabase.com/characters.php?id=" +
              randomCharacter.id
            }
            target="_blank"
            rel="noreferrer"
          >
            {randomCharacter.name} from {randomCharacter.anime}
          </a>
        )}
      </div>
    </>
  );
};
