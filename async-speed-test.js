const frmFloat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
const frmInt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

function siPrefix(amount, enableUpper = true, enableLower = true, enableMinor = false) {
  let prefixes = [];
  const add = (...additionalPrefix) => prefixes = prefixes.concat(additionalPrefix);

  const noPrefix = ["", 0];

  if (enableUpper) add(
    ["Y", 24], ["Z", 21], ["E", 18], ["P", 15], ["T", 12], ["G", 9], ["M", 6], ["k", 3]
  );

  if (enableMinor) add(
    ["h", 2], ["da", 1]
  );

  add(
    noPrefix
  );

  if (enableMinor) add(
    ["d", -1], ["c", -2]
  );

  if (enableLower) add(
    ["m", -3], ["μ", -6], ["n", -9], ["p", -12], ["f", -15], ["a", -18], ["z", -21], ["y", -24]
  );


  let pickedPrefix = noPrefix;

  if (Number.isFinite(amount)) {
    prefixes = prefixes.sort(([ap, ae], [bp, be]) => be - ae);

    for (const prefix of prefixes)
      if (amount >= (10 ** prefix[1])) {
        pickedPrefix = prefix;
        break;
      }
  }

  return frmFloat.format(amount / (10 ** pickedPrefix[1])) + " " + pickedPrefix[0];
}

async function empty(amount) {
  for (let i = 0; i < amount; i++) {

  }
}

async function division(amount) {
  for (let i = 0; i < amount; i++) {
    const t = 1 / i;
  }
}

async function promiseAwaits(amount) {
  for (let i = 0; i < amount; i++) {
    await Promise.resolve();
  }
}

function chooseRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomChar() {
  return chooseRandom(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]);
}

async function randomString(amount) {
  const length = 3;

  for (let i = 0; i < amount; i++) {
    let str = "";
    for (let i = 0; i < length; i++)
      str += randomChar();
  }
}

async function testAll(fncs, maxExp = 8, enableColors = false) {
  const fncNameLength = fncs.map(f => f.name.length).reduce((p, c) => p > c ? p : c, 0);

  for (let e = 2; e <= maxExp; e++) {
    const amount = 10 ** e;

    console.group("%s cycles", frmInt.format(amount));
    for (const fnc of fncs) {
      const start = performance.now();
      await fnc(amount);
      const end = performance.now();

      const duration = (end - start) / 1000;

      const blue = enableColors ? "\x1B[94m" : "";
      const green = enableColors ? "\x1B[92m" : "";
      const reset = enableColors ? "\x1B[0m" : "";

      console.log(
        "%s took %s which results in %s or %s",
        blue + ("[" + fnc.name + "]").padEnd(fncNameLength + 2, " ") + reset,
        green + siPrefix(duration, false) + "s" + reset,
        green + siPrefix(duration / amount) + "s/call" + reset,
        green + siPrefix(amount / duration) + "hz" + reset
      );
    }
    console.groupEnd();
  }
}

testAll(
  [empty, division, promiseAwaits, randomString], 7,
  (typeof process !== "undefined") ? process.stdout.hasColors() : false
).catch(e => {
  console.error(e);
  if (typeof process !== "undefined")
    process.exit(1);
});
