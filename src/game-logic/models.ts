export type Suit = "♠" | "♣" | "♥" | "♦";
export type Rank = 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
// Suit and Rank are TypeScript unions.

export const Suits: Suit[] = ["♠" , "♣" , "♥" , "♦"];
export const Ranks: Rank[] = [6, 7, 8, 9, 10, 11, 12, 13, 14];

export type CardModel = {
  suit: Suit;
  rank: Rank;
};

export type HandModel = {
  cards: CardModel[];
}

export type PairModel = {
  attack: CardModel; 
  defence?: CardModel; 
}

export type BattleAreaModel = {
  pairs: PairModel[];
}

export type DeckModel = {
  cards: CardModel[];
  trumpCard: CardModel;
}

export type BeatenModel = {
  cards: CardModel[];
}
