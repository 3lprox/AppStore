// --- Detección de Dispositivo ---
const isMobile = () => /Mobi|Android/i.test(navigator.userAgent);
const mobileControls = document.getElementById('mobile-controls');
const kickButton = document.getElementById('kick-btn');
const controlButtons = document.querySelectorAll('.control-btn');

// Mostrar/Ocultar controles al inicio
if (isMobile()) {
    mobileControls.classList.remove('hidden');
    // En móvil, la interacción principal es con los botones táctiles
    console.log("Modo móvil detectado. Controles táctiles activados.");
} else {
    mobileControls.classList.add('hidden');
    // En PC, la interacción principal es con el teclado
    console.log("Modo PC detectado. Controles WASD/X activados.");
}

// -----------------------------------------------------
// --- Lógica del Juego (Simplificada de HaxBall) ---
// -----------------------------------------------------

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const W = canvas.width;
const H = canvas.height;

// Variables de juego
const player = { x: W / 2, y: H / 2, radius: 15, speed: 2.5, color: '#FFEB3B' }; // Amarillo Material
const ball = { x: W / 2, y: H / 2, radius: 8, vx: 0, vy: 0, friction: 0.98, color: '#FFFFFF' };
const keysPressed = {};
const moveVector = { x: 0, y: 0 };
const kickPower = 15;
const maxSpeed = 5;

// --- DIBUJO ---
function draw() {
    // 1. Campo y Límites
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#4CAF50'; // Verde
    ctx.fillRect(0, 0, W, H);
    
    // Línea central
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(W / 2, 0);
    ctx.lineTo(W / 2, H);
    ctx.stroke();

    // 2. Balón
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // 3. Jugador
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fill();
}

// --- ACTUALIZACIÓN DE FÍSICA Y MOVIMIENTO ---
function update() {
    // 1. Mover Jugador
    moveVector.x = 0;
    moveVector.y = 0;

    // Actualizar vector de movimiento basado en las teclas presionadas
    if (keysPressed['a']) moveVector.x -= 1;
    if (keysPressed['d']) moveVector.x += 1;
    if (keysPressed['w']) moveVector.y -= 1;
    if (keysPressed['s']) moveVector.y += 1;
    
    // Normalizar el vector para evitar moverse más rápido en diagonal
    const magnitude = Math.sqrt(moveVector.x * moveVector.x + moveVector.y * moveVector.y);
    if (magnitude > 0) {
        player.x += (moveVector.x / magnitude) * player.speed;
        player.y += (moveVector.y / magnitude) * player.speed;
    }
    
    // 2. Colisión del Jugador con los bordes (limitación)
    player.x = Math.max(player.radius, Math.min(W - player.radius, player.x));
    player.y = Math.max(player.radius, Math.min(H - player.radius, player.y));

    // 3. Mover y Fricción del Balón
    ball.vx *= ball.friction;
    ball.vy *= ball.friction;
    ball.x += ball.vx;
    ball.y += ball.vy;

    // 4. Colisión del Balón con los bordes
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > W) ball.vx *= -1;
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > H) ball.vy *= -1;
    
    ball.x = Math.max(ball.radius, Math.min(W - ball.radius, ball.x));
    ball.y = Math.max(ball.radius, Math.min(H - ball.radius, ball.y));

    // 5. Colisión Jugador-Balón (Patada)
    const dx = ball.x - player.x;
    const dy = ball.y - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = player.radius + ball.radius;

    if (distance < minDistance) {
        // La colisión: empujar la pelota
        const angle = Math.atan2(dy, dx);
        const overlap = minDistance - distance;

        // Mover el jugador ligeramente para evitar que se pegue
        player.x -= (overlap) * Math.cos(angle);
        player.y -= (overlap) * Math.sin(angle);
        
        // Aplicar impulso a la pelota basado en la dirección de la patada
        if (keysPressed['x']) {
            ball.vx = maxSpeed * Math.cos(angle) * 1.5; // Impulso extra
            ball.vy = maxSpeed * Math.sin(angle) * 1.5;
        } else {
            // Empuje básico por el movimiento del jugador
            ball.vx += (moveVector.x / magnitude) * 0.5;
            ball.vy += (moveVector.y / magnitude) * 0.5;
            // Limitar velocidad
            ball.vx = Math.min(Math.max(ball.vx, -maxSpeed), maxSpeed);
            ball.vy = Math.min(Math.max(ball.vy, -maxSpeed), maxSpeed);
        }
    }
}

// --- BUCLE PRINCIPAL DEL JUEGO ---
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// -----------------------------------------------------
// --- Manejo de Entradas (Teclado y Táctil) ---
// -----------------------------------------------------

// --- Teclado (PC) ---
window.addEventListener('keydown', (e) => {
    // Solo manejamos WASD y X
    if (['w', 'a', 's', 'd', 'x'].includes(e.key.toLowerCase())) {
        keysPressed[e.key.toLowerCase()] = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (['w', 'a', 's', 'd', 'x'].includes(e.key.toLowerCase())) {
        keysPressed[e.key.toLowerCase()] = false;
    }
});

// --- Táctil (Móvil) ---
function handleTouchStart(e) {
    const key = e.currentTarget.dataset.key;
    if (key) {
        keysPressed[key] = true;
    }
}

function handleTouchEnd(e) {
    const key = e.currentTarget.dataset.key;
    if (key) {
        keysPressed[key] = false;
    }
}

// Asignar eventos a los botones táctiles
controlButtons.forEach(btn => {
    btn.addEventListener('touchstart', handleTouchStart);
    btn.addEventListener('touchend', handleTouchEnd);
    btn.addEventListener('touchcancel', handleTouchEnd); // Por si el dedo se sale
    
    // También se puede usar el mouse para pruebas en PC
    btn.addEventListener('mousedown', handleTouchStart);
    btn.addEventListener('mouseup', handleTouchEnd);
    btn.addEventListener('mouseout', handleTouchEnd);
});

// 🚀 ¡Iniciar el juego!
gameLoop();
