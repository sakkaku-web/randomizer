import { useEffect, useState } from "react";
import { List } from "./List";

interface RandomListProps {
  name: string;
  onDelete?: () => void;
}

const LIST_ID_PREFIX_KEY = "randomizerListIds-";

export const RandomList = ({ name, onDelete }: RandomListProps) => {
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState<string>();

  const listKey = LIST_ID_PREFIX_KEY + name;

  useEffect(() => {
    const stored = localStorage.getItem(listKey);
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, [listKey]);

  const handleAddItem = async (e: React.KeyboardEvent) => {
    if (e.key !== "Enter") return;
    if (!newItem) return;

    setItems([...items, newItem]);
    setNewItem("");
    localStorage.setItem(listKey, JSON.stringify(items));
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold flex gap-4">
        {name} <button onClick={onDelete}>x</button>
      </h1>

      <input
        type="text"
        className="border px-2 py-1"
        value={newItem}
        onKeyUp={handleAddItem}
        placeholder="Item"
        onChange={(e) => setNewItem(e.target.value)}
      />

      <List items={items} />
    </div>
  );
};
