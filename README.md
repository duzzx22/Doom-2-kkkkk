# Iron Epoch: 1899

Um jogo FPS estilo retro ambientado em 1899, misturando steampunk, arquitetura vitoriana e horror gótico. Construído com Three.js, TypeScript e suportando totalmente navegador, desktop e mobile.

![Versão](https://img.shields.io/badge/version-1.0.0-blue)
![Status](https://img.shields.io/badge/status-Development-yellow)
![Licença](https://img.shields.io/badge/license-MIT-green)

## 🎮 Características

- **Jogo Totalmente Funcional**: Campanha offline completa com 5 níveis
- **Cross-Platform**: Web, PC (Electron/Tauri), Mobile (Android/iOS via Capacitor)
- **Otimizado para Performance**: 60+ FPS em dispositivos mid-range
- **Controles Adaptativos**: Teclado/mouse para PC, joysticks virtuais + giroscópio para mobile
- **Arte Retro**: Estética baixa poli com textures procedurais
- **Sistemas Avançados**: IA inimiga, física, colisões, partículas

## 🚀 Requisitos

- Node.js 16+ e npm/yarn
- Navegador moderno com suporte WebGL
- Para mobile: Capacitor CLI (opcional)

## 📦 Instalação

### 1. Clone o repositório
\`\`\`bash
git clone https://github.com/seu-usuario/iron-epoch-1899.git
cd iron-epoch-1899
\`\`\`

### 2. Instale as dependências
\`\`\`bash
npm install
\`\`\`

## 🛠️ Desenvolvimento no VS Code

O projeto inclui tarefas configuradas para facilitar o desenvolvimento no VS Code:

- **Run Dev Server**: Executa o servidor de desenvolvimento
- **Build for Production**: Compila para produção

Para executar, pressione \`Ctrl+Shift+P\` e digite "Tasks: Run Task", então selecione a tarefa desejada.

## 🎮 Como Jogar

### Desenvolvimento

\`\`\`bash
npm run dev
\`\`\`
Em seguida, abra o navegador em \`http://localhost:5173\`

### Produção

\`\`\`bash
npm run build
npx http-server dist
\`\`\`
Em seguida, abra o navegador em \`http://localhost:8080\`

### Controles

**PC (Teclado + Mouse):**
- **W/A/S/D** - Mover-se
- **Espaço** - Pular
- **Ctrl** - Agachar
- **Mouse** - Olhar ao redor
- **Clique Esquerdo** - Disparar
- **Scroll do Mouse** - Trocar arma
- **Esc** - Pausar

**Mobile (Touchscreen):**
- **Joystick Esquerdo** - Movimento
- **Joystick Direito** - Visão
- **Botão Fogo** - Disparar
- **Botão Pulo** - Pular
- **Giroscópio** (opcional) - Visão alternativa

## 📱 Build para Mobile

### Android

\`\`\`bash
# Instale Capacitor
npm install -g @capacitor/cli

# Build frontend
npm run build

# Adicione Android
npx cap add android

# Gere APK
npx cap open android
# (Abra Android Studio e compile)
\`\`\`

### iOS

\`\`\`bash
# Instale Capacitor
npm install -g @capacitor/cli

# Build frontend
npm run build

# Adicione iOS
npx cap add ios

# Abra projeto Xcode
npx cap open ios
# (Compile e envie para App Store)
\`\`\`

## 🔧 Desenvolvimento

### Scripts disponíveis

\`\`\`bash
npm run dev        # Inicia servidor dev com hot-reload
npm run build      # Build de produção
npm run preview    # Preview da build de produção
npm run server     # Inicia servidor multiplayer
npm run dev-full   # Ambos servidor e cliente em paralelo
\`\`\`

## 📊 Estatísticas Técnicas

- **Engine**: Three.js r128
- **Linguagem**: TypeScript 5.3
- **Build Tool**: Vite 5
- **Multiplayer**: Socket.io 4.7
- **Audio**: Howler.js 2.2
- **Tamanho Bundle**: ~500KB (minificado + comprimido)
- **Performance**: 60 FPS em mid-range, 144+ FPS em high-end

## 🎯 Roadmap

- [ ] Mais armas e power-ups
- [ ] Modo Co-op com ondas de inimigos
- [ ] Sistema de progressão/ranking
- [ ] Skins personalizadas para jogadores
- [ ] Mapas adicionais
- [ ] Suporte VR (WebXR)
- [ ] Editor de níveis

---

**Iron Epoch: 1899** - Dispare, Mate, Sobreviva. A Engenharia de Vapor Aguarda.

🎮 Feito com ❤️ em TypeScript/Three.js
