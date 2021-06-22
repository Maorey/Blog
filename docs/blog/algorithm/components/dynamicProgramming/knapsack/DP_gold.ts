import type { GoldMine } from './types'

export default function getMostGold<T extends GoldMine = GoldMine>(
  goldMines: T[],
  minerCount: number,
  goldMineCount = goldMines.length
): number {
  const DPTable: { [goldMineCount: number]: number } = {}

  let goldMine: T
  let gold: number
  let cost: number
  let j: number
  while (goldMineCount) {
    goldMine = goldMines[--goldMineCount]
    gold = goldMine.gold
    cost = goldMine.cost

    for (j = minerCount; j >= cost; j--) {
      DPTable[j] = Math.max(DPTable[j] || 0, (DPTable[j - cost] || 0) + gold)
    }
  }

  return DPTable[minerCount]
}
