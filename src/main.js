import {
  percent,
  createMousePositionListener,
  createWindowSizeListener,
  drawGirl,
  drawMouth,
  floor,
} from "./utils.js";

import { ASSETS, loaded as assetsLoaded } from "./assets.js";

import { PI } from "./constants.js";

/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");

let ahegaoTrigger = 39;

/**
 * https://github.com/rocksdanister/lively/wiki/Web-Guide-IV-:-Interaction#lively-properties
 * @param {string} name
 * @param {string | number} value
 */
const livelyPropertyListener = (name, value) => {
  if (name === "ahegaoTrigger") {
    const float = parseFloat(value);
    ahegaoTrigger = isNaN(float) || !isFinite(float) ? 0 : float;
  }
};

window.livelyPropertyListener = livelyPropertyListener;

/**
 * Wait till all assets are loaded
 */
assetsLoaded.then(main);

function main() {
  const { MousePosition } = createMousePositionListener(() => {
    requestAnimationFrame(draw);
  });

  const { WindowSize } = createWindowSizeListener(() => {
    canvas.width = WindowSize.width;
    canvas.height = WindowSize.height;

    requestAnimationFrame(draw);
  });

  const ctx = canvas.getContext("2d");

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let gradient = ctx.createLinearGradient(
      0,
      canvas.height / 2.8,
      0,
      canvas.height / 2
    );

    gradient.addColorStop(0, "#babfcc");
    gradient.addColorStop(1, "#ffffff");

    ctx.fillStyle = gradient;
    ctx.beginPath();

    const center = canvas.width / 2;

    const ninePercent = percent(9, canvas.height);

    const radius = floor(ninePercent * 0.7);
    const diameter = radius * 2;

    /**
     * @param {number} x
     */
    const drawEyeball = (x) => {
      ctx.arc(
        floor(center + x),
        floor(canvas.height / 2 - ninePercent / 2),
        radius,
        0,
        2 * PI
      );
    };

    drawEyeball(-ninePercent);
    drawEyeball(ninePercent);

    ctx.fill();

    let { x, y } = MousePosition;
    const { left_eye, right_eye } = ASSETS;

    x /= canvas.width;
    y /= canvas.height;

    let open_mount = false;

    if (y * 100 < ahegaoTrigger) {
      open_mount = true;
    }

    if (y === 0) {
      y = 0.5;
    } else if (y < 0.37) {
      y = 0.37;
    } else if (y > 0.75) {
      y = 0.75;
    }

    if (x === 0) {
      x = 0.5;
    } else if (x < 0.23) {
      x = 0.23;
    } else if (x > 0.77) {
      x = 0.77;
    }

    x *= diameter;
    y *= diameter;

    const yOffset = percent(36.5, canvas.height);

    // this is a magical number
    const eighteenAnd675 = percent(18.675, canvas.height);

    ctx.drawImage(
      left_eye,
      center - eighteenAnd675 + x,
      yOffset + y,
      radius,
      radius
    );

    ctx.drawImage(right_eye, center + x, yOffset + y, radius, radius);

    drawGirl(canvas, ctx);

    if (open_mount) {
      drawMouth(canvas, ctx);
    }
  };
}
