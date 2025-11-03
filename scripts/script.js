let isSpinning = false;

function getRandomRotation() {
    // Generate random number of full rotations (2-5 rotations)
    const rotations = 2 + Math.floor(Math.random() * 3);
    // Generate random final position (0-360 degrees)
    const finalAngle = Math.floor(Math.random() * 360);
    return rotations * 360 + finalAngle;
}

function spinWheel() {
    if (isSpinning) return;
    
    const cubes = document.querySelectorAll('.cube');
    const spinButton = document.querySelector('.spin-button');
    spinButton.disabled = true;
    isSpinning = true;

    let completedSpins = 0;

    cubes.forEach((cube, index) => {
        // Add spinning class for rapid rotation
        cube.classList.add('spinning');
        
        // Random spin time between 2 and 4 seconds
        const spinTime = 2000 + Math.random() * 2000;
        
        setTimeout(() => {
            // Remove spinning animation
            cube.classList.remove('spinning');
            
            // Calculate final random rotation
            const rotationX = getRandomRotation();
            const rotationY = getRandomRotation();
            
            // Apply final rotation
            cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
            
            completedSpins++;
            
            if (completedSpins === cubes.length) {
                setTimeout(() => {
                    spinButton.disabled = false;
                    isSpinning = false;
                }, 500);
            }
        }, spinTime);
    });
}