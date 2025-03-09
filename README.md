# JavaScript 高级程序设计（第4版）思维导图

## 1. JavaScript 简介
- **起源与发展**
- **JavaScript 组成**
    - ECMAScript
    - DOM
    - BOM
- **运行环境**
    - 浏览器
    - Node.js

## 2. 基本概念
- **变量**
    - var、let、const
    - 作用域与作用域链
- **数据类型**
    - 原始类型（string, number, boolean, null, undefined, symbol, bigint）
    - 引用类型（对象、数组、函数）
- **类型转换**
    - 隐式 & 显式转换
    - == vs ===
- **运算符**
    - 算术、逻辑、比较、位运算
- **流程控制**
    - if/else、switch、for、while、try/catch

## 3. 函数
- **函数声明与表达式**
- **箭头函数**
- **this 绑定**
    - 默认绑定、隐式绑定、显式绑定（call/apply/bind）、new 绑定
- **闭包**
    - 作用域与变量提升
- **函数式编程**
    - 纯函数、柯里化、函数组合

## 4. 对象与原型
- **创建对象**
    - 工厂模式、构造函数模式、原型模式、ES6 class
- **对象属性**
    - 数据属性 vs 访问器属性
    - `Object.defineProperty`
- **原型与原型链**
    - `__proto__` vs `prototype`
    - 继承方式：原型继承、构造函数继承、组合继承、ES6 class 继承

## 5. 作用域与闭包
- **执行上下文**
    - 变量对象、作用域链、this
- **变量提升**
- **闭包**
    - 作用与应用（私有变量、缓存、事件监听）

## 6. 异步编程
- **事件循环**
    - 宏任务（setTimeout, setInterval, setImmediate）
    - 微任务（Promise.then, process.nextTick）
- **回调函数**
- **Promise**
    - then、catch、finally
- **async/await**
    - 异步函数的错误处理

## 7. 事件与DOM
- **DOM 结构**
- **事件模型**
    - 捕获、冒泡、事件委托
- **事件处理**
    - `addEventListener`
- **常见 DOM 操作**
    - 查询、修改、删除
- **CSS 操作**
    - 计算样式、修改样式
- **BOM（浏览器对象模型）**
    - `window`、`navigator`、`location`、`history`

## 8. 模块化
- **ES6 模块**
    - `import` / `export`
- **CommonJS & AMD**
- **打包工具**
    - Webpack, Rollup, Vite

## 9. 面向对象与设计模式（已加强）
_（省略，见上方优化内容）_

## 10. 性能优化与安全（已加强）
_（省略，见上方优化内容）_

## 11. 现代 JavaScript 特性（重点加强）
- **ES6+ 语法**
    - **解构赋值**
        - 数组、对象解构
        - 默认值、别名赋值
    - **模板字符串**
        - `${}` 变量插值
        - 多行字符串
    - **可选链（?.）**
        - 访问深层嵌套对象，避免 `undefined` 报错
    - **空值合并（??）**
        - `null` 或 `undefined` 时使用默认值
    - **默认参数**
        - `function test(a = 10) { ... }`
    - **箭头函数**
        - 语法简洁，`this` 绑定当前作用域
    - **展开运算符（...）**
        - 数组展开、对象合并
    - **Rest 参数**
        - `function sum(...args) {}` 处理不定参数
    - **`Symbol` & `BigInt`**
        - `Symbol` 作为对象属性，避免命名冲突
        - `BigInt` 处理大数运算

- **异步编程**
    - **Promise**
        - `Promise.all` 并行执行多个任务
        - `Promise.race` 取最快的 Promise 结果
        - `Promise.allSettled` 返回所有 Promise 状态
    - **async/await**
        - 使异步代码更像同步代码
        - `try/catch` 处理错误
    - **fetch API**
        - 替代 `XMLHttpRequest`
        - `fetch(url).then(res => res.json())`

- **迭代器与生成器**
    - **迭代器（Iterator）**
        - `Symbol.iterator`
        - `for...of` 遍历
    - **生成器（Generator）**
        - `function* gen() { yield 1; yield 2; }`
        - `gen.next()` 控制执行

- **Proxy & Reflect**
    - **Proxy**
        - 拦截对象操作，如 `get`、`set`
        - `new Proxy(target, handler)`
    - **Reflect**
        - `Reflect.get(obj, key)`
        - `Reflect.set(obj, key, value)`

- **Web API**
    - **Fetch API**
        - `fetch(url).then(res => res.json())`
    - **WebSocket**
        - `const ws = new WebSocket("wss://example.com")`
        - `ws.onmessage = (event) => console.log(event.data)`
    - **Service Worker**
        - `navigator.serviceWorker.register('/sw.js')`
        - 用于 PWA（渐进式 Web 应用）

- **新数据结构**
    - **Map 和 Set**
        - `new Map()`，支持键值对存储
        - `new Set()`，不允许重复值
    - **WeakMap 和 WeakSet**
        - 允许垃圾回收的键值对存储

- **Class 语法**
    - `class Person { constructor(name) { this.name = name } }`
    - 继承：`class Student extends Person {}`

- **模块化**
    - `import { func } from './module.js'`
    - `export function func() {}`

- **国际化 API**
    - `Intl.DateTimeFormat` 处理不同地区的日期格式
    - `Intl.NumberFormat` 格式化货币

---
