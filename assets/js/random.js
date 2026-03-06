(function (global) {
  const UINT32_RANGE = 0x100000000;
  const cryptoObj = global.crypto && typeof global.crypto.getRandomValues === "function"
    ? global.crypto
    : null;

  function fallbackUint32() {
    return Math.floor(Math.random() * UINT32_RANGE) >>> 0;
  }

  function uint32() {
    if (!cryptoObj) return fallbackUint32();
    const buf = new Uint32Array(1);
    cryptoObj.getRandomValues(buf);
    return buf[0] >>> 0;
  }

  function float() {
    return uint32() / UINT32_RANGE;
  }

  function bool() {
    return (uint32() & 1) === 1;
  }

  function index(length) {
    const size = Number(length);
    if (!Number.isFinite(size) || size <= 0) return -1;
    const max = Math.floor(size);
    const limit = UINT32_RANGE - (UINT32_RANGE % max);
    let value = uint32();
    while (value >= limit) value = uint32();
    return value % max;
  }

  function range(minInclusive, maxExclusive) {
    const min = Math.floor(Number(minInclusive) || 0);
    const max = Math.floor(Number(maxExclusive) || 0);
    if (max <= min) return min;
    return min + index(max - min);
  }

  function choice(list) {
    if (!Array.isArray(list) || !list.length) return undefined;
    return list[index(list.length)];
  }

  function shuffle(list) {
    const out = Array.isArray(list) ? list.slice() : [];
    for (let i = out.length - 1; i > 0; i--) {
      const j = index(i + 1);
      const tmp = out[i];
      out[i] = out[j];
      out[j] = tmp;
    }
    return out;
  }

  global.RLTRandom = {
    bool,
    choice,
    float,
    index,
    range,
    shuffle,
    uint32
  };
})(window);
