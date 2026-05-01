# Contribuindo para Iron Epoch: 1899

Obrigado por considerar contribuir para Iron Epoch: 1899! Este documento fornece orientações para contribuir ao projeto.

## Código de Conduta

Por favor, note que este projeto é lançado com um [Código de Conduta do Colaborador](CODE_OF_CONDUCT.md). Ao participar deste projeto você concorda em seguir seus termos.

## Como Contribuir

### Relatando Bugs

Antes de criar um relatório de bug, verifique a lista de issues para ver se o problema já foi relatado. Se você encontrar um bug, por favor, crie uma issue e inclua:

- **Use um título claro e descritivo** para a issue
- **Descreva os passos exatos** para reproduzir o problema
- **Fornece exemplos específicos** para demonstrar os passos
- **Descreva o comportamento observado** e **quais eram suas expectativas**
- **Inclua capturas de tela/vídeos** se possível
- **Inclua seu ambiente**: navegador, OS, versão de Node.js

### Sugerindo Enhancemtnts

- **Use um título claro e descritivo** para a sugestão
- **Forneça uma descrição detalhada** da funcionalidade sugerida
- **Liste alguns exemplos** de como isso seria usado
- **Explique por que isso seria útil** para a maioria dos usuários

### Enviando Pull Requests

- Preencha o template fornecido
- Siga os [styleGuides](#style-guides) do projeto
- Documente novos código adequadamente
- Termine todos os arquivos com uma nova linha
- Evite referências a arquivos específicos de plataformas (use paths como `public/assets`)

## Style Guides

### Git Commit Messages

- Use o tempo presente ("Adiciona feature" não "Adicionou feature")
- Use o imperativo ("Move cursor para..." não "Move cursors para...")
- Limite a primeira linha a 72 caracteres ou menos
- Referencie issues e pull requests quando apropriado
- Exemplo:
  ```
  Corrige bug de colisão com inimigos

  Descreve o que foi feito aqui...
  
  Fixes #123
  ```

### TypeScript/JavaScript

- Use 2 espaços para indentação
- Use camelCase para nomes de variáveis e funções
- Use PascalCase para nomes de classes
- Adicione types TypeScript quando aplicável
- Adicione comentários para código complexo
- Exemplo:
  ```typescript
  // Boa
  class PlayerController {
    private moveSpeed: number = 16;
    
    public update(deltaTime: number): void {
      // Atualiza movimento...
    }
  }
  ```

### CSS/SCSS

- Use 2 espaços para indentação
- Use kebab-case para nomes de classes
- Agrupre propriedades relacionadas
- Use variáveis CSS para cores/tamanhos
- Exemplo:
  ```css
  .player-health {
    width: 200px;
    height: 30px;
    background: var(--color-dark-bg);
    border: 2px solid var(--color-brass);
  }
  ```

## Processo de Desenvolvimento

1. **Fork** o repositório
2. **Clone** sua fork local
3. **Crie uma branch** para sua feature (`git checkout -b feature/MinhaFeature`)
4. **Faça seu trabalho** e **commit** suas mudanças
5. **Push** para sua fork
6. **Abra um Pull Request**

### Setup de Desenvolvimento

```bash
# Clone sua fork
git clone https://github.com/seu-usuario/iron-epoch-1899.git
cd iron-epoch-1899

# Instale dependências
npm install

# Crie uma branch
git checkout -b feature/MinhaFeature

# Inicie o servidor dev
npm run dev
```

### Testando Suas Mudanças

- Teste em **desktop** (Chrome, Firefox, Safari)
- Teste em **mobile** (iOS, Android se possível)
- Teste **modo offline** e **modo multiplayer**
- Verifique **performance** (60 FPS)
- Verifique **console** para erros

## Adicionando Nova Feature

Se você está adicionando uma nova feature, por favor:

1. **Atualize** a documentação relevante
2. **Adicione testes** se aplicável
3. **Atualize** o CHANGELOG.md
4. **Atualize** o README.md se necessário

### Exemplo: Adicionar Nova Arma

1. Edite `src/game/Player.ts`
2. Adicione à função `initializeWeapons()`
3. Implemente método de tiro se necessário
4. Atualize `CHANGELOG.md`
5. Abra PR com descrição clara

## Benchmarks & Performance

Antes de submeter PR:

- [ ] Verifi que o FPS continua 60+
- [ ] Teste performance em mobile
- [ ] Não adicione dependências desnecessárias
- [ ] Otimize renderização quando possível
- [ ] Use Object pooling para objetos frequentes

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a licença MIT.

## Perguntas?

Sinta-se à vontade para:
- Abrir uma discussão no GitHub
- Comentar em uma issue
- Enviar um email: dev@ironepoch.dev

---

**Obrigado por contribuir! 🎮**
