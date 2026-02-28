import type { Question } from "@/types/quiz";

export const questions: Question[] = [
  // ─── JUNIOR ────────────────────────────────────────────────
  {
    id: "j1",
    text: "What is the result of `typeof null` in JavaScript?",
    topic: "core-js",
    level: "junior",
    options: [
      { id: "j1a", text: '"null"' },
      { id: "j1b", text: '"object"' },
      { id: "j1c", text: '"undefined"' },
      { id: "j1d", text: '"boolean"' },
    ],
    correctOptionId: "j1b",
    explanation:
      '`typeof null` returns "object". This is a well-known JavaScript bug that dates back to the first version of the language, where values were represented as a type tag and a value, and the type tag for objects was 0 — which null also had.',
  },
  {
    id: "j2",
    text: "Which keyword declares a block-scoped variable?",
    topic: "core-js",
    level: "junior",
    options: [
      { id: "j2a", text: "var" },
      { id: "j2b", text: "let" },
      { id: "j2c", text: "const" },
      { id: "j2d", text: "Both let and const" },
    ],
    correctOptionId: "j2d",
    explanation:
      "Both `let` and `const` are block-scoped. `var` is function-scoped (or globally scoped if declared outside a function). `let` allows reassignment while `const` does not.",
  },
  {
    id: "j3",
    text: "What does `===` check in JavaScript?",
    topic: "core-js",
    level: "junior",
    options: [
      { id: "j3a", text: "Value equality only" },
      { id: "j3b", text: "Type equality only" },
      { id: "j3c", text: "Value and type equality" },
      { id: "j3d", text: "Reference equality" },
    ],
    correctOptionId: "j3c",
    explanation:
      "The strict equality operator (`===`) checks both value and type without performing type coercion. `==` checks value equality with type coercion.",
  },
  {
    id: "j4",
    text: "What is the output of `console.log(2 + '2')`?",
    topic: "core-js",
    level: "junior",
    options: [
      { id: "j4a", text: "4" },
      { id: "j4b", text: '"22"' },
      { id: "j4c", text: "NaN" },
      { id: "j4d", text: '"4"' },
    ],
    correctOptionId: "j4b",
    explanation:
      'When you use the `+` operator with a number and a string, JavaScript coerces the number to a string and performs concatenation. So `2 + \'2\'` becomes `"22"`.',
  },
  {
    id: "j5",
    text: "Which array method adds an element to the end of an array?",
    topic: "core-js",
    level: "junior",
    options: [
      { id: "j5a", text: "push()" },
      { id: "j5b", text: "pop()" },
      { id: "j5c", text: "shift()" },
      { id: "j5d", text: "unshift()" },
    ],
    correctOptionId: "j5a",
    explanation:
      "`push()` adds one or more elements to the end of an array. `pop()` removes from the end, `shift()` removes from the beginning, and `unshift()` adds to the beginning.",
  },
  {
    id: "j6",
    text: "What value does a function return if it has no `return` statement?",
    topic: "functions-closures",
    level: "junior",
    options: [
      { id: "j6a", text: "null" },
      { id: "j6b", text: "0" },
      { id: "j6c", text: "undefined" },
      { id: "j6d", text: '""' },
    ],
    correctOptionId: "j6c",
    explanation:
      "A JavaScript function without a `return` statement (or with an empty `return`) returns `undefined` by default.",
  },
  {
    id: "j7",
    text: "Which of the following is NOT a JavaScript data type?",
    topic: "core-js",
    level: "junior",
    options: [
      { id: "j7a", text: "Symbol" },
      { id: "j7b", text: "BigInt" },
      { id: "j7c", text: "Float" },
      { id: "j7d", text: "Boolean" },
    ],
    correctOptionId: "j7c",
    explanation:
      "JavaScript has 7 primitive types: string, number, bigint, boolean, undefined, symbol, and null. There is no separate `Float` type — all numbers (integers and decimals) are of type `number`.",
  },
  {
    id: "j8",
    text: "What does `Array.isArray([])` return?",
    topic: "core-js",
    level: "junior",
    options: [
      { id: "j8a", text: "true" },
      { id: "j8b", text: "false" },
      { id: "j8c", text: "undefined" },
      { id: "j8d", text: "It throws an error" },
    ],
    correctOptionId: "j8a",
    explanation:
      "`Array.isArray([])` returns `true`. It's the reliable way to check if a value is an array, unlike `typeof` which returns \"object\" for arrays.",
  },
  {
    id: "j9",
    text: "What is the output of `console.log(Boolean(''))`?",
    topic: "core-js",
    level: "junior",
    options: [
      { id: "j9a", text: "true" },
      { id: "j9b", text: "false" },
      { id: "j9c", text: "undefined" },
      { id: "j9d", text: '""' },
    ],
    correctOptionId: "j9b",
    explanation:
      "An empty string is a falsy value in JavaScript. The 6 falsy values are: `false`, `0`, `\"\"`, `null`, `undefined`, and `NaN`.",
  },
  {
    id: "j10",
    text: "Which loop is guaranteed to execute at least once?",
    topic: "core-js",
    level: "junior",
    options: [
      { id: "j10a", text: "for" },
      { id: "j10b", text: "while" },
      { id: "j10c", text: "do...while" },
      { id: "j10d", text: "for...in" },
    ],
    correctOptionId: "j10c",
    explanation:
      "A `do...while` loop always executes its body at least once before checking the condition, because the condition is evaluated after the loop body.",
  },

  // ─── MID ───────────────────────────────────────────────────
  {
    id: "m1",
    text: "What will this code output?\n```js\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}\n```",
    topic: "functions-closures",
    level: "mid",
    options: [
      { id: "m1a", text: "0, 1, 2" },
      { id: "m1b", text: "3, 3, 3" },
      { id: "m1c", text: "undefined, undefined, undefined" },
      { id: "m1d", text: "An error is thrown" },
    ],
    correctOptionId: "m1b",
    explanation:
      "Because `var` is function-scoped, there is only one `i` variable. By the time the `setTimeout` callbacks execute, the loop has finished and `i` is 3. Using `let` instead of `var` would fix this.",
  },
  {
    id: "m2",
    text: "What is a closure in JavaScript?",
    topic: "functions-closures",
    level: "mid",
    options: [
      { id: "m2a", text: "A function that calls itself" },
      {
        id: "m2b",
        text: "A function that retains access to its outer scope's variables even after the outer function has returned",
      },
      { id: "m2c", text: "A function without a return value" },
      { id: "m2d", text: "A function declared with the `const` keyword" },
    ],
    correctOptionId: "m2b",
    explanation:
      "A closure is formed when a function retains access to variables from its enclosing (lexical) scope, even after that scope has finished execution. This is a fundamental JavaScript concept used in callbacks, data privacy, and partial application.",
  },
  {
    id: "m3",
    text: "What does `Promise.all()` do?",
    topic: "async",
    level: "mid",
    options: [
      { id: "m3a", text: "Runs promises sequentially" },
      {
        id: "m3b",
        text: "Resolves when ALL promises resolve; rejects if ANY rejects",
      },
      { id: "m3c", text: "Resolves when the first promise resolves" },
      { id: "m3d", text: "Always resolves, never rejects" },
    ],
    correctOptionId: "m3b",
    explanation:
      "`Promise.all()` takes an iterable of promises and returns a single promise that resolves with an array of results when all promises resolve, or rejects with the reason of the first promise that rejects.",
  },
  {
    id: "m4",
    text: "What is the output of `[...'hello']`?",
    topic: "es6+",
    level: "mid",
    options: [
      { id: "m4a", text: '["hello"]' },
      { id: "m4b", text: '["h", "e", "l", "l", "o"]' },
      { id: "m4c", text: "An error" },
      { id: "m4d", text: '["h-e-l-l-o"]' },
    ],
    correctOptionId: "m4b",
    explanation:
      'The spread operator (`...`) works on any iterable. Strings are iterable, so spreading a string into an array splits it into individual characters: `["h", "e", "l", "l", "o"]`.',
  },
  {
    id: "m5",
    text: "What is the difference between `map()` and `forEach()`?",
    topic: "es6+",
    level: "mid",
    options: [
      { id: "m5a", text: "There is no difference" },
      {
        id: "m5b",
        text: "`map()` returns a new array; `forEach()` returns undefined",
      },
      { id: "m5c", text: "`forEach()` can break early; `map()` cannot" },
      { id: "m5d", text: "`map()` mutates the original array" },
    ],
    correctOptionId: "m5b",
    explanation:
      "`map()` creates and returns a new array with the results of calling a function on every element. `forEach()` executes a function for each element but always returns `undefined`. Neither can be short-circuited with `break`.",
  },
  {
    id: "m6",
    text: "What does `event.stopPropagation()` do?",
    topic: "dom",
    level: "mid",
    options: [
      { id: "m6a", text: "Prevents the default browser behavior" },
      {
        id: "m6b",
        text: "Stops the event from bubbling up to parent elements",
      },
      { id: "m6c", text: "Removes the event listener" },
      { id: "m6d", text: "Cancels the event entirely" },
    ],
    correctOptionId: "m6b",
    explanation:
      "`stopPropagation()` prevents the event from bubbling up the DOM tree, so parent handlers won't be notified. `preventDefault()` prevents the default browser behavior (like form submission).",
  },
  {
    id: "m7",
    text: "What does destructuring in the function parameter `function foo({ a, b }) {}` accomplish?",
    topic: "es6+",
    level: "mid",
    options: [
      { id: "m7a", text: "Creates a copy of the passed object" },
      {
        id: "m7b",
        text: "Extracts properties `a` and `b` from the passed object into local variables",
      },
      { id: "m7c", text: "Makes `a` and `b` required parameters" },
      { id: "m7d", text: "Validates that the object has properties `a` and `b`" },
    ],
    correctOptionId: "m7b",
    explanation:
      "Destructuring in function parameters extracts specific properties from the passed object into local variables. If the properties don't exist, the variables will be `undefined` (unless defaults are provided).",
  },
  {
    id: "m8",
    text: "What is `event delegation`?",
    topic: "dom",
    level: "mid",
    options: [
      {
        id: "m8a",
        text: "Attaching an event listener to a parent element to handle events on its children",
      },
      {
        id: "m8b",
        text: "Delegating event handling to a Web Worker",
      },
      {
        id: "m8c",
        text: "Using `addEventListener` instead of inline handlers",
      },
      { id: "m8d", text: "Passing events between different windows" },
    ],
    correctOptionId: "m8a",
    explanation:
      "Event delegation leverages event bubbling by placing a single event listener on a parent element instead of individual listeners on each child. It's efficient for dynamic content and reduces memory usage.",
  },
  {
    id: "m9",
    text: "What does `async/await` simplify?",
    topic: "async",
    level: "mid",
    options: [
      { id: "m9a", text: "Synchronous code execution" },
      { id: "m9b", text: "Working with Promises in a more readable way" },
      { id: "m9c", text: "Multi-threading in JavaScript" },
      { id: "m9d", text: "Error-free asynchronous code" },
    ],
    correctOptionId: "m9b",
    explanation:
      "`async/await` is syntactic sugar over Promises. An `async` function always returns a Promise, and `await` pauses execution until the Promise resolves, making asynchronous code look and behave like synchronous code.",
  },
  {
    id: "m10",
    text: "What is a template literal in JavaScript?",
    topic: "es6+",
    level: "mid",
    options: [
      { id: "m10a", text: "A string written with single quotes" },
      {
        id: "m10b",
        text: "A string written with backticks that supports embedded expressions",
      },
      { id: "m10c", text: "A pre-compiled string for performance" },
      { id: "m10d", text: "A string that cannot be modified" },
    ],
    correctOptionId: "m10b",
    explanation:
      "Template literals use backticks (`` ` ``) and allow embedded expressions via `${expression}`, multi-line strings, and tagged templates for advanced string processing.",
  },

  // ─── SENIOR ────────────────────────────────────────────────
  {
    id: "s1",
    text: "What is the output?\n```js\nconsole.log([] == ![]);\n```",
    topic: "core-js",
    level: "senior",
    options: [
      { id: "s1a", text: "true" },
      { id: "s1b", text: "false" },
      { id: "s1c", text: "TypeError" },
      { id: "s1d", text: "undefined" },
    ],
    correctOptionId: "s1a",
    explanation:
      "This is `true` due to type coercion. `![]` evaluates to `false` (since arrays are truthy). Then `[] == false` triggers coercion: both sides eventually become `0`, so `0 == 0` is `true`.",
  },
  {
    id: "s2",
    text: "In the event loop, what is the priority order of execution?",
    topic: "async",
    level: "senior",
    options: [
      {
        id: "s2a",
        text: "Call Stack → Macrotask Queue → Microtask Queue",
      },
      {
        id: "s2b",
        text: "Call Stack → Microtask Queue → Macrotask Queue",
      },
      {
        id: "s2c",
        text: "Microtask Queue → Call Stack → Macrotask Queue",
      },
      {
        id: "s2d",
        text: "Macrotask Queue → Microtask Queue → Call Stack",
      },
    ],
    correctOptionId: "s2b",
    explanation:
      "The event loop processes: 1) the call stack until empty, 2) all microtasks (Promises, queueMicrotask, MutationObserver), 3) one macrotask (setTimeout, setInterval, I/O). After each macrotask, microtasks are drained again.",
  },
  {
    id: "s3",
    text: "What will this log?\n```js\nconst obj = { a: 1 };\nconst proto = { b: 2 };\nObject.setPrototypeOf(obj, proto);\nconsole.log(obj.b);\n```",
    topic: "oop-prototypes",
    level: "senior",
    options: [
      { id: "s3a", text: "undefined" },
      { id: "s3b", text: "2" },
      { id: "s3c", text: "null" },
      { id: "s3d", text: "TypeError" },
    ],
    correctOptionId: "s3b",
    explanation:
      "`Object.setPrototypeOf(obj, proto)` sets `proto` as the prototype of `obj`. When accessing `obj.b`, JavaScript doesn't find it on `obj` directly, so it looks up the prototype chain and finds `b: 2` on `proto`.",
  },
  {
    id: "s4",
    text: "What is the Temporal Dead Zone (TDZ)?",
    topic: "es6+",
    level: "senior",
    options: [
      {
        id: "s4a",
        text: "The period between entering a scope and the `let`/`const` declaration being initialized",
      },
      {
        id: "s4b",
        text: "A memory region where garbage collected objects are held",
      },
      {
        id: "s4c",
        text: "The time between a `setTimeout` call and its callback execution",
      },
      {
        id: "s4d",
        text: "A scope where no variables can be accessed",
      },
    ],
    correctOptionId: "s4a",
    explanation:
      "The TDZ is the region from the start of the block scope to the point where the variable is declared. Accessing a `let` or `const` variable in the TDZ throws a `ReferenceError`. Unlike `var`, they are not initialized to `undefined` during hoisting.",
  },
  {
    id: "s5",
    text: "What is the difference between `Object.freeze()` and `Object.seal()`?",
    topic: "oop-prototypes",
    level: "senior",
    options: [
      { id: "s5a", text: "They are identical" },
      {
        id: "s5b",
        text: "`freeze` prevents all changes; `seal` allows modifying existing properties but not adding/removing",
      },
      {
        id: "s5c",
        text: "`seal` prevents all changes; `freeze` allows modifications",
      },
      {
        id: "s5d",
        text: "`freeze` is deep; `seal` is shallow",
      },
    ],
    correctOptionId: "s5b",
    explanation:
      "`Object.freeze()` makes an object completely immutable (no additions, deletions, or modifications). `Object.seal()` prevents adding/deleting properties but allows modifying existing ones. Both are shallow — nested objects are not affected.",
  },
  {
    id: "s6",
    text: "What does `WeakMap` offer over a regular `Map`?",
    topic: "es6+",
    level: "senior",
    options: [
      { id: "s6a", text: "Better performance for all operations" },
      {
        id: "s6b",
        text: "Keys are weakly referenced and can be garbage collected when no other references exist",
      },
      {
        id: "s6c",
        text: "It allows primitive keys",
      },
      {
        id: "s6d",
        text: "It preserves insertion order",
      },
    ],
    correctOptionId: "s6b",
    explanation:
      "`WeakMap` holds weak references to its keys (which must be objects). If there are no other references to the key, it can be garbage collected, preventing memory leaks. Unlike `Map`, `WeakMap` is not iterable and has no `size` property.",
  },
  {
    id: "s7",
    text: "What happens when you call `new` on a constructor function?",
    topic: "oop-prototypes",
    level: "senior",
    options: [
      { id: "s7a", text: "A new object is created with the function as its prototype" },
      {
        id: "s7b",
        text: "A new object is created, `this` is bound to it, and the constructor's prototype is set as the new object's `__proto__`",
      },
      {
        id: "s7c",
        text: "The function is called without any special behavior",
      },
      {
        id: "s7d",
        text: "A deep clone of the function's prototype is returned",
      },
    ],
    correctOptionId: "s7b",
    explanation:
      "The `new` operator: 1) creates a new empty object, 2) sets its `[[Prototype]]` to the constructor's `.prototype`, 3) binds `this` to the new object within the constructor, and 4) returns the object (unless the constructor explicitly returns another object).",
  },
  {
    id: "s8",
    text: "What is the output?\n```js\nPromise.resolve()\n  .then(() => console.log(1))\n  .then(() => console.log(2));\nconsole.log(3);\n```",
    topic: "async",
    level: "senior",
    options: [
      { id: "s8a", text: "1, 2, 3" },
      { id: "s8b", text: "3, 1, 2" },
      { id: "s8c", text: "1, 3, 2" },
      { id: "s8d", text: "3, 2, 1" },
    ],
    correctOptionId: "s8b",
    explanation:
      "Promise `.then()` callbacks are microtasks — they execute after the current synchronous code finishes. So `3` logs first (synchronous), then `1` (first microtask), then `2` (second microtask).",
  },
  {
    id: "s9",
    text: "What is the purpose of `Symbol` in JavaScript?",
    topic: "es6+",
    level: "senior",
    options: [
      { id: "s9a", text: "To create encrypted string values" },
      {
        id: "s9b",
        text: "To create unique, immutable identifiers often used as object property keys",
      },
      { id: "s9c", text: "To define mathematical constants" },
      { id: "s9d", text: "To replace string-based enums" },
    ],
    correctOptionId: "s9b",
    explanation:
      "`Symbol()` creates a unique, immutable primitive value. Symbols are commonly used as property keys to avoid name collisions, to define well-known behaviors (like `Symbol.iterator`), and to create non-enumerable properties.",
  },
  {
    id: "s10",
    text: "What is the output?\n```js\nfunction Foo() {\n  return this;\n}\nconst a = Foo();\nconst b = new Foo();\nconsole.log(a === b);\n```",
    topic: "oop-prototypes",
    level: "senior",
    options: [
      { id: "s10a", text: "true" },
      { id: "s10b", text: "false" },
      { id: "s10c", text: "TypeError" },
      { id: "s10d", text: "undefined" },
    ],
    correctOptionId: "s10b",
    explanation:
      "`Foo()` called without `new` returns `this` which is the global object (or `undefined` in strict mode). `new Foo()` creates a new object and returns it. They are different objects, so `a === b` is `false`.",
  },
];
