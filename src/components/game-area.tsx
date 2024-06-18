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

export type GameComponentProps = {
  game: GameModel;
  playerId: number; 
};

export const GameComponent: React.FC<GameComponentProps> = ({ game, playerId}) => {

   
    const handleCardClick = (cardIndex : number) => {
      const activePlayer = game.currentState.activePlayerId 
      if (activePlayer !== playerId) {
        alert("Not your turn");
        return
      }
      

    }

  return (
    <div className="flex flex-row items-center justify-center gap-3">
      {/* <Link href="/api/create-room">Create Session</Link> */}
      <DeckAreaComponent className="pr-28" deck={game.deck} />

      <div className="flex w-[650px] flex-col">
        <HandComponent hand={game.hands[0]!} isPlayer={false} />
        <BattleAreaComponent
          className="flex items-center justify-center py-14"
          battleArea={game.battleArea}
        />
        <HandComponent onCardClick={handleCardClick} hand={game.hands[1]!} isPlayer={true} />
      </div>

      <BeatenAreaComponent className="pl-12" beaten={game.beaten} />
    </div>
  );
};
