import { useState } from "react";
import {
  HandComponent,
  BattleAreaComponent,
  DeckAreaComponent,
  BeatenAreaComponent,
  TextButton,
  BadgeName,
  ButtonComponent,
} from "~/components";
import { canDefend } from "~/game-logic";
import { usePeer } from "~/hooks/usePeer";
import { api } from "~/utils/api";

export type GameComponentProps = {
  roomId: number;
  playerId: number;
};

export const GameComponent: React.FC<GameComponentProps> = ({
  roomId,
  playerId,
}) => {
  const utils = api.useUtils();

  const { triggerEvent } = usePeer()!;

  const { data: game } = api.game.getCurrentGame.useQuery({ roomId });

  const { data: playerList } = api.roomLobby.getPlayerList.useQuery({ roomId });

  const { mutate: mutateEndTurn } = api.game.endTurn.useMutation({
    async onSuccess() {
      await utils.game.getCurrentGame.invalidate();
      triggerEvent("game");
    },
  });

  const { mutate: mutateCollectCards } = api.game.collectCards.useMutation({
    async onSuccess() {
      await utils.game.getCurrentGame.invalidate();
      triggerEvent("game");
    },
  });

  const { mutate: mutateAttack, error: attackErrorr } =
    api.game.attackMove.useMutation({
      async onSuccess() {
        await utils.game.getCurrentGame.invalidate();
        triggerEvent("game");
      },
    });

  const { mutate: mutateDefence, error: defendError } =
    api.game.defenceMove.useMutation({
      async onSuccess() {
        await utils.game.getCurrentGame.invalidate();
        triggerEvent("game");
      },
    });

  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  ////Add loading

  if (!game || !playerList) {
    return <>loading</>;
  }

  const handleEndTurn = () => {
    mutateEndTurn({ roomId: roomId });
  };

  const handleCollectedCards = () => {
    mutateCollectCards({ roomId: roomId });
  };

  

  const handleCardClick = (cardIndex: number) => {
    if (playerId === game.currentState.attacker) {
      mutateAttack({ cardIndex: cardIndex, roomId: roomId });
      return;
    }
    if (playerId === game.currentState.defender) {
      const defendablePairs = game.battleArea.pairs.filter(
        (pair) =>
          !pair.defence &&
          canDefend(
            pair.attack,
            game.hands[game.playerList.indexOf(playerId)]!.cards[cardIndex]!,
            game.deck.trumpCard.suit,
          ),
      );

      if (defendablePairs.length === 1) {
        mutateDefence({
          cardIndex: cardIndex,
          roomId: roomId,
          pairIndex: game.battleArea.pairs.indexOf(defendablePairs[0]!),
        });
        return;
      }
      if (defendablePairs.length === 0) {
        return
      }
      if (selectedCard === cardIndex) {
        console.log("🚩");
        setSelectedCard(null);
        console.log("🚩🚩");
        return
      }
      setSelectedCard(cardIndex);                       
    }
  };


 

  const playerCount = game.playerList.length;

  const playerHandIndex = game.playerList.indexOf(playerId);

  const allPairsComplete = game.battleArea.pairs.every((pair) => pair.defence);

  // for (const pair of game.battleArea.pairs) {
  //   if (!pair.defence) {collectPermeted = false}
  // }

  const player0Hand = game.hands[playerHandIndex]!;

  const player0Id = game.playerList[playerHandIndex];

  //Is player0 the active player?
  const player0Name = playerList.find(
    (player) => player.playerId === player0Id,
  )?.playerName;

  const player1Hand = game.hands[(playerHandIndex + 1) % game.hands.length]!;

  const player1Id = game.playerList[(playerHandIndex + 1) % game.hands.length];

  const player1Name = playerList.find(
    (player) => player.playerId === player1Id,
  )?.playerName;

  const player2Hand = game.hands[(playerHandIndex + 2) % game.hands.length]!;

  const player2Id = game.playerList[(playerHandIndex + 2) % game.hands.length];

  const player2Name = playerList.find(
    (player) => player.playerId === player2Id,
  )?.playerName;

  const player3Hand = game.hands[(playerHandIndex + 3) % game.hands.length]!;

  const player3Id = game.playerList[(playerHandIndex + 3) % game.hands.length];

  const player3Name = playerList.find(
    (player) => player.playerId === player3Id,
  )?.playerName;

  // add logic to check if player can end turn
  const canEndTurn = !(playerId === game.currentState.defender);

  const canCollect = !allPairsComplete && playerId === game.currentState.defender;

  // Badge images indicating player status
  const badgeAttack = "/assets/badge-attack.webp";
  const badgeDefend = "/assets/badge-defend.webp";
  const badgeCollect = "/assets/badge-collect.webp";
  const badgeIdle = "/assets/badge-idle.webp";
  const badgeAddCard = "/assets/badge-addCard.webp";

  return (
    <div className="flex-flex-col">



      {game.currentState.collecting && (
        <div className="block w-full pb-8 text-center text-gray-300">{playerList.find((player) => player.playerId === game.currentState.defender)?.playerName} is collecting</div>
      )}
      

      <div className="flex flex-row items-center justify-center gap-3">
        <div className="flex items-end justify-center">
          <DeckAreaComponent className="pr-28" deck={game.deck} />
        </div>

        {playerCount > 2 && (
          <div className="flex w-[100px] items-end justify-center">
            <div className="flex flex-col items-center justify-center rounded-[50px] bg-gradient-to-r from-[#00000031] to-[#31313131] p-11 backdrop-blur-sm backdrop-opacity-50">
              <BadgeName className="mb-10" imageUrl={badgeAttack}>
                {player0Name}
              </BadgeName>
              <HandComponent
                hand={player1Hand}
                isPlayer={false}
                isSmaller={true}
                className="rotate-90"
                trumpSuit={game.deck.trumpCard.suit}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col items-center justify-center ">
          {playerCount !== 3 && (
            <div className="flex flex-col items-center justify-center rounded-[50px] bg-gradient-to-r from-[#00000031] to-[#31313131] p-11 backdrop-blur-sm backdrop-opacity-50">
              <BadgeName
                className="mb-10"
                imageUrl={badgeIdle}
                isActive={false}
              >
                {player1Name}
              </BadgeName>

              <HandComponent
                hand={playerCount === 2 ? player1Hand : player2Hand}
                isPlayer={false}
                isSmaller={playerCount !== 2}
                trumpSuit={game.deck.trumpCard.suit}
              />
            </div>
          )}

          <BattleAreaComponent
            className="flex items-center justify-center py-14"
            battleArea={game.battleArea}
          />

          <div className="flex flex-col items-center justify-center rounded-[50px] bg-gradient-to-r from-[#00000031] to-[#31313131] p-11 backdrop-blur-sm backdrop-opacity-50">
            <HandComponent
              onCardClick={handleCardClick}
              hand={player0Hand}
              isPlayer={true}
              trumpSuit={game.deck.trumpCard.suit}
              selectedIndex={selectedCard}
            />
            <BadgeName className="mt-10" imageUrl={badgeAttack}>
              {player0Name}
            </BadgeName>
          </div>

          <ButtonComponent
            //if (battle area has undefended cards and player is attacker) { handleCollectedCards }
            //if (player attacker) { handleEndTurn }

            onClick={
              !allPairsComplete && playerId === game.currentState.defender
                ? handleCollectedCards
                : handleEndTurn
            }
            className="mt-16 text-2xl"
            isActive={canEndTurn || canCollect}
          >
            {playerId === game.currentState.defender ? (
              <span>Collect</span>
            ) : (
              <span>End Turn</span>
            )}
          </ButtonComponent>
        </div>

        {game.hands.length > 2 && (
          <div className="flex w-[100px] items-end justify-center">
            <HandComponent
              hand={playerCount === 3 ? player2Hand : player3Hand}
              isPlayer={false}
              isSmaller={true}
              className="rotate-90"
              trumpSuit={game.deck.trumpCard.suit}
            />
          </div>
        )}

        <div className="flex items-start justify-center">
          <BeatenAreaComponent className="pl-12" beaten={game.beaten} />
        </div>
      </div>

    </div>
  );
};
