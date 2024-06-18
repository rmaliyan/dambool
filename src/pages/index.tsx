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
      <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-t from-black to-zinc-800">
        <div className="flex h-full w-full scale-90 items-center justify-center">
          <div className="group relative mt-[-50px] flex items-center justify-center">
            <div className="absolute h-[500px] w-[500px] rounded-full border-4 border-white border-opacity-5 shadow-xl backdrop-blur-[2px] transition-all group-hover:z-10 group-hover:scale-105 group-hover:backdrop-blur-[4px]"></div>
            <div className="mb-[-50px] h-[600px] w-[600px] rounded-full bg-[url('/assets/background_table_tiled_small.jpg')] bg-repeat transition-all"></div>
            <img
              className="pointer-events: none absolute z-40 mt-[-140px] w-[950px] scale-150"
              src="/assets/dambool logo final-300.png"
              alt="dambool logo"
            ></img>
            <Link
              className="absolute z-50 mb-[-320px] w-44 select-none bg-gradient-to-r from-[#c74ee6] to-[#783fa7] bg-clip-text text-center font-mono text-6xl font-extrabold uppercase italic tracking-tighter text-transparent transition-all active:scale-100 group-hover:scale-110 group-hover:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.2)]"
              href="/api/create-room"
            >
              Start
              <span className="absolute -bottom-1 left-1/2 h-1 w-0 bg-[#CA33EF] transition-all group-hover:w-3/6 group-hover:opacity-80"></span>
              <span className="absolute -bottom-1 right-1/2 h-1 w-0 bg-[#CA33EF] transition-all group-hover:w-3/6 group-hover:opacity-80"></span>
            </Link>
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

    // <>
    //   <div className="absolute z-0 h-[400px] w-[500px] rounded-[130px] shadow-xl backdrop-blur"></div>
    //   <div className="group container z-10 flex flex-col items-center justify-center">
    //     <img
    //       className="mb-[-50px] mt-[-50px] h-96"
    //       src="/assets/dambool logo draft-300.png"
    //       alt="dambool logo"
    //     ></img>
    //     <Link
    //       className="font-mono text-4xl font-extrabold uppercase italic tracking-tighter text-purple-950 drop-shadow-[0px_1px_1px_rgba(255,255,255,0.6)] transition-all hover:scale-125 hover:text-purple-500 hover:drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.4)] active:scale-100"
    //       href="/api/create-room"
    //     >
    //       Start
    //     </Link>
    //   </div>
    // </>
  );
}

// "bg-[url('/assets/card-back-red-border.jpg')] bg-cover bg-center"
