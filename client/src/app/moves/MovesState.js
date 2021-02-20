import { POKE_API_URL, MAX_MOVES } from 'src/shared/util/constants';
import { capitalize } from 'src/shared/util/capitalize';

export default class MovesState {
  constructor() {
    this.moves = [];
  }

  async init() {
    const res = await fetch(`${POKE_API_URL}/move?limit=${MAX_MOVES}`);
    const data = await res.json();
    // I *could* use a map call.
    this.moves = data.results;
    this.moves.forEach(
      (move) => (move.name = capitalize(move.name.replaceAll('-', ' ')))
    );
  }

  filter(pattern) {
    return this.moves.filter((move) =>
      move.name.toLowerCase().startsWith(pattern)
    );
  }

  async getMove(moveUrl) {
    const res = await fetch(moveUrl);
    const move = await res.json();
    return move;
  }
}