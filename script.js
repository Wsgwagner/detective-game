// ============================================================
//  script.js  -  LÓGICA do jogo Liar Hunter
//  (os dados dos casos estão em data.js)
// ============================================================

// ---------- PONTUAÇÃO (fica fácil de ajustar aqui em cima) ----------
const POINTS = {
  suspect: 50,       // acertou o culpado
  lie: 30,           // apontou a frase mentirosa certa
  evidence: 10,      // apontou a prova certa (nos casos Easy/Medium vem junto com a mentira)
  maxBonus: 10,      // bônus máximo por perguntas não usadas (+1 cada)
};

// ---------- ESTADO DO JOGO (tudo que muda durante a partida) ----------
let state = {
  caseIndex: 0,          // qual caso está sendo jogado (posição no array CASES)
  questionsLeft: 0,      // perguntas restantes
  selected: null,        // ID do suspeito selecionado
  asked: new Set(),      // perguntas já feitas, no formato "suspeito-numero" (ex: "grey-0")
  notebook: [],          // respostas anotadas: [{ suspectId, index }]
};

// Escolhas do jogador na hora de acusar
let accusation = { suspectId: null, lieKey: null, evidenceKey: null };

// ---------- ATALHOS ----------
const $ = (id) => document.getElementById(id);                                // $("x") = document.getElementById("x")
const currentCase = () => CASES[state.caseIndex];                             // devolve o caso atual
const findSuspect = (id) => currentCase().suspects.find((s) => s.id === id);  // acha suspeito pelo ID
const totalSteps = () => (currentCase().requireEvidence ? 3 : 2);             // acusação tem 2 ou 3 etapas

// ---------- TROCAR DE TELA ----------
function showScreen(name) {                                     // mostra uma tela e esconde as outras
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active")); // esconde todas
  $("screen-" + name).classList.add("active");                  // mostra só a escolhida
  window.scrollTo(0, 0);                                        // volta para o topo da página
}

// ---------- GRAMMAR LENS: transforma {ps:went} em <span class="g-ps">went</span> ----------
function toHTML(text) {
  return text.replace(/\{(ps|pc|cn):([^}]+)\}/g, '<span class="g-$1">$2</span>'); // expressão regular troca as marcações
}
function toPlain(text) {                                        // tira as marcações (áudio e textos simples)
  return text.replace(/\{(ps|pc|cn):([^}]+)\}/g, "$2");
}

// ---------- ÁUDIO: lê o texto em inglês com a voz do navegador ----------
function speak(text) {
  if (!("speechSynthesis" in window)) return;                   // se o navegador não suporta, não faz nada
  speechSynthesis.cancel();                                     // para qualquer fala anterior
  const voice = new SpeechSynthesisUtterance(toPlain(text));    // cria a fala com o texto limpo
  voice.lang = "en-US";                                         // sotaque americano
  voice.rate = 0.9;                                             // um pouco mais devagar para treinar o ouvido
  speechSynthesis.speak(voice);                                 // fala!
}

// ---------- SALVAR RECORDES (localStorage) ----------
function loadBest() {                                           // lê os recordes salvos no navegador
  try { return JSON.parse(localStorage.getItem("liarHunterBest")) || {}; } // texto -> objeto
  catch (e) { return {}; }                                      // se der erro, começa vazio
}
function saveBest(caseId, score) {                              // salva só se for maior que o anterior
  const best = loadBest();
  if (best[caseId] === undefined || score > best[caseId]) best[caseId] = score;
  try { localStorage.setItem("liarHunterBest", JSON.stringify(best)); } catch (e) {} // objeto -> texto
}

// ---------- MENU ----------
function renderMenuTotal() {                                    // soma dos recordes no menu
  const best = loadBest();
  const total = CASES.reduce((sum, c) => sum + (best[c.id] || 0), 0); // soma só os casos que existem
  $("menu-total").textContent = total ? `🏆 Total best score: ${total} / ${CASES.length * 100}` : "";
}

function renderCaseList() {                                     // cria os cards dos casos
  const best = loadBest();
  $("case-list").innerHTML = "";                                // limpa a lista
  CASES.forEach((c, i) => {                                     // para cada caso...
    const card = document.createElement("div");                 // cria uma <div>
    card.className = "case-card level-" + c.level.toLowerCase(); // classe da cor da dificuldade
    card.innerHTML = `
      <div class="level">Case ${i + 1} · ${c.level}</div>
      <h3>${c.title}</h3>
      <div class="faces">${c.suspects.map((s) => s.avatar).join(" ")}</div>
      <div class="info">👥 ${c.suspects.length} suspects · ❓ ${c.questionLimit} questions${c.requireEvidence ? " · 🧾 proof needed" : ""}</div>
      <div class="best">${best[c.id] !== undefined ? "🏆 Best: " + best[c.id] + " pts" : "🔒 Not solved yet"}</div>`;
    card.onclick = () => startCase(i);                          // ao clicar, começa esse caso
    $("case-list").appendChild(card);                           // coloca o card na tela
  });
}

// ---------- COMEÇAR UM CASO ----------
function startCase(index) {
  state = {                                                     // reinicia o estado
    caseIndex: index,
    questionsLeft: CASES[index].questionLimit,                  // cada caso tem seu limite
    selected: null,
    asked: new Set(),
    notebook: [],
  };
  const c = currentCase();
  $("case-title").textContent = `Case ${index + 1}: ${c.title} (${c.level})`; // título
  $("case-intro").textContent = c.intro;                        // história
  $("clue-list").innerHTML = c.clues.map((cl) => `<li>${cl.text}</li>`).join(""); // pistas
  $("interrogation").innerHTML = '<p class="placeholder">Click on a suspect to start the interrogation.</p>';
  renderSuspects();                                             // desenha os suspeitos
  renderNotebook();                                             // caderno vazio
  updateCounter();                                              // contador de perguntas
  showScreen("game");                                           // mostra a tela do jogo
}

function renderSuspects() {                                     // desenha os cards dos suspeitos
  $("suspect-list").innerHTML = "";
  currentCase().suspects.forEach((s) => {
    const askedCount = s.questions.filter((_, i) => state.asked.has(`${s.id}-${i}`)).length; // quantas já perguntou
    const div = document.createElement("div");
    div.className = "suspect" + (state.selected === s.id ? " selected" : ""); // destaca o selecionado
    div.innerHTML = `<div class="avatar">${s.avatar}</div><div class="name">${s.name}</div>
      <div class="role">${s.role}</div><div class="asked-count">${askedCount}/${s.questions.length} asked</div>`;
    div.onclick = () => selectSuspect(s.id);                    // ao clicar, seleciona o suspeito
    $("suspect-list").appendChild(div);
  });
}

function selectSuspect(id) {                                    // escolhe um suspeito para interrogar
  state.selected = id;
  renderSuspects();                                             // atualiza o destaque
  renderQuestions();                                            // mostra as perguntas dele
}

function renderQuestions(lastIndex = null) {                    // mostra as perguntas e a última resposta
  const s = findSuspect(state.selected);
  const box = $("interrogation");
  box.innerHTML = `<h4>Ask ${s.name} a question:</h4>`;
  s.questions.forEach((item, i) => {                            // um botão para cada pergunta
    const key = `${s.id}-${i}`;                                 // chave única da pergunta
    const btn = document.createElement("button");
    btn.className = "btn question-btn" + (state.asked.has(key) ? " asked" : ""); // risca se já perguntou
    btn.textContent = "🗨️ " + item.q;
    btn.disabled = state.asked.has(key) || state.questionsLeft === 0; // desativa se já perguntou ou acabou
    btn.onclick = () => ask(s.id, i);                           // ao clicar, faz a pergunta
    box.appendChild(btn);
  });
  if (lastIndex !== null) {                                     // se acabou de perguntar, mostra o diálogo
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
  if (state.questionsLeft === 0) {                              // acabaram as perguntas
    box.insertAdjacentHTML("beforeend", '<p class="bad"><b>No more questions! Time to ACCUSE someone.</b></p>');
  }
}

// ---------- FAZER UMA PERGUNTA ----------
function ask(suspectId, index) {
  const key = `${suspectId}-${index}`;
  if (state.asked.has(key) || state.questionsLeft <= 0) return; // não pergunta duas vezes
  state.asked.add(key);                                         // marca como perguntada
  state.questionsLeft--;                                        // gasta uma pergunta
  state.notebook.push({ suspectId, index });                    // anota no caderno
  updateCounter();
  renderNotebook();
  renderSuspects();                                             // atualiza o "x/5 asked"
  renderQuestions(index);                                       // atualiza botões e mostra a resposta
}

function updateCounter() {                                      // atualiza as perguntas restantes
  $("questions-left").textContent = state.questionsLeft;
  $("questions-left").classList.toggle("low", state.questionsLeft <= 3); // fica vermelho quando está acabando
}

function renderNotebook() {                                     // escreve as respostas no caderno
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

function showHowTo() {                                          // instruções em inglês
  openModal(`
    <h2>📖 How to Play</h2>
    <p><b>You are a detective.</b> In each case, a crime happened and some people are suspects. <b>Only one of them is lying.</b></p>
    <ol>
      <li>Read the <b>Case File</b>. The <b>facts</b> are always true.</li>
      <li>Click on a <b>suspect</b> and choose a <b>question</b>. Questions are <b>limited</b>, so think before you ask!</li>
      <li>Every answer goes to your <b>Notebook</b>. Compare the answers with the facts <b>and with each other</b>.</li>
      <li>Find the <b>contradiction</b>: a sentence that can't be true.</li>
      <li>Click <b>⚖️ Accuse</b>, choose the guilty person and point to the <b>lie</b>.</li>
    </ol>
    <h3>Difficulty</h3>
    <div class="example">🟢 <b>Easy</b> — 3 suspects. The lie goes against a fact in the Case File.</div>
    <div class="example">🟡 <b>Medium</b> — 4 suspects. More information, more distractions.</div>
    <div class="example">🔴 <b>Hard</b> — 5 suspects and only 12 of 25 questions. The lie may go against <b>another suspect's answer</b>, or you may need to <b>combine two facts</b>. You must also show the <b>proof</b>.</div>
    <h3>Scoring (max 100)</h3>
    <p>✅ Right suspect <b>+${POINTS.suspect}</b> · 🎯 Right lie <b>+${POINTS.lie}</b> · 🧾 Right proof <b>+${POINTS.evidence}</b> · ⏱️ Each unused question <b>+1</b> (max ${POINTS.maxBonus})</p>
    <p>❌ Wrong suspect: <b>0 points</b> and the culprit escapes!</p>
    <p>💡 Turn on the <b>🔍 Grammar Lens</b> to see verbs and connectives in colors. Click <b>🔊</b> to listen to the answers.</p>`);
}

function showGrammar() {                                        // guia de gramática em inglês
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
    <div class="example"><b>Time:</b> when, while, before, after, after that, then, later, until, during</div>
    <div class="example"><b>Cause / result:</b> because, so, that's why</div>
    <div class="example"><b>Contrast:</b> but, unfortunately, without</div>
    <p>🕵️ <b>Detective tip:</b> liars often say "I <b>was</b> doing X" — check if X was really possible with the facts!</p>`);
}

// ---------- ACUSAÇÃO (2 ou 3 etapas dentro do modal) ----------
function openAccuse() {                                         // ETAPA 1: escolher o suspeito
  accusation = { suspectId: null, lieKey: null, evidenceKey: null };
  const buttons = currentCase().suspects.map((s) =>
    `<button class="btn choice" data-suspect="${s.id}">${s.avatar} ${s.name} — ${s.role}</button>`).join("");
  openModal(`<h2>⚖️ Who is guilty?</h2><p>Step 1 of ${totalSteps()}: choose the person who is lying.</p>${buttons}`);
  document.querySelectorAll("[data-suspect]").forEach((b) => {
    b.onclick = () => { accusation.suspectId = b.dataset.suspect; chooseLie(); }; // vai para a etapa 2
  });
}

function chooseLie() {                                          // ETAPA 2: apontar a frase mentirosa
  const s = findSuspect(accusation.suspectId);
  const entries = state.notebook.filter((e) => e.suspectId === s.id); // só as respostas desse suspeito
  let html = `<h2>${s.avatar} ${s.name}</h2><p>Step 2 of ${totalSteps()}: which statement is a <b>lie</b>?</p>`;
  if (entries.length === 0) {
    html += `<p class="hint">You didn't ask ${s.name} any questions... You can't prove the lie!</p>`;
  }
  entries.forEach((e) => {                                      // um botão para cada frase anotada
    html += `<button class="btn choice" data-lie="${e.suspectId}-${e.index}">"${toPlain(s.questions[e.index].a)}"</button>`;
  });
  html += `<button class="btn choice" data-lie="none">🤷 I can't point to the lie</button>`;
  html += navButtons(currentCase().requireEvidence ? "➡ Next: Proof" : "⚖️ Confirm Accusation");
  openModal(html);
  selectable("[data-lie]", (value) => (accusation.lieKey = value)); // guarda a escolha
  $("btn-back-accuse").onclick = openAccuse;                    // volta à etapa 1
  $("btn-confirm").onclick = () => {
    if (currentCase().requireEvidence && accusation.lieKey !== "none") chooseEvidence(); // Hard: vai p/ etapa 3
    else finishCase();                                          // Easy/Medium: termina
  };
}

function chooseEvidence() {                                     // ETAPA 3 (só Hard): apontar a prova
  const c = currentCase();
  let html = `<h2>🧾 What proves the lie?</h2><p>Step 3 of 3: choose a <b>fact</b> or <b>another person's answer</b>.</p>`;
  html += "<h4>Facts</h4>";
  c.clues.forEach((cl) => {                                     // todas as pistas do caso
    html += `<button class="btn choice" data-ev="${cl.id}">📌 ${cl.text}</button>`;
  });
  const others = state.notebook.filter((e) => e.suspectId !== accusation.suspectId); // respostas dos OUTROS
  if (others.length) html += "<h4>Statements in your notebook</h4>";
  others.forEach((e) => {
    const s = findSuspect(e.suspectId);
    html += `<button class="btn choice" data-ev="${e.suspectId}-${e.index}">🗨️ <b>${s.name}:</b> "${toPlain(s.questions[e.index].a)}"</button>`;
  });
  html += navButtons("⚖️ Confirm Accusation");
  openModal(html);
  selectable("[data-ev]", (value) => (accusation.evidenceKey = value));
  $("btn-back-accuse").onclick = chooseLie;                     // volta à etapa 2
  $("btn-confirm").onclick = finishCase;
}

function navButtons(confirmText) {                              // botões "Back" e "Confirm" do modal
  return `<div class="row" style="margin-top:14px">
            <button class="btn" id="btn-back-accuse">⬅ Back</button>
            <button class="btn danger" id="btn-confirm" disabled>${confirmText}</button>
          </div>`;
}

function selectable(selector, onPick) {                         // deixa só 1 botão marcado por vez
  document.querySelectorAll(selector).forEach((b) => {
    b.onclick = () => {
      document.querySelectorAll(selector).forEach((x) => x.classList.remove("selected")); // desmarca todos
      b.classList.add("selected");                              // marca o clicado
      onPick(b.dataset.lie || b.dataset.ev);                    // avisa qual foi escolhido
      $("btn-confirm").disabled = false;                        // libera o botão de confirmar
    };
  });
}

// ---------- RESULTADO ----------
function evidenceText(key) {                                    // transforma a chave da prova em texto
  const c = currentCase();
  const clue = c.clues.find((cl) => cl.id === key);             // é uma pista?
  if (clue) return "📌 " + clue.text;
  const [sid, idx] = key.split("-");                            // é uma resposta? ex: "nina-1"
  const s = findSuspect(sid);
  return `🗨️ ${s.name}: "${toPlain(s.questions[Number(idx)].a)}"`;
}

function finishCase() {
  closeModal();
  if ("speechSynthesis" in window) speechSynthesis.cancel();    // para o áudio se estiver falando
  const c = currentCase();
  const culprit = findSuspect(c.culprit);
  const lieIndex = culprit.questions.findIndex((q) => q.lie);   // posição da pergunta com a mentira
  const lie = culprit.questions[lieIndex];
  const rightSuspect = accusation.suspectId === c.culprit;      // acertou o culpado?
  const rightLie = rightSuspect && accusation.lieKey === `${c.culprit}-${lieIndex}`; // acertou a frase?
  const rightEvidence = rightLie && (!c.requireEvidence || lie.evidence.includes(accusation.evidenceKey)); // acertou a prova?

  let score = 0;                                                // calcula a pontuação
  const rows = [];                                              // linhas da tabela de pontos
  if (rightSuspect) {
    score += POINTS.suspect; rows.push(["✅ Right suspect", "+" + POINTS.suspect]);
    rows.push(["🎯 Right lie", rightLie ? "+" + POINTS.lie : "+0"]);
    if (rightLie) score += POINTS.lie;
    rows.push([c.requireEvidence ? "🧾 Right proof" : "🧾 Proof (automatic)", rightEvidence ? "+" + POINTS.evidence : "+0"]);
    if (rightEvidence) score += POINTS.evidence;
    const bonus = Math.min(state.questionsLeft, POINTS.maxBonus); // bônus limitado
    score += bonus; rows.push([`⏱️ Unused questions (${state.questionsLeft})`, "+" + bonus]);
  } else {
    rows.push(["❌ Wrong suspect", "0"]);
  }
  rows.push(["TOTAL", score]);
  saveBest(c.id, score);                                        // salva o recorde

  const stars = rightEvidence ? 3 : rightLie || rightSuspect ? (rightLie ? 2 : 1) : 0; // estrelas
  $("result-stars").textContent = "★".repeat(stars) + "☆".repeat(3 - stars);
  $("result-title").innerHTML = rightSuspect
    ? '<span class="good">🔒 Case Closed!</span>'
    : '<span class="bad">💨 Wrong Person! The culprit escaped...</span>';

  let comment = "";                                             // comentário extra conforme o erro
  if (rightSuspect && !rightLie) comment = "You found the culprit, but you didn't point to the right lie. A good detective needs proof!";
  else if (rightLie && !rightEvidence) comment = "You found the lie, but your proof was not correct. Look at the proofs above!";

  $("result-text").innerHTML = `
    The culprit was <b>${culprit.avatar} ${culprit.name}</b> (${culprit.role}).<br><br>
    <b>The lie:</b> "${toPlain(lie.a)}"<br><br>
    <b>What proves it:</b><br>${lie.evidence.map(evidenceText).join("<br>")}<br><br>
    ${comment}`;
  $("score-table").innerHTML = rows.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join("");
  $("result-rank").textContent = rank(score);
  $("btn-next").style.display = state.caseIndex < CASES.length - 1 ? "" : "none"; // esconde "Next" no último caso
  showScreen("result");
}

function rank(score) {                                          // classificação pelos pontos
  if (score >= 95) return "🏅 Rank: Master Detective";
  if (score >= 85) return "🥈 Rank: Senior Detective";
  if (score >= 50) return "🥉 Rank: Junior Detective";
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

renderMenuTotal();                                              // ao abrir a página, mostra a pontuação total
