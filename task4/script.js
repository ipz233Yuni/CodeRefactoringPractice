const numberOfBlocks = 5; 
const blocks = [];
const directions = [];

function createRandomBlock() {
    const block = document.createElement('div');
    block.classList.add('block');

    const x = Math.floor(Math.random() * (window.innerWidth - 50));
    const y = Math.floor(Math.random() * (window.innerHeight - 50));
    block.style.left = `${x}px`;
    block.style.top = `${y}px`;

    document.body.appendChild(block);
    blocks.push(block);
    directions.push({
        x: Math.random() > 0.5 ? 1 : -1,
        y: Math.random() > 0.5 ? 1 : -1
    });
}

for (let i = 0; i < numberOfBlocks; i++) {
    createRandomBlock();
}

function moveBlocks() {
    blocks.forEach((block, index) => {
        const direction = directions[index];
        let x = parseFloat(block.style.left);
        let y = parseFloat(block.style.top);

        x += direction.x * 2;
        y += direction.y * 2;

        if (x <= 0 || x + block.offsetWidth >= window.innerWidth) {
            direction.x *= -1; 
        }
        if (y <= 0 || y + block.offsetHeight >= window.innerHeight) {
            direction.y *= -1;
        }

        block.style.left = `${x}px`;
        block.style.top = `${y}px`;
    });

    requestAnimationFrame(moveBlocks);
}

moveBlocks();