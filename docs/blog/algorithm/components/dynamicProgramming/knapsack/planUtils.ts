import type { GoldMine, Plan } from './types'

export function add<T extends GoldMine = GoldMine>(goldMine: T, plans: Plan<T>[]): Plan<T>[] {
  const { gold, cost } = goldMine

  let i = plans.length
  let plan: Plan<T>
  while (i) {
    plan = plans[--i]

    plan.gold += gold
    plan.cost += cost
    plan.mines.push(goldMine)
  }

  return plans
}

export function merge<T extends GoldMine = GoldMine, R extends GoldMine = T>(
  leftPlans: Plan<T>[],
  rightPlans: Plan<R>[]
): Plan<T | R>[] {
  const leftGold = leftPlans[0].gold
  const rightGold = rightPlans[0].gold

  if (leftGold === rightGold) {
    // 归并
    const mergedPlans: Array<Plan<T | R>> = []

    let l = leftPlans.length
    let r = rightPlans.length
    while (l && r) {
      mergedPlans.unshift(
        leftPlans[l - 1].cost > rightPlans[r - 1].cost ? leftPlans[--l] : rightPlans[--r]
      )
    }
    while (l) {
      mergedPlans.unshift(leftPlans[--l])
    }
    while (r) {
      mergedPlans.unshift(rightPlans[--r])
    }

    return mergedPlans
  }

  return leftGold > rightGold ? leftPlans : rightPlans
}
