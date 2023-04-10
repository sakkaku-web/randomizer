import React, { useEffect, useState } from "react";
import { RandomList } from "./RandomList";

const LISTS_ID_KEY = "randomizerListIds";

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

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex gap-4">
        <input
          className="border"
          type="text"
          placeholder="New List"
          value={newList}
          onKeyUp={handleAddList}
          onChange={(e) => setNewList(e.target.value)}
        />
      </div>

      <div className="flex gap-4">
        {lists.map((list) => (
          <RandomList name={list} />
        ))}
      </div>
    </div>
  );
}

export default App;
