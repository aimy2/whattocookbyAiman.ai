export type Recipe = {
  id: string;
  title: string;
  description: string;
  cuisine: string;
  time: string;
  difficulty: string;
  rating: number;
  reviews: number;
  tags: string[];
  emoji: string;
  imageUrl?: string;
  imagePrompt?: string;
  ingredients: string[];
  steps: string[];
};

export const fallbackRecipes: Recipe[] = [
  {
    id: "coconut-curry",
    title: "Golden coconut chickpea curry",
    description: "A silky, fragrant bowl with just enough heat and a sunny finish.",
    cuisine: "South Asian",
    time: "35 min",
    difficulty: "Easy",
    rating: 4.9,
    reviews: 218,
    tags: ["Savory", "Comforting"],
    emoji: "🍛",
    ingredients: ["1 can chickpeas", "1 can coconut milk", "1 tbsp curry powder", "1 onion, sliced", "2 handfuls spinach", "Rice or naan, to serve"],
    steps: ["Soften the onion in oil until golden, then bloom the curry powder for 30 seconds.", "Add chickpeas and coconut milk. Simmer for 18 minutes until thick and glossy.", "Fold through spinach, season with lime and salt, and serve over warm rice."],
  },
  {
    id: "miso-noodles",
    title: "Miso butter sesame noodles",
    description: "Glossy noodles, a little umami magic, and dinner in under twenty minutes.",
    cuisine: "Japanese-inspired",
    time: "18 min",
    difficulty: "Quick",
    rating: 4.8,
    reviews: 164,
    tags: ["Savory", "Quick win"],
    emoji: "🍜",
    ingredients: ["200g noodles", "1 tbsp white miso", "1 tbsp butter", "1 tsp sesame oil", "2 spring onions", "Sesame seeds and chili oil"],
    steps: ["Cook the noodles until just tender, reserving a mug of cooking water.", "Whisk miso, butter, sesame oil, and a splash of noodle water into a glossy sauce.", "Toss together, then finish with spring onions, sesame, and chili oil."],
  },
  {
    id: "peach-pavlova",
    title: "Cloud-soft peach pavlova",
    description: "Crisp edges, marshmallow middle, and ripe fruit for the table’s grand finale.",
    cuisine: "New Zealand",
    time: "1 hr 20 min",
    difficulty: "A little fancy",
    rating: 4.7,
    reviews: 92,
    tags: ["Sweet", "Exquisite"],
    emoji: "🍑",
    ingredients: ["4 egg whites", "220g caster sugar", "1 tsp vanilla", "1 tsp cornflour", "300ml cream", "3 ripe peaches"],
    steps: ["Whisk egg whites to soft peaks, then add sugar slowly until thick and glossy.", "Fold in vanilla and cornflour, shape on a lined tray, and bake low until crisp outside.", "Cool completely, top with softly whipped cream, and scatter with peaches."],
  },
];
