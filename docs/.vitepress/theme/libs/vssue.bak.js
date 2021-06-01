import Vue from 'vssue/node_modules/vue'
import { VssueComponent } from 'vssue'
import GithubV3 from '@vssue/api-github-v3' // 为啥不按package.json指定的文件, 非要找src???

import '../style/vssue.styl'

export var v = {
  v: Vue,
  a: GithubV3,
  c: VssueComponent,
}
