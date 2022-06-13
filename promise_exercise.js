class Scheduler {
  constructor() {
    this.count = 0;
    this.funcs = [];
  }
  async add(promiseFunc) {
    if (this.count >= 2) {
      await new Promise((resolve) => {
        this.funcs.push(resolve);
      });
    }
    this.count++;
    const result = await promiseFunc();
    this.count--;
    if (this.funcs.length) {
      this.funcs.shift()();
    }
    return result;
  }
}
const scheduler = new Scheduler();
const timeout = (time) => {
  return new Promise((r) => setTimeout(r, time));
};
const addTask = (time, order) => {
  scheduler.add(() => timeout(time)).then((v) => console.log(order));
};
addTask(1000, 1);
addTask(500, 2);
addTask(300, 3);
addTask(400, 4);
// 2 3 1 4

function retry(fn, time) {
  return new Promise((resolve, reject) => {
    fn()
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        if (time-- == 0) {
          reject("重试次数已用完！");
        } else {
          resolve(retry(fn, time));
        }
      });
  });
}
let globalTime = 7;
function fn1() {
  return new Promise((resolve, reject) => {
    if (--globalTime !== 0) {
      reject(globalTime);
    } else {
      resolve(globalTime);
    }
  });
}

const p = retry(fn1, 5);
p.then((res) => console.log("res: ", res)).catch((error) =>
  console.log("error: ", error)
);

// const arr = [1, 2, 3];
// arr.reduce((prev, curr) => {
//   return prev.then(() => {
//     console.log(curr);
//     return new Promise((resolve) => {
//       setTimeout(() => resolve(), 1000);
//     });
//   });
// }, Promise.resolve());

// arr.reduce(
//   (p, x) =>
//     p.then(new Promise((r) => setTimeout(() => r(console.log(x)), 1000))),
//   Promise.resolve()
// );

//==============================================
// function red() {
//   console.log("red");
// }
// function green() {
//   console.log("green");
// }
// function yellow() {
//   console.log("yellow");
// }
// const redLight = () =>
//   new Promise((resolve) => {
//     setTimeout(() => {
//       red();
//       resolve();
//     }, 3000);
//   });
// const yellowLight = () =>
//   new Promise((resolve) => {
//     setTimeout(() => {
//       yellow();
//       resolve();
//     }, 2000);
//   });
// const greenLight = () =>
//   new Promise((resolve) => {
//     setTimeout(() => {
//       green();
//       resolve();
//     }, 1000);
//   });
// const light = function () {
//   Promise.resolve()
//     .then(() => {
//       return redLight();
//     })
//     .then(() => {
//       return yellowLight();
//     })
//     .then(() => {
//       return greenLight();
//     })
//     .then(() => {
//       return light();
//     });
// };
// light();

//===============================================
// const time = (timer) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve();
//     }, timer);
//   });
// };
// const ajax1 = () =>
//   time(2000).then(() => {
//     console.log(1);
//     return 1;
//   });
// const ajax2 = () =>
//   time(1000).then(() => {
//     console.log(2);
//     return 2;
//   });
// const ajax3 = () =>
//   time(1000).then(() => {
//     console.log(3);
//     return 3;
//   });

// function mergePromise(asyncArrays) {
//   let result = [];
//   let promise = Promise.resolve();
//   asyncArrays.forEach((func) => {
//     promise = promise.then(func).then((res) => {
//       result.push(res);
//       return result;
//     });
//   });
//   return promise;
// }

// mergePromise([ajax1, ajax2, ajax3]).then((data) => {
//   console.log("done");
//   console.log(data); // data 为 [1, 2, 3]
// });

// 要求分别输出
// 1
// 2
// 3
// done
// [1, 2, 3]

// ===================================
var urls = [
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting1.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting2.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting3.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting4.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/AboutMe-painting5.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/bpmn6.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/bpmn7.png",
  "https://hexo-blog-1256114407.cos.ap-shenzhen-fsi.myqcloud.com/bpmn8.png",
];
function loadImg(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function () {
      console.log("一张图片加载完成");
      resolve(img);
    };
    img.onerror = function () {
      reject(new Error("Could not load image at" + url));
    };
    img.src = url;
  });
}
function loadAllImages() {
  const limit = 3;
  let count = 0;
  let queuing = [];
  urls.forEach((url) => {
    count++;
    if (count < limit) {
      loadImg(url).then((img) => {
        console.log("img: ", img);
        if (queuing.length) {
          queuing.shift()();
        }
      });
    } else {
      new Promise((resolve) => {
        queuing.push(resolve);
      })
        .then(() => {
          count--;
          loadImg(url);
        })
        .then((img) => {
          console.log("img: ", img);
          if (queuing.length) {
            queuing.shift()();
          }
        });
    }
  });
}

loadAllImages();
// 方法二
function limitLoad(urls, handler, limit) {
  let sequence = [].concat(urls); // 复制urls
  // 这一步是为了初始化 promises 这个"容器"
  let promises = sequence.splice(0, limit).map((url, index) => {
    return handler(url).then(() => {
      // 返回下标是为了知道数组中是哪一项最先完成
      return index;
    });
  });
  // 注意这里要将整个变量过程返回，这样得到的就是一个Promise，可以在外面链式调用
  return sequence
    .reduce((pCollect, url) => {
      return pCollect
        .then(() => {
          return Promise.race(promises); // 返回已经完成的下标
        })
        .then((fastestIndex) => {
          // 获取到已经完成的下标
          // 将"容器"内已经完成的那一项替换
          promises[fastestIndex] = handler(url).then(() => {
            return fastestIndex; // 要继续将这个下标返回，以便下一次变量
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }, Promise.resolve()) // 初始化传入
    .then(() => {
      // 最后三个用.all来调用
      return Promise.all(promises);
    });
}
limitLoad(urls, loadImg, 3)
  .then((res) => {
    console.log("图片全部加载完毕");
    console.log(res);
  })
  .catch((err) => {
    console.error(err);
  });
