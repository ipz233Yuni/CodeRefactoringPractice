function updateClock() {
    try {
        const clockElement = document.getElementById('clock');
        if (!clockElement) {
            console.error('Clock element not found');
            return;
        }

        const now = new Date();
        if (isNaN(now.getTime())) {
            throw new Error('Invalid date');
        }

        clockElement.textContent = now.toLocaleTimeString();
    } catch (error) {
        console.error('Error updating clock:', error);
        const clockElement = document.getElementById('clock');
        if (clockElement) {
            clockElement.textContent = 'Clock Error';
            clockElement.className = 'error';
        }
    }
}

try {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            updateClock();
            setInterval(updateClock, 1000);
        });
    } else {
        updateClock();
        setInterval(updateClock, 1000);
    }
} catch (error) {
    console.error('Failed to initialize clock:', error);
}