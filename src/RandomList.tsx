import { useEffect, useState } from "react";
import { List } from "./List";
import { BiCopy, BiPaste } from "react-icons/bi";

export interface ListHandler<T, E = T> {
  onAddNew?: (item: string) => Promise<T | null>;
  getId?: (item: T) => string;
  format?: (item: T) => JSX.Element;
  formatRandom?: (item: E) => JSX.Element;
  getRandomFor?: (item: T[]) => Promise<E | null>;
}

interface RandomListProps {
  name: string;
  editable: boolean;
  handler?: ListHandler<any>;
  onDelete: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
}

const LIST_ID_PREFIX_KEY = "randomizerListIds-";

export const RandomList = ({
  name,
  editable,
  handler,
  onDelete,
  onMoveLeft,
  onMoveRight,
}: RandomListProps) => {
  const [items, setItems] = useState<any[]>([]);
  const [newItem, setNewItem] = useState<string>("");

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

    const item =
      handler && handler.onAddNew ? await handler.onAddNew(newItem) : newItem;
    if (!item) return;

    updateItems([...items, item]);
    setNewItem("");
  };

  const handleDeleteItem = (item: any) => {
    updateItems(items.filter((i) => i !== item));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(items));
    // alert("Copied to clipboard");
  };

  const handlePaste = async () => {
    if (!newItem) return;

    const parsed = JSON.parse(newItem);
    if (Array.isArray(parsed)) {
      updateItems(parsed);
      setNewItem("");
    } else {
      alert("Invalid clipboard data");
    }
  };

  const updateItems = (newItems: any[]) => {
    setItems(newItems);
    localStorage.setItem(listKey, JSON.stringify(newItems));
  };

  const deleteList = () => {
    localStorage.removeItem(listKey);
    onDelete();
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold flex gap-4">
        <span>{name}</span>
        <button onClick={handleCopy} title="copy raw data to clipboard">
          <BiCopy />
        </button>
        {editable && (
          <>
            <button onClick={deleteList}>x</button>
            <button onClick={onMoveLeft}>&lt;</button>
            <button onClick={onMoveRight}>&gt;</button>
          </>
        )}
      </h1>

      <div className="flex items-center gap-2">
        <input
          type="text"
          className="border px-2 py-1"
          value={newItem}
          onKeyUp={handleAddItem}
          placeholder="Item"
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button onClick={handlePaste} title="parse as raw data">
          <BiPaste />
        </button>
      </div>

      <List
        items={items}
        editable={editable}
        getId={handler?.getId}
        format={handler?.format}
        formatRandom={handler?.formatRandom}
        getRandomFor={handler?.getRandomFor}
        onDelete={(item) => handleDeleteItem(item)}
      />
    </div>
  );
};
