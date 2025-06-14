class BouncingAnimation {
    constructor() {
        this.blocks = [];
        this.directions = [];
        this.colors = [
            '#e74c3c', '#3498db', '#2ecc71', '#f39c12',
            '#9b59b6', '#1abc9c', '#e67e22', '#34495e'
        ];
        this.speed = 2;
        this.isPaused = false;
        this.animationId = null;
        this.blockSize = 50;
        this.minBlocks = 1;
        this.maxBlocks = 20;
        this.lastFrameTime = 0;
        this.frameCount = 0;
        this.fpsUpdateInterval = null;

        this.init();
    }

    init() {
        try {
            this.validateEnvironment();
            this.setupEventListeners();
            this.createInitialBlocks();
            this.startAnimation();
            this.startFPSCounter();
        } catch (error) {
            this.handleError('Initialization failed', error);
        }
    }

    validateEnvironment() {
        if (!document.body) {
            throw new Error('Document body not available');
        }

        if (!window.requestAnimationFrame) {
            throw new Error('requestAnimationFrame not supported');
        }

        const viewport = this.getViewportSize();
        if (viewport.width < this.blockSize || viewport.height < this.blockSize) {
            throw new Error('Viewport too small for animation');
        }
    }

    getViewportSize() {
        const width = window.innerWidth || document.documentElement.clientWidth || 0;
        const height = window.innerHeight || document.documentElement.clientHeight || 0;

        if (width <= 0 || height <= 0) {
            throw new Error('Invalid viewport dimensions');
        }

        return { width, height };
    }

    setupEventListeners() {
        try {
            window.addEventListener('resize', () => this.handleResize());
            window.addEventListener('visibilitychange', () => this.handleVisibilityChange());

            window.addEventListener('beforeunload', () => this.cleanup());
        } catch (error) {
            console.warn('Could not setup all event listeners:', error);
        }
    }

    handleResize() {
        try {
            const viewport = this.getViewportSize();

            this.blocks.forEach((block, index) => {
                if (!block || !block.parentNode) return;

                const rect = block.getBoundingClientRect();
                let x = parseFloat(block.style.left) || 0;
                let y = parseFloat(block.style.top) || 0;

                if (x + this.blockSize > viewport.width) {
                    x = viewport.width - this.blockSize;
                    block.style.left = `${x}px`;
                }

                if (y + this.blockSize > viewport.height) {
                    y = viewport.height - this.blockSize;
                    block.style.top = `${y}px`;
                }
            });
        } catch (error) {
            console.error('Error handling resize:', error);
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.pause();
        } else {
            this.resume();
        }
    }

    createInitialBlocks() {
        const numberOfBlocks = 5;
        for (let i = 0; i < numberOfBlocks; i++) {
            this.addBlock();
        }
    }

    addBlock() {
        try {
            if (this.blocks.length >= this.maxBlocks) {
                console.warn('Maximum number of blocks reached');
                return;
            }

            const viewport = this.getViewportSize();
            const block = this.createBlockElement();
            const position = this.getRandomPosition(viewport);

            block.style.left = `${position.x}px`;
            block.style.top = `${position.y}px`;
            block.style.backgroundColor = this.getRandomColor();

            document.body.appendChild(block);
            this.blocks.push(block);
            this.directions.push(this.getRandomDirection());

            this.updateStats();
        } catch (error) {
            this.handleError('Failed to add block', error);
        }
    }

    removeBlock() {
        try {
            if (this.blocks.length <= this.minBlocks) {
                console.warn('Minimum number of blocks reached');
                return;
            }

            const lastBlock = this.blocks.pop();
            if (lastBlock && lastBlock.parentNode) {
                lastBlock.parentNode.removeChild(lastBlock);
            }
            this.directions.pop();

            this.updateStats();
        } catch (error) {
            this.handleError('Failed to remove block', error);
        }
    }

    createBlockElement() {
        const block = document.createElement('div');
        block.classList.add('block');
        return block;
    }

    getRandomPosition(viewport) {
        const maxX = Math.max(0, viewport.width - this.blockSize);
        const maxY = Math.max(0, viewport.height - this.blockSize);

        return {
            x: Math.floor(Math.random() * maxX),
            y: Math.floor(Math.random() * maxY)
        };
    }

    getRandomDirection() {
        return {
            x: Math.random() > 0.5 ? 1 : -1,
            y: Math.random() > 0.5 ? 1 : -1
        };
    }

    getRandomColor() {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    }

    moveBlocks() {
        if (this.isPaused) {
            this.animationId = requestAnimationFrame(() => this.moveBlocks());
            return;
        }

        try {
            const viewport = this.getViewportSize();

            this.blocks.forEach((block, index) => {
                if (!block || !block.parentNode) return;

                const direction = this.directions[index];
                if (!direction) return;

                let x = parseFloat(block.style.left) || 0;
                let y = parseFloat(block.style.top) || 0;

                // Move block
                x += direction.x * this.speed;
                y += direction.y * this.speed;

                // Bounce off walls with boundary checks
                if (x <= 0) {
                    x = 0;
                    direction.x = Math.abs(direction.x);
                } else if (x + this.blockSize >= viewport.width) {
                    x = viewport.width - this.blockSize;
                    direction.x = -Math.abs(direction.x);
                }

                if (y <= 0) {
                    y = 0;
                    direction.y = Math.abs(direction.y);
                } else if (y + this.blockSize >= viewport.height) {
                    y = viewport.height - this.blockSize;
                    direction.y = -Math.abs(direction.y);
                }

                block.style.left = `${x}px`;
                block.style.top = `${y}px`;
            });

            this.frameCount++;
            this.animationId = requestAnimationFrame(() => this.moveBlocks());

        } catch (error) {
            console.error('Error in animation loop:', error);
            this.pause();
            setTimeout(() => this.resume(), 1000); // Retry after 1 second
        }
    }

    startAnimation() {
        if (!this.animationId) {
            this.moveBlocks();
        }
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    togglePause() {
        this.isPaused = !this.isPaused;
    }

    changeSpeed() {
        this.speed = this.speed >= 5 ? 1 : this.speed + 1;
        this.updateStats();
    }

    startFPSCounter() {
        this.fpsUpdateInterval = setInterval(() => {
            const now = performance.now();
            if (this.lastFrameTime) {
                const fps = Math.round(this.frameCount * 1000 / (now - this.lastFrameTime));
                this.updateFPS(fps);
            }
            this.lastFrameTime = now;
            this.frameCount = 0;
        }, 1000);
    }

    updateStats() {
        try {
            const blockCountEl = document.getElementById('blockCount');
            const speedValueEl = document.getElementById('speedValue');

            if (blockCountEl) blockCountEl.textContent = this.blocks.length;
            if (speedValueEl) speedValueEl.textContent = this.speed;
        } catch (error) {
            console.warn('Could not update stats:', error);
        }
    }

    updateFPS(fps) {
        try {
            const fpsValueEl = document.getElementById('fpsValue');
            if (fpsValueEl) fpsValueEl.textContent = fps;
        } catch (error) {
            console.warn('Could not update FPS:', error);
        }
    }

    handleError(message, error) {
        console.error(message, error);

        try {
            this.showErrorMessage(`${message}: ${error.message}`);
        } catch (displayError) {
            console.error('Could not display error message:', displayError);
        }
    }

    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);

        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }

    cleanup() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }

        if (this.fpsUpdateInterval) {
            clearInterval(this.fpsUpdateInterval);
            this.fpsUpdateInterval = null;
        }

        this.blocks.forEach(block => {
            if (block && block.parentNode) {
                block.parentNode.removeChild(block);
            }
        });

        this.blocks = [];
        this.directions = [];
    }
}

let animation;
try {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            animation = new BouncingAnimation();
        });
    } else {
        animation = new BouncingAnimation();
    }
} catch (error) {
    console.error('Failed to initialize bouncing animation:', error);

    document.body.innerHTML = `
                <div class="error">
                    Failed to initialize animation: ${error.message}<br>
                    Please refresh the page or check your browser compatibility.
                </div>
            `;
}