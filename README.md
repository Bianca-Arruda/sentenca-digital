# SENTENÇA DIGITAL — REMESSA 6

Remessa 6 continua diretamente a Remessa 5 e consolida o sistema de carreira e acompanhamento do jogador.

## Entregue

- Carreira baseada no avanço da campanha.
- Porcentagem real de conclusão calculada no backend.
- Contagem de casos concluídos e descobertos.
- Total de casos publicados no painel.
- Estado das três métricas da sociedade.
- Variação das métricas após cada decisão.
- Histórico persistido de eventos do jogador.
- Evento de descoberta de caso.
- Evento de decisão registrada.
- Evento de novo caso desbloqueado.
- Eventos de marcos de carreira em 25%, 50%, 75% e 100%.
- Dashboard conectado ao progresso real do jogador.
- Janela de decisão mostra a alteração de cada métrica.
- Progresso é recarregado do backend após uma decisão.

## Carreira

A carreira não funciona como uma nota de acerto. Ela representa somente o avanço da campanha:

- 0–24% — Observador Digital
- 25–49% — Analista Digital
- 50–74% — Juiz Digital
- 75–99% — Conselheiro Digital
- 100% — Sentença Digital

## Eventos

Os eventos ficam persistidos em `PlayerEvent` e são vinculados ao usuário. O dashboard mostra os eventos mais recentes sem depender de dados hardcoded no React.

## Banco de dados

Foi adicionado:

- `PlayerEventType`
- `PlayerEvent`

Execute a migração antes de iniciar a API:

```bash
cd apps/api
npm install
npm run prisma:generate
npm run prisma:migrate -- --name remessa6_career_events
npm run prisma:seed
npm run dev
```

Frontend:

```bash
cd apps/web
npm install
npm run dev
```

## Observação

A Remessa 6 não altera o conceito central do jogo: as métricas representam o estado da sociedade, enquanto a carreira representa apenas o progresso do jogador na campanha. Não existe pontuação de "decisão correta".

## Próxima etapa sugerida

A próxima remessa pode consolidar o mapa mundial com progresso individual, conquistas realmente desbloqueadas por eventos/progresso e o encerramento da campanha, mantendo o fluxo retro do sistema operacional.


## Remessa 8 — Conquistas

Esta remessa transforma o sistema de conquistas em uma funcionalidade persistida e vinculada ao progresso real do jogador.

- `ACHIEVEMENTS.EXE` carrega as conquistas da API.
- O backend informa quais conquistas estão desbloqueadas para o usuário autenticado.
- As conquistas são desbloqueadas automaticamente durante uma decisão concluída.
- O desbloqueio é persistido em `UserAchievement`.
- Um `PlayerEvent` do tipo `ACHIEVEMENT_UNLOCKED` é criado para cada nova conquista.
- Critérios atuais: primeira decisão, 5 casos descobertos, 10 casos concluídos, casos descobertos em 5 países e arquivo completo.
- A tela de conquistas mostra o estado persistido e a data de desbloqueio.

### Banco

Foi adicionado `ACHIEVEMENT_UNLOCKED` ao enum `PlayerEventType`. Execute: `npm run prisma:generate` e depois uma migration, por exemplo `npm run prisma:migrate -- --name remessa8_achievements`.


# REMESSA 9 — DASHBOARD FINAL

Esta remessa adiciona o relatório final da campanha: carreira concluída, estatísticas persistidas, métricas finais, estado da sociedade e encerramento. O relatório é liberado ao atingir 100% dos casos.

## Dados do relatório
- casos concluídos e descobertos
- decisões registradas
- países descobertos
- conquistas desbloqueadas
- Responsabilidade, Adoção da IA e Confiança Pública
- carreira atual e percentual da campanha

## Fluxo de encerramento
DECISÃO FINAL → REAL_CASE.DOC → CAMPANHA CONCLUÍDA → FINAL_REPORT.EXE

Não há uma classificação de decisão correta/incorreta no encerramento. O relatório registra as escolhas e o estado final da sociedade produzido pela campanha.

A Remessa 9 não altera o Prisma Schema, portanto não requer uma nova migration.
