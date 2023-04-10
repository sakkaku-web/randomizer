import { useState } from "react";

interface ListProps {
  items: any[];
  itemLink?: (item: any) => string;
  format?: (item: any) => string;
  getRandomFor?: (item: any) => Promise<any>;
  formatRandom?: (item: any) => string;
  randomLink?: (item: any) => string;
}

export const List = ({
  items,
  format = (x) => x,
  getRandomFor = async (x) => x,
  formatRandom = (x) => x,
  itemLink,
  randomLink,
}: ListProps) => {
  const [randomItem, setRandomItem] = useState<any | null>(null);

  const getRandomItem = (arr: any[]) => {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  };

  const handleGetRandom = async () => {
    const item = getRandomItem(items);
    setRandomItem(await getRandomFor(item));
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
        <button
          className="bg-slate-300 p-2 rounded"
          onClick={() => handleGetRandom()}
        >
          Get Random
        </button>
        {randomItem && randomItemElem(randomItem)}
      </div>

      <div className="flex flex-col gap-2">{items.map((x) => itemElem(x))}</div>
    </div>
  );
};
