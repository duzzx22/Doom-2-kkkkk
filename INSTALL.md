# Guia de Instalação - Iron Epoch: 1899

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 16.0.0 ou superior) - [Download](https://nodejs.org/)
- **npm** (geralmente vem com Node.js)
- Um navegador moderno (Chrome, Firefox, Safari, Edge)
- **Git** (opcional, para clonar o repositório)

### Verificar Instalação

\`\`\`bash
node --version  # Deve mostrar v16.0.0+
npm --version   # Deve mostrar 7.0.0+
git --version   # Opcional
\`\`\`

## 📥 Instalação Básica

### 1. Clonar o Repositório

\`\`\`bash
git clone https://github.com/seu-usuario/iron-epoch-1899.git
cd iron-epoch-1899
\`\`\`

Ou baixar como ZIP e extrair.

### 2. Instalar Dependências

\`\`\`bash
npm install
\`\`\`

Isso vai baixar:
- Three.js (engine 3D)
- Socket.io (multiplayer)
- Howler.js (áudio)
- Vite (build tool)
- TypeScript

### 3. Iniciar Servidor de Desenvolvimento

\`\`\`bash
npm run dev
\`\`\`

A página abrirá automaticamente em `http://localhost:5173`

Se não abrir, acesse manualmente no navegador.

## 🎮 Primeiro Jogo

1. Aguarde a tela de "CARREGANDO..." desaparecer
2. Clique em **CAMPAÑA OFFLINE**
3. Use WASD para se mover e mouse para olhar
4. Clique para disparar
5. Esc para pausar

## 🌐 Modo Multiplayer

### Servidor Local (mesma máquina)

**Terminal 1:**
\`\`\`bash
npm run server
# Saída: 🎮 Iron Epoch: 1899 Server running on port 3000
\`\`\`

**Terminal 2:**
\`\`\`bash
npm run dev
\`\`\`

**Para conectar:**
1. No menu, clique **MULTIPLAYER**
2. Digite: `localhost:3000`
3. Clique **CONECTAR**

### Rede Local

Se quiser jogar com alguém na mesma rede:

1. Descubra o IP da máquina servidor:
   - **Windows**: \`ipconfig\` (procure por IPv4)
   - **Mac/Linux**: \`ifconfig\` ou \`hostname -I\`

2. Suponha que o IP seja `192.168.1.100`

3. Outro jogador na mesma rede digita: `192.168.1.100:3000`

## 🏗️ Build para Produção

\`\`\`bash
npm run build
\`\`\`

Isso gera a pasta `/dist` com todos os arquivos otimizados.

Para testar a build:
\`\`\`bash
npm run preview
\`\`\`

## 📱 Executar em Mobile

### Via Navegador (Mais Fácil)

1. Coloque o computador e celular na mesma rede WiFi
2. No computador, descubra seu IP (veja acima)
3. No celular, acesse: `http://SEU_IP:5173`
4. Pronto! O jogo funcionará com controles touch

### Via Aplicativo Android

\`\`\`bash
# Instale Capacitor
npm install -g @capacitor/cli

# Build o jogo
npm run build

# Inicialize Capacitor
npx cap init

# Adicione Android
npx cap add android

# Abra no Android Studio
npx cap open android
\`\`\`

Depois compile e instale o APK.

## 🐛 Resolução de Problemas

### Porta 5173 já em uso
\`\`\`bash
# Mudar porta
npm run dev -- --port 5174
\`\`\`

### Erro ao importar Three.js
\`\`\`bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
\`\`\`

### Jogo não carrega
- Abra Console (F12) e procure por erros
- Verifique se WebGL está habilitado no navegador
- Tente outro navegador

### Servidor multiplayer não conecta
- Verificar firewall (porta 3000 pode estar bloqueada)
- Testar com `localhost:3000` primeiro
- Verificar console do navegador (F12)

## 🎨 Customizar Antes de Jogar

Em `src/styles/main.css`, altere as cores:
\`\`\`css
--color-brass: #seu-cor;
--color-accent: #seu-accent;
\`\`\`

## 📚 Próximos Passos

- Leia [DEVELOPMENT.md](DEVELOPMENT.md) para arquitetura
- Veja [README.md](README.md) para mais features
- Explore o código comentado
- Customize e divirta-se!

## 💬 Suporte

- Issues: GitHub Issues
- Discussões: GitHub Discussions
- Email: dev@ironepoch.dev

---

Happy Gaming! 🎮
