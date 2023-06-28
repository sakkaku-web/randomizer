import { ListHandler } from '../RandomList';
import { getRandomItem } from '../random';

export const grouperListHandler: ListHandler<string, string[][]> = {
  formatRandom: (groups: string[][]) => (
    <div className="flex flex-col gap-2">
      {groups.map((g) => (
        <div>{g.join(', ')}</div>
      ))}
    </div>
  ),
  getRandomFor: async (items: string[]) => {
    let currentItems = [...items];
    let currentGroup = [];
    const groups: string[][] = [];

    while (currentItems.length > 0) {
      const item = getRandomItem(currentItems);

      currentGroup.push(item);
      if (currentGroup.length >= 2) {
        groups.push(currentGroup);
        currentGroup = [];
      }

      currentItems = currentItems.filter((i) => i !== item);
    }

    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  },
};
