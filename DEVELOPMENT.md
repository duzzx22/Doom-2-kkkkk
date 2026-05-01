# Documentação de Desenvolvimento - Iron Epoch: 1899

## 📚 Estrutura do Projeto

### pasta `/src/game/` - Motor principal do jogo

- **Engine.ts**: Class central que gerencia o Three.js renderer, cena e loop do jogo
- **Player.ts**: Controlador do jogador com sistema de armas, movimento e câmera
- **Enemy.ts**: IA de inimigos com estados (Idle, Chase, Attack)
- **InputManager.ts**: Sistema unificado de entrada (teclado, mouse, touch, giroscópio)
- **AudioManager.ts**: Gerenciador de áudio com suporte a efeitos espaciais
- **UIManager.ts**: Gerenciamento de HUD e elementos visuais na tela
- **LevelGenerator.ts**: Geração procedural de níveis com padrões de grade
- **GameStateManager.ts**: Máquina de estado do jogo (Offline, Multiplayer, Paused)

### Pasta `/src/network/` - Multiplayer

- **ClientNetwork.ts**: Cliente Socket.io para sincronização de jogadores e eventos

### Pasta `/src/utils/` - Utilidades

- **MathHelpers.ts**: Funções matemáticas (lerp, clamp, rotações)
- **StorageManager.ts**: Persistência local (pontuações, configurações)

### Pasta `/src/styles/` - Estilo

- **main.css**: Estilos retro, CRT filter, responsividade mobile

### Pasta `/public/` - Recursos estáticos

- **index.html**: Template HTML principal
- **manifest.json**: PWA manifest para instalação no dispositivo

## 🎮 Fluxo do Jogo

1. **Inicialização** (main.ts)
   - Carrega Engine e GameStateManager
   - Mostra tela de carregamento por 1 segundo
   - Exibe menu principal

2. **Menu/Introução**
   - Usuário escolhe: Campanha Offline, Multiplayer, Configurações

3. **Fase de Jogo**
   - Engine inicializa (Three.js, câmera, luzes)
   - LevelGenerator cria nível procedural
   - Player spawna em ponto inicial
   - Inimigos spawnam em pontos designados
   - Game loop começa

4. **Loop Principal** (~60 FPS)
   - Update de entrada (InputManager)
   - Update do jogador (movimento, tiro, dano)
   - Update de inimigos (IA, colisões)
   - Render da cena (Three.js)

5. **Fim de Jogo**
   - Derrota: Mostrar stats e opção de retry
   - Vitória: Passar para próximo nível ou fim de campanha

## 🛠️ Como Adicionar Funcionalidades

### Adicionar Nova Arma

1. Em `Player.ts`, no método `initializeWeapons()`:
\`\`\`typescript
this.weapons.set('Plasma Gun', {
  name: 'Plasma Gun',
  damage: 80,
  fireRate: 0.4,
  ammo: 15,
  maxAmmo: 75,
  reloadTime: 2,
  spread: 0.05
});
\`\`\`

2. Customize o método `fire()` para efeitos especiais

### Adicionar Novo Tipo de Inimigo

1. Em `Enemy.ts`, adicione ao enum `EnemyType`:
\`\`\`typescript
export enum EnemyType {
  Zombie = 'zombie',
  Golem = 'golem',
  Stalker = 'stalker',
  CustomBoss = 'custom_boss'  // NOVO
}
\`\`\`

2. Em `initializeEnemy()`:
\`\`\`typescript
case EnemyType.CustomBoss:
  this.maxHealth = 200;
  this.moveSpeed = 2;
  this.createBossMesh();
  break;
\`\`\`

3. Implemente `createBossMesh()`

### Adicionar Novo Nível

Em `LevelGenerator.ts`, modifique `generateLevel()` para diferentes layouts baseado em `levelNumber`:

\`\`\`typescript
if (levelNumber === 5) {
  // Layout especial para nível 5
  this.generateBossArena(levelData);
}
\`\`\`

## 🐛 Debugging

### Ativar modo debug
- Pressione `Ctrl+Shift+D` durante o jogo
- Exibe FPS, health, ammo no canto superior esquerdo

### Console do navegador (F12)
\`\`\`javascript
// Acessar engine
const engine = gameEngine();

// Acessar estado do jogo
const state = gameState();

// Teleportar jogador
engine.player.position.set(0, 5, 0);

// Dar dano ao jogador
engine.player.takeDamage(50);
\`\`\`

## 🚀 Performance Tips

1. **Reduza número de inimigos** para dispositivos mobile
2. **Use texture atlasing** para minimizar draw calls
3. **Ative LOD (Level of Detail)** para modelos distantes
4. **Optimize raycasting** com spatial partitioning
5. **Use Object pooling** para balas e efeitos

## 📱 Mobile Considerations

- Toque deve funcionar sem delays
- Controles virtuais não devem bloquear gameplay
- Giroscópio ofere sensibilidade alternativa
- Orientação landscape é obrigatória
- Performance: Reduzir resolução de sombras no mobile

## 🌐 Multiplayer

### Eventos Socket.io

- **player-move**: Sincronear posição/rotação
- **player-shot**: Disparar (validado no servidor)
- **damage**: Infligir dano
- **chat**: Mensagens de texto
- **player-joined**: Jogador conectou
- **player-left**: Jogador desconectou

### Server-Side Validation
Sempre validar no servidor:
- Distância entre atirador e alvo
- Presença de inimigos
- Sincronização de saúde

## 📦 Build para Produção

\`\`\`bash
npm run build
# Gera pasta /dist com HTML/JS/CSS minificado
\`\`\`

Para servir:
\`\`\`bash
npx http-server dist/
# Ou copiar para servidor web (Nginx, Apache)
\`\`\`

## 🎨 Customização Avançada

### Modificar Paleta de Cores
Em `main.css`:
\`\`\`css
:root {
  --color-brass: #seu-coral;
  --color-blood-red: #seu-vermelho;
  /* etc */
}
\`\`\`

### Alterar Densidade de Inimigos
Em `Engine.ts`:
\`\`\`typescript
const numEnemies = Math.min(15 + levelNumber * 3, 50); // Aumentar limite
\`\`\`

### Modificar Física do Jogador
Em `Player.ts`:
\`\`\`typescript
private moveSpeed: number = 20; // Aumentar velocidade
private jumpForce: number = 10; // Aumentar pulo
private gravity: number = -35; // Aumentar gravidade
\`\`\`

---

Dúvidas? Abra uma issue no GitHub!
