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
  GameModel,
} from "~/game-logic";
import { api } from "~/utils/api";

export type GameComponentProps = {
  game: GameModel;
  roomId: number;
  playerId: number;
};

export const GameComponent: React.FC<GameComponentProps> = ({
  game,
  roomId,
  playerId,
}) => {
  const { mutate: mutateAttack, error } = api.game.attackMove.useMutation();

  const handleCardClick = (cardIndex: number) => {
    const activePlayer = game.currentState.activePlayerId;
    if (activePlayer !== playerId) {
      alert("Not your turn");
      return;
    }
    mutateAttack({ cardIndex: cardIndex, roomId: roomId });
  };

  const playerCount = game.playerList.length;

  const playerHandIndex = game.playerList.indexOf(playerId);

  const player0Hand = game.hands[playerHandIndex]!;

  const player1Hand = game.hands[(playerHandIndex + 1) % game.hands.length]!;

  const player2Hand = game.hands[(playerHandIndex + 2) % game.hands.length]!;

  const player3Hand = game.hands[(playerHandIndex + 3) % game.hands.length]!;

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
