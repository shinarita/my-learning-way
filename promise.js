const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

const isFunction = (fn) => typeof fn === "function";

class MyPromise {
  constructor(executor) {
    try {
      executor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }
  status = PENDING;
  value = null;
  reason = null;
  onFulfilledCallbacks = [];
  onRejectedCallbacks = [];

  resolve = (value) => {
    if (this.status === PENDING) {
      this.status = FULFILLED;
      this.value = value;
      while (this.onFulfilledCallbacks.length) {
        this.onFulfilledCallbacks.shift()(value);
      }
    }
  };
  reject = (reason) => {
    if (this.status === PENDING) {
      this.status = REJECTED;
      this.reason = reason;
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(reason);
      }
    }
  };
  then = (onFulfilled, onRejected) => {
    const realOnFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    const realOnRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };
    const promise2 = new Promise((resolve, reject) => {
      const fulfilledMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = realOnFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };
      const rejectedMicrotask = () => {
        queueMicrotask(() => {
          try {
            const x = realOnRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      };
      if (this.status === FULFILLED) {
        fulfilledMicrotask();
      } else if (this.status === REJECTED) {
        rejectedMicrotask();
      } else if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(fulfilledMicrotask);
        this.onRejectedCallbacks.push(rejectedMicrotask);
      }
    });
    return promise2;
  };

  static resolve(parameter) {
    if (parameter instanceof MyPromise) {
      return parameter;
    }
    return new MyPromise((resolve) => {
      resolve(parameter);
    });
  }

  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }
}

function resolvePromise(promise, x, resolve, reject) {
  if (promise == x) {
    return reject(
      new TypeError("Chaining cycle detected for promise #<Promise>")
    );
  }
  if (typeof x === "object" || typeof x === "function") {
    if (x === null) {
      return resolve(x);
    }

    let then;
    try {
      then = x.then;
    } catch (error) {
      return reject(error);
    }

    if (typeof then === "function") {
      let called = false;
      try {
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(promise, y, resolve, reject);
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } catch (error) {
        if (called) then;
        reject(error);
      }
    } else {
      resolve(x);
    }
  } else {
    resolve(x);
  }
}

module.exports = MyPromise;

const p = Promise.resolve();(async () => {await p;console.log("after: await");})();p.then(() => console.log("tick:a ")).then(() => console.log("tick:b"));
