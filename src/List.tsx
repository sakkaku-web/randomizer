import { useState } from "react";

interface ListProps {
  items: any[];
  isEqual?: (a: any, b: any) => boolean;
  itemLink?: (item: any) => string;
  format?: (item: any) => string;
  getRandomFor?: (item: any) => Promise<any>;
  formatRandom?: (item: any) => string;
  randomLink?: (item: any) => string;
}

export const List = ({
  items,
  isEqual = (a, b) => a === b,
  format = (x) => x,
  getRandomFor = async (x) => x,
  formatRandom = (x) => x,
  itemLink,
  randomLink,
}: ListProps) => {
  const [randomItem, setRandomItem] = useState<any | null>(null);
  const [disabled, setDisabled] = useState<any[]>([]);

  const getRandomItem = (arr: any[]) => {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  };

  const handleGetRandom = async () => {
    const enabledItems = items.filter((x) => !isDisabled(x));
    const item = getRandomItem(enabledItems);
    setRandomItem(await getRandomFor(item));
  };

  const isDisabled = (item: any) =>
    disabled.find((x) => isEqual(x, item)) != null;

  const toggleDisabled = (item: any) => {
    if (isDisabled(item)) {
      setDisabled(disabled.filter((x) => !isEqual(x, item)));
    } else {
      setDisabled([...disabled, item]);
    }
  };

  const toggleAll = () => {
    if (disabled.length === 0) {
      setDisabled(items);
    } else {
      setDisabled([]);
    }
  };

  const itemElem = (x: any) =>
    (itemLink && (
      <a key={format(x)} href={itemLink(x)} target="_blank" rel="noreferrer">
        {format(x)}
      </a>
    )) || <span key={x}>{format(x)}</span>;

  const randomItemElem = (x: any) =>
    (randomLink && (
      <a
        key={formatRandom(x)}
        href={randomLink(x)}
        target="_blank"
        rel="noreferrer"
      >
        {formatRandom(x)}
      </a>
    )) || <span key={x}>{formatRandom(x)}</span>;

  return (
    <div className="flex flex-col gap-4 items-start">
      <div className="flex gap-4 items-center">
        <input
          type="checkbox"
          checked={disabled.length === 0}
          onChange={() => toggleAll()}
        />
        <button
          className="bg-slate-300 px-2 py-1 rounded"
          onClick={() => handleGetRandom()}
        >
          Random
        </button>
        {randomItem && randomItemElem(randomItem)}
      </div>

      <div className="flex flex-col gap-2">
        {items.map((x) => (
          <div className="flex gap-2" key={format(x)}>
            <input
              type="checkbox"
              checked={!isDisabled(x)}
              onChange={() => toggleDisabled(x)}
            />
            <span>{itemElem(x)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
