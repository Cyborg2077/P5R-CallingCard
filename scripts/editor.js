// editor related switches and option
var showLogo = true, 
    showWtm = true, 
    isMiddle = true, 
    textStroke = false,  // 固定边框为关闭状态
    textStrokeWidth = 6;
    
// delay function
function saveDelay() {
    let delay = Number(document.querySelector('#delay-rate > input[type="number"]').value);
    let date = new Date();
    date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
    let expires = "expires=" + date.toUTCString();
    document.cookie = `delay=${delay};${expires};path=/`;
    console.log(`[editor::saveDelay] delay:${delay}ms OK`);
}

window.onload = function() {
    console.info("[editor::onLoad] Getting cookie value...")
    let delay = document.cookie.replace(/(?:(?:^|.*;\s*)delay\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    if (delay) {
        document.querySelector('input[name="delay-rate"]').value = delay;
    }
    // 显示主设计面板
    const alignmentPanel = document.getElementById('alignment');
    if (alignmentPanel) {
        alignmentPanel.classList.add('active');
    }
}
