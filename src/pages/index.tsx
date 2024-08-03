import Link from "next/link";
import { TextButton } from "~/components";
// import type {
//   HandModel,
//   PairModel,
//   BattleAreaModel,
//   DeckModel,
//   BeatenModel,
// } from "~/game-logic";

// import {
//   Suits,
//   Ranks,
//  } from "~/game-logic";

import Image from "next/image";

import RMlogo from "~/assets/MR.svg";

// const testHand: HandModel = {
//   cards: [
//     {
//       suit: "♦",
//       rank: 11,
//     },
//     {
//       suit: "♥",
//       rank: 6,
//     },
//     {
//       suit: "♣",
//       rank: 13,
//     },
//     {
//       suit: "♠",
//       rank: 10,
//     },
//     {
//       suit: "♦",
//       rank: 8,
//     },
//     {
//       suit: "♥",
//       rank: 7,
//     },
//     {
//       suit: "♣",
//       rank: 12,
//     },
//     {
//       suit: "♠",
//       rank: 14,
//     },
//   ],
// };

// const testCard1:CardModel = testHand.cards[0];

// const testPair1: PairModel = {
//   attack: {
//     suit: "♦",
//     rank: 11,
//   },
//   defence: {
//     suit: "♥",
//     rank: 6,
//   },
// };

// const testPair2: PairModel = {
//   attack: {
//     suit: "♣",
//     rank: 13,
//   },
//   defence: {
//     suit: "♠",
//     rank: 10,
//   },
// };

// const testPair3: PairModel = {
//   attack: {
//     suit: "♦",
//     rank: 11,
//   },
// };

// const testBattleArea: BattleAreaModel = {
//   pairs: [testPair1, testPair2, testPair3],
// };

// const testBattleArea: BattleAreaModel = {
//   pairs: [testPair1],
// };

// function createDeck(): DeckModel {
//   const cards = [];

//   for (const suit of Suits) {
//     for (const rank of Ranks) {
//       cards.push({ suit: suit, rank: rank });
//     }
//   }
//   return { cards: cards, trumpCard: cards[0]! };
// }

// function createBeaten(): BeatenModel {
//   const cards = [];

//   for (const suit of Suits) {
//     for (const rank of Ranks) {
//       cards.push({ suit: suit, rank: rank });
//     }
//   }
//   return { cards: cards };
// }

// const testDeck = createDeck();

// const testDeck2: DeckModel = {
//   cards: [],
//   trumpCard: {
//     suit: "♦",
//     rank: 11,
//   },
// };

// const testDeck3 = createBeaten();

export default function Home() {
  const images = {
    background: "/assets/background_table_tiled_small.webp",
    ornament: "/assets/circular-gothic-ornament.webp",
    logo: "/assets/dambool-logo-final-300.webp",
    // mrLogo: "/assets/MR.svg",
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-t from-black to-zinc-800">
      <main className="relative mb-[100px] flex flex-col items-center justify-center">
        <div className="absolute z-0 h-[500px] w-[500px] overflow-hidden rounded-full">
          <div
            className="absolute inset-0 bg-repeat"
            style={{ backgroundImage: `url(${images.background})` }}
          ></div>
          <div
            className="absolute inset-0 animate-slow-spin bg-cover opacity-30 mix-blend-soft-light"
            style={{ backgroundImage: `url(${images.ornament})` }}
          ></div>
        </div>

        <div className="group absolute flex flex-col items-center justify-center">
          <div className="absolute top-[-235px] h-[430px] w-[430px] rounded-full border-4 border-white border-opacity-5 shadow-xl backdrop-blur-[2px] transition-all group-hover:z-10 group-hover:scale-105 group-hover:backdrop-blur-[4px]"></div>

          <div
            className="pointer-events-none absolute top-[-270px] z-20 h-[150px] w-[350px] bg-cover lg:h-[400px] lg:w-[750px]"
            style={{ backgroundImage: `url(${images.logo})` }}
          ></div>

          <TextButton
            hrefLink="/api/create-room"
            className="absolute top-[85px] z-20 text-6xl"
            textGradient="bg-gradient-to-r from-[#993AE4] to-[#D434EE]"
          >
            <span>Start</span>
          </TextButton>
        </div>

        <footer className="absolute top-[300px] flex min-w-[800px] flex-col items-center justify-center text-base font-normal text-zinc-700">
          <div className="flex items-center justify-center">
            <span>A non-gambling multiplayer card game. Made by</span>
            <Link
              href="https://github.com/rmaliyan"
              target="_blank"
              title="Ruben Maliyan"
            >
              <div className="relative ml-2 w-[35px] h-[22px]">               
                <Image 
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                src={RMlogo} alt="MR logo" fill={true} /> 
              </div>
            </Link>
            <span className="ml-2">in 2024</span>
          </div>
          <span>
            Special thanks to
            <Link href="https://github.com/Soarc" target="_blank" title="soarc">
              <span className="mx-2 text-sm font-black">
                &#62;&#60;&#40;&#40;&#40;&#40;&#40;&#176;&#62;
              </span>
            </Link>
            for his guidance, support and patience.
          </span>
        </footer>
      </main>
    </div>
  );
}
