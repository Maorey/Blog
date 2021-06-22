import { add, merge } from './planUtils'
import type { GoldMine, Plan } from './types'

function copyPlan<T extends GoldMine = GoldMine>(plan: Plan<T>): Plan<T> {
  return { ...plan, mines: [...plan.mines] }
}

export default function getMostGold<T extends GoldMine = GoldMine>(
  goldMines: T[],
  minerCount: number,
  goldMineCount = goldMines.length
): Plan<T>[] {
  const DPTable: { [goldMineCount: number]: Plan<T>[] } = {}

  let goldMine: T
  let gold: number
  let cost: number
  let j: number
  let leftPlans: Plan<T>[]
  let rightPlans: Plan<T>[]
  while (goldMineCount) {
    goldMine = goldMines[--goldMineCount]
    gold = goldMine.gold
    cost = goldMine.cost

    for (j = minerCount; j >= cost; j--) {
      leftPlans = DPTable[j - cost]
      leftPlans = leftPlans
        ? add(goldMine, leftPlans.map(copyPlan))
        : [{ gold, cost, mines: [goldMine] }]
      rightPlans = DPTable[j]
      DPTable[j] = rightPlans ? merge(leftPlans, rightPlans) : leftPlans
    }
  }

  return DPTable[minerCount]
}
