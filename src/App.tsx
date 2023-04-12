import React, { useEffect, useState } from "react";
import { ListHandler, RandomList } from "./RandomList";
import { animeListHandler } from "./anime";
import { BiEdit } from "react-icons/bi";

const LISTS_ID_KEY = "randomizerListIds";
const ANIME_CHAR_KEY = "Anime";

const HANDLER: Record<string, ListHandler<any>> = {
  [ANIME_CHAR_KEY]: animeListHandler,
};

function App() {
  const [lists, setLists] = useState<string[]>([]);
  const [newList, setNewList] = useState<string>("");
  const [editable, setEditable] = useState<boolean>(false);

  useEffect(() => {
    const storedLists = localStorage.getItem(LISTS_ID_KEY);
    if (storedLists) {
      setLists(JSON.parse(storedLists));
    }
  }, []);

  const updateLists = (newLists: string[]) => {
    setLists(newLists);
    localStorage.setItem(LISTS_ID_KEY, JSON.stringify(newLists));
  };

  const handleAddList = async (e: React.KeyboardEvent) => {
    if (e.key !== "Enter") return;
    if (!newList) return;

    updateLists([...lists, newList]);
    setNewList("");
  };

  const handleDeleteList = (list: string) => {
    updateLists(lists.filter((l) => l !== list));
  };

  const handleMoveList = (list: string, direction: "left" | "right") => {
    const index = lists.indexOf(list);
    if (index === -1) return;
    lists.splice(index, 1);
    if (direction === "left") {
      lists.splice(index - 1, 0, list);
    } else {
      lists.splice(index + 1, 0, list);
    }
    updateLists([...lists]);
  };

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

        <button
          onClick={() => setEditable(!editable)}
          className={"p-2 " + (editable ? "text-red-500" : "")}
        >
          <BiEdit />
        </button>
      </div>

      <div className="flex gap-4 flex-wrap">
        {lists.map((list) => (
          <RandomList
            key={list}
            editable={editable}
            name={list}
            handler={HANDLER[list]}
            onDelete={() => handleDeleteList(list)}
            onMoveLeft={() => handleMoveList(list, "left")}
            onMoveRight={() => handleMoveList(list, "right")}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
