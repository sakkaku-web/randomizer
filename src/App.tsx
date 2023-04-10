import React, { useEffect, useState } from "react";
import { ListHandler, RandomList } from "./RandomList";
import { animeListHandler } from "./anime";

const LISTS_ID_KEY = "randomizerListIds";
const ANIME_CHAR_KEY = "Anime Characters";

const HANDLER: Record<string, ListHandler<any>> = {
  [ANIME_CHAR_KEY]: animeListHandler,
};

function App() {
  const [lists, setLists] = useState<string[]>([]);
  const [newList, setNewList] = useState<string>("");

  useEffect(() => {
    const storedLists = localStorage.getItem(LISTS_ID_KEY);
    if (storedLists) {
      setLists(JSON.parse(storedLists));
    }
  }, []);

  const handleAddList = async (e: React.KeyboardEvent) => {
    if (e.key !== "Enter") return;
    if (!newList) return;

    const updatedList = [...lists, newList];
    setLists(updatedList);
    setNewList("");
    localStorage.setItem(LISTS_ID_KEY, JSON.stringify(updatedList));
  };

  const handleDeleteList = (list: string) => {
    const updatedList = lists.filter((l) => l !== list);
    setLists(updatedList);
    localStorage.setItem(LISTS_ID_KEY, JSON.stringify(updatedList));
  };

  const allLists = [ANIME_CHAR_KEY, ...lists];

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex gap-4">
        <input
          className="border px-2 py-1"
          type="text"
          placeholder="New List"
          value={newList}
          onKeyUp={handleAddList}
          onChange={(e) => setNewList(e.target.value)}
        />
      </div>

      <div className="flex gap-4 flex-wrap">
        {allLists.map((list) => (
          <RandomList
            key={list}
            name={list}
            handler={HANDLER[list]}
            onDelete={
              ANIME_CHAR_KEY === list ? undefined : () => handleDeleteList(list)
            }
          />
        ))}
      </div>
    </div>
  );
}

export default App;
