class Timer {
    constructor(timerElement) {
        this.timerElement = timerElement;
        this.timeDisplay = timerElement.querySelector('.time-display');
        this.startBtn = timerElement.querySelector('.start');
        this.stopBtn = timerElement.querySelector('.stop');
        this.resetBtn = timerElement.querySelector('.reset');

        this.initialTime = this.parseInitialTime();
        this.currentTime = { ...this.initialTime };
        this.countdown = null;
        this.isFinished = false;

        this.init();
    }

    parseInitialTime() {
        try {
            const hours = this.parseTimeValue(this.timerElement.getAttribute('data-hours'), 0);
            const minutes = this.parseTimeValue(this.timerElement.getAttribute('data-minutes'), 0);
            const seconds = this.parseTimeValue(this.timerElement.getAttribute('data-seconds'), 0);

            if (hours < 0 || hours > 23) throw new Error('Invalid hours range');
            if (minutes < 0 || minutes > 59) throw new Error('Invalid minutes range');
            if (seconds < 0 || seconds > 59) throw new Error('Invalid seconds range');

            return { hours, minutes, seconds };
        } catch (error) {
            console.error('Error parsing initial time:', error);
            this.showError('Invalid timer configuration');
            return { hours: 0, minutes: 1, seconds: 0 };
        }
    }

    parseTimeValue(value, defaultValue) {
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? defaultValue : parsed;
    }

    formatTime(h, m, s) {
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    updateDisplay() {
        if (!this.timeDisplay) return;

        try {
            const { hours, minutes, seconds } = this.currentTime;
            this.timeDisplay.textContent = this.formatTime(hours, minutes, seconds);

            if (this.isFinished) {
                this.timeDisplay.classList.add('finished');
            } else {
                this.timeDisplay.classList.remove('finished');
            }
        } catch (error) {
            console.error('Error updating display:', error);
            this.showError('Display update failed');
        }
    }

    showError(message) {
        let errorDiv = this.timerElement.querySelector('.error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error';
            this.timerElement.appendChild(errorDiv);
        }
        errorDiv.textContent = message;

        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 3000);
    }

    countdownTick() {
        try {
            const { hours, minutes, seconds } = this.currentTime;

            if (seconds > 0) {
                this.currentTime.seconds--;
            } else if (minutes > 0) {
                this.currentTime.minutes--;
                this.currentTime.seconds = 59;
            } else if (hours > 0) {
                this.currentTime.hours--;
                this.currentTime.minutes = 59;
                this.currentTime.seconds = 59;
            } else {
                this.finish();
                return;
            }

            this.updateDisplay();
        } catch (error) {
            console.error('Error in countdown tick:', error);
            this.stop();
            this.showError('Timer error occurred');
        }
    }

    finish() {
        this.stop();
        this.isFinished = true;
        this.updateDisplay();

        // Optional: Play sound or show notification
        try {
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Timer Finished!', {
                    body: 'Your countdown timer has reached zero.',
                    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%23e74c3c"/></svg>'
                });
            }
        } catch (notificationError) {
            console.warn('Could not show notification:', notificationError);
        }
    }

    start() {
        if (this.countdown) return;

        try {
            this.isFinished = false;
            this.countdown = setInterval(() => this.countdownTick(), 1000);
            this.updateDisplay();
        } catch (error) {
            console.error('Error starting timer:', error);
            this.showError('Failed to start timer');
        }
    }

    stop() {
        if (this.countdown) {
            clearInterval(this.countdown);
            this.countdown = null;
        }
    }

    reset() {
        try {
            this.stop();
            this.currentTime = { ...this.initialTime };
            this.isFinished = false;
            this.updateDisplay();
        } catch (error) {
            console.error('Error resetting timer:', error);
            this.showError('Failed to reset timer');
        }
    }

    init() {
        if (!this.timeDisplay || !this.startBtn || !this.stopBtn || !this.resetBtn) {
            console.error('Timer elements not found');
            this.showError('Timer interface incomplete');
            return;
        }

        try {
            this.startBtn.addEventListener('click', () => this.start());
            this.stopBtn.addEventListener('click', () => this.stop());
            this.resetBtn.addEventListener('click', () => this.reset());

            this.updateDisplay();

            // Request notification permission
            if ('Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission();
            }
        } catch (error) {
            console.error('Error initializing timer:', error);
            this.showError('Timer initialization failed');
        }
    }
}

try {
    document.addEventListener('DOMContentLoaded', () => {
        const timerElements = document.querySelectorAll('.timer');

        if (timerElements.length === 0) {
            console.warn('No timer elements found');
            return;
        }

        timerElements.forEach((timerElement, index) => {
            try {
                new Timer(timerElement);
            } catch (error) {
                console.error(`Error initializing timer ${index + 1}:`, error);
            }
        });
    });
} catch (error) {
    console.error('Failed to initialize timers:', error);
}