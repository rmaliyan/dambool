import Head from "next/head";
import Link from "next/link";
import {
  HandComponent,
  BattleAreaComponent,
  DeckAreaComponent,
  BeatenAreaComponent,
  TextButton,
} from "~/components";
import {
  CardModel,
  HandModel,
  PairModel,
  BattleAreaModel,
  DeckModel,
  Suits,
  Ranks,
  BeatenModel,
} from "~/game-logic";

const testHand: HandModel = {
  cards: [
    {
      suit: "♦",
      rank: 11,
    },
    {
      suit: "♥",
      rank: 6,
    },
    {
      suit: "♣",
      rank: 13,
    },
    {
      suit: "♠",
      rank: 10,
    },
    {
      suit: "♦",
      rank: 8,
    },
    {
      suit: "♥",
      rank: 7,
    },
    {
      suit: "♣",
      rank: 12,
    },
    {
      suit: "♠",
      rank: 14,
    },
  ],
};

// const testCard1:CardModel = testHand.cards[0];

const testPair1: PairModel = {
  attack: {
    suit: "♦",
    rank: 11,
  },
  defence: {
    suit: "♥",
    rank: 6,
  },
};

const testPair2: PairModel = {
  attack: {
    suit: "♣",
    rank: 13,
  },
  defence: {
    suit: "♠",
    rank: 10,
  },
};

const testPair3: PairModel = {
  attack: {
    suit: "♦",
    rank: 11,
  },
};

const testBattleArea: BattleAreaModel = {
  pairs: [testPair1, testPair2, testPair3],
};

// const testBattleArea: BattleAreaModel = {
//   pairs: [testPair1],
// };

function createDeck(): DeckModel {
  const cards = [];

  for (const suit of Suits) {
    for (const rank of Ranks) {
      cards.push({ suit: suit, rank: rank });
    }
  }
  return { cards: cards, trumpCard: cards[0]! };
}

function createBeaten(): BeatenModel {
  const cards = [];

  for (const suit of Suits) {
    for (const rank of Ranks) {
      cards.push({ suit: suit, rank: rank });
    }
  }
  return { cards: cards };
}

const testDeck = createDeck();

const testDeck2: DeckModel = {
  cards: [],
  trumpCard: {
    suit: "♦",
    rank: 11,
  },
};

const testDeck3 = createBeaten();

export default function Home() {
  return (
    <>
      <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-t from-black to-zinc-800">
        <div className="flex h-full w-full scale-90 items-center justify-center">
          <div className="group relative mt-[-50px] flex items-center justify-center">
            <div className="absolute h-[500px] w-[500px] rounded-full border-4 border-white border-opacity-5 shadow-xl backdrop-blur-[2px] transition-all group-hover:z-10 group-hover:scale-105 group-hover:backdrop-blur-[4px]"></div>
            <div className="mb-[-50px] h-[600px] w-[600px] rounded-full bg-[url('/assets/background_table_tiled_small.webp')] bg-repeat transition-all"></div>
            <img
              className="pointer-events: none absolute z-40 mt-[-140px] w-[950px] scale-150"
              src="/assets/dambool logo final-300.webp"
              alt="dambool logo"
            ></img>

            <TextButton buttonText="Start" hrefLink="/api/create-room" className="absolute z-50 mb-[-320px] text-6xl w-44"/>

          </div>
          <div className="absolute mb-[-800px] flex items-center">
            <span className="text-base font-semibold text-zinc-700 opacity-100">
              A non-gambling multiplayer card game. 2024
            </span>
            <Link href="https://github.com/rmaliyan" target="_blank">
              <img
                className="ml-2 h-[22px] opacity-100"
                src="/assets/MR.svg"
                alt="MR logo"
              ></img>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
