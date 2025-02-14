// ボタン
const timeH = document.getElementById("timeH");
const timeM = document.getElementById("timeM");
const timeS = document.getElementById("timeS");
const timeT = document.getElementById("timeT");
const dividers = document.querySelectorAll('#divider');

// 他要素
const sidebarShowBtn = document.getElementById("sidebar-show-btn");
const sidebarCloseBtn = document.getElementById("sidebar-close-btn");

const sidebar = document.getElementById("sidebar");

const display = document.getElementById("stopwatch-display");
const startStopBtn = document.getElementById("start-stop-btn");
const startStopBtn_text = document.getElementById("start-stop-text");
const deleteBtn = document.getElementById("delete-btn");

const fontSizeSlider = document.getElementById("font-size-slider");
const stopBgColorPicker = document.getElementById("stop-bg-color");
const countBgColorPicker = document.getElementById("count-bg-color");

const fontSelector = document.getElementById('fontSelector');


// 音声ファイル
const start_audio = new Audio("../sound/0/start.wav");
const stop_audio = new Audio("../sound/0/stop.wav");
const delete_audio = new Audio("../sound/0/delete.wav");
const swipe_audio = new Audio("../sound/0/swipe.wav");
const tap_audio = new Audio("../sound/0/tap.wav");

let running = false;
let elapsedTime = 0;
let interval;
let keydownHandled = false;
let selectedFont=0;

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// 初期設定: ストップ状態
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
document.body.style.backgroundColor = stopBgColorPicker.value; // stopとdelete時の背景色
document.body.classList.remove("dark-mode"); // ダークモード無効化

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// ストップウォッチのスタート/ストップ
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
startStopBtn.addEventListener("click", () => {
    display.classList.remove("move");
    playAudio(tap_audio);
    if (running) {
      clearInterval(interval);
      startStopBtn_text.textContent = "START";
    } else {
      const startTime = Date.now() - elapsedTime;
      startStopBtn_text.textContent = "STOP";
      interval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        updateDisplay(elapsedTime);
      }, 10); // 10msごとに更新
    }
    running = !running;

    if(running){
      deleteBtn.classList.remove("visible"); // 停止時にリセットボタンを表示
    }
    else{
      deleteBtn.classList.add("visible"); // 停止時にリセットボタンを表示
    }
    // 文字の黒と白を入れ替え
    updateBackgroundColor();
});

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// リセットボタン
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

deleteBtn.addEventListener("click", () => {
  playAudio(delete_audio);

  clearInterval(interval);
  display.classList.add("move");
  running = false;
  elapsedTime = 0;
  updateDisplay(elapsedTime);
  startStopBtn_text.textContent = "START";
  document.body.style.backgroundColor = stopBgColorPicker.value; // delete時背景色は停止時の色
  deleteBtn.classList.remove("visible"); // リセット後にリセットボタンを隠す
});

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// ストップウォッチのディスプレイ更新
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

function updateDisplay() {
  const totalMilliseconds = Math.floor(elapsedTime);
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  const tenthsOfMilliseconds = String(Math.floor((totalMilliseconds % 1000) / 10)).padStart(2, "0");

  // タイトルに時間を表示
  document.title = `${hours}:${minutes}:${seconds}:${tenthsOfMilliseconds}`;

  // フォントフォルダに基づいて画像を更新
  document.getElementById("timeH").src = `../images/font${selectedFont}/${hours[0]}.png`;
  document.getElementById("timeM").src = `../images/font${selectedFont}/${minutes[0]}.png`;
  document.getElementById("timeS").src = `../images/font${selectedFont}/${seconds[0]}.png`;
  document.getElementById("timeT").src = `../images/font${selectedFont}/${tenthsOfMilliseconds[0]}.png`;

  document.getElementById("timeH2").src = `../images/font${selectedFont}/${hours[1]}.png`;
  document.getElementById("timeM2").src = `../images/font${selectedFont}/${minutes[1]}.png`;
  document.getElementById("timeS2").src = `../images/font${selectedFont}/${seconds[1]}.png`;
  document.getElementById("timeT2").src = `../images/font${selectedFont}/${tenthsOfMilliseconds[1]}.png`;
}


// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// 背景色のリアルタイム変更
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
function updateBackgroundColor() {
  let picker;
  let bgColor;
  if (running) {
    picker = countBgColorPicker;
  } else {
    picker = stopBgColorPicker;
  }
  bgColor = picker.value
  document.body.style.backgroundColor = bgColor;

  const rgbColor = hexToRgb(bgColor);
  const luminance = getLuminance(rgbColor); // 輝度を計算
  if (luminance < 0.5) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
}

stopBgColorPicker.addEventListener("input", () => {
  updateBackgroundColor();
});

countBgColorPicker.addEventListener("input", () => {
  updateBackgroundColor();
});


function hexToRgb(hex) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  return `rgb(${r}, ${g}, ${b})`;
}

// 照度計算
function getLuminance(color) {
  const rgb = color.match(/\d+/g); // RGBの数値を取り出す
  const r = parseInt(rgb[0], 10) / 255;
  const g = parseInt(rgb[1], 10) / 255;
  const b = parseInt(rgb[2], 10) / 255;
  // 輝度の計算（加重平均）
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// サイドバーの表示非表示
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
sidebar.classList.toggle("active");
// function toggleSidebar() {
//   playAudio(swipe_audio);
//   sidebar.classList.toggle("active");
//   sidebarShowBtn.classList.toggle("disable");
// }

// sidebarShowBtn.addEventListener("click", toggleSidebar);
// sidebarCloseBtn.addEventListener("click", toggleSidebar);

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// キー入力でボタン操作
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();

    if (!keydownHandled) {
      startStopBtn.click();
      keydownHandled = true;
      startStopBtn.classList.add("active");
    }
  }
  if (e.code === "Backspace" || e.code === "Delete") {
    if (!keydownHandled) {
      deleteBtn.click();
      keydownHandled = true;
    }
  }
  if (e.code === "KeyS") {
    if (!keydownHandled) {
      toggleSidebar();
      keydownHandled = true;
    }
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    startStopBtn.classList.remove("active");
  }
  if (e.code === "Backspace") {
  }
  if (e.code === "KeyS") {
  }

  keydownHandled = false;
});





// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// サウンド再生
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
function playAudio(audioElement) {
  if (!audioElement.paused) {
    audioElement.pause();
    audioElement.currentTime = 0;
  }
  audioElement.play();
}

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// フォントサイズ変更
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
fontSizeSlider.addEventListener("input", (e) => {
  const newSize = `${e.target.value * 10}px`; // スケールに応じたサイズ
  timeH.style.width = newSize;
  timeH2.style.width = newSize;
  timeM.style.width = newSize;
  timeM2.style.width = newSize;
  timeS.style.width = newSize;
  timeS2.style.width = newSize;
  timeT.style.width = newSize;
  timeT2.style.width = newSize;

  dividers.forEach(divider => {
    divider.style.fontSize = `${e.target.value}rem`;
  });
});

const event = new Event("input", { bubbles: true });
fontSizeSlider.dispatchEvent(event);
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// フォント変更
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

fontSelector.addEventListener("change", function(event) {
  selectedFont = event.target.value; // セレクターで選ばれたフォント
  // updateFont(selectedFont); // フォントを変更
  updateDisplay();
});
