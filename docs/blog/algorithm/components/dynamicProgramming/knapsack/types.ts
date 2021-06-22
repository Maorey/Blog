/** 金矿信息 */
export interface GoldMine {
  /** 黄金储量 */
  gold: number
  /** 需要矿工数 */
  cost: number
}

/** 得到黄金最多的 采矿方案 */
export interface Plan<T extends GoldMine = GoldMine> extends GoldMine {
  /** 要挖掘的金矿 */
  mines: T[]
}
