import {
  CardModel,
  HandModel,
  BattleAreaModel,
  DeckModel,
  Suits,
  Ranks,
  GameModel,
  Suit,
} from "~/game-logic";

export class GameLogicError {
  message: string = "";

  constructor(message: string) {
    this.message = message;
  }
}

function createDeck(): CardModel[] {
  const cards = [];

  for (const suit of Suits) {
    for (const rank of Ranks) {
      cards.push({ suit: suit, rank: rank });
    }
  }
  return cards;
}

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
      attacker: playerList[0]!,
      defender: playerList[1]!,
      collecting: false,
      idlePlayerCount: 0,
    },
    playerList: playerList,
    hands: playerList.map(() => dealHand(deck, { cards: [] })),
    battleArea: { pairs: [] },
    deck: deck,
    beaten: { cards: [] },
  };

  return currentGame;
}

export function canDefend(
  attackCard: CardModel,
  defenceCard: CardModel,
  trumpSuit: Suit,
) {
  if (defenceCard.suit === attackCard.suit) {
    return defenceCard.rank > attackCard.rank;
  }
  return defenceCard.suit === trumpSuit;
}

export function canAttack(battleArea: BattleAreaModel, attackCard: CardModel) {
  return (
    battleArea.pairs.length === 0 ||
    battleArea.pairs.find(
      (elem) =>
        elem.attack.rank === attackCard.rank ||
        elem.defence?.rank === attackCard.rank,
    ) !== undefined
  );
}

export function discardToBeaten(game: GameModel) {
  for (const { attack, defence } of game.battleArea.pairs) {
    game.beaten.cards.push(attack);
    game.beaten.cards.push(defence!);
  }
  startNextRound(game);
}

export function startNextRound(game: GameModel) {
  game.battleArea.pairs.length = 0;

  dealAll(game);

  let newAttacker = game.currentState.defender;

  if (game.currentState.collecting) {
    newAttacker = nextPlayer(game.playerList, game.currentState.defender);
  }

  const newDefender = nextPlayer(game.playerList, newAttacker);

  game.currentState.attacker = newAttacker;
  game.currentState.defender = newDefender;

  game.currentState.idlePlayerCount = 0;

  game.currentState.collecting = false;

  // Add a check for the game being finished
}

export function dealAll(game: GameModel) {
  for (const hand of game.hands) {
    dealHand(game.deck, hand);
  }
}

export function nextPlayer(playerList: number[], playerId: number) {
  const playerIndex = playerList.indexOf(playerId);
  return playerList[(playerIndex + 1) % playerList.length]!;
}

export function endAttackTurn(game: GameModel) {
  if (game.battleArea.pairs.filter((pair) => !pair.defence).length) {
    throw new GameLogicError(
      "Turn can not be ended while there are unbeaten cards at the battle area.",
    );
  }

  game.currentState.idlePlayerCount++;

  if (game.currentState.idlePlayerCount === game.playerList.length - 1) {
    discardToBeaten(game);
    return;
  }

  let nextAttacker = nextPlayer(game.playerList, game.currentState.attacker);

  if (nextAttacker === game.currentState.defender) {
    nextAttacker = nextPlayer(game.playerList, nextAttacker);
  }

  game.currentState.attacker = nextAttacker;

  if (!attackerCanMakeATurn(game, game.currentState.attacker)) {
    endAttackTurn(game);
  }
}

export function endDefenceTurn(game: GameModel) {
  if (!canCollectMore(game)) { 
    collectCards(game);
    return;
  }

  game.currentState.idlePlayerCount++;

  if (game.currentState.idlePlayerCount === game.playerList.length - 1) {
    collectCards(game);
    return;
  }

  let nextAttacker = nextPlayer(game.playerList, game.currentState.attacker);

  if (nextAttacker === game.currentState.defender) {
    nextAttacker = nextPlayer(game.playerList, nextAttacker);
  }

  game.currentState.attacker = nextAttacker; 
}

export function endTurn(game:GameModel) {
  if(game.currentState.collecting) {
    endDefenceTurn(game);
    return;
  }
  endAttackTurn(game);
}

export function getPlayerHand(game: GameModel, playerId: number) {
  return game.hands[game.playerList.indexOf(playerId)]!;
}

export function attackerCanMakeATurn(game: GameModel, playerId: number) {
  const defenderHand = getPlayerHand(game, game.currentState.defender);

  const undefendedPairsCount = game.battleArea.pairs.filter(
    (pair) => !pair.defence,
  ).length;

  if (defenderHand.cards.length - undefendedPairsCount === 0) {
    return false;
  }

  const attackerHand = getPlayerHand(game, playerId);

  for (const card of attackerHand.cards) {
    if (canAttack(game.battleArea, card)) {
      return true;
    }
  }
  return false;
}

export function attackMove(game: GameModel, cardIndex: number) {
  const hand = getPlayerHand(game, game.currentState.attacker);

  if (cardIndex >= hand.cards.length) {
    throw new GameLogicError(
      "Attacking card index exceeds number of cards in hand",
    );
  }

  const attackCard = hand.cards[cardIndex]!;

  if (!canAttack(game.battleArea, attackCard)) {
    throw new GameLogicError("No cards in hand suitable for attack");
  }

  game.battleArea.pairs.push({ attack: attackCard });

  hand.cards.splice(cardIndex, 1);

  game.currentState.turnCount++;

  game.currentState.idlePlayerCount = 0;
}

export function addCardMove(game: GameModel, cardIndex: number) {
  attackMove(game, cardIndex);
  if (!canCollectMore(game)) {
    collectCards(game);
  }
}

export function initiateCollectMove(game: GameModel) {
  game.currentState.collecting = true;
  if (!canCollectMore(game)) {
    collectCards(game);
  }
}

export function collectCards(game: GameModel) {
  // Get defender's hand
  const hand = getPlayerHand(game, game.currentState.defender);

  // Push collected cards to defenders hand, empty battle area
  for (const pair of game.battleArea.pairs) {
    hand.cards.push(pair.attack);
    if (pair.defence) {
      hand.cards.push(pair.defence);
    }
  }
  startNextRound(game);
}

export function canCollectMore(game: GameModel) {
  return (
    getPlayerHand(game, game.currentState.defender).cards.length >
    game.battleArea.pairs.filter((pair) => !pair.defence).length
  );
}

// export function defenderCanMakeATurn(game: GameModel, playerId: number) {}
