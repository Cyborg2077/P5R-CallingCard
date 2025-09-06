// 动态时钟功能
class RuntimeClock {
    constructor() {
        this.startTime = new Date('2025-09-06T12:56:13'); // 项目启动时间
        this.currentTime = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
        };
        this.previousTime = { ...this.currentTime };
        this.init();
    }

    init() {
        this.updateTime();
        this.startTimer();
    }

    calculateRuntime() {
        const now = new Date();
        const diff = now - this.startTime;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
    }

    updateTime() {
        this.previousTime = { ...this.currentTime };
        this.currentTime = this.calculateRuntime();
        
        // 更新显示
        this.updateDisplay('days', this.currentTime.days);
        this.updateDisplay('hours', this.currentTime.hours.toString().padStart(2, '0'));
        this.updateDisplay('minutes', this.currentTime.minutes.toString().padStart(2, '0'));
        this.updateDisplay('seconds', this.currentTime.seconds.toString().padStart(2, '0'));
    }

    updateDisplay(unit, newValue) {
        const card = document.querySelector(`[data-unit="${unit}"]`);
        if (!card) return;

        const frontCard = card.querySelector('.card-front');
        
        // 直接更新显示，不使用动画
        frontCard.textContent = newValue;
    }

    startTimer() {
        setInterval(() => {
            this.updateTime();
        }, 1000);
    }

    // 添加一些特殊效果
    addSpecialEffects() {
        // 每分钟添加一个小的闪烁效果
        setInterval(() => {
            const clockContainer = document.querySelector('.clock-container');
            if (clockContainer) {
                clockContainer.style.animation = 'pulse 0.5s ease-in-out';
                setTimeout(() => {
                    clockContainer.style.animation = '';
                }, 500);
            }
        }, 60000);
    }
}

// 添加脉冲动画的CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// 页面加载完成后初始化时钟
document.addEventListener('DOMContentLoaded', () => {
    const clock = new RuntimeClock();
    clock.addSpecialEffects();
    
    console.log('[Clock] Runtime clock initialized');
});

// 导出供其他脚本使用
window.RuntimeClock = RuntimeClock;