// ============================================================
//  script.js  -  LÓGICA do jogo Liar Hunter
//  (os dados dos casos estão em data.js)
// ============================================================

// ---------- ESTADO DO JOGO (tudo que muda durante a partida) ----------
let state = {
  caseIndex: 0,          // qual caso está sendo jogado (posição no array CASES)
  questionsLeft: 0,      // perguntas restantes
  selected: null,        // ID do suspeito selecionado
  asked: new Set(),      // perguntas já feitas, no formato "suspeito-numero" (ex: "grey-0")
  notebook: [],          // respostas anotadas: [{ suspectId, index }]
};

// ---------- ATALHOS ----------
const $ = (id) => document.getElementById(id);         // atalho: $("x") = document.getElementById("x")
const currentCase = () => CASES[state.caseIndex];      // devolve o caso atual
const findSuspect = (id) => currentCase().suspects.find((s) => s.id === id); // acha suspeito pelo ID

// ---------- TROCAR DE TELA ----------
function showScreen(name) {                            // mostra uma tela e esconde as outras
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active")); // esconde todas
  $("screen-" + name).classList.add("active");         // mostra só a escolhida
  window.scrollTo(0, 0);                               // volta para o topo da página
}

// ---------- GRAMMAR LENS: transforma {ps:went} em <span class="g-ps">went</span> ----------
function toHTML(text) {
  return text.replace(/\{(ps|pc|cn):([^}]+)\}/g, '<span class="g-$1">$2</span>'); // expressão regular troca as marcações
}
function toPlain(text) {                               // tira as marcações (para o áudio e textos simples)
  return text.replace(/\{(ps|pc|cn):([^}]+)\}/g, "$2");
}

// ---------- ÁUDIO: lê o texto em inglês com a voz do navegador ----------
function speak(text) {
  if (!("speechSynthesis" in window)) return;          // se o navegador não suporta, não faz nada
  speechSynthesis.cancel();                            // para qualquer fala anterior
  const voice = new SpeechSynthesisUtterance(toPlain(text)); // cria a fala com o texto limpo
  voice.lang = "en-US";                                // sotaque americano
  voice.rate = 0.9;                                    // um pouco mais devagar para treinar o ouvido
  speechSynthesis.speak(voice);                        // fala!
}

// ---------- SALVAR RECORDES (localStorage) ----------
function loadBest() {                                  // lê os recordes salvos no navegador
  try { return JSON.parse(localStorage.getItem("liarHunterBest")) || {}; } // converte texto -> objeto
  catch (e) { return {}; }                             // se der erro, começa vazio
}
function saveBest(caseId, score) {                     // salva o recorde se for maior que o anterior
  const best = loadBest();
  if (!best[caseId] || score > best[caseId]) best[caseId] = score; // só substitui se melhorou
  try { localStorage.setItem("liarHunterBest", JSON.stringify(best)); } catch (e) {} // objeto -> texto
}

// ---------- MENU ----------
function renderMenuTotal() {                           // mostra a soma dos recordes no menu
  const best = loadBest();
  const total = Object.values(best).reduce((sum, n) => sum + n, 0); // soma todos os valores
  $("menu-total").textContent = total ? `🏆 Total best score: ${total} / ${CASES.length * 100}` : "";
}

function renderCaseList() {                            // cria os cards de casos na tela de escolha
  const best = loadBest();
  $("case-list").innerHTML = "";                       // limpa a lista
  CASES.forEach((c, i) => {                            // para cada caso...
    const card = document.createElement("div");        // cria uma <div>
    card.className = "case-card";
    card.innerHTML = `
      <div class="level">Case ${i + 1} · ${c.level}</div>
      <h3>${c.title}</h3>
      <div>${c.suspects.map((s) => s.avatar).join(" ")}</div>
      <div class="best">${best[c.id] !== undefined ? "🏆 Best: " + best[c.id] + " pts" : "🔒 Not solved yet"}</div>`;
    card.onclick = () => startCase(i);                 // ao clicar, começa esse caso
    $("case-list").appendChild(card);                  // coloca o card na tela
  });
}

// ---------- COMEÇAR UM CASO ----------
function startCase(index) {
  state = {                                            // reinicia o estado
    caseIndex: index,
    questionsLeft: QUESTION_LIMIT,
    selected: null,
    asked: new Set(),
    notebook: [],
  };
  const c = currentCase();
  $("case-title").textContent = `Case ${index + 1}: ${c.title}`; // título
  $("case-intro").textContent = c.intro;               // história
  $("clue-list").innerHTML = c.clues.map((cl) => `<li>${cl.text}</li>`).join(""); // pistas
  $("interrogation").innerHTML = '<p class="placeholder">Click on a suspect to start the interrogation.</p>';
  renderSuspects();                                    // desenha os suspeitos
  renderNotebook();                                    // caderno vazio
  updateCounter();                                     // contador de perguntas
  showScreen("game");                                  // mostra a tela do jogo
}

function renderSuspects() {                            // desenha os cards dos suspeitos
  $("suspect-list").innerHTML = "";
  currentCase().suspects.forEach((s) => {
    const div = document.createElement("div");
    div.className = "suspect" + (state.selected === s.id ? " selected" : ""); // destaca o selecionado
    div.innerHTML = `<div class="avatar">${s.avatar}</div><div class="name">${s.name}</div><div class="role">${s.role}</div>`;
    div.onclick = () => selectSuspect(s.id);           // ao clicar, seleciona o suspeito
    $("suspect-list").appendChild(div);
  });
}

function selectSuspect(id) {                           // escolhe um suspeito para interrogar
  state.selected = id;
  renderSuspects();                                    // atualiza o destaque
  renderQuestions();                                   // mostra as perguntas dele
}

function renderQuestions(lastIndex = null) {           // mostra as perguntas e a última resposta
  const s = findSuspect(state.selected);
  const box = $("interrogation");
  box.innerHTML = `<h4>Ask ${s.name} a question:</h4>`;
  s.questions.forEach((item, i) => {                   // um botão para cada pergunta
    const key = `${s.id}-${i}`;                        // chave única da pergunta
    const btn = document.createElement("button");
    btn.className = "btn question-btn" + (state.asked.has(key) ? " asked" : ""); // risca se já perguntou
    btn.textContent = "🗨️ " + item.q;
    btn.disabled = state.asked.has(key) || state.questionsLeft === 0; // desativa se já perguntou ou acabou
    btn.onclick = () => ask(s.id, i);                  // ao clicar, faz a pergunta
    box.appendChild(btn);
  });
  if (lastIndex !== null) {                            // se acabou de perguntar, mostra o diálogo
    const item = s.questions[lastIndex];
    const dialog = document.createElement("div");
    dialog.className = "dialog";
    dialog.innerHTML = `
      <div class="bubble you">🕵️ <b>You:</b> ${item.q}</div>
      <div class="bubble them">${s.avatar} <b>${s.name}:</b> "${toHTML(item.a)}"
        <button class="speak" title="Listen">🔊</button></div>`;
    dialog.querySelector(".speak").onclick = () => speak(item.a); // botão de ouvir a resposta
    box.appendChild(dialog);
  }
  if (state.questionsLeft === 0) {                     // acabaram as perguntas
    box.insertAdjacentHTML("beforeend", '<p class="bad"><b>No more questions! Time to ACCUSE someone.</b></p>');
  }
}

// ---------- FAZER UMA PERGUNTA ----------
function ask(suspectId, index) {
  const key = `${suspectId}-${index}`;
  if (state.asked.has(key) || state.questionsLeft <= 0) return; // proteção: não pergunta duas vezes
  state.asked.add(key);                                // marca como perguntada
  state.questionsLeft--;                               // gasta uma pergunta
  state.notebook.push({ suspectId, index });           // anota no caderno
  updateCounter();
  renderNotebook();
  renderQuestions(index);                              // atualiza botões e mostra a resposta
}

function updateCounter() {                             // atualiza o número de perguntas restantes
  $("questions-left").textContent = state.questionsLeft;
}

function renderNotebook() {                            // escreve as respostas no caderno
  if (state.notebook.length === 0) {
    $("notebook").innerHTML = "<li><i>Empty... ask some questions!</i></li>";
    return;
  }
  $("notebook").innerHTML = state.notebook.map((entry) => {
    const s = findSuspect(entry.suspectId);
    return `<li><span class="who">${s.name}:</span> ${toHTML(s.questions[entry.index].a)}</li>`;
  }).join("");
}

// ---------- MODAL (janela reutilizável) ----------
function openModal(html) { $("modal-content").innerHTML = html; $("modal").classList.remove("hidden"); }
function closeModal() { $("modal").classList.add("hidden"); }

function showHowTo() {                                 // instruções em inglês
  openModal(`
    <h2>📖 How to Play</h2>
    <p><b>You are a detective.</b> In each case, a crime happened and three people are suspects. <b>One of them is lying.</b></p>
    <ol>
      <li>Read the <b>Case File</b>. The <b>facts</b> are always true.</li>
      <li>Click on a <b>suspect</b> and choose a <b>question</b>. You have only <b>${QUESTION_LIMIT} questions</b> per case!</li>
      <li>Every answer goes to your <b>Notebook</b>. Read it carefully.</li>
      <li>Find the <b>contradiction</b>: a sentence that does not match the facts.</li>
      <li>Click <b>⚖️ Accuse</b>, choose the guilty person and point to the <b>lie</b>.</li>
    </ol>
    <h3>Scoring</h3>
    <p>✅ Right suspect: <b>+60</b> &nbsp; 🎯 Right lie: <b>+30</b> &nbsp; ⏱️ Each unused question: <b>+1</b></p>
    <p>❌ Wrong suspect: <b>0 points</b> and the culprit escapes!</p>
    <p>💡 Tip: turn on the <b>🔍 Grammar Lens</b> to see the verbs and connectives in colors. Click <b>🔊</b> to listen to the answers.</p>`);
}

function showGrammar() {                               // guia de gramática em inglês
  openModal(`
    <h2>✏️ Grammar Guide</h2>
    <div class="legend"><span class="ps">■ Past Simple</span><span class="pc">■ Past Continuous</span><span class="cn">■ Connectives</span></div>
    <h3 style="color:var(--ps)">Past Simple</h3>
    <p>A <b>finished action</b> in the past. Regular verbs end in <b>-ed</b>; irregular verbs change.</p>
    <div class="example">I <b>polished</b> the silver. · She <b>went</b> upstairs. · I <b>didn't see</b> his face.</div>
    <h3 style="color:var(--pc)">Past Continuous</h3>
    <p>An action <b>in progress</b> at a moment in the past. Form: <b>was/were + verb-ing</b>.</p>
    <div class="example">At 8:30, I <b>was reading</b> a novel. · They <b>were talking</b>.</div>
    <h3>Together: Past Continuous + WHEN + Past Simple</h3>
    <p>The long action is interrupted by a short action.</p>
    <div class="example">I <b>was cleaning</b> a spoon <i>when</i> the lights <b>went</b> off.</div>
    <div class="example"><i>While</i> I <b>was riding</b> my bike, I <b>saw</b> a man.</div>
    <h3 style="color:var(--cn)">Connectives</h3>
    <p>Words that connect ideas and show <b>time</b>, <b>cause</b> or <b>contrast</b>:</p>
    <div class="example"><b>Time:</b> when, while, before, after that, then, later</div>
    <div class="example"><b>Cause / result:</b> because, so</div>
    <div class="example"><b>Contrast:</b> but, unfortunately</div>
    <p>🕵️ <b>Detective tip:</b> liars often say "I <b>was</b> doing X" — check if X was really possible with the facts!</p>`);
}

// ---------- ACUSAÇÃO (em 2 passos dentro do modal) ----------
let accusation = { suspectId: null, lieKey: null };    // escolha temporária do jogador

function openAccuse() {                                // passo 1: escolher o suspeito
  accusation = { suspectId: null, lieKey: null };
  const buttons = currentCase().suspects.map((s) =>
    `<button class="btn choice" data-suspect="${s.id}">${s.avatar} ${s.name} — ${s.role}</button>`).join("");
  openModal(`<h2>⚖️ Who is guilty?</h2><p>Step 1 of 2: choose the person who is lying.</p>${buttons}`);
  document.querySelectorAll("[data-suspect]").forEach((b) => {
    b.onclick = () => { accusation.suspectId = b.dataset.suspect; chooseLie(); }; // vai para o passo 2
  });
}

function chooseLie() {                                 // passo 2: apontar a frase mentirosa
  const s = findSuspect(accusation.suspectId);
  const entries = state.notebook.filter((e) => e.suspectId === s.id); // só as respostas desse suspeito
  let html = `<h2>${s.avatar} ${s.name}</h2><p>Step 2 of 2: which statement is a <b>lie</b>?</p>`;
  if (entries.length === 0) {
    html += `<p class="hint">You didn't ask ${s.name} any questions... You can't prove the lie!</p>`;
  }
  entries.forEach((e) => {                             // um botão para cada frase anotada
    html += `<button class="btn choice" data-lie="${e.suspectId}-${e.index}">"${toPlain(s.questions[e.index].a)}"</button>`;
  });
  html += `<button class="btn choice" data-lie="none">🤷 I can't point to the lie</button>
           <div class="row" style="margin-top:14px">
             <button class="btn" id="btn-back-accuse">⬅ Back</button>
             <button class="btn danger" id="btn-confirm" disabled>⚖️ Confirm Accusation</button>
           </div>`;
  openModal(html);
  document.querySelectorAll("[data-lie]").forEach((b) => {
    b.onclick = () => {                                // marca a frase escolhida
      document.querySelectorAll("[data-lie]").forEach((x) => x.classList.remove("selected"));
      b.classList.add("selected");
      accusation.lieKey = b.dataset.lie;
      $("btn-confirm").disabled = false;               // libera o botão de confirmar
    };
  });
  $("btn-back-accuse").onclick = openAccuse;           // volta ao passo 1
  $("btn-confirm").onclick = finishCase;               // confirma e vai para o resultado
}

// ---------- RESULTADO ----------
function finishCase() {
  closeModal();
  if ("speechSynthesis" in window) speechSynthesis.cancel(); // para o áudio se estiver falando
  const c = currentCase();
  const culprit = findSuspect(c.culprit);
  const lieIndex = culprit.questions.findIndex((q) => q.lie); // posição da pergunta com a mentira
  const lie = culprit.questions[lieIndex];
  const clue = c.clues.find((cl) => cl.id === lie.contradicts); // pista que desmente a mentira
  const rightSuspect = accusation.suspectId === c.culprit;      // acertou o culpado?
  const rightLie = accusation.lieKey === `${c.culprit}-${lieIndex}`; // acertou a frase?

  let score = 0;                                       // calcula a pontuação
  const rows = [];                                     // linhas da tabela de pontos
  if (rightSuspect) {
    score += 60; rows.push(["✅ Right suspect", "+60"]);
    if (rightLie) { score += 30; rows.push(["🎯 Right lie", "+30"]); }
    else rows.push(["🎯 Right lie", "+0"]);
    score += state.questionsLeft; rows.push([`⏱️ Unused questions (${state.questionsLeft})`, "+" + state.questionsLeft]);
  } else {
    rows.push(["❌ Wrong suspect", "0"]);
  }
  rows.push(["TOTAL", score]);
  saveBest(c.id, score);                               // salva o recorde

  const stars = rightSuspect && rightLie ? 3 : rightSuspect ? 2 : 0; // estrelas
  $("result-stars").textContent = "★".repeat(stars) + "☆".repeat(3 - stars);
  $("result-title").innerHTML = rightSuspect
    ? '<span class="good">🔒 Case Closed!</span>'
    : '<span class="bad">💨 Wrong Person! The culprit escaped...</span>';
  $("result-text").innerHTML = `
    The culprit was <b>${culprit.avatar} ${culprit.name}</b> (${culprit.role}).<br><br>
    <b>The lie:</b> "${toPlain(lie.a)}"<br>
    <b>The fact:</b> 📌 ${clue.text}<br><br>
    ${rightSuspect && !rightLie ? "You found the culprit, but you didn't point to the right lie. A good detective needs proof!" : ""}`;
  $("score-table").innerHTML = rows.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join("");
  $("result-rank").textContent = rank(score);
  $("btn-next").style.display = state.caseIndex < CASES.length - 1 ? "" : "none"; // esconde "Next" no último caso
  showScreen("result");
}

function rank(score) {                                 // classificação pelo número de pontos
  if (score >= 95) return "🏅 Rank: Master Detective";
  if (score >= 85) return "🥈 Rank: Senior Detective";
  if (score >= 60) return "🥉 Rank: Junior Detective";
  return "📎 Rank: Trainee — try again!";
}

// ---------- LIGAR OS BOTÕES (eventos) ----------
$("btn-play").onclick = () => { renderCaseList(); showScreen("cases"); }; // Play -> lista de casos
$("btn-howto").onclick = showHowTo;
$("btn-grammar").onclick = showGrammar;
$("btn-grammar-2").onclick = showGrammar;
$("btn-accuse").onclick = openAccuse;
$("modal-close").onclick = closeModal;
$("modal").onclick = (e) => { if (e.target.id === "modal") closeModal(); }; // clicar fora fecha o modal
$("btn-retry").onclick = () => startCase(state.caseIndex);                  // joga o mesmo caso de novo
$("btn-next").onclick = () => startCase(state.caseIndex + 1);               // próximo caso
$("lens-toggle").onchange = (e) => document.body.classList.toggle("lens-on", e.target.checked); // liga/desliga cores
document.querySelectorAll("[data-go]").forEach((b) => {                     // botões "Back" / "All Cases"
  b.onclick = () => {
    if (b.dataset.go === "cases") renderCaseList();
    if (b.dataset.go === "menu") renderMenuTotal();
    showScreen(b.dataset.go);
  };
});

renderMenuTotal();                                     // ao abrir a página, mostra a pontuação total
