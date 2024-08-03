import { useState } from "react";
import {
  HandComponent,
  BattleAreaComponent,
  DeckAreaComponent,
  BeatenAreaComponent,
  BadgeComponent,
  ButtonComponent,
} from "~/components";
import type { GameModel, HandModel } from "~/game-logic";
import { canDefend } from "~/game-logic";

import { usePeer } from "~/hooks/usePeer";
import { api } from "~/utils/api";

type PlayerState = "attack" | "defend" | "collect" | "idle" | "addCard";

type PlayerStateBadgeProps = {
  playerState: PlayerState;
  playerName: string;
  className?: string;
};

const PlayerStateBadge: React.FC<PlayerStateBadgeProps> = ({
  playerState,
  playerName,
  className,
}) => {
  // Badge images indicating player status
  const badgeAttack = "/assets/badge-attack.webp";
  const badgeDefend = "/assets/badge-defend.webp";
  const badgeCollect = "/assets/badge-collect.webp";
  const badgeIdle = "/assets/badge-idle.webp";
  const badgeAddCard = "/assets/badge-addCard.webp";

  let badgeImage = "";

  switch (playerState) {
    case "attack":
      badgeImage = badgeAttack;
      break;
    case "defend":
      badgeImage = badgeDefend;
      break;
    case "collect":
      badgeImage = badgeCollect;
      break;
    case "idle":
      badgeImage = badgeIdle;
      break;
    case "addCard":
      badgeImage = badgeAddCard;
      break;
  }

  return (
    <BadgeComponent
      className={className}
      imageUrl={badgeImage}
      isActive={playerState !== "idle"}
    >
      {playerName}
    </BadgeComponent>
  );
};

// Badge images indicating message types
const badgeInfo = "/assets/badge-info.webp";

// Alert and Error not being used yet
// const badgeAlert = "/assets/badge-alert.webp";
const badgeError = "/assets/badge-error.webp";

const getPlayerState = (playerId: number, game: GameModel) => {
  if (playerId === game.currentState.defender && game.currentState.collecting) {
    return "collect";
  }
  if (
    playerId !== game.currentState.attacker &&
    playerId !== game.currentState.defender
  ) {
    return "idle";
  }
  if (playerId === game.currentState.attacker && game.currentState.collecting) {
    return "addCard";
  }
  if (playerId === game.currentState.attacker) {
    return "attack";
  }
  if (playerId === game.currentState.defender) {
    return "defend";
  }
  return "idle";
};

type opponentsProps = {
  game: GameModel;
  playerList: {
    playerId: number;
    playerName: string;
  }[];
  currentPlayerId: number;
};

const Opponents: React.FC<opponentsProps> = ({
  game,
  playerList,
  currentPlayerId,
}) => {
  const opponentList = game.playerList.filter(
    (elem) => elem !== currentPlayerId,
  );

  const handPadding = (hand: HandModel) => {
    return hand.cards.length < 8 ? "pr-5" : "pl-11 pr-20";
  };

  return (
    <>
      {opponentList.map((opponentId) => {
        return (
          <div
            key={opponentId}
            className="flex flex-col items-center justify-center rounded-[40px] bg-gradient-to-r from-[#00000031] to-[#31313131] py-10 backdrop-blur-sm backdrop-opacity-30"
          >
            <PlayerStateBadge
              className="ml-5"
              playerState={getPlayerState(opponentId, game)}
              playerName={
                playerList.find((elem) => elem.playerId === opponentId)!
                  .playerName
              }
            />

            {/* <div className="mt-5 flex w-[400px] min-w-[300px] items-center justify-center"> */}
            <div
              className={`mt-5 flex w-[500px] min-w-[300px] items-center justify-center ${handPadding(game.hands[game.playerList.indexOf(opponentId)]!)}`}
            >
              <HandComponent
                hand={game.hands[game.playerList.indexOf(opponentId)]!}
                isPlayer={false}
                isSmaller={opponentList.length > 1}
              />
            </div>
          </div>
        );
      })}
    </>
  );
};

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

  const { mutate: mutateAttack, error: attackError } =
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

  const [selectedHandCard, setSelectedCard] = useState<number | null>(null);

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

  const handleBattleAreaCardClick = (pairIndex: number) => {
    // selectedHandCard

    if (playerId !== game.currentState.defender) {
      return;
    }

    if (game.battleArea.pairs[pairIndex]?.defence) {
      return;
    }

    const attackCard = game.battleArea.pairs[pairIndex]!.attack;

    if (selectedHandCard === null) {
      return;
    }

    const defenceCard =
      game.hands[game.playerList.indexOf(playerId)]!.cards[selectedHandCard]!;

    const trumpSuit = game.deck.trumpCard.suit;

    if (!canDefend(attackCard, defenceCard, trumpSuit)) {
      //add visual feedback that selected card can't defend
      return;
    }

    mutateDefence({
      cardIndex: selectedHandCard,
      roomId: roomId,
      pairIndex: pairIndex,
    });

    setSelectedCard(null);

    return;
  };

  const handleHandCardClick = (cardIndex: number) => {
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
        return;
      }
      if (selectedHandCard === cardIndex) {
        setSelectedCard(null);
        return;
      }
      setSelectedCard(cardIndex);
    }
  };

  // not used currently
  // const playerCount = game.playerList.length;

  const playerHandIndex = game.playerList.indexOf(playerId);

  const allPairsComplete = game.battleArea.pairs.every((pair) => pair.defence);

  const player0Hand = game.hands[playerHandIndex]!;

  const player0Id = game.playerList[playerHandIndex];

  //Is player0 the active player?
  const player0Name = playerList.find(
    (player) => player.playerId === player0Id,
  )?.playerName;

  const canEndTurn = !(playerId === game.currentState.defender);

  const canCollect =
    !allPairsComplete && playerId === game.currentState.defender;

  const handPadding = (hand: HandModel) => {
    return hand.cards.length < 8 ? "" : "pl-11 pr-20";
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex min-h-[36px] items-end justify-center">
        {game.currentState.collecting && (
          // fix message width
          <BadgeComponent className="scale-75" imageUrl={badgeInfo}>
            {
              playerList.find(
                (player) => player.playerId === game.currentState.defender,
              )?.playerName
            }{" "}
            is collecting
          </BadgeComponent>
        )}
        {defendError && attackError && (
          <BadgeComponent className="scale-75" imageUrl={badgeError}>
            {defendError.message}&nbsp;{attackError.message}
          </BadgeComponent>
        )}
        {attackError && !defendError && (
          <BadgeComponent className="scale-75" imageUrl={badgeError}>
            {attackError.message}
          </BadgeComponent>
        )}
        {defendError && !attackError && (
          <BadgeComponent className="scale-75" imageUrl={badgeError}>
            {defendError.message}
          </BadgeComponent>
        )}
      </div>

      <div className="flex flex-col items-center justify-center gap-y-6">
        <div className="flex items-center justify-center gap-6">
          <Opponents
            game={game}
            playerList={playerList}
            currentPlayerId={playerId}
          />
        </div>

        <div className="flex w-full flex-row items-center justify-center gap-3">
          <div className="flex w-1/3 items-end justify-end">
            <DeckAreaComponent className="pr-28" deck={game.deck} />
          </div>

          <div className="flex min-h-[208px] w-1/3 items-center justify-center">
            <BattleAreaComponent
              className="flex items-center justify-center pl-14"
              battleArea={game.battleArea}
              onPairClick={handleBattleAreaCardClick}
            />
          </div>

          <div className="flex w-1/3 items-center justify-start">
            <BeatenAreaComponent className="pl-12" beaten={game.beaten} />
          </div>
        </div>

        <div>
          <div
            className={`flex w-[550px] flex-col items-center justify-center rounded-[50px] bg-gradient-to-r from-[#00000031] to-[#31313131] p-11 backdrop-blur-sm backdrop-opacity-30`}
          >
            <HandComponent
              className={`${handPadding(player0Hand)} w-full`}
              onCardClick={handleHandCardClick}
              hand={player0Hand}
              isPlayer={true}
              trumpSuit={game.deck.trumpCard.suit}
              selectedIndex={selectedHandCard}
            />

            <PlayerStateBadge
              className="mt-8"
              playerState={getPlayerState(player0Id!, game)}
              playerName={player0Name!}
            />
          </div>
        </div>
      </div>

      <div className="flex w-full items-start justify-center">
        <ButtonComponent
          //if (battle area has undefended cards and player is attacker) { handleCollectedCards }
          //if (player attacker) { handleEndTurn }

          onClick={
            !allPairsComplete && playerId === game.currentState.defender
              ? handleCollectedCards
              : handleEndTurn
          }
          className="text-2xl"
          isActive={canEndTurn || canCollect}
        >
          {playerId === game.currentState.defender ? (
            <span>Collect</span>
          ) : (
            <span>End Turn</span>
          )}
        </ButtonComponent>
      </div>
    </div>
  );
};
