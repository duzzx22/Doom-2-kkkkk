// main.ts - Entry point for Iron Epoch: 1899
import './styles/main.css';
import { Engine } from './game/Engine';
import { GameStateManager } from './game/GameStateManager';

// Global game state
let engine: Engine;
let gameStateManager: GameStateManager;

// Initialize the game
async function initGame(): Promise<void> {
  try {
    // Get canvas element
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    if (!canvas) {
      throw new Error('Canvas element not found');
    }

    // Create game engine
    engine = new Engine(canvas);
    await engine.initialize();

    // Create state manager
    gameStateManager = new GameStateManager(engine);

    // Set up menu event listeners
    setupMenuListeners();

    // Hide loading screen and show main menu
    setTimeout(() => {
      const loadingScreen = document.getElementById('loadingScreen');
      const mainMenu = document.getElementById('mainMenu');
      if (loadingScreen) loadingScreen.style.display = 'none';
      if (mainMenu) mainMenu.style.display = 'flex';
    }, 1000);

    // Start game loop
    engine.start();
  } catch (error) {
    console.error('Failed to initialize game:', error);
    alert('Erro ao carregar o jogo. Verifique o console para mais detalhes.');
  }
}

// Menu event listeners
function setupMenuListeners(): void {
  // Main Menu Buttons
  const btnSinglePlayer = document.getElementById('btnSinglePlayer');
  const btnMultiplayer = document.getElementById('btnMultiplayer');
  const btnSettings = document.getElementById('btnSettings');
  const btnQuit = document.getElementById('btnQuit');

  btnSinglePlayer?.addEventListener('click', () => startSinglePlayer());
  btnMultiplayer?.addEventListener('click', () => showMultiplayerMenu());
  btnSettings?.addEventListener('click', () => showSettingsMenu());
  btnQuit?.addEventListener('click', () => window.location.href = 'about:blank');

  // Multiplayer Menu
  const btnConnect = document.getElementById('btnConnect');
  const btnHostGame = document.getElementById('btnHostGame');
  const btnBackMultiplayer = document.getElementById('btnBackMultiplayer');
  const serverInput = document.getElementById('serverInput') as HTMLInputElement;

  btnConnect?.addEventListener('click', () => connectToServer(serverInput?.value || 'localhost:3000'));
  btnHostGame?.addEventListener('click', () => hostGame());
  btnBackMultiplayer?.addEventListener('click', () => showMainMenu());

  // Settings Menu
  const btnBackSettings = document.getElementById('btnBackSettings');
  const volumeSlider = document.getElementById('volumeSlider') as HTMLInputElement;
  const crtToggle = document.getElementById('crtToggle') as HTMLInputElement;
  const gyroToggle = document.getElementById('gyroToggle') as HTMLInputElement;
  const autoFireToggle = document.getElementById('autoFireToggle') as HTMLInputElement;

  btnBackSettings?.addEventListener('click', () => showMainMenu());
  volumeSlider?.addEventListener('change', (e) => {
    const volume = parseInt((e.target as HTMLInputElement).value);
    localStorage.setItem('gameVolume', volume.toString());
  });
  crtToggle?.addEventListener('change', (e) => {
    const enabled = (e.target as HTMLInputElement).checked;
    localStorage.setItem('crtEffect', enabled.toString());
    const canvas = document.getElementById('gameCanvas');
    if (enabled) {
      canvas?.classList.add('crt-effect');
    } else {
      canvas?.classList.remove('crt-effect');
    }
  });
  gyroToggle?.addEventListener('change', (e) => {
    const enabled = (e.target as HTMLInputElement).checked;
    localStorage.setItem('gyroEnabled', enabled.toString());
    if (engine?.inputManager) {
      engine.inputManager.enableGyro = enabled;
    }
  });
  autoFireToggle?.addEventListener('change', (e) => {
    const enabled = (e.target as HTMLInputElement).checked;
    localStorage.setItem('autoFire', enabled.toString());
    if (engine?.player) {
      engine.player.autoFire = enabled;
    }
  });

  // Pause Menu (set up when game starts)
  const btnResume = document.getElementById('btnResume');
  const btnSettingsPause = document.getElementById('btnSettingsPause');
  const btnMainMenuPause = document.getElementById('btnMainMenuPause');

  btnResume?.addEventListener('click', () => resumeGame());
  btnSettingsPause?.addEventListener('click', () => showSettingsMenu());
  btnMainMenuPause?.addEventListener('click', () => returnToMainMenu());

  // Game Over Menu
  const btnRetry = document.getElementById('btnRetry');
  const btnMainMenuGameOver = document.getElementById('btnMainMenuGameOver');

  btnRetry?.addEventListener('click', () => startSinglePlayer());
  btnMainMenuGameOver?.addEventListener('click', () => returnToMainMenu());

  // Load saved settings
  loadSettings();
}

function loadSettings(): void {
  const volume = localStorage.getItem('gameVolume') || '70';
  const crtEffect = localStorage.getItem('crtEffect') === 'true';
  const gyroEnabled = localStorage.getItem('gyroEnabled') === 'true';
  const autoFire = localStorage.getItem('autoFire') === 'true';

  const volumeSlider = document.getElementById('volumeSlider') as HTMLInputElement;
  const crtToggle = document.getElementById('crtToggle') as HTMLInputElement;
  const gyroToggle = document.getElementById('gyroToggle') as HTMLInputElement;
  const autoFireToggle = document.getElementById('autoFireToggle') as HTMLInputElement;

  if (volumeSlider) volumeSlider.value = volume;
  if (crtToggle) crtToggle.checked = crtEffect;
  if (gyroToggle) gyroToggle.checked = gyroEnabled;
  if (autoFireToggle) autoFireToggle.checked = autoFire;
}

function showMainMenu(): void {
  const mainMenu = document.getElementById('mainMenu');
  const multiplayerMenu = document.getElementById('multiplayerMenu');
  const settingsMenu = document.getElementById('settingsMenu');
  const pauseMenu = document.getElementById('pauseMenu');
  const gameOverScreen = document.getElementById('gameOverScreen');
  const hud = document.getElementById('hud');

  mainMenu ? mainMenu.style.display = 'flex' : null;
  multiplayerMenu ? multiplayerMenu.style.display = 'none' : null;
  settingsMenu ? settingsMenu.style.display = 'none' : null;
  pauseMenu ? pauseMenu.style.display = 'none' : null;
  gameOverScreen ? gameOverScreen.style.display = 'none' : null;
  hud ? hud.style.display = 'none' : null;
}

function showMultiplayerMenu(): void {
  const mainMenu = document.getElementById('mainMenu');
  const multiplayerMenu = document.getElementById('multiplayerMenu');
  mainMenu ? mainMenu.style.display = 'none' : null;
  multiplayerMenu ? multiplayerMenu.style.display = 'flex' : null;
}

function showSettingsMenu(): void {
  const settingsMenu = document.getElementById('settingsMenu');
  const mainMenu = document.getElementById('mainMenu');
  const pauseMenu = document.getElementById('pauseMenu');
  
  mainMenu ? mainMenu.style.display = 'none' : null;
  pauseMenu ? pauseMenu.style.display = 'none' : null;
  settingsMenu ? settingsMenu.style.display = 'flex' : null;
}

function startSinglePlayer(): void {
  if (engine && gameStateManager) {
    gameStateManager.startSinglePlayer();
    document.getElementById('mainMenu')!.style.display = 'none';
    document.getElementById('hud')!.style.display = 'block';
  }
}

function connectToServer(serverAddress: string): void {
  if (engine && gameStateManager) {
    gameStateManager.connectToServer(serverAddress);
  }
}

function hostGame(): void {
  if (engine && gameStateManager) {
    gameStateManager.hostGame();
  }
}

function resumeGame(): void {
  const pauseMenu = document.getElementById('pauseMenu');
  const hud = document.getElementById('hud');
  pauseMenu ? pauseMenu.style.display = 'none' : null;
  hud ? hud.style.display = 'block' : null;
  if (engine) engine.paused = false;
}

function returnToMainMenu(): void {
  if (engine) {
    engine.resetGame();
  }
  showMainMenu();
}

// Handle pause key press
document.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'Escape' && engine?.gameActive) {
    const pauseMenu = document.getElementById('pauseMenu');
    const hud = document.getElementById('hud');
    if (engine.paused) {
      resumeGame();
    } else {
      pauseMenu ? pauseMenu.style.display = 'flex' : null;
      hud ? hud.style.display = 'none' : null;
      engine.paused = true;
    }
  }
});

// Handle fullscreen toggle
document.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === 'F' && event.ctrlKey) {
    event.preventDefault();
    const canvas = document.getElementById('gameCanvas');
    if (canvas?.requestFullscreen) {
      canvas.requestFullscreen();
    }
  }
});

// Start the game when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}

// Export for debugging
(window as any).gameEngine = () => engine;
(window as any).gameState = () => gameStateManager;
