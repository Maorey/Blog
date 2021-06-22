import type { GoldMine } from './types'

let DPTable: { [key: string]: number }

function solve<T extends GoldMine = GoldMine>(
  goldMines: T[],
  minerCount: number,
  goldMineCount: number
): number {
  const key = minerCount + '.' + goldMineCount
  const result = DPTable[key]
  if (result !== undefined) {
    return result
  }

  if (goldMineCount < 2) {
    const goldMine = goldMines[0]

    return (DPTable[key] = minerCount < goldMine.cost ? 0 : goldMine.gold)
  }

  const goldMine = goldMines[--goldMineCount]
  const right =
    minerCount < goldMine.cost
      ? 0
      : minerCount === goldMine.cost
      ? goldMine.gold
      : goldMine.gold + solve(goldMines, minerCount - goldMine.cost, goldMineCount)

  const left = solve(goldMines, minerCount, goldMineCount)

  return (DPTable[key] = left > right ? left : right)
}

export default function getMostGold<T extends GoldMine = GoldMine>(
  goldMines: T[],
  minerCount: number,
  goldMineCount = goldMines.length
): number {
  DPTable = {}
  const result = solve(goldMines, minerCount, goldMineCount)
  DPTable = null! // 睁一只眼闭一只眼

  return result
}

/* 验证
getMostGold(
  [
    { id: '1', gold: 400, cost: 5 },
    { id: '2', gold: 500, cost: 5 },
    { id: '3', gold: 200, cost: 3 },
    { id: '4', gold: 300, cost: 4 },
    { id: '5', gold: 350, cost: 3 },
  ],
  10
)
*/
