import Head from "next/head";
import Link from "next/link";
import {
  HandComponent,
  BattleAreaComponent,
  DeckAreaComponent,
  BeatenAreaComponent,
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
      <div className="absolute z-0 h-[400px] w-[500px] rounded-[130px] shadow-xl backdrop-blur"></div>
      <div className="group container z-10 flex flex-col items-center justify-center">
        <img
          className="mb-[-50px] mt-[-50px] h-96"
          src="/assets/dambool logo draft-300.png"
          alt="dambool logo"
        ></img>
        <Link
          className="font-mono text-4xl font-extrabold uppercase italic tracking-tighter text-purple-950 drop-shadow-[0px_1px_1px_rgba(255,255,255,0.6)] transition-all hover:scale-125 hover:text-purple-500 hover:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.4)] active:scale-100"
          href="/api/create-room"
        >
          Start
        </Link>
      </div>
    </>
  );
}

// "bg-[url('/assets/card-back-red-border.jpg')] bg-cover bg-center"
