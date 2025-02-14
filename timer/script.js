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
const startStopBtn_text = document.getElementById("start-stop-btn-text");

const deleteBtn = document.getElementById("delete-btn");
 
const fontSizeSlider = document.getElementById("font-size-slider");
const stopBgColorPicker = document.getElementById("stop-bg-color");
const countBgColorPicker = document.getElementById("count-bg-color");

// 音声ファイル
const audio1 = new Audio("../sound/0/start.wav");

let running = false;
let elapsedTime = 0;
let keydownHandled = false;
let firsttime=0;

const deleteButton = document.getElementById("delete-btn");
const adjustButtons = document.querySelectorAll(".adjust-btn"); // 時間追加/減少ボタン
const adjustButtonsText = document.querySelectorAll(".adjust-btn-text"); // 時間追加/減少ボタン
const adjustSelects = document.querySelectorAll(".adjust-select-btn"); // 時間指定ボタン

let totalMilliseconds = 0; // タイマーの合計時間（ミリ秒単位）
let interval = null; // カウントダウン用のインターバルID
let selectedFont=0;


  // タイマーの表示を更新

  document.body.style.backgroundColor = stopBgColorPicker.value; 
  document.body.classList.remove("dark-mode"); 
  // 要素の取得
  const shortcutKeyMap = {
    J: "3600000", // +1h
    K: "600000",  // +10min
    L: "60000",   // +1min
  };

  // キーボードショートカットのイベントリスナー
  document.addEventListener("keydown", (event) => {
    if (running) return; // タイマー動作中は無効
    const key = event.key.toUpperCase(); // 大文字に統一
    const adjustment = shortcutKeyMap[key];
    if (adjustment) {
      totalMilliseconds = Math.max(0, totalMilliseconds + parseInt(adjustment, 10));
      updateDisplay();
      if(key=="J")adjustButtons[0].classList.add("active");
      else if(key=="K")adjustButtons[1].classList.add("active");
      else if(key=="L")adjustButtons[2].classList.add("active");
    }
  });
  document.addEventListener("keyup", (event) => {
    if (running) return; // タイマー動作中は無効
    const key = event.key.toUpperCase(); // 大文字に統一
    const adjustment = shortcutKeyMap[key];
    if (adjustment) {
      if(key=="J")adjustButtons[0].classList.remove("active");
      else if(key=="K")adjustButtons[1].classList.remove("active");
      else if(key=="L")adjustButtons[2].classList.remove("active");
    }
  });

  function updateDisplay() {
    // const totalSeconds = Math.floor(totalMilliseconds / 1000);
    const hours = String(Math.floor(totalMilliseconds / 3600000)).padStart(2, "0");
    const minutes = String(Math.floor((totalMilliseconds % 3600000) / 60000)).padStart(2, "0");
    const seconds = String(Math.floor((totalMilliseconds % 60000) / 1000)).padStart(2, "0");
    const tenthsOfMilliseconds = String(Math.floor((totalMilliseconds % 1000) / 10)).padStart(2, "0");

    // document.title = `${String(hours).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`; // タブに時間を表示
    document.title = `${hours}:${minutes}:${seconds}`; // タブに時間を表示

    // deleteボタンの表示・非表示
    if (!running && totalMilliseconds > 0) {
      deleteButton.style.visibility = "visible";
    } else {
      deleteButton.style.visibility = "hidden";
    }
  
    // 「NO COUNT」の状態にする
    if (totalMilliseconds <= 0) {
      startStopBtn_text.textContent = ""; // 時間が0の時に「NO COUNT」に変更
    } else if (running) {
      startStopBtn_text.textContent = "PAUSE";
    } else {
      startStopBtn_text.textContent = "START";
    }
  
    // タイマー動作中の時は、時間追加・減少ボタン、時間指定ボタンを非表示に
    const displayValue = running ? "none" : "block";
    adjustButtonsText.forEach((button) => (button.style.display = displayValue));
    adjustSelects.forEach((button) => (button.style.display = displayValue));
  
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

  
  function startStopTimer() {
    display.classList.remove("move");
    if (running) {
      clearInterval(interval);
      running = false;
      startStopBtn_text.textContent = "START";
      playAudio(audio1);

    } else {
      if (totalMilliseconds <= 0) {

        startStopBtn_text.textContent = ""; // カウントが0の場合は「NO COUNT」表示
        return; // 時間が0の場合はタイマーを開始しない
      }
      document.body.style.backgroundColor = countBgColorPicker.value; // delete時背景色は停止時の色

      running = true;
      startStopBtn_text.textContent = "PAUSE";
      interval = setInterval(() => {
        if (totalMilliseconds > 0) {
          totalMilliseconds -= 10; // 10msずつ減らす
          updateDisplay();
          updateBackgroundColor();


        } else {
          // start_audio.volume=1;
          playAudio(audio1); // 1回目

            playAudio(audio1); // 2回目
            setTimeout(() => {
              playAudio(audio1); // 3回目
            },800); // 2回目と3回目の間の間隔（1000ミリ秒）
          clearInterval(interval);
          running = false;
          startStopBtn_text.textContent = ""; // タイムアップ後、ボタンテキストを非表示
          updateDisplay(); // ボタンの表示を更新
          document.body.style.backgroundColor = stopBgColorPicker.value; // delete時背景色は停止時の色

          updateBackgroundColor();
          // 追加: 時間追加ボタンを表示

          adjustButtonsText.forEach((button) => (button.style.display = "block"));
          adjustSelects.forEach((button) => (button.style.display = "block"));
        }
      }, 10);
    }
    updateDisplay(); // ボタンの表示状態を更新
  }
  // タイマーのリセット
  function resetTimer() {
    display.classList.add("move");
    clearInterval(interval);
    totalMilliseconds = 0;
    running = false;
    updateDisplay(); // ボタンの表示を更新
  }

  // 時間を追加または減算する

  function adjustTime(event) {
    if (running) return; // 動作中は無効
    const adjustment = parseInt(event.target.dataset.time, 10);
    totalMilliseconds = Math.max(0, totalMilliseconds + adjustment);
    updateDisplay();
    
    // 時間を加えた後、startStopTimer()を呼び出してSTARTボタンを表示する
    if (totalMilliseconds > 0) {
      startStopBtn_text.textContent = "START"; // ボタンテキストを更新
    }
  }
  

  // 時間を指定する
  function setTime(event) {
    if (running) return; // 動作中は無効
    const specifiedTime = parseInt(event.target.dataset.time, 10);
    totalMilliseconds = specifiedTime;
    updateDisplay();
    
  }

  // イベントリスナーの登録
  startStopBtn.addEventListener("click", startStopTimer);
  deleteButton.addEventListener("click", resetTimer);
  adjustButtons.forEach((button) => button.addEventListener("click", adjustTime));
  adjustSelects.forEach((button) => button.addEventListener("click", setTime));

  // 初期表示の更新
  updateDisplay();




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

document.addEventListener("keydown", (event) => {
  const key = event.key.toUpperCase(); // 大文字に統一
  
  // タイマーが動作中でない場合、ショートカットを実行
    // Spaceでスタート/ストップ
  if (key === " " || key === "SPACE") {
    // totalMilliseconds > 0のときだけタイマーを開始
    if (totalMilliseconds > 0) {
      startStopTimer(); // スタート/ストップボタンをクリック
      startStopBtn.classList.add("active");

    }
    event.preventDefault(); // デフォルトの動作を防ぐ
  }
  if (!running) {
    // Deleteでリセット
    if (key === "DELETE"||key ==="BACKSPACE") {
      resetTimer(); // リセットボタンをクリック
      event.preventDefault(); // デフォルトの動作を防ぐ
    }
  }
  if (key === "S") {
      toggleSidebar();
  }
});
// document.addEventListener("keydown", (e) => {
//   if (e.code === "Space") {
//     e.preventDefault();

//     if (!keydownHandled) {
//       startStopBtn.click();
//       keydownHandled = true;
//       startStopBtn.classList.add("active");
//     }
//   }
//   if (e.code === "Backspace") {
//     if (!keydownHandled) {
//       deleteBtn.click();
//       keydownHandled = true;
//     }
//   }
//   if (e.code === "KeyS") {
//     if (!keydownHandled) {
//       toggleSidebar();
//       keydownHandled = true;
//     }
//   }
// });

document.addEventListener("keyup", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    startStopBtn.classList.remove("active");
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
// フォントサイズ調整
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



fontSelector.addEventListener("change", function(event) {
  selectedFont = event.target.value; // セレクターで選ばれたフォント
  // updateFont(selectedFont); // フォントを変更
  updateDisplay();
});

