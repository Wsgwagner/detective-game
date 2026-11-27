# 🕵️ LIAR HUNTER — Detective Interrogation Game

**Nível:** Intermediário · **Tecnologia:** HTML + CSS + JavaScript (sem instalar nada)

## Como rodar
Abra o arquivo `index.html` no navegador (Chrome/Edge). Pronto. Os 4 arquivos precisam ficar na mesma pasta.

## Etapa 1 — Planning

| Item | Resposta |
|---|---|
| **Nome** | Liar Hunter |
| **Objetivo** | Descobrir qual suspeito está mentindo e provar a mentira |
| **Regras** | 3 suspeitos por caso · 9 perguntas no máximo · as pistas do *Case File* são sempre verdadeiras · acusar o culpado e apontar a frase mentirosa |
| **Pontuação** | Culpado certo +60 · Mentira certa +30 · cada pergunta não usada +1 · culpado errado = 0 |
| **Inglês trabalhado** | Past Simple, Past Continuous, conectivos (*when, while, because, so, but, then…*) e leitura atenta |
| **Ferramenta** | JavaScript (interface web com botões) |

## Estrutura dos arquivos
| Arquivo | O que faz |
|---|---|
| `index.html` | Esqueleto: as 4 telas (menu, casos, interrogatório, resultado) e a janela modal |
| `style.css` | Visual estilo "filme noir", caderno com linhas, cores da Grammar Lens |
| `data.js` | Os 3 casos: história, pistas, suspeitos, perguntas e respostas. A mentira tem `lie: true` |
| `script.js` | Lógica: trocar telas, fazer perguntas, caderno, acusação, pontuação, recordes |

## Recursos extras
- **🔍 Grammar Lens** — pinta os verbos: azul = Past Simple, laranja = Past Continuous, roxo = conectivos. Funciona porque as respostas no `data.js` têm marcações como `{ps:went}`, e a função `toHTML()` troca isso por `<span>` com uma expressão regular.
- **🔊 Áudio** — lê a resposta em inglês com a voz do navegador (`speechSynthesis`).
- **Recordes salvos** no navegador (`localStorage`).

## Gabarito (não mostre na apresentação 😉)
| Caso | Culpado | Mentira | Fato que desmente |
|---|---|---|---|
| 1. Blackwood Necklace | Victor | "I watched the whole game without any interruption" | A luz acabou das 8:20 às 8:50 |
| 2. Missing Laptop | Paul | "I took the elevator" | O elevador estava quebrado o dia todo |
| 3. Bakery Break-in | Mr. Hill | "I was buying vegetables at the street market" | A feira foi cancelada |

## Roteiro da apresentação (Etapa 3)
1. **Proposta (30s):** "Liar Hunter is a detective game. You interrogate suspects in English and find the liar."
2. **Regras:** abra *How to Play* e mostre o limite de 9 perguntas e a pontuação.
3. **Demonstração:** jogue o Caso 1 → pergunte ao Victor "What were you doing when the lights went out?" → mostre a contradição com o fato da luz → acuse → mostre o resultado.
4. **Inglês no projeto:** ligue a Grammar Lens, explique *was cleaning … when … went* (ação longa interrompida por ação curta), abra o *Grammar Guide*, clique no 🔊.
5. **Código:** mostre que o `data.js` separa os dados da lógica — para criar um caso novo, é só adicionar um objeto no array `CASES`.
