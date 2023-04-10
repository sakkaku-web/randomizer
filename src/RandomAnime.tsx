import { useEffect, useState } from "react";
import { List } from "./List";

interface Anime {
  id: string;
  name: string;
}

interface Character {
  id: string;
  name: string;
  anime: string;
}

interface RandomAnimeProps {
  baseUrl: string;
}

const ANIME_ID_KEY = "randomizerAnimeIds";

export const RandomAnime = ({ baseUrl }: RandomAnimeProps) => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [newAnime, setNewAnime] = useState<string>("");

  useEffect(() => {
    const storedAnimes = localStorage.getItem(ANIME_ID_KEY);
    if (storedAnimes) {
      setAnimes(JSON.parse(storedAnimes));
    }
  }, []);

  const getAnimeInfo = async (animeId: string) => {
    const response = await fetch(baseUrl + "api/other/anime/" + animeId);
    const data = await response.json();
    return data;
  };

  const handleAddAnime = async (e: React.KeyboardEvent) => {
    if (e.key !== "Enter") return;
    if (!newAnime) return;

    const info = await getAnimeInfo(newAnime);
    const name = info["anime_name"];

    const updated = [...animes, { id: newAnime, name }];
    setAnimes(updated);
    setNewAnime("");
    localStorage.setItem(ANIME_ID_KEY, JSON.stringify(updated));
  };

  const randomItem = (arr: any[]) => {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  };

  const getRandomCharacter = async (anime: Anime): Promise<Character> => {
    const info = await getAnimeInfo(anime.id);
    const characters = info.characters;

    const char = randomItem(characters);
    return {
      id: char.id,
      name: char.name,
      anime: anime.name,
    };
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold">Anime Character</h1>

      <input
        type="text"
        className="border px-2 py-1"
        value={newAnime}
        onKeyUp={handleAddAnime}
        placeholder="Anime ID"
        onChange={(e) => setNewAnime(e.target.value)}
      />

      <List
        items={animes}
        itemLink={(a) =>
          "https://www.animecharactersdatabase.com/source.php?id=" + a.id
        }
        randomLink={(a) =>
          "https://www.animecharactersdatabase.com/characters.php?id=" + a.id
        }
        format={(a) => `${a.name} (${a.id})`}
        formatRandom={(a) => `${a.name} from ${a.anime}`}
        getRandomFor={(a) => getRandomCharacter(a)}
      />
    </div>
  );
};
