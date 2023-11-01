export type NFTItem = {
  title?: string;
  image?: string;
  description?: string;
  standard?: string;
  soulbound?: boolean;
  amount: number;
};

export const items: NFTItem[] = [
  {
    title: 'item 1',
    image: 'https://reactnative.dev/img/tiny_logo.png',
    description: 'Creatures',
    standard: 'ERC-721',
    soulbound: false,
    amount: 1,
  },
  {
    title: 'item 2',
    image: 'https://reactnative.dev/img/tiny_logo.png',
    description: 'Creatures',
    standard: 'ERC-721',
    soulbound: true,
    amount: 2,
  },
  {
    title: 'item 3',
    image: 'https://reactnative.dev/img/tiny_logo.png',
    description: 'Creatures',
    standard: 'ERC-721',
    soulbound: true,
    amount: 1,
  },
  {
    title: 'item 4',
    image: 'https://reactnative.dev/img/tiny_logo.png',
    description: 'Creatures',
    standard: 'ERC-721',
    soulbound: true,
    amount: 1,
  },
  {
    title: 'item 5',
    image: 'https://reactnative.dev/img/tiny_logo.png',
    description: 'Creatures',
    standard: 'ERC-721',
    soulbound: true,
    amount: 1,
  },
  {
    title: 'item 6',
    image: 'https://reactnative.dev/img/tiny_logo.png',
    description: 'Creatures',
    standard: 'ERC-721',
    soulbound: true,
    amount: 1,
  },
];
