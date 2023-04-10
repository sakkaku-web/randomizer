import { useEffect, useState } from "react";
import { List } from "./List";

export interface ListHandler<T, E = T> {
  onAddNew: (item: string) => Promise<T | null>;
  itemLink?: (item: T) => string;
  randomLink?: (item: T) => string;
  format?: (item: T) => string;
  formatRandom?: (item: E) => string;
  getRandomFor?: (item: T) => Promise<E | null>;
}

interface RandomListProps {
  name: string;
  handler?: ListHandler<any>;
  onDelete?: () => void;
}

const LIST_ID_PREFIX_KEY = "randomizerListIds-";

export const RandomList = ({ name, onDelete, handler }: RandomListProps) => {
  const [items, setItems] = useState<any[]>([]);
  const [newItem, setNewItem] = useState<string>();

  const listKey = LIST_ID_PREFIX_KEY + name.replaceAll(" ", "-");

  useEffect(() => {
    const stored = localStorage.getItem(listKey);
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, [listKey]);

  const handleAddItem = async (e: React.KeyboardEvent) => {
    if (e.key !== "Enter") return;
    if (!newItem) return;

    const item = handler ? await handler?.onAddNew(newItem) : newItem;
    if (!item) return;

    setItems([...items, item]);
    setNewItem("");
    localStorage.setItem(listKey, JSON.stringify(items));
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold flex gap-4">
        {name} {onDelete && <button onClick={onDelete}>x</button>}
      </h1>

      <input
        type="text"
        className="border px-2 py-1"
        value={newItem}
        onKeyUp={handleAddItem}
        placeholder="Item"
        onChange={(e) => setNewItem(e.target.value)}
      />

      <List
        items={items}
        itemLink={handler?.itemLink}
        randomLink={handler?.randomLink}
        format={handler?.format}
        formatRandom={handler?.formatRandom}
        getRandomFor={handler?.getRandomFor}
      />
    </div>
  );
};
