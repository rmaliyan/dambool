import {
  HandComponent,
  BattleAreaComponent,
  DeckAreaComponent,
  BeatenAreaComponent,
  TextButton,
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

  const { mutate: mutateEndTurn } = api.game.endTurn.useMutation({
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

  if (!game) {
    return <>loading</>;
  }

  const handleEndTurn = () => {
    mutateEndTurn({ roomId: roomId });
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
    }
  };

  const playerCount = game.playerList.length;

  const playerHandIndex = game.playerList.indexOf(playerId);

  const player0Hand = game.hands[playerHandIndex]!;

  const player1Hand = game.hands[(playerHandIndex + 1) % game.hands.length]!;

  const player2Hand = game.hands[(playerHandIndex + 2) % game.hands.length]!;

  const player3Hand = game.hands[(playerHandIndex + 3) % game.hands.length]!;

  const canEndTurn = true;

  return (
    <div className="flex flex-row items-center justify-center gap-3">
      <div className="flex items-end justify-center">
        <DeckAreaComponent className="pr-28" deck={game.deck} />
      </div>

      {playerCount > 2 && (
        <div className="flex w-[100px] items-end justify-center">
          <HandComponent
            hand={player1Hand}
            isPlayer={false}
            isSmaller={true}
            className="rotate-90"
          />
        </div>
      )}

      <div className="flex flex-col items-center justify-center ">
        {playerCount !== 3 && (
          <HandComponent
            hand={playerCount === 2 ? player1Hand : player2Hand}
            isPlayer={false}
            isSmaller={playerCount !== 2}
          />
        )}

        <BattleAreaComponent
          className="flex items-center justify-center py-14"
          battleArea={game.battleArea}
        />

        <HandComponent
          onCardClick={handleCardClick}
          hand={player0Hand}
          isPlayer={true}
        />

        <div className="mt-10 bg-white px-5">
          <TextButton
            buttonText="End Turn"
            onClick={handleEndTurn}
            className="text-2xl"
            isActive={canEndTurn}
          />
        </div>
      </div>

      {game.hands.length > 2 && (
        <div className="flex w-[100px] items-end justify-center">
          <HandComponent
            hand={playerCount === 3 ? player2Hand : player3Hand}
            isPlayer={false}
            isSmaller={true}
            className="rotate-90"
          />
        </div>
      )}

      <div className="flex items-start justify-center">
        <BeatenAreaComponent className="pl-12" beaten={game.beaten} />
      </div>
    </div>
  );
};
