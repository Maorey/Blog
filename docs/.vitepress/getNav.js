// /** 累加字符串数字和 */
// function sumStr(str, sum = 0) {
//   if (typeof str === 'number') {
//     sum += str
//   } else {
//     let i = str.length
//     while (i--) {
//       sum += i + str.charCodeAt(i)
//     }
//   }

//   return sum
// }

// const CHAR = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$'
// const RADIX = CHAR.length
// /** 数字转RADIX进制字符串 */
// function toRadix(number) {
//   let str = ''
//   do {
//     str = CHAR[number % RADIX] + str
//     number = (number / RADIX) | 0
//   } while (number)

//   return str
// }

const fs = require('fs')
const path = require('path')
const rootDir = path.resolve()
const docsDir = path.join(rootDir, 'docs')
const vitepress = '.vitepress'
const vitepressDir = path.join(docsDir, vitepress)
const public = 'public'
const publicDir = path.join(docsDir, public)

// const recordFile = path.join(vitepressDir, 'record.json')

// let record
// try {
//   record = JSON.parse(fs.readFileSync(recordFile).toString())
// } catch (error) {
//   record = {}
// }
// process.on('beforeExit', () => {
//   fs.writeFile(recordFile, JSON.stringify(record, null, 2), error => {
//     error && console.error('写入记录失败', error)
//   })
// })

// /** 获取uuid */
// function getUUID(fileName) {
//   let uuid = record[fileName]

//   if (!uuid) {
//     const values = new Set(Object.values(record))
//     let sum = sumStr(fileName)
//     do {
//       uuid = toRadix(sum++)
//     } while (values.has(uuid))

//     record[fileName] = uuid
//   }

//   return uuid
// }

function commonExec(reg, content) {
  return (reg.exec(content) || 0)[1]
}

const REG_OPTIONS = /---\s*\n([\d\D]+)\n\s*---/

const REG_TITLE = /(?<!#)# +(.*)/
const REG_HIDE = /(?<!\w)hide *: *(\w+)/
const REG_INDEX = /(?<!\w)index *: *(\d+)/
const parsers = {
  title(optionsContent, info, content) {
    info.title =
      commonExec(REG_TITLE, optionsContent) || commonExec(REG_TITLE, content)
  },
  hide(optionsContent, info) {
    info.hide = commonExec(REG_HIDE, optionsContent) === 'true'
  },
  index(optionsContent, info) {
    const index = commonExec(REG_INDEX, optionsContent)
    info.index = index && (index | 0) + 1
  },
}
/** 提取设置信息 */
function extractInfo(absolutePath) {
  let content
  try {
    content = fs.readFileSync(absolutePath).toString()
  } catch (error) {
    return
  }

  const info = {}
  const optionsContent = commonExec(REG_OPTIONS, content)
  if (optionsContent) {
    for (let option in parsers) {
      parsers[option](optionsContent, info, content)
    }
  }

  return info
}

function sortByName(prev, next) {
  prev = prev.i
  next = next.i
  return prev === next ? 0 : prev > next ? -1 : 1
}

const ext = '.md'
const extUrl = '.html'
const index = 'index' + ext
const REG_TRIM_END = /\.md$/
/** 读取顶部导航 */
module.exports = function getNav(noFile, pathRelativeToDocs = './', rootPath = '/') {
  const nav = []

  const absolutePath = path.resolve(docsDir, pathRelativeToDocs)
  if (absolutePath === vitepressDir || absolutePath === publicDir) {
    return nav
  }

  const isRoot = rootPath === '/'
  const dirs = fs.readdirSync(absolutePath, { withFileTypes: true })
  for (let i = 0, len = dirs.length, dir, name, info, link, children; i < len; i++) {
    dir = dirs[i]
    name = dir.name

    if (dir.isFile()) {
      if (name.endsWith(ext) && !name.endsWith(index) && (!noFile || isRoot)) {
        name = path.basename(name)
        info = extractInfo(path.join(absolutePath, name))
        if (info && !info.hide) {
          name = name.replace(REG_TRIM_END, '')
          dir = info.title || name
          nav.push({
            i: info.index || dir, // 排序
            f: 1, // 标识文件
            text: dir,
            link: rootPath + name + extUrl,
          })
        }
      }
    } else if (
      dir.isDirectory() &&
      !name.endsWith(public) &&
      !name.endsWith(vitepress)
    ) {
      name = path.basename(name)
      info = extractInfo(path.join(absolutePath, name, index))

      if (!info || !info.hide) {
        link = rootPath + name + '/'
        children = getNav(
          noFile,
          path.relative(docsDir, path.join(absolutePath, name)),
          link
        )
        dir = (info && info.title) || name
        nav.push({
          i: (info && info.index) || dir, // 排序
          l: link, // 标记目录 (链接)
          text: dir,
          link: info ? link : undefined,
          children: children.length ? children : undefined,
        })
      }
    }
  }

  return nav.sort(sortByName)
}
