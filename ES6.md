# ES6相关Api

## Promise
### 以往回调存在的问题
1. 状态的传递：异步代码中若包含对某些变量的操作，完成后需要通知其他引用这些变量的代码。以前只能通过回调函数嵌套来执行后续的操作。随着代码越来越复杂，回调策略不具扩展性。
### 使用
1. Promise构造函数使用一个执行器函数来初始化一个promise实例。
2. 执行器函数作用：初始化Promise的异步行为，控制状态的最终转换。执行器函数有两个参数，resolve和reject。调用resolve把状态切换为resolved，调用reject把状态切换为rejected。
3. 执行器函数是同步执行的。
4. 链式调用：每个then、catch、finally方法都会返回一个promise实例