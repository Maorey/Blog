import { add, merge } from './planUtils'
import type { GoldMine, Plan } from './types'

let DPTable: { [key: string]: any }

function solve<T extends GoldMine = GoldMine>(
  goldMines: T[],
  minerCount: number,
  goldMineCount: number
): Plan<T>[] {
  const key = minerCount + '.' + goldMineCount
  const result = DPTable[key]
  if (result !== undefined) {
    return result
  }

  let goldMine
  let cost

  if (goldMineCount < 2) {
    goldMine = goldMines[0]
    cost = goldMine.cost

    return (DPTable[key] =
      minerCount < cost
        ? [{ gold: 0, cost: 0, mines: [] }]
        : [{ gold: goldMine.gold, cost, mines: [goldMine] }])
  }

  goldMine = goldMines[--goldMineCount]
  cost = goldMine.cost

  if (minerCount < cost) {
    return (DPTable[key] = solve(goldMines, minerCount, goldMineCount))
  }

  let right
  if (minerCount === cost) {
    right = [{ gold: goldMine.gold, cost, mines: [goldMine] }]
  } else {
    right = add(goldMine, solve(goldMines, minerCount - cost, goldMineCount))
  }

  return (DPTable[key] = merge(solve(goldMines, minerCount, goldMineCount), right))
}

export default function getMostGold<T extends GoldMine = GoldMine>(
  goldMines: T[],
  minerCount: number,
  goldMineCount = goldMines.length
): Plan<T>[] {
  DPTable = {}
  const result = solve(goldMines, minerCount, goldMineCount)
  DPTable = null! // 睁一只眼闭一只眼

  return result
}
