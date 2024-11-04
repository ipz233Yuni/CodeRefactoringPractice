document.querySelectorAll('.timer').forEach(timer => {
    const timeDisplay = timer.querySelector('.time-display');
    let hours = parseInt(timer.getAttribute('data-hours'));
    let minutes = parseInt(timer.getAttribute('data-minutes'));
    let seconds = parseInt(timer.getAttribute('data-seconds'));
    let initialTime = { hours, minutes, seconds };
    let countdown;

    function formatTime(h, m, s) {
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    function updateDisplay() {
        timeDisplay.textContent = formatTime(hours, minutes, seconds);
    }

    function countdownTick() {
        if (seconds > 0) {
            seconds--;
        } else if (minutes > 0) {
            minutes--;
            seconds = 59;
        } else if (hours > 0) {
            hours--;
            minutes = 59;
            seconds = 59;
        } else {
            clearInterval(countdown);
            countdown = null;
            return;
        }
        updateDisplay();
    }

    timer.querySelector('.start').addEventListener('click', () => {
        if (!countdown) {
            countdown = setInterval(countdownTick, 1000);
        }
    });

    timer.querySelector('.stop').addEventListener('click', () => {
        clearInterval(countdown);
        countdown = null;
    });

    timer.querySelector('.reset').addEventListener('click', () => {
        clearInterval(countdown);
        countdown = null;
        hours = initialTime.hours;
        minutes = initialTime.minutes;
        seconds = initialTime.seconds;
        updateDisplay();
    });

    updateDisplay();
});