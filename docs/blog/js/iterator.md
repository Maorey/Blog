---
title: 迭代器
index: 1
---

*2021-01-15*

## 前言

**迭代器**是js中比较基础但很重要的数据结构, 相关ES语法涉及`ES2015-2018`, 现代浏览器都支持 (IE: 啥? 村里通网了么?:rofl:)

## 迭代器 (Iterators - ES2015)

迭代器[接口定义](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)如下:

```ts
interface IteratorYieldResult<TYield> {
  /** 是否到达结束位置 */
  done?: false
  /** 当前位置值 */
  value: TYield
}
interface IteratorReturnResult<TReturn> {
  done: true
  value: TReturn
}
type IteratorResult<T, TReturn = any> =
  | IteratorYieldResult<T>
  | IteratorReturnResult<TReturn>

interface Iterator<T, TReturn = any, TNext = undefined> {
  /** 返回下一个指针位置信息 */
  next(...args: [] | [TNext]): IteratorResult<T, TReturn>
  /** 从外部控制 提前结束迭代器并指定返回值 */
  return?(value?: TReturn): IteratorResult<T, TReturn>
  /** 从外部控制 抛出错误并结束迭代器 */
  throw?(e?: any): IteratorResult<T, TReturn>
}

interface Iterable<T> {
  [Symbol.iterator](): Iterator<T>
}
interface IterableIterator<T> extends Iterator<T> {
  [Symbol.iterator](): IterableIterator<T>
}
```

它为数据的迭代(遍历)提供了统一的实现方式, 原生部署了迭代器接口的数据类型有:

- `Array` / `TypedArray`
- `Map`
- `Set`
- `String`
- `Arguments`
- `NodeList`
- [请补充]

你可以通过从上述类型的实例/字面量调用`[Symbol.iterator]`方法得到迭代器实例:

```ts
const SOME_STRING = 'AB'
const iterator: IterableIterator<string> = SOME_STRING[Symbol.iterator]()

iterator.next() // { value: 'A', done: false }
iterator.next() // { value: 'B', done: true }
iterator.next() // { value: undefined, done: true }
iterator.next() // { value: undefined, done: true }
```

迭代器的主要消费者 (`done = true` 时即结束迭代)

- `for...of` / `for await...of`
- `...` (解构赋值, 扩展运算)
- `yield*`
- `Array.from()`
- `Map(), Set(), WeakMap(), WeakSet()` (比如: `new Map([['a', 1], ['b', 2]])`)
- `Promise.all()`
- `Promise.race()`
- [请补充]

我们来自己实现一下`Iterator`:

```ts
const someObject = {
  id: 'someObject',
  [Symbol.iterator]() {
    const MAX_SIZE = 3
    let pointer = 0
    let done = false

    return {
      next: (value?: number) => {
        if (done) {
          console.log('next: iterator is done')
          return { value: undefined, done }
        }

        value = value || pointer++
        done = value > MAX_SIZE
        console.log('current value is: ', value)

        return { value, done }
      },
      return: (value: number) => {
        if (done) {
          console.log('return: iterator is done')
          return { value: undefined, done }
        }

        done = true
        return { value, done }
      },
      throw: (err: any) => {
        if (done) {
          console.log('throw: iterator is done')
          return { value: undefined, done }
        }

        done = true
        console.error(err)
        return { value: undefined, done }
      },
    }
  },
}

// case0: 检查迭代器状态
const iterator = someObject[Symbol.iterator]()
iterator.next() // { value: 0, done: false }
// try yourself

// case1: for...of (可使用 break/continue)
for (const value of someObject) {
  console.log('for...of someObject: ', value)
}

// case2: 解构赋值
const [first, ...rest] = someObject
// first = 0, rest = [1, 2, 3]
const { id, ...restProperty } = someObject
// [...restProperty] = [0, 1, 2, 3]

// case3: 展开
console.log([...someObject])
// [0, 1, 2, 3]

// case4:
console.log(Array.from(someObject))
console.log(new Set(someObject))
// [0, 1, 2, 3]
```

## 异步迭代器 (AsyncIterators - ES2018)

异步迭代器, 即调用 `next` 方法得到一个`Promise`对象, 接口签名如下:

```ts
interface AsyncIterator<T, TReturn = any, TNext = undefined> {
  next(...args: [] | [TNext]): Promise<IteratorResult<T, TReturn>>
  return?(value?: TReturn | PromiseLike<TReturn>): Promise<IteratorResult<T, TReturn>>
  throw?(e?: any): Promise<IteratorResult<T, TReturn>>
}

interface AsyncIterable<T> {
  [Symbol.asyncIterator](): AsyncIterator<T>
}
interface AsyncIterableIterator<T> extends AsyncIterator<T> {
  [Symbol.asyncIterator](): AsyncIterableIterator<T>
}
```

部署了异步迭代器的对象可以通过 `for await...of` (也可遍历**同步迭代器**)等方式遍历

```ts
const someObject = {
  id: 'someObject',
  [Symbol.asyncIterator]() {
    const MAX_SIZE = 3
    let pointer = 0
    let done = false

    return {
      next: (value?: number): Promise<IteratorResult<number>> => {
        if (done) {
          console.log('next: asyncIterator is done')
          return Promise.resolve({ value: undefined, done })
        }

        return new Promise(resolve => {
          setTimeout(() => {
            value = value || pointer++
            done = value > MAX_SIZE
            console.log('current value is: ', value)

            resolve({ value, done })
          }, (Math.random() * 250) | 0)
        })
      },
    }
  },
}

async function run() {
  try {
    for await (const x of someObject) {
      console.log(x)
    }
  } catch (error) {}
}

run() // 0, 1, 2, 3
```

## 生成器函数 (GeneratorFunction - ES2015)

生成器函数顾名思义就是用来生成**迭代器**([Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) 对象, 该对象实现了[`Iterator`](#迭代器-iterators-es2015)接口, 包括`next/return/throw`方法)的函数, 示例语法:

```ts
interface Generator<T = unknown, TReturn = any, TNext = unknown> extends Iterator<T, TReturn, TNext> {
  next(...args: [] | [TNext]): IteratorResult<T, TReturn>
  return(value: TReturn): IteratorResult<T, TReturn>
  throw(e: any): IteratorResult<T, TReturn>
  [Symbol.iterator](): Generator<T, TReturn, TNext>
}

function* helloGenerator(): Generator {
  yield 'hello'
  yield 'world'
  return 'over'
}
const foo = function* () {}
const bar = { *baz() {} }

const iterator = helloGenerator()
iterator.next() // { value: 'hello', done: false }
iterator.next() // { value: 'world', done: false }
iterator.next() // { value: 'over', done: true }
iterator.next() // { value: undefined, done: true }
```

生成器函数使用 `function*` 声明, 函数体内可使用 `yield` [表达式](https://tc39.es/ecma262/#sec-expressions)返回当前迭代器的值 (可视作迭代器 `next` 方法), 没有 `return` 语句则以 `undefined` 为 `value` 结束, 总是返回一个迭代器, 不可用作构造函数(即`new`)

如果`yield`表达式在另一个表达式中**必须**加括号:

```ts
function* foo(name: string) {
  console.log('Hello' + (yield || name)) // SyntaxError
  console.log('Hello' + (yield name || name)) // SyntaxError
  console.log('Hello' + ((yield) || name)) // OK
  console.log('Hello' + ((yield name) || name)) // OK
}
```

调用生成器函数时仅创建迭代器, 调用迭代器时才执行具体逻辑, 这些逻辑以 `yield` 表达式分割, 可以理解为**每次执行完下一条`yield`表达式所在的语句后就暂停执行**

```ts
function* lazy() {
  console.log('lazy is run')
}

const iterator = lazy()
iterator.next() // 'lazy is run' \n { value: undefined, done: true }
iterator.next() // { value: undefined, done: true }
```

下面是使用`for...of`/`...`/`Array.from`等遍历的示例:

```ts
function* foo() {
  console.log('run foo')
  console.log(`foo1 ${yield 1}`)
  console.log(`foo2 ${yield 2}`)
  console.log('foo3')
  return 3
}

for (const value of foo()) {
  console.log('value: ', value)
}
// run foo \n value: 1 \n foo1 undefined \n value: 2 \n foo2 undefined \n foo3
```

<br/>`next` / `return` / `throw` 本质上是一样的, 都是恢复执行生成器函数(并使用不同的方法替换`yield`表达式)

### next

可通过`next`方法向生成器函数里传递数据(将`yield`表达式替换为指定值):

```ts
function* add() {
  let sum = 0

  let input
  while (true) {
    input = yield sum // yield 后面不写 = yield undefined
    if (input === true) {
      return sum
    }
    sum += input
  }
}

const iterator = add()
iterator.next(1) // { value: 0, done: false }
iterator.next(2) // { value: 2, done: false }
iterator.next(3) // { value: 5, done: false }
iterator.next(true) // { value: 5, done: true }
iterator.next() // { value: undefined, done: true }
```

### return

可通过`return`方法结束迭代器(将`yield`表达式替换为`return`语句)

```ts
const iterator = add()
iterator.next() // { value: 0, done: false }
iterator.next(1) // { value: 1, done: false }
iterator.next(2) // { value: 3, done: false }
iterator.return(2) // { value: 2, done: true }
iterator.next(3) // { value: undefined, done: true }
```

### throw

可通过`throw`方法向迭代器内部传递错误(将`yield`表达式替换为`throw`语句), 生成器函数内部可使用`try...catch`捕获错误, 若未捕获则抛出错误**并结束迭代**, 否则继续执行到**下一条`yield`表达式**

```ts
function* foo() {
  console.log('run foo')
  try {
    console.log(`foo1 ${yield 1}`)
  } catch (error) {
    console.error(error)
  }
  console.log(`foo2 ${yield 2}`)
  console.log('foo3')
  return 3
}

const iterator = foo()
iterator.next() // run foo \n { value: 1, done: false }
iterator.throw('给我报错') // 给我报错 \n { value: 2, done: false }
iterator.next(1) // foo2 1 \n foo3 \n { value: 3, done: true }
iterator.next(2) // { value: undefined, done: true }
```

### yield* 表达式

在生成器函数内部可使用 `yield*` 表达式遍历其他**可迭代数据结构** (部署了 迭代器/异步迭代器 的数据结构), 有递归的效果

```ts
function* foo() {
  yield 1
  yield* [2, 3] // 或(function* bar() {yield 2; yield 3})()
  yield 4
}
```

等价于

```ts
function* foo() {
  yield 1
  for (const value of [2, 3]) {
    yield value
  }
  yield 4
}
```

### 执行器

使用生成器函数有个问题是**需要了解实现细节**, 所以比较好的方式是牺牲一定的灵活度, 遵循一定的规则来实现, 这样就可以使用**特定的执行器**来执行它, 常见的方式是使用[Thunk](http://www.ruanyifeng.com/blog/2015/05/thunk.html)函数(`(callback: any) => any`)/`Promise`来作为`yield`的值

## 异步函数 (AsyncFunction - ES2017)

异步函数使用 `async function` 声明, 函数体内部可以使用 `await` 表达式等待异步操作结果(`thenAble`对象), 总是返回一个`Promise`对象, 它是[生成器函数](#生成器函数-generatorfunction-es2015)的语法糖(内置执行器)

```ts
async function foo(delay?: number) {
  const result = await new Promise(resolve => {
    setTimeout(() => {
      resolve('done')
    }, delay)
  })
  return result
}
// 酱紫也可以
async function foo(delay?: number) {
  let cb: (value: string) => any
  setTimeout(() => {
    cb && cb('done')
  }, delay)

  const result = await {
    then(callback: typeof cb) {
      cb = callback
    },
  }

  return result
}
const bar = async () => {}
const baz = { async qux() {} }

foo(500).then(value => {
  console.log('value: ', value) // value: done
})

async function qux(args) {
  // ...
}

// 等同于
function qux(args) {
  return spawn(function* () {
    // ...
  })
}
// typeof spawn = (fn: GeneratorFunction) => Promise
```

其中`spawn`函数返回的`Promise`对象将会在生成器函数自动执行完成后, 变更为`fulfilled`状态. 使用时注意下异步操作的**并行**(使用`Promise.all`等方式)/**串行**及**错误处理**即可

```ts
// 错误处理
async function foo(url: string) {
  let result
  let errorInfo

  let tryTimes = 5
  while (tryTimes--) {
    try {
      result = await fetch(url)
    } catch (error) {
      errorInfo = error
      continue
    }

    return result
  }

  return errorInfo
}
```

## 异步生成器函数 (AsyncGeneratorFunction - ES2018)

异步生成器函数的语法上是 [异步函数](#异步函数-asyncfunction-es2017) 和 [生成器函数](#生成器函数-generatorfunction-es2015) 的结合, 用来生成一个**异步迭代器**([AsyncGenerator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects#control_abstraction_objects) 仅列出, 暂无文档)对象, 该对象实现了[异步迭代器](#异步迭代器-asynciterators-es2018)接口, 包括`next/return/throw`方法)的函数, 示例语法:

```ts
interface AsyncGenerator<T = unknown, TReturn = any, TNext = unknown> extends AsyncIterator<T, TReturn, TNext> {
  next(...args: [] | [TNext]): Promise<IteratorResult<T, TReturn>>
  return(value: TReturn | PromiseLike<TReturn>): Promise<IteratorResult<T, TReturn>>
  throw(e: any): Promise<IteratorResult<T, TReturn>>
  [Symbol.asyncIterator](): AsyncGenerator<T, TReturn, TNext>
}

async function* foo(): AsyncGenerator {
  console.log('foo: 1')
  const result = await Promise.resolve('done')
  console.log('foo: 2')
  const data = yield result
  console.log('foo: 3')
  return data
}
const bar = async function* () {}
const baz = { async *qux() {} }

async function run() {
  try {
    for await (const x of foo()) {
      console.log('run:', x)
    }
  } catch (error) {}
}

run() // foo: 1 \n foo: 2 \n run: done \n foo: 3
```

异步生成器函数返回的异步迭代器, 其[next](#next) / [return](#return) / [throw](#throw) 方法的行为与上述生成器函数返回的迭代器相似, 注意下`Promise`和错误处理(`try...catch`)即可, 也可以被 [yield*](#yield-表达式) 遍历, 不可用作构造函数(即`new`)

```ts
function* foo() {
  console.log('foo: 0')
  yield 'foo: 1'
  console.log('foo: 2')
  yield 'foo: 3'
  console.log('foo: 4')
}
async function* bar() {
  console.log('bar: 0')
  yield await Promise.resolve('bar: 1')
  console.log('bar: 2')
}
async function* baz() {
  console.log('baz: 0')
  yield await Promise.resolve('baz: 1')
  console.log('baz: 2')
  yield* foo()
  console.log('baz: 3')
  yield* bar()
  console.log('baz: 4')
}

async function run() {
  try {
    for await (const x of baz()) {
      console.log('run:', x)
    }
  } catch (error) {}
}

run()
// baz: 0 \n run: baz: 1 \n baz: 2 \n foo: 0
// run: foo: 1 \n foo: 2 \n run: foo: 3 \n foo: 4
// baz: 3 \n bar: 0 \n run: bar: 1 \n bar: 2 \n baz: 4
```

遵循一定的规范, 是可以使用相同的执行器来执行的. 这是比较巧妙(但不是巧合)的地方, 可以忽略掉同步和异步的差别

## 聊聊

- [协程](https://mp.weixin.qq.com/s/57IERpGIlvRwYCh6vSbMDA): 可以看到, 迭代器(含异步)这种执行权交替转移的方式是协程的不完全实现
- [上下文](https://tc39.es/ecma262/#sec-execution-contexts): 自动绑定了(生成器(含异步)函数)执行上下文
- 性能: 迭代器性能自然是比不上传统的迭代方式的, 不管是从数据结构(含内存分配)还是查找等方面考量, 都是如此. 但是我们使用它的场景往往是在于管道的控制等, 所以一般也不会有大量的数据/步骤需要迭代, 缺点是可忽略的. 而且使用它会给我们带来的开发/维护等方面的诸多好处, 这是**不可忽视的优点**

### 应用

- 顺序一致性: 确保对数据每次遍历的顺序一致(类数组)
- 异步编程: 异步编程的同步化表达
- 状态机: 迭代器(含异步)是很适合做状态机的结构, 而生成器函数(含异步)大大方便了创建迭代器
- 控制流: 任务组合, 流程控制
- [请补充]

## 参考链接

- [MDN](https://developer.mozilla.org): [Iterators_and_Generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators) 等
- [阮一峰](http://www.ruanyifeng.com): [Iterator 和 for...of 循环](https://es6.ruanyifeng.com/#docs/iterator) 等
- [ES2020](https://tc39.es/ecma262/2020): [operations-on-iterator-objects](https://tc39.es/ecma262/2020/#sec-operations-on-iterator-objects) 等
- 微信公众号: [实现一个 async/await](https://mp.weixin.qq.com/s/gFSb0BYSbL7c5K4cCcgeow)
- 微信公众号: [哈希表](https://mp.weixin.qq.com/s/AzS6p2d7ZEw20eL4GVnp2w)
