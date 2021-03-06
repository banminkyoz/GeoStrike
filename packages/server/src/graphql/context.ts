import { GamesManager, IGameObject, IPlayer, IViewer } from '../core/local-data/game-manager';
import { decode } from 'jsonwebtoken';

export interface IGraphQLContext {
  games: GamesManager;
  game?: IGameObject;
  player?: IPlayer | IViewer;
}

export const createContext = (): IGraphQLContext => {
  return {
    games: new GamesManager(),
  };
};

export const resolveGameAndPlayer = (headerValue: string, games: GamesManager): { game?: IGameObject, player?: IPlayer | IViewer } | {} => {
  if (headerValue) {
    const decodedPlayerToken: { gameId: string, playerId: string } = decode(headerValue) as any;

    if (decodedPlayerToken) {
      const game = games.getGameById(decodedPlayerToken.gameId);

      if (game) {
        const player = game.playersMap.get(decodedPlayerToken.playerId) || game.viewers.find(v => v.playerId === decodedPlayerToken.playerId);

        if (player) {
          return {
            game,
            player,
          };
        } else {
          throw new Error('Invalid player playerId!');
        }
      } else {
        throw new Error('Invalid game!');
      }
    } else {
      throw new Error('Invalid token!');
    }
  }

  return {};
};
