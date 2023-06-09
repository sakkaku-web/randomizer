import { ListHandler } from '../RandomList';
import { env } from '../env';
import { getRandomItem } from '../random';

interface Anime {
  id: string;
  name: string;
}

interface Character {
  id: string;
  name: string;
  anime: string;
}

const getAnimeInfo = async (animeId: string) => {
  const response = await fetch(env.API_URL + 'api/other/anime/' + animeId);
  const data = await response.json();
  return data;
};

const randomItem = (arr: any[]) => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};

const getRandomCharacter = async (
  animes: Anime[]
): Promise<Character | null> => {
  const anime = getRandomItem(animes);
  try {
    const info = await getAnimeInfo(anime.id);
    const characters = info.characters;

    const char = randomItem(characters);
    return {
      id: char.id,
      name: char.name,
      anime: anime.name,
    };
  } catch (e) {
    console.error('Failed to get random anime character', e);
    return null;
  }
};

const getNewAnime = async (id: string): Promise<Anime | null> => {
  try {
    const info = await getAnimeInfo(id);
    return { id, name: info.name };
  } catch (e) {
    console.error('Failed to get anime info', e);
    return null;
  }
};

export const animeListHandler: ListHandler<Anime, Character> = {
  onAddNew: (id) => getNewAnime(id),
  getId: (x) => x.id,
  format: (x) => (
    <>
      <a
        className="text-blue-500 hover:underline"
        href={`https://www.animecharactersdatabase.com/source.php?id=${x.id}`}
        target="_blank"
        rel="noreferrer"
      >
        {x.name}
      </a>{' '}
      ({x.id})
    </>
  ),
  formatRandom: (x) => (
    <>
      <a
        className="text-blue-500 hover:underline"
        href={`https://www.animecharactersdatabase.com/characters.php?id=${x.id}`}
        target="_blank"
        rel="noreferrer"
      >
        {x.name}
      </a>
      from {x.anime}
    </>
  ),
  getRandomFor: getRandomCharacter,
};
