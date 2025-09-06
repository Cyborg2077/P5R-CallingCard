// P5CC core functions
var canvas = document.getElementById("canvas-card");
var card = canvas.getContext("2d");

card.font = '34px KoreanKRSM';

// load base card first
var baseCard = new Image();
baseCard.src = "assets/base.png";
baseCard.onload = redrawBg;

// logo initial size: 250 × 291
var logo = new Image();
logo.src = "assets/logo.png";
logo.onload = redrawBg;

// for the card canvas
function redrawBg() {
    // asset calculations - logo is now always shown
    console.log(`[card::redrawBg] Logo always displayed`);

    // 固定logo设置
    const logoScale = 1;
    const logoOffset = 20;

    let logoWidth = 250 * logoScale;
    let logoHeight = 291 * logoScale;

    card.clearRect(0, 0, canvas.width, canvas.height);
    card.drawImage(baseCard, 0, 0);

    // logo常驻显示在右下角
    const logoX = canvas.width - logoWidth - logoOffset;
    const logoY = canvas.height - logoHeight - logoOffset;
    card.drawImage(logo, logoX, logoY, logoWidth, logoHeight);

}

// for the text canvas
const textInput = document.querySelector('#content > textarea');
const fontSizeInput = document.querySelector('#font-size');
const fontFamilyInput = document.querySelector('#font-family');

const lineCanvas = document.createElement('canvas');

const canvasText = document.getElementById("canvas-text");
const textCtx = canvasText.getContext('2d');
let box;

// テキストと設定の状態を保持
let lastState = {
    text: '',
    fontSize: 0,
    fontFamily: '',
    delay: 0,
    topOffset: 0,
    isMiddle: true
};

// 渲染队列管理
let renderQueue = [];
let isRendering = false;

function redrawText(force = false) {
    // 固定延迟为200ms（逐字渲染更快）
    let charDelay = 200;
    let fontSize = Math.min(Math.abs(+fontSizeInput.value || 120));
    let fontFamily = fontFamilyInput.value || 'sans-serif';
    let value = (textInput.value || 'TAKE YOUR HEART').trim();
    let topOffset = Number(document.querySelector('#text-top').value);

    // 状態が変更されたかチェック
    const currentState = {
        text: value,
        fontSize: fontSize,
        fontFamily: fontFamily,
        delay: charDelay,
        topOffset: topOffset,
        isMiddle: isMiddle
    };

    // forceがtrueの場合は常に再描画、そうでない場合は変更があった時のみ再描画
    if (!force && JSON.stringify(lastState) === JSON.stringify(currentState)) {
        return;
    }

    console.log(`[card::redrawText] ${force ? 'Force redraw' : 'Changes detected'}, redrawing text with character-by-character animation...`);

    // 清除之前的渲染队列
    renderQueue.forEach(timeoutId => clearTimeout(timeoutId));
    renderQueue = [];
    
    // 状態を更新
    lastState = currentState;

    const splitValue = value.split('\n');
    
    // another canvas so making multiline text is easier
    lineCanvas.width = canvasText.width;
    lineCanvas.height = fontSize * 2.2;

    textCtx.clearRect(0, 0, canvasText.width, canvasText.height);

    // they are all offset, just a different name and purpose
    let lineHeight = 0, middleOffset = 0, heightOffset = 0;
    let timer = 0;
    let totalCharCount = 0;

    isRendering = true;
    
    // 计算总字符数（用于判断最后一个字符）
    const totalChars = splitValue.reduce((sum, line) => sum + line.length, 0);
    let renderedCharCount = 0;
    
    splitValue.forEach((line, lineIndex) => {
        // 为每一行计算位置偏移
        const currentLineHeight = lineHeight;
        
        // 逐字渲染每一行
        for (let charIndex = 0; charIndex < line.length; charIndex++) {
            const partialText = line.substring(0, charIndex + 1);
            
            const timeoutId = setTimeout(() => {
                // 检查是否仍在当前渲染会话中
                if (!isRendering) return;
                
                // 创建包含当前字符的文本对象
                box = new BoxText(partialText, {
                    fontSize,
                    fontFamily
                });
        
                if (isMiddle) {
                    middleOffset = ((canvasText.height - fontSize * splitValue.length) / 2.5) - (fontSize / 5 * (splitValue.length));
                }
        
                // 清除整个画布
                 textCtx.clearRect(0, 0, canvasText.width, canvasText.height);
                 
                 // 重新绘制所有行的内容（包括当前正在渲染的行）
                 let currentDrawLineHeight = 0;
                 for (let drawLineIndex = 0; drawLineIndex <= lineIndex; drawLineIndex++) {
                     const drawLine = splitValue[drawLineIndex];
                     let textToDraw = drawLine;
                     
                     // 如果是当前正在渲染的行，只绘制部分文本
                     if (drawLineIndex === lineIndex) {
                         textToDraw = partialText;
                     }
                     
                     if (textToDraw.length > 0) {
                         const drawBox = new BoxText(textToDraw, { fontSize, fontFamily });
                         const drawLineY = currentDrawLineHeight + middleOffset + topOffset;
                         drawBox.draw(lineCanvas);
                         textCtx.drawImage(lineCanvas, 0, drawLineY);
                         currentDrawLineHeight += fontSize * 1.5;
                     }
                 }
        
                lineHeight = Math.floor(heightOffset) || lineHeight;
                console.log(`[card::redrawText] char: '${line[charIndex]}', line: ${lineIndex}, char: ${charIndex}, lineHeight:${lineHeight}`);
                
                renderedCharCount++;
                // 如果是最后一个字符，标记渲染完成
                if (renderedCharCount === totalChars) {
                    isRendering = false;
                    console.log('[card::redrawText] Character-by-character rendering completed');
                }
            }, timer);
            
            renderQueue.push(timeoutId);
            timer += charDelay;
        }
        
        // 更新行高为下一行做准备
         lineHeight += fontSize * 1.5;
    });
}

// 优化的检查逻辑 - 使用事件监听而不是定时器
let checkTimeout;

function scheduleCheck() {
    if (checkTimeout) clearTimeout(checkTimeout);
    checkTimeout = setTimeout(() => {
        const currentText = textInput.value;
        const currentFontSize = fontSizeInput.value;
        const currentFontFamily = fontFamilyInput.value;
        const currentDelay = 1000; // 固定延迟
        const currentTopOffset = document.querySelector('#text-top').value;

        // 只有在值真正改变时才重新渲染
        if (currentText !== lastState.text ||
            Number(currentFontSize) !== lastState.fontSize ||
            currentFontFamily !== lastState.fontFamily ||
            Number(currentDelay) !== lastState.delay ||
            Number(currentTopOffset) !== lastState.topOffset ||
            isMiddle !== lastState.isMiddle) {
            redrawText();
        }
    }, 500); // 减少检查频率
}

// 添加事件监听器以提高响应性
textInput.addEventListener('input', scheduleCheck);
fontSizeInput.addEventListener('change', scheduleCheck);
fontFamilyInput.addEventListener('change', scheduleCheck);
const topOffsetInput = document.querySelector('#text-top');
if (topOffsetInput) topOffsetInput.addEventListener('change', scheduleCheck);

// 页面加载完成后进行初始渲染
window.addEventListener('load', function() {
    // 确保所有资源加载完成后再渲染
    setTimeout(() => {
        console.log('[card::init] Starting initial render...');
        redrawBg();
        redrawText(true); // 强制渲染文本
    }, 100);
});
