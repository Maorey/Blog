import type { DefaultTheme } from 'vitepress'

/** 读取顶部导航 */
declare function getNav(
  noFile?: boolean,
  /**
   * @default './'
   */
  pathRelativeToDocs?: string,
  /**
   * @default ''
   */
  rootPath?: string
): DefaultTheme.NavItem | DefaultTheme.SideBarItem
export default getNav
