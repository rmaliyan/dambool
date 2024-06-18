import {
  CardModel,
  HandModel,
  PairModel,
  BattleAreaModel,
  DeckModel,
  Suits,
  Ranks,
  BeatenModel,
  GameModel,
} from "~/game-logic";

function createDeck(): CardModel[] {
  const cards = [];

  for (const suit of Suits) {
    for (const rank of Ranks) {
      cards.push({ suit: suit, rank: rank });
    }
  }
  return cards;
}

////////////////////////////////////////////////////////

const shuffleDeck = (cards: CardModel[]): DeckModel => {
  for (let index: number = cards.length - 1; index > 0; index--) {
    const randomIndex: number = Math.floor(Math.random() * index);

    if (randomIndex === index) {
      continue;
    }

    const tmp = cards[index];
    cards[index] = cards[randomIndex]!;
    cards[randomIndex] = tmp!;
  }
  return { cards: cards, trumpCard: cards[0]! };
};

////////////////////////////////////////////////////////

// function shuffleDeck(cards: CardModel[]): DeckModel {
//   for (let i = 0; i < cards.length; i++) {
//     const tmp = cards[i]!;
//     const randIndex = Math.floor(Math.random() * cards.length);
//     cards[i] = cards[randIndex]!;
//     cards[randIndex] = tmp;
//   }

//   return { cards: cards, trumpCard: cards[0]! };
// }

function dealHand(deck: DeckModel, hand: HandModel): HandModel {
  if (hand.cards.length >= 6) {
    return hand;
  }

  for (let i = hand.cards.length; i < 6 && deck.cards.length > 0; i++) {
    hand.cards.push(deck.cards[deck.cards.length - 1]!);
    deck.cards.length--;
  }

  return hand;
}

export function startGame(playerList: number[]): GameModel {
  const deck = shuffleDeck(createDeck());

  const currentGame: GameModel = {
    currentState: {
      turnCount: 0,
      activePlayerId: playerList[0]!,
      state: "attacking",
    },
    playerList: playerList,
    hands: playerList.map(() => dealHand(deck, { cards: [] })),
    battleArea: { pairs: [] },
    deck: deck,
    beaten: { cards: [] },
  };

  return currentGame;
}
