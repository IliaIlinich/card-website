let isSpinning = false;
let animationId = null;

function getRandomSpeed() {
    return Math.random() * 0.5 + 0.5;
}

function getRandomTime() {
    return Math.random() * 4000 + 1000;
}

function animateWheels(wheels) {
    const now = performance.now();
    let anyActive = false;

    wheels.forEach(wheel => {
        if (wheel.isSpinning) {
            const delta = now - wheel.lastTime;
            wheel.angle = (wheel.angle + (360 / wheel.currentDuration) * (delta / 1000)) % 360;
            wheel.style.transform = `rotateX(${wheel.angle}deg)`;
            wheel.lastTime = now;
            anyActive = true;
        } else if (wheel.isSnapping) {
            const elapsed = now - wheel.snapStartTime;
            if (elapsed >= wheel.snapDuration) {
                wheel.angle = wheel.targetAngle;
                wheel.style.transform = `rotateX(${wheel.angle}deg)`;
                wheel.isSnapping = false;
            } else {
                const progress = elapsed / wheel.snapDuration;
                const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                let delta = wheel.targetAngle - wheel.snapStartAngle;
                delta = (((delta + 180) % 360) - 180);
                wheel.angle = (wheel.snapStartAngle + delta * eased) % 360;
                if (wheel.angle > 180) wheel.angle -= 360;
                if (wheel.angle < -180) wheel.angle += 360;
                wheel.style.transform = `rotateX(${wheel.angle}deg)`;
            }
            anyActive = true;
        }
    });

    if (anyActive) {
        animationId = requestAnimationFrame(() => animateWheels(wheels));
    } else {
        isSpinning = false;
    }
}

function startSlowdown(wheels) {
    let stoppingInterval = 1000;

    wheels.forEach(wheel => {
        let currentDuration = wheel.currentDuration;
        const slowdownInterval = setInterval(() => {
            currentDuration += 0.2;
            wheel.currentDuration = currentDuration;

            if (currentDuration >= 3.0) {
                clearInterval(slowdownInterval);
                wheel.isSpinning = false;
                let currentAngle = wheel.angle % 360;
                const targets = [0, 120, 240];
                const diffs = targets.map(t => Math.min(Math.abs(currentAngle - t), 360 - Math.abs(currentAngle - t)));
                const minDiff = Math.min(...diffs);
                const targetIndex = diffs.findIndex(d => d === minDiff);
                wheel.targetAngle = targets[targetIndex];
                wheel.isSnapping = true;
                wheel.snapStartTime = performance.now();
                wheel.snapDuration = 500;
                wheel.snapStartAngle = currentAngle;
            }
        }, stoppingInterval);
    });
}

function spinWheel() {
    if (isSpinning) return;

    isSpinning = true;
    const wheels = document.querySelectorAll('.Wheel');

    wheels.forEach(wheel => {
        wheel.style.animation = 'none';
        wheel.currentDuration = getRandomSpeed();
        wheel.angle = wheel.angle || 0;
        wheel.lastTime = performance.now();
        wheel.isSpinning = true;
        wheel.isSnapping = false;
    });

    animateWheels(wheels);
    setTimeout(() => startSlowdown(wheels), getRandomTime());
}