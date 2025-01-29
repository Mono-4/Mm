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
const start_audio = new Audio("start.wav");
const stop_audio = new Audio("stop.wav");
const delete_audio = new Audio("delete.wav");
const swipe_audio = new Audio("swipe.wav");
const tap_audio = new Audio("tap.wav");

let running = false;
let elapsedTime = 0;
let interval;
let keydownHandled = false;

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
// ディスプレイ更新
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// ストップウォッチのディスプレイ更新
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// ストップウォッチのディスプレイ更新
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
function updateDisplay(time) {
  const totalMilliseconds = Math.floor(time);
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  const tenthsOfMilliseconds = String(Math.floor((totalMilliseconds % 1000) / 10)).padStart(2, "0");

  // タイトルに時間を表示
  document.title = `${hours}:${minutes}:${seconds}:${tenthsOfMilliseconds}`;

  // 各時間部分を画像に変更（1桁ずつ対応）
  timeH.src = `../images/font0/${hours[0]}.png`;
  timeM.src = `../images/font0/${minutes[0]}.png`;
  timeS.src = `../images/font0/${seconds[0]}.png`;
  timeT.src = `../images/font0/${tenthsOfMilliseconds[0]}.png`;

  // 二桁目の数字を対応する画像に設定
  timeH2.src = `../images/font0/${hours[1]}.png`;
  timeM2.src = `../images/font0/${minutes[1]}.png`;
  timeS2.src = `../images/font0/${seconds[1]}.png`;
  timeT2.src = `../images/font0/${tenthsOfMilliseconds[1]}.png`;
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
function toggleSidebar() {
  playAudio(swipe_audio);
  sidebar.classList.toggle("active");
  sidebarShowBtn.classList.toggle("disable");
}

sidebarShowBtn.addEventListener("click", toggleSidebar);
sidebarCloseBtn.addEventListener("click", toggleSidebar);

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
// フォント変更
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝



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
// 数字を画像に置き換える関数
function updateDisplayWithImages(time) {
  const totalMilliseconds = Math.floor(time);
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  const tenthsOfMilliseconds = String(Math.floor((totalMilliseconds % 1000) / 10)).padStart(2, "0");

  // 各部分の要素を画像に変換
  updateTimeWithImage(timeH, hours);
  updateTimeWithImage(timeM, minutes);
  updateTimeWithImage(timeS, seconds);
  updateTimeWithImage(timeT, tenthsOfMilliseconds);
}

// 時間、分、秒、10分秒の表示を画像に変換する関数
function updateTimeWithImage(element, timeString) {
  // まず子要素をクリア
  element.innerHTML = '';

  // 各数字に対応する画像を挿入
  for (let i = 0; i < timeString.length; i++) {
    const digit = timeString[i];
    const img = document.createElement('img');
    img.src = `num${digit}.png`; // num0.png 〜 num9.png を読み込む
    img.alt = digit;
    img.classList.add('digit-image');
    element.appendChild(img);
  }
}

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// フォントサイズ調整
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// fontSizeSlider.addEventListener("input", (e) => {
//   timeH.style.fontSize = `${e.target.value}rem`;
//   timeM.style.fontSize = `${e.target.value}rem`;
//   timeS.style.fontSize = `${e.target.value}rem`;
//   timeT.style.fontSize = `${e.target.value}rem`;
//   dividers.forEach(divider => {
//     divider.style.fontSize = `${e.target.value}rem`;
//   });
// });

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


// 時間の数字に対応する画像を更新する関数
function updateTimeWithImage(element, fontFolder, timeString) {
  // 既存の内容を削除
  element.innerHTML = '';

  // 各数字に対応する画像を挿入
  for (let i = 0; i < timeString.length; i++) {
    const digit = timeString[i];
    const img = document.createElement('img');
    
    // 画像のソースを指定
    img.src = `../images/${fontFolder}/${digit}.png`;  // 選択したフォントフォルダ内の画像を指定
    
    // 画像をエレメントに追加
    element.appendChild(img);
  }
}

// フォントを変更するセレクターの値を取得して表示する関数
function updateFont(fontFolder) {
  const totalMilliseconds = Math.floor(elapsedTime);
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  const tenthsOfMilliseconds = String(Math.floor((totalMilliseconds % 1000) / 10)).padStart(2, "0");

  // タイトルに時間を表示
  document.title = `${hours}:${minutes}:${seconds}:${tenthsOfMilliseconds}`;

  // フォントフォルダに基づいて画像を更新
  document.getElementById("timeH").src = `../images/font${fontFolder}/${hours[0]}.png`;
  document.getElementById("timeM").src = `../images/font${fontFolder}/${minutes[0]}.png`;
  document.getElementById("timeS").src = `../images/font${fontFolder}/${seconds[0]}.png`;
  document.getElementById("timeT").src = `../images/font${fontFolder}/${tenthsOfMilliseconds[0]}.png`;

  document.getElementById("timeH2").src = `../images/font${fontFolder}/${hours[1]}.png`;
  document.getElementById("timeM2").src = `../images/font${fontFolder}/${minutes[1]}.png`;
  document.getElementById("timeS2").src = `../images/font${fontFolder}/${seconds[1]}.png`;
  document.getElementById("timeT2").src = `../images/font${fontFolder}/${tenthsOfMilliseconds[1]}.png`;
}

// セレクターの変更を検知してフォントを変更する
fontSelector.addEventListener("change", function(event) {
  const selectedFont = event.target.value; // セレクターで選ばれたフォント
  updateFont(selectedFont); // フォントを変更
});


