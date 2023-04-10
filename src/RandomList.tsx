import { useEffect, useState } from "react";

interface RandomListProps {
  name: string;
}

const LIST_ID_PREFIX_KEY = "randomizerListIds-";

export const RandomList = ({ name }: RandomListProps) => {
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState<string>();
  const [randomItem, setRandomItem] = useState<string | null>(null);

  const listKey = LIST_ID_PREFIX_KEY + name;

  useEffect(() => {
    const stored = localStorage.getItem(listKey);
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, [listKey]);

  const handleAddItem = async () => {
    if (!newItem) return;

    setItems([...items, newItem]);
    setNewItem("");
    localStorage.setItem(listKey, JSON.stringify(items));
  };

  const getRandomItem = (arr: any[]) => {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  };

  const handleGetRandom = async () => {
    const item = getRandomItem(items);
    setRandomItem(item);
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold">{name}</h1>

      <div className="flex gap-2">
        <input
          type="text"
          className="border px-2"
          value={newItem}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              handleAddItem();
            }
          }}
          placeholder="Item"
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button
          onClick={() => handleAddItem()}
          className="bg-slate-300 p-2 rounded"
        >
          Add
        </button>
      </div>

      <div className="flex flex-col gap-4 items-start">
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>

        <div className="flex gap-4 items-center">
          <button
            className="bg-slate-300 p-2 rounded"
            onClick={() => handleGetRandom()}
          >
            Get Random
          </button>
          {randomItem && <span>{randomItem}</span>}
        </div>
      </div>
    </div>
  );
};
