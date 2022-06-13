class Emitter {
  constructor(max) {
    this.max = max;
    this.aysncIdx = 0;
  }
  async *[Symbol.asyncIterator]() {
    while (this.aysncIdx < this.max) {
      yield new Promise((resolve) => resolve(this.aysncIdx++));
    }
  }
}

async function asyncCount() {
  let emitter = new Emitter(5);
  for await (const x of emitter) {
    console.log(x);
  }
}

asyncCount();

var fibonacci = (function () {
  let memo = [0, 1];
  let fib = function (n) {
    if (!memo[n]) {
      memo[n] = memo[n - 1] + memo[n - 2];
    }
    return memo[n];
  };
  return fib;
})();

var memoizer = function (func) {
  let memo = [];
  return function (n) {
    if (!memo[n]) {
      memo[n] = func[n];
    }
    return memo[n];
  };
};
fibonacci = memoizer(function (n) {
  if (n === 1 || n === 2) {
    return 1;
  }
  return fibonacci(n - 2) + fibonacci(n - 1);
});

// 实现 ES6 语法中的 const 声明 使用 ES5 var 怎么去做
var _const = function (param, value) {
  var _global = window;
  var key_arr = ["class", "var", "return"];
  if (!param || key_arr.indexOf(key_arr) > -1) {
    throw new Error("Please enter a valid key");
  }
  if (_global.hasOwnProperty(param)) {
    throw new Error("The param has been declared");
  }
  if (value === undefined) {
    throw new Error("The param should be initiated with a value");
  }
  _global[param] = value;
  Object.defineProperty(_global, param, {
    get: function () {
      return value;
    },
    set: function () {
      if (_global.hasOwnProperty(param)) {
        throw new Error("Connot set the param twice.");
      }
    },
  });
};

// 输入一串含有 ()、[] 、{ } 的字符串 写代码做出检查 括号要成对
function checkString(string) {
  let chars = {
    "(": ")",
    "[": "]",
    "{": "}",
  };
  let leftCharArray = [];
  let result = true;
  for (let i = 0; i < string.length; i++) {
    let char = string[i];
    if (chars[char]) {
      leftCharArray.push(char);
    } else {
      let current = chars[leftCharArray.pop()];
      if (current != char) {
        result = false;
        break;
      }
    }
  }
  return result;
}

// 输入一个有序数组 输出一个无序数组
function randArr(arr) {
  let length = arr.length;
  for (let i = 0; i < length; i++) {
    let index = parseInt(Math.random() * length - 1);
    let temp = arr[i];
    arr[i] = arr[index];
    arr[index] = temp;
  }
  return arr;
}
let arr = [1, 2, 3, 4, 5];
console.log(randArr(arr));

// 二分查找
function search(arr, key) {
  // 循环
  var start = 0,
    end = arr.length - 1;
  while (start <= end) {
    var mid = parseInt((start + end) / 2);
    if (key === arr[mid]) {
      return mid;
    } else if (ke > arr[mid]) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }
  return -1;
}
function search2(arr, key, start, end) {
  // 递归
  if (start > end) {
    return -1;
  }
  var end = end === undefined ? arr.length - 1 : end;
  var start = start || 0;
  var mid = parseInt((start + end) / 2);
  if (key == arr[mid]) {
    return mid;
  } else if (key < arr[mid]) {
    return search2(arr, key, start, mid - 1);
  } else {
    return search2(arr, key, mid + 1, end);
  }
}
