import { BadgerType } from './enums/badger-type.enum';
import { BadgerTypeMap } from './types/badger-type-map';

export const BADGER_RANKS: BadgerTypeMap = {
  [BadgerType.Basic]: 1,
  [BadgerType.Neo]: 20,
  [BadgerType.Hero]: 200,
  [BadgerType.Hyper]: 600,
  [BadgerType.Frenzy]: 1400,
};

export function getBadgerType(score: number): BadgerType {
  if (score >= BADGER_RANKS[BadgerType.Frenzy]) {
    return BadgerType.Frenzy;
  }
  if (score >= BADGER_RANKS[BadgerType.Hyper]) {
    return BadgerType.Hyper;
  }
  if (score >= BADGER_RANKS[BadgerType.Hero]) {
    return BadgerType.Hero;
  }
  if (score >= BADGER_RANKS[BadgerType.Neo]) {
    return BadgerType.Neo;
  }
  return BadgerType.Basic;
}
