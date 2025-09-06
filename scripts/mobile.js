/**
 * 移动设备优化脚本
 * 为移动设备添加滑动导航和其他触摸优化
 */

document.addEventListener('DOMContentLoaded', function() {
    // 检查是否为移动设备
    const isMobile = window.innerWidth <= 767;
    
    if (isMobile) {
        const optionsContainer = document.getElementById('options');
        const tabButtons = document.querySelectorAll('.tab-btn button');
        
        if (optionsContainer) {
            // 添加触摸滑动支持
            let touchStartX = 0;
            let touchEndX = 0;
            
            optionsContainer.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
            }, false);
            
            optionsContainer.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, false);
            
            // 处理滑动导航
            function handleSwipe() {
                const currentTab = document.querySelector('.tab-btn button.active');
                if (!currentTab) return;
                
                const swipeThreshold = 50;
                const swipeDistance = touchEndX - touchStartX;
                
                if (Math.abs(swipeDistance) < swipeThreshold) return;
                
                const currentIndex = Array.from(tabButtons).indexOf(currentTab);
                let newIndex;
                
                if (swipeDistance > 0) {
                    // 向右滑动，显示上一个选项卡
                    newIndex = currentIndex - 1;
                    if (newIndex < 0) newIndex = tabButtons.length - 1;
                } else {
                    // 向左滑动，显示下一个选项卡
                    newIndex = currentIndex + 1;
                    if (newIndex >= tabButtons.length) newIndex = 0;
                }
                
                tabButtons[newIndex].click();
            }
        }
        
        // 优化画布触摸体验
        const cardPreview = document.getElementById('card-preview');
        if (cardPreview) {
            const canvas = cardPreview.querySelector('canvas');
            if (canvas) {
                canvas.addEventListener('touchstart', function() {
                    this.style.transform = 'scale(0.98)';
                }, { passive: true });
                
                canvas.addEventListener('touchend', function() {
                    this.style.transform = 'scale(1)';
                }, { passive: true });
            }
        }
        
        // 优化表单输入体验
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            // 防止iOS自动缩放
            input.addEventListener('focus', function() {
                if (this.type === 'number' || this.tagName === 'TEXTAREA') {
                    // 滚动到视图中
                    setTimeout(() => {
                        this.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 300);
                }
            });
        });
        
        // 添加触摸反馈给按钮
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
                this.style.opacity = '0.8';
            }, { passive: true });
            
            button.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
                this.style.opacity = '1';
            }, { passive: true });
        });
    }
});