# 🕵️ LIAR HUNTER — Detective Interrogation Game

**Nível:** Intermediário · **Tecnologia:** HTML + CSS + JavaScript (sem instalar nada)

## Como rodar
Abra o arquivo `index.html` no navegador (Chrome/Edge). Pronto. Os 4 arquivos precisam ficar na mesma pasta.

## Etapa 1 — Planning

| Item | Resposta |
|---|---|
| **Nome** | Liar Hunter |
| **Objetivo** | Descobrir qual suspeito está mentindo e provar a mentira |
| **Regras** | 6 casos em 3 níveis · perguntas limitadas · as pistas do *Case File* são sempre verdadeiras · só um suspeito mente · acusar o culpado e apontar a frase mentirosa (no Hard, também a prova) |
| **Pontuação** | Culpado certo +50 · Mentira certa +30 · Prova certa +10 · +1 por pergunta não usada (máx. 10) · culpado errado = 0 |
| **Inglês trabalhado** | Past Simple, Past Continuous, conectivos (*when, while, because, so, but, then…*) e leitura atenta |
| **Ferramenta** | JavaScript (interface web com botões) |

## Níveis
| Nível | Casos | Suspeitos | Perguntas | O que muda |
|---|---|---|---|---|
| 🟢 Easy | School Trophy, Blackwood Necklace | 3 | 8 de 12 | A mentira contradiz um fato do Case File |
| 🟡 Medium | Missing Laptop, Bakery Break-in | 4 | 10 de 16 | Mais informação e mais distrações |
| 🔴 Hard | Night Train Violin, Server Room Breach | 5 | 12 de 25 | A mentira contradiz **outro suspeito** ou exige **juntar dois fatos** · suspeitos "com cara de culpado" que são inocentes · 3ª etapa: apontar a **prova** |

## Estrutura dos arquivos
| Arquivo | O que faz |
|---|---|
| `index.html` | Esqueleto: as 4 telas (menu, casos, interrogatório, resultado) e a janela modal |
| `style.css` | Visual estilo "filme noir", caderno com linhas, cores da Grammar Lens |
| `data.js` | Os 6 casos: história, pistas, suspeitos, perguntas e respostas. A mentira tem `lie: true` e a lista de provas aceitas em `evidence` |
| `script.js` | Lógica: trocar telas, fazer perguntas, caderno, acusação, pontuação, recordes |

## Recursos extras
- **🔍 Grammar Lens** — pinta os verbos: azul = Past Simple, laranja = Past Continuous, roxo = conectivos. Funciona porque as respostas no `data.js` têm marcações como `{ps:went}`, e a função `toHTML()` troca isso por `<span>` com uma expressão regular.
- **🔊 Áudio** — lê a resposta em inglês com a voz do navegador (`speechSynthesis`).
- **Recordes salvos** no navegador (`localStorage`).

## Roteiro da apresentação (Etapa 3)
1. **Proposta (30s):** "Liar Hunter is a detective game. You interrogate suspects in English and find the liar."
2. **Regras:** abra *How to Play* e mostre os níveis, o limite de perguntas e a pontuação.
3. **Demonstração:** jogue um caso Easy rapidinho e depois mostre um Hard, com a 3ª etapa da acusação (*What proves the lie?*).
4. **Inglês no projeto:** ligue a Grammar Lens, explique *was cleaning … when … went* (ação longa interrompida por ação curta), abra o *Grammar Guide*, clique no 🔊.
5. **Código:** mostre que o `data.js` separa os dados da lógica — para criar um caso novo, é só adicionar um objeto no array `CASES` (o `questionLimit` e o `requireEvidence` definem a dificuldade).
