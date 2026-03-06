(function (global) {
  const TOP_FACE_ORIENTATION = {
    1: [90, 0, 0],
    2: [-90, 0, 0],
    3: [-90, 90, 0],
    4: [-90, -90, 0],
    5: [0, 0, 0],
    6: [-180, 0, 0]
  };

  function faceTarget(value) {
    return (TOP_FACE_ORIENTATION[value] || TOP_FACE_ORIENTATION[1]).slice();
  }

  global.RLTDiceOrientation = {
    TOP_FACE_ORIENTATION,
    faceTarget
  };
})(window);
