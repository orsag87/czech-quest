/* ============================================================================
   NATASHA'S CZECH QUEST — ENGINE (app.js)
   All learning logic lives here. Content lives in content.js.
   ========================================================================== */

const LEVELS = ["A1","A2","B1","B2","C1","C2"];
const LEARNER = "Natasha";
const LEVEL_NAMES = { A1:"beginner", A2:"elementary", B1:"intermediate", B2:"upper-intermediate", C1:"advanced", C2:"mastery" };
const LEVEL_COLOR = {
  A1:["#3F9794","#E1F0EF"], A2:["#E0A93B","#FBF0D8"], B1:["#C8443F","#F8E5E4"],
  B2:["#7B4EA3","#EEE7F5"], C1:["#34507A","#E4EAF3"], C2:["#1F6F50","#E3F1EA"]
};
const XP_PER_CORRECT = { A1:10, A2:15, B1:20, B2:25, C1:30, C2:35 };
const DAILY_GOAL_XP = 60;
const LEITNER_DAYS = [0, 1, 3, 7, 16, 35]; // interval by box (days)

/* ===== STATE ===== */
const DEFAULTS = {
  level:"A2", xp:0, streak:0, lastDate:null,
  stars:{}, recent:{}, miss:{}, seen:{},
  vocab:{},            // cz -> {en, box, due, reps, correct, wrong}
  bossPassed:{},       // level -> true
  badges:{},           // badgeId -> earned timestamp
  placed:false,        // has she done (or skipped) the placement test
  dayXp:0, dayKey:null, // daily-goal tracking
  freezes:2,           // streak freezes banked (a missed day auto-consumes one)
  remindersOn:false    // has she enabled daily push reminders on this device
};
let S = clone(DEFAULTS);
function clone(o){ return JSON.parse(JSON.stringify(o)); }
function load(){
  try{
    const r = localStorage.getItem("czQuestV2");
    if(r){ S = Object.assign(clone(DEFAULTS), JSON.parse(r)); return; }
    // migrate from v1 if present
    const old = localStorage.getItem("czQuest");
    if(old){ const o = JSON.parse(old); S = Object.assign(clone(DEFAULTS), o); S.placed = true; save(); }
  }catch(e){}
}
function save(){ try{ localStorage.setItem("czQuestV2", JSON.stringify(S)); }catch(e){} }

/* ===== BADGES ===== */
const BADGES = {
  first:      { icon:"🌱", name:"First steps",   desc:"Finished your first lesson" },
  streak3:    { icon:"🔥", name:"On a roll",      desc:"3-day streak" },
  streak7:    { icon:"⚡", name:"Unstoppable",    desc:"7-day streak" },
  perfect:    { icon:"💯", name:"Flawless",       desc:"A perfect 100% round" },
  words25:    { icon:"📚", name:"Word collector", desc:"25 words learned" },
  words100:   { icon:"🦉", name:"Vocabulary owl", desc:"100 words mastered" },
  boss:       { icon:"🏅", name:"Checkpoint!",    desc:"Passed a Boss checkpoint" },
  c1:         { icon:"👑", name:"Advanced",       desc:"Reached level C1" }
};
function award(id){
  if(S.badges[id]) return null;
  S.badges[id] = Date.now(); save();
  return BADGES[id];
}

/* ===== GLOSS / VOCAB INDEX (built once from all stories) ===== */
const GLOSS_RE = /\[([^|\]]+)\|([^\]]+)\]/g;
const VOCAB_INDEX = {};        // cz -> {en, level}
const VOCAB_BY_LEVEL = {};     // level -> [cz, ...]
(function buildVocabIndex(){
  STORIES.forEach(s=>{
    let m; GLOSS_RE.lastIndex = 0;
    while((m = GLOSS_RE.exec(s.text))){
      const cz = m[1].trim(), en = m[2].trim();
      if(!VOCAB_INDEX[cz]){ VOCAB_INDEX[cz] = { en, level:s.level }; (VOCAB_BY_LEVEL[s.level] ||= []).push(cz); }
    }
  });
})();

/* ===== HELPERS ===== */
function applyLevelColor(){
  const c = LEVEL_COLOR[S.level] || LEVEL_COLOR.A2;
  document.documentElement.style.setProperty("--lvl", c[0]);
  document.documentElement.style.setProperty("--lvl-tint", c[1]);
}
function plainText(t){ return t.replace(GLOSS_RE, "$1"); }
function renderStory(t){ return t.replace(GLOSS_RE, (m,cz,en)=>`<span class="gloss">${cz}<span class="pop">${en}</span></span>`); }
function buildGlossary(t){
  const out=[], seen=new Set(); let m; GLOSS_RE.lastIndex=0;
  while((m=GLOSS_RE.exec(t))){ const cz=m[1].trim(); if(!seen.has(cz.toLowerCase())){ seen.add(cz.toLowerCase()); out.push([cz, m[2].trim()]); } }
  return out;
}
function starString(n){ let s=""; for(let i=0;i<3;i++) s += i<n ? "★" : '<span class="off">★</span>'; return s; }
/* Accent-insensitive: strips diacritics so "vysetril" still matches "vyšetřil".
   The feedback still SHOWS the correctly-accented answer, so she learns the spelling. */
function norm(s){ return (s||"").toLowerCase().trim().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[.,!?;:„“"]/g,"").replace(/\s+/g," "); }
function todayKey(){ return new Date().toDateString(); }
function daysBetween(aStr,bStr){ const a=new Date(aStr); a.setHours(0,0,0,0); const b=new Date(bStr); b.setHours(0,0,0,0); return Math.round((b-a)/864e5); }
/* Advance the daily streak for ANY completed activity (story/review/match/boss/practice).
   A missed day auto-consumes a banked freeze instead of resetting; earns a freeze every 7 days. */
function markActivity(){
  const today=todayKey();
  if(S.lastDate===today){ S._streakEvent="same"; return; }   // already counted today
  if(!S.lastDate){ S.streak=1; S.lastDate=today; S._streakEvent="up"; return; }
  const gap=daysBetween(S.lastDate, today);
  if(gap<=0){ S._streakEvent="same"; return; }               // clock oddity
  if(gap===1){ S.streak++; S._streakEvent="up"; }
  else {
    const missed=gap-1;
    if((S.freezes||0)>=missed){ S.freezes-=missed; S.streak++; S._streakEvent="froze"; }
    else { S.streak=1; S._streakEvent="reset"; }
  }
  S.lastDate=today;
  if(S.streak>0 && S.streak%7===0) S.freezes=Math.min((S.freezes||0)+1, 3); // earn a freeze weekly (cap 3)
}
function levelIdx(l){ return LEVELS.indexOf(l); }
function storiesAt(l){ return STORIES.filter(s=>s.level===l).sort((a,b)=>(a.diff||0)-(b.diff||0)); }
const VIEWS = ["home","reading","quiz","lesson","results","placement","match"];
function show(id){ VIEWS.forEach(v=>document.getElementById(v).classList.toggle("hidden", v!==id)); }

/* ===== VOCAB / SRS ===== */
function enrollWord(cz, box){
  const info = VOCAB_INDEX[cz]; if(!info) return;
  if(!S.vocab[cz]){ S.vocab[cz] = { en:info.en, box:box||0, due:Date.now()+LEITNER_DAYS[box||0]*864e5, reps:0, correct:0, wrong:0, added:Date.now() }; }
}
function reviewWord(cz, correct){
  const v = S.vocab[cz]; if(!v) return;
  v.reps++;
  if(correct){ v.correct++; v.box = Math.min(v.box+1, 5); }
  else { v.wrong++; v.box = Math.max(v.box-1, 0); }
  v.due = Date.now() + (correct ? LEITNER_DAYS[v.box]*864e5 : 6*36e5); // wrong -> ~6h
}
function dueWords(){ const now=Date.now(); return Object.keys(S.vocab).filter(cz=>S.vocab[cz].due<=now); }
function vocabStats(){
  const keys=Object.keys(S.vocab); let learning=0, mastered=0;
  keys.forEach(cz=>{ if(S.vocab[cz].box>=4) mastered++; else learning++; });
  return { total:keys.length, learning, mastered };
}
/* build a multiple-choice question for a vocab word, with distractors */
function vocabQuestion(cz){
  const correct = S.vocab[cz].en || (VOCAB_INDEX[cz] && VOCAB_INDEX[cz].en) || "";
  const pool = Object.keys(VOCAB_INDEX).filter(w=>w!==cz && VOCAB_INDEX[w].en!==correct);
  const distractors=[]; const used=new Set([correct]);
  while(distractors.length<2 && pool.length){
    const w = pool.splice(Math.floor(Math.random()*pool.length),1)[0];
    if(!used.has(VOCAB_INDEX[w].en)){ distractors.push(VOCAB_INDEX[w].en); used.add(VOCAB_INDEX[w].en); }
  }
  const opts = shuffle([correct, ...distractors]);
  return { q:`Co znamená „${cz}"?`, opts, a:opts.indexOf(correct), skill:"vocab-daily", _vocab:cz };
}
function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

/* ===== MASCOT ===== */
let mascotTimer=null;
function mascot(mood, text, sticky){
  const el=document.getElementById("mascot"), bubble=document.getElementById("mascotBubble");
  if(!el) return;
  el.setAttribute("data-mood", mood||"idle");
  if(text){ bubble.textContent=text; bubble.classList.add("show"); }
  else bubble.classList.remove("show");
  el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop");
  clearTimeout(mascotTimer);
  if(text && !sticky) mascotTimer=setTimeout(()=>{ bubble.classList.remove("show"); el.setAttribute("data-mood","idle"); }, 3200);
}

/* ===== CONFETTI (no deps) ===== */
function confetti(){
  const c=document.getElementById("fx"); if(!c) return;
  const ctx=c.getContext("2d"); c.width=innerWidth; c.height=innerHeight;
  const cols=["#E0A93B","#5C7363","#C8443F","#7B4EA3","#3F9794","#2F9E5A"];
  const N=130, P=[];
  for(let i=0;i<N;i++) P.push({x:Math.random()*c.width, y:-20-Math.random()*c.height*0.3, r:5+Math.random()*7, c:cols[i%cols.length], vy:2+Math.random()*4, vx:-2+Math.random()*4, a:Math.random()*6.28, va:-0.2+Math.random()*0.4});
  let frames=0;
  c.classList.add("show");
  (function tick(){
    ctx.clearRect(0,0,c.width,c.height); frames++;
    P.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; p.a+=p.va; p.vy+=0.04;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.a); ctx.fillStyle=p.c;
      ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r*0.6); ctx.restore(); });
    if(frames<160) requestAnimationFrame(tick);
    else { ctx.clearRect(0,0,c.width,c.height); c.classList.remove("show"); }
  })();
}

/* ===== HUD + HOME ===== */
function rollDay(){ if(S.dayKey!==todayKey()){ S.dayKey=todayKey(); S.dayXp=0; } }
function dailyRing(){
  rollDay();
  const pct=Math.min(1, S.dayXp/DAILY_GOAL_XP);
  const r=13, circ=2*Math.PI*r, off=circ*(1-pct);
  return `<svg class="ring" viewBox="0 0 32 32" aria-hidden="true">
    <circle cx="16" cy="16" r="${r}" class="ring-bg"></circle>
    <circle cx="16" cy="16" r="${r}" class="ring-fg" style="stroke-dasharray:${circ};stroke-dashoffset:${off}"></circle>
    <text x="16" y="20" text-anchor="middle" class="ring-t">${pct>=1?"✓":Math.round(pct*100)}</text></svg>`;
}
function renderHud(){
  applyLevelColor();
  document.getElementById("hudLevel").textContent = S.level+" ⚙";
  document.getElementById("hudStreak").innerHTML = `🔥 ${S.streak}<small>${S.streak===1?"den":"dnů"}</small>`;
  document.getElementById("hudXp").innerHTML = `★ ${S.xp}<small>XP</small>`;
  document.getElementById("hudGoal").innerHTML = dailyRing();
}
function strongRounds(){ return (S.recent[S.level]||[]).filter(a=>a>=0.85).length; }
function weakSkills(){ return Object.keys(S.miss).filter(k=>S.miss[k]>=2); }
function levelComplete(l){ const ss=storiesAt(l); return ss.length>0 && ss.every(s=>S.stars.hasOwnProperty(s.id)); }
function bossAvailable(){
  const l=S.level;
  if(S.bossPassed[l]) return false;
  if(levelIdx(l)>=LEVELS.length-1) return false;        // no boss past top
  const ss=storiesAt(l); if(ss.length<2) return false;
  const done=ss.filter(s=>S.stars.hasOwnProperty(s.id)).length;
  return done>=Math.min(3, ss.length);                  // unlock after 3 (or all) done
}

function renderHome(){
  renderHud();
  const hour=new Date().getHours();
  const greet = hour<11?"Dobré ráno" : hour<18?"Ahoj" : "Dobrý večer";
  const doneToday = S.lastDate===todayKey();
  let sub;
  if(doneToday) sub = S.streak>0 ? `Day ${S.streak} done today — nice work. 🔥` : "Nice work today!";
  else if(S.streak>0) sub = `Keep your ${S.streak}-day streak alive today, ${LEARNER}! 🔥`;
  else sub = S.xp>0 ? "Welcome back — let's keep learning Czech." : "Let's learn some Czech together.";
  const freezeLine = (S.freezes>0 && !doneToday && S.streak>0)
    ? `<div class="sub" style="margin-top:3px">🛡️ ${S.freezes} streak freeze${S.freezes>1?'s':''} banked — one missed day won't break it.</div>` : "";
  document.getElementById("welcome").innerHTML = `<div class="hi">${greet}, ${LEARNER} 👋</div><div class="sub">${sub}</div>${freezeLine}`;

  // dynamic cards: SRS review, weak spots, boss
  let cards="";
  const due=dueWords();
  if(due.length>=4){
    cards += `<div class="review srs"><h3>🧠 Slovíčka na opakování · Word review</h3><div class="desc">${due.length} words are due — a quick spaced-repetition round keeps them locked in.</div><button class="btn small" style="background:var(--sage)" onclick="startSrs()">Opakovat (${Math.min(due.length,8)}) · Review</button></div>`;
  }
  if(bossAvailable()){
    const nxt=LEVELS[levelIdx(S.level)+1];
    cards += `<div class="review boss"><h3>🏆 Boss checkpoint · ${S.level}</h3><div class="desc">You've done the ${S.level} stories. Pass this mixed challenge (80%+) to certify ${S.level} and unlock ${nxt}.</div><button class="btn small bossbtn" onclick="startBoss()">Přijmout výzvu · Take the challenge</button></div>`;
  }
  const weak=weakSkills();
  if(weak.length){
    cards += `<div class="review"><h3>🎯 Slabá místa · Review</h3><div class="desc">Things to shore up, based on what's been missed. A quick lesson + targeted practice each.</div>${
      weak.map(k=>`<div class="weakrow"><div class="wn">${SKILLS[k].name}<small>missed ${S.miss[k]}×</small></div><button class="btn small" style="background:var(--gold)" onclick="openLesson('${k}')">Procvičit</button></div>`).join("")
    }</div>`;
  }
  document.getElementById("reviewBox").innerHTML = cards;

  // always-available practice: word match
  document.getElementById("practiceBox").innerHTML = matchAvailable()
    ? `<div class="review practice"><h3>🃏 Spojování slovíček · Word match</h3><div class="desc">Quick recap — match recent Czech words to their English. Jump in anytime.</div><button class="btn small" style="background:var(--lvl)" onclick="startMatch()">Hrát · Play</button></div>`
    : "";

  // level card
  document.getElementById("lvlTitle").textContent = `Úroveň ${S.level} · ${LEVEL_NAMES[S.level]}`;
  const idx=levelIdx(S.level), top=idx>=LEVELS.length-1;
  document.getElementById("lvlGoal").textContent = top ? "nejvyšší úroveň" : "boss + 3× 85 % → výš";
  const sr=Math.min(strongRounds(),3); let dots="";
  for(let i=0;i<3;i++) dots+=`<div class="dot ${i<sr?'on':''}"></div>`;
  document.getElementById("lvlDots").innerHTML = dots;
  document.getElementById("lvlHint").textContent = top
    ? "Top level — keep her sharp; reviews and boss rounds keep it challenging."
    : `Strong rounds: ${sr}/3. Ace the Boss checkpoint or score 85%+ three times to reach ${LEVELS[idx+1]}.`;

  // vocab mastery strip
  const vs=vocabStats();
  document.getElementById("vocabStrip").innerHTML = vs.total
    ? `<div class="vstrip"><span>📖 Slovíčka</span><b>${vs.total}</b> learned · <b>${vs.mastered}</b> mastered · <b>${vs.learning}</b> learning</div>` : "";

  // badges
  const earned=Object.keys(S.badges);
  document.getElementById("badgeStrip").innerHTML = earned.length
    ? `<div class="sechead" style="margin-top:6px">Odznaky · Badges</div><div class="badges">${earned.map(id=>`<div class="badge" title="${BADGES[id].desc}">${BADGES[id].icon}<span>${BADGES[id].name}</span></div>`).join("")}</div>` : "";

  // story list
  const list=storiesAt(S.level);
  document.getElementById("storyList").innerHTML = list.map((s,i)=>{
    const st=S.stars[s.id]||0, done=S.stars.hasOwnProperty(s.id);
    return `<div class="story-card ${done?'done':''}" onclick="openStory('${s.id}')"><div class="story-num">${done?'✓':i+1}</div><div class="story-meta"><div class="t">${s.titleCz}</div><div class="e">${s.titleEn}</div></div><div class="stars">${starString(st)}</div></div>`;
  }).join("");

  document.getElementById("footer").classList.add("hidden");
  mascot("idle","");
}
function goHome(){ if(window.speechSynthesis) speechSynthesis.cancel(); mode="story"; show("home"); renderHome(); window.scrollTo(0,0); }

/* ===== READING ===== */
let current=null, mode="story", practiceSkill=null;
function openStory(id){
  mode="story";
  current=STORIES.find(s=>s.id===id);
  document.getElementById("rTitle").textContent=current.titleCz;
  document.getElementById("rSub").textContent=current.titleEn;
  document.getElementById("rBody").innerHTML=renderStory(current.text);
  document.getElementById("rGloss").innerHTML=buildGlossary(current.text).map(([cz,en])=>`<div class="gi"><span class="cz">${cz}</span><span class="en">${en}</span></div>`).join("");
  bindGlosses(); show("reading");
  const f=document.getElementById("footer"); f.classList.remove("hidden");
  const b=document.getElementById("footerBtn"); b.textContent="Spustit kvíz · Start quiz"; b.onclick=startQuiz;
  document.getElementById("reading").scrollTop=0;
  mascot("read","Klepni na podtržená slova 👇");
}
function bindGlosses(){
  document.querySelectorAll("#rBody .gloss").forEach(g=>{
    g.onclick=(e)=>{
      const w=g.classList.contains("active");
      document.querySelectorAll(".gloss.active").forEach(x=>x.classList.remove("active"));
      if(!w){ g.classList.add("active"); enrollWord(g.firstChild.textContent.trim(),1); save(); }
      e.stopPropagation();
    };
  });
}
document.body.addEventListener("click",()=>document.querySelectorAll(".gloss.active").forEach(x=>x.classList.remove("active")));
function speak(rate){
  const tip=document.getElementById("rTip");
  if(!("speechSynthesis" in window)){ tip.textContent="Read-aloud isn't supported here."; return; }
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(plainText(current.text)); u.lang="cs-CZ"; u.rate=rate;
  const cz=speechSynthesis.getVoices().find(v=>v.lang&&v.lang.toLowerCase().startsWith("cs"));
  if(cz) u.voice=cz; else tip.textContent="No Czech voice on this device yet — add one in Settings ▸ Accessibility ▸ Spoken Content for correct pronunciation.";
  speechSynthesis.speak(u);
}
if("speechSynthesis" in window) speechSynthesis.onvoiceschanged=()=>{};

/* ===== QUIZ ENGINE (shared by story / practice / srs / placement / boss) ===== */
let qIndex=0, qCorrect=0, qLocked=false, qResults=[];
function startQuiz(){ if(window.speechSynthesis) speechSynthesis.cancel(); qIndex=0; qCorrect=0; qResults=[]; show("quiz"); document.getElementById("footer").classList.add("hidden"); renderQuestion(); }
function renderQuestion(){
  qLocked=false;
  const item=current.quiz[qIndex], total=current.quiz.length;
  let bars=""; for(let i=0;i<total;i++) bars+=`<div class="qbar ${i<=qIndex?'on':''}"></div>`;
  document.getElementById("qProgress").innerHTML=bars;
  document.getElementById("qCount").textContent=`OTÁZKA ${qIndex+1} / ${total}`;
  document.getElementById("qText").textContent=item.q;
  const fb=document.getElementById("qFeedback"); fb.textContent=""; fb.className="qfeedback";
  document.getElementById("qExplain").innerHTML="";
  if(item.type==="fill"){
    document.getElementById("qOpts").innerHTML=`<input id="fillIn" class="fill" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false" placeholder="napiš slovo…"><button class="btn" style="margin-top:12px" onclick="submitFill()">Zkontrolovat · Check</button>`;
    const inp=document.getElementById("fillIn"); inp.addEventListener("keydown",e=>{ if(e.key==="Enter") submitFill(); }); setTimeout(()=>inp.focus(),100);
  } else {
    document.getElementById("qOpts").innerHTML=item.opts.map((o,i)=>`<button class="opt" onclick="answer(${i})">${o}</button>`).join("");
  }
  document.getElementById("quiz").scrollTop=0;
}
function record(item, correct){
  qResults.push({ skill:item.skill||"comprehension", correct, vocab:item._vocab||null });
  if(correct) qCorrect++;
  if(item._vocab) reviewWord(item._vocab, correct);
}
function afterAnswer(item, correct){
  const ex=document.getElementById("qExplain");
  if(item.explain && (item.trick || !correct)) ex.innerHTML=`<div class="explain-box">💡 ${item.explain}</div>`;
  else if(item.trick) ex.innerHTML=`<div class="explain-box">💡 Trick question — nicely handled.</div>`;
  const f=document.getElementById("footer"); f.classList.remove("hidden");
  const b=document.getElementById("footerBtn");
  if(qIndex<current.quiz.length-1){ b.textContent="Další · Next"; b.onclick=nextQuestion; }
  else { b.textContent="Hotovo · Finish"; b.onclick=finishQuiz; }
}
function answer(i){
  if(qLocked) return; qLocked=true;
  const item=current.quiz[qIndex];
  document.querySelectorAll("#qOpts .opt").forEach((b,bi)=>{ b.disabled=true; if(bi===item.a) b.classList.add("correct"); if(bi===i&&i!==item.a) b.classList.add("wrong"); });
  const ok=i===item.a, fb=document.getElementById("qFeedback");
  if(ok){ fb.textContent="Správně! ✓"; fb.className="qfeedback ok"; mascot("happy", pick(["Skvělé!","Výborně!","Super!","Přesně tak!"])); }
  else { fb.textContent="Skoro — správně je zelená."; fb.className="qfeedback no"; mascot("sad","To nevadí 💪"); }
  record(item,ok); afterAnswer(item,ok); save();
}
function submitFill(){
  if(qLocked) return; qLocked=true;
  const item=current.quiz[qIndex], inp=document.getElementById("fillIn");
  const ok=item.a.map(norm).includes(norm(inp.value));
  inp.disabled=true; inp.classList.add(ok?"ok":"bad");
  document.querySelector("#qOpts .btn").disabled=true;
  const fb=document.getElementById("qFeedback");
  if(ok){ fb.textContent="Správně! ✓"; fb.className="qfeedback ok"; mascot("happy","Přesně!"); }
  else { fb.textContent=`Skoro — správně: „${item.a[0]}"`; fb.className="qfeedback no"; mascot("sad","Příště to vyjde 💪"); }
  record(item,ok); afterAnswer(item,ok); save();
}
function nextQuestion(){ qIndex++; document.getElementById("footer").classList.add("hidden"); renderQuestion(); }
function pick(a){ return a[Math.floor(Math.random()*a.length)]; }

/* ===== FINISH / RESULTS ===== */
function finishQuiz(){
  const total=current.quiz.length, acc=qCorrect/total;
  qResults.forEach(r=>{ S.seen[r.skill]=(S.seen[r.skill]||0)+1; if(!r.correct) S.miss[r.skill]=(S.miss[r.skill]||0)+1; });

  if(mode==="srs"){
    S.xp+=qCorrect*10; bumpDay(qCorrect*10); markActivity(); save();
    renderResults({ acc, stars:acc>=1?3:acc>=0.66?2:acc>=0.33?1:0, gained:qCorrect*10, special:"srs" });
    return;
  }
  if(mode==="practice"){
    S.xp+=qCorrect*10; bumpDay(qCorrect*10); markActivity();
    if(acc>=0.7) delete S.miss[practiceSkill]; else S.miss[practiceSkill]=2;
    save();
    renderResults({ acc, stars:acc>=1?3:acc>=0.66?2:acc>=0.33?1:0, gained:qCorrect*10, special:"practice" });
    return;
  }
  if(mode==="boss"){
    const passed=acc>=0.8;
    let gained=qCorrect*XP_PER_CORRECT[S.level]+ (passed?100:0); S.xp+=gained; bumpDay(gained); markActivity();
    let move=null, prev=S.level;
    if(passed){
      S.bossPassed[S.level]=true;
      const idx=levelIdx(S.level);
      if(idx<LEVELS.length-1){ S.level=LEVELS[idx+1]; S.recent[S.level]=[]; move="up"; }
      award("boss");
    }
    save();
    renderResults({ acc, stars:passed?3:1, gained, move, prevLevel:prev, special:passed?"boss-pass":"boss-fail" });
    return;
  }

  // ---- normal story round ----
  const stars=acc>=1?3:acc>=0.66?2:acc>=0.33?1:0;
  let gained=qCorrect*XP_PER_CORRECT[S.level]; if(acc>=1) gained+=25; S.xp+=gained; bumpDay(gained);
  const firstEver=!Object.keys(S.stars).length;
  S.stars[current.id]=Math.max(S.stars[current.id]||0, stars);
  // enroll this story's words into SRS (she has now studied them)
  buildGlossary(current.text).forEach(([cz])=>enrollWord(cz,1));
  // streak
  markActivity();
  // rolling avg + gentle auto-level
  const lvl=S.level; (S.recent[lvl] ||= []).push(acc); if(S.recent[lvl].length>3) S.recent[lvl].shift();
  let move=null; const idx=levelIdx(lvl);
  if(S.recent[lvl].length>=3){
    const avg=S.recent[lvl].reduce((a,b)=>a+b,0)/S.recent[lvl].length;
    if(avg>=0.85 && idx<LEVELS.length-1){ S.level=LEVELS[idx+1]; S.recent[S.level]=[]; move="up"; }
    else if(avg<0.45 && idx>0){ S.level=LEVELS[idx-1]; S.recent[S.level]=[]; move="down"; }
  }
  // badges
  const newBadges=[];
  if(firstEver){ const b=award("first"); if(b) newBadges.push(b); }
  if(acc>=1){ const b=award("perfect"); if(b) newBadges.push(b); }
  if(S.streak>=3){ const b=award("streak3"); if(b) newBadges.push(b); }
  if(S.streak>=7){ const b=award("streak7"); if(b) newBadges.push(b); }
  const vs=vocabStats();
  if(vs.total>=25){ const b=award("words25"); if(b) newBadges.push(b); }
  if(vs.mastered>=100){ const b=award("words100"); if(b) newBadges.push(b); }
  if(levelIdx(S.level)>=levelIdx("C1")){ const b=award("c1"); if(b) newBadges.push(b); }

  const missedNow=qResults.filter(r=>!r.correct).map(r=>r.skill);
  const topMissed=missedNow.length?missedNow[0]:null;
  save();
  renderResults({ acc, stars, gained, move, prevLevel:lvl, topMissed, newBadges });
}
function bumpDay(x){ rollDay(); S.dayXp+=x; }

function renderResults({acc,stars,gained,move,prevLevel,topMissed,newBadges,special}){
  applyLevelColor(); renderHud();
  const pct=Math.round(acc*100);
  const ring=stars===3?"🏆":stars===2?"🎉":stars===1?"👍":"📖";
  let banner="";
  if(special==="boss-pass") banner=`<div class="banner up">🏅 Checkpoint passed, ${LEARNER}! You've officially certified ${prevLevel} — welcome to ${S.level}.</div>`;
  if(special==="boss-fail") banner=`<div class="banner down">So close! You need 80% to clear the checkpoint. Review a little and try again — you've got this.</div>`;
  if(move==="up" && special!=="boss-pass") banner=`<div class="banner up">⬆ Level up, ${LEARNER}! Moving from ${prevLevel} to ${S.level}.</div>`;
  if(move==="down") banner=`<div class="banner down">↺ No worries, ${LEARNER} — easing back to ${S.level} to lock in the basics.</div>`;

  let lesson="";
  if(topMissed && SKILLS[topMissed]) lesson=`<div class="lessoncall"><h4>📘 Quick lesson · ${SKILLS[topMissed].name}</h4><p>${SKILLS[topMissed].lesson}</p><button class="btn small" style="background:var(--gold)" onclick="openLesson('${topMissed}')">Procvičit toto · Practice this</button></div>`;

  let badgeHtml="";
  if(newBadges && newBadges.length) badgeHtml=`<div class="newbadges">${newBadges.map(b=>`<div class="nb">${b.icon}<span>${b.name}</span></div>`).join("")}</div>`;

  const msgs=[`Zkus to znovu, ${LEARNER} — every read makes the next one click.`,`Dobrý začátek, ${LEARNER}! Review the glossary and run it again.`,`Pěkně, ${LEARNER}! Strong comprehension.`,`Výborně, ${LEARNER}! Perfect round. 🎉`];
  let headline = special==="srs" ? `Opakování hotovo, ${LEARNER}!`
              : special==="practice" ? `Procvičování hotovo, ${LEARNER}!`
              : special==="match" ? `Spojování hotovo, ${LEARNER}!`
              : msgs[stars];
  const freezeBanner = S._streakEvent==="froze" ? `<div class="banner up">🛡️ Streak saved, ${LEARNER}! A banked freeze covered a missed day — you're still on a ${S.streak}-day streak 🔥.</div>` : "";

  document.getElementById("results").innerHTML=`<div class="result"><div class="ring">${ring}</div><h1>${pct}%</h1><div class="bigstars">${starString(stars)}</div><p>${headline}</p>${banner}${freezeBanner}${badgeHtml}${lesson}<div class="rewards"><div class="reward"><div class="v" style="color:var(--gold)">+${gained}</div><div class="l">XP</div></div><div class="reward"><div class="v">🔥 ${S.streak}</div><div class="l">streak</div></div></div></div>`;
  show("results");
  const f=document.getElementById("footer"); f.classList.remove("hidden");
  const b=document.getElementById("footerBtn"); b.textContent="Domů · Home"; b.onclick=goHome;

  if(stars===3 || special==="boss-pass" || move==="up"){ confetti(); mascot("celebrate", special==="boss-pass"?"Šampión! 🏅":"Skvělá práce! 🎉", true); }
  else if(stars>=2){ mascot("happy","Dobře! 👏", true); }
  else mascot("idle","");
}

/* ===== SKILL LESSON + TARGETED PRACTICE ===== */
function openLesson(skill){
  practiceSkill=skill;
  document.getElementById("lessonTitle").textContent=SKILLS[skill].name;
  document.getElementById("lessonSub").textContent="Mini-lekce · Mini-lesson";
  document.getElementById("lessonBody").innerHTML=SKILLS[skill].lesson;
  show("lesson");
  const f=document.getElementById("footer"); f.classList.remove("hidden");
  const b=document.getElementById("footerBtn");
  const pool=skillPool(skill);
  b.textContent=pool.length?`Procvičit (${Math.min(pool.length,5)} otázek) · Practice`:"Domů · Home";
  b.onclick=pool.length?()=>startPractice(skill):goHome;
  mascot("idle","");
}
function skillPool(skill){ const pool=[]; STORIES.forEach(s=>s.quiz.forEach(q=>{ if((q.skill||"comprehension")===skill) pool.push(q); })); return pool; }
function startPractice(skill){
  mode="practice"; practiceSkill=skill;
  let pool=shuffle(skillPool(skill)).slice(0,5);
  current={ titleCz:"Procvičování", titleEn:SKILLS[skill].name, quiz:pool };
  startQuiz();
}

/* ===== SRS REVIEW SESSION ===== */
function startSrs(){
  mode="srs";
  const due=shuffle(dueWords()).slice(0,8);
  const quiz=due.map(vocabQuestion);
  if(!quiz.length){ goHome(); return; }
  current={ titleCz:"Opakování slovíček", titleEn:"Word review", quiz };
  startQuiz();
}

/* ===== WORD MATCH (tap-to-match vocab recap) =====
   6 Czech buttons on the left, 6 English on the right (each column independently
   shuffled). Tap a Czech word then its English match. Correct = both lock green and
   the word gets a spaced-repetition credit. Pulls her most-recently-learned words first. */
let matchBoards=[], matchBoardIdx=0, matchPairs=[], matchLeft=[], matchRight=[],
    selL=null, selR=null, matchLock=false, matchedThisBoard=0,
    matchClean=0, matchTotal=0, matchDirty=new Set();

function matchEnFor(cz){ return (S.vocab[cz]&&S.vocab[cz].en) || (VOCAB_INDEX[cz]&&VOCAB_INDEX[cz].en) || ""; }
function recentVocab(limit){
  // most-recently-learned first; top up from the current level's stories if she's new
  let keys=Object.keys(S.vocab).filter(cz=>matchEnFor(cz));
  keys.sort((a,b)=>(S.vocab[b].added||0)-(S.vocab[a].added||0) || (S.vocab[a].due-S.vocab[b].due));
  let pool=keys.slice(0,limit);
  if(pool.length<6){
    const seen=new Set(pool);
    storiesAt(S.level).forEach(s=>buildGlossary(s.text).forEach(([cz])=>{ if(!seen.has(cz)&&VOCAB_INDEX[cz]){ seen.add(cz); pool.push(cz); } }));
    pool=pool.slice(0,Math.max(6,limit));
  }
  return pool;
}
function matchAvailable(){ return recentVocab(18).length>=4; }

function startMatch(){
  if(window.speechSynthesis) speechSynthesis.cancel();
  mode="match";
  const pool=shuffle(recentVocab(18));
  if(pool.length<4){ goHome(); return; }
  matchBoards=[]; for(let i=0;i<pool.length;i+=6) matchBoards.push(pool.slice(i,i+6));
  // don't leave a lonely 1-word final board
  if(matchBoards.length>1 && matchBoards[matchBoards.length-1].length===1){
    matchBoards[matchBoards.length-2]=matchBoards[matchBoards.length-2].concat(matchBoards.pop());
  }
  matchBoardIdx=0; matchClean=0; matchTotal=0;
  show("match"); document.getElementById("footer").classList.add("hidden");
  renderMatchBoard();
  mascot("idle","");
}
function renderMatchBoard(){
  matchLock=false; selL=null; selR=null; matchedThisBoard=0; matchDirty=new Set();
  matchPairs=matchBoards[matchBoardIdx].map(cz=>({cz, en:matchEnFor(cz)}));
  matchLeft=shuffle(matchPairs.map(p=>p.cz));
  matchRight=shuffle(matchPairs.map(p=>p.en));
  document.getElementById("match").innerHTML=`
    <div class="topnav"><button class="back" onclick="goHome()">‹ Zpět</button></div>
    <div class="qcount" id="mCount"></div>
    <div class="mtip">Spoj slovo s překladem · Tap a Czech word, then its English match.</div>
    <div class="cols">
      <div class="mcol cz">${matchLeft.map((cz,i)=>`<button class="mbtn" id="L${i}" onclick="matchTap('L',${i})">${cz}</button>`).join("")}</div>
      <div class="mcol en">${matchRight.map((en,i)=>`<button class="mbtn" id="R${i}" onclick="matchTap('R',${i})">${en}</button>`).join("")}</div>
    </div>`;
  updateMatchCount();
  document.getElementById("match").scrollTop=0;
}
function updateMatchCount(){
  document.getElementById("mCount").textContent=`KOLO ${matchBoardIdx+1}/${matchBoards.length} · ${matchedThisBoard}/${matchPairs.length}`;
}
function matchTap(side,i){
  if(matchLock) return;
  const btn=document.getElementById(side+i);
  if(!btn || btn.classList.contains("matched")) return;
  if(side==="L"){ if(selL!=null) document.getElementById("L"+selL).classList.remove("sel"); selL=i; }
  else { if(selR!=null) document.getElementById("R"+selR).classList.remove("sel"); selR=i; }
  btn.classList.add("sel");
  if(selL!=null && selR!=null) evalMatch();
}
function evalMatch(){
  const cz=matchLeft[selL], en=matchRight[selR];
  const lb=document.getElementById("L"+selL), rb=document.getElementById("R"+selR);
  if(matchEnFor(cz)===en){
    lb.classList.remove("sel"); rb.classList.remove("sel");
    lb.classList.add("matched"); rb.classList.add("matched");
    const wasDirty=matchDirty.has(cz);
    reviewWord(cz, !wasDirty);            // clean match advances SRS; messy one re-queues sooner
    matchTotal++; if(!wasDirty) matchClean++;
    matchedThisBoard++; selL=null; selR=null;
    save(); updateMatchCount();
    mascot("happy", pick(["✓","Super!","Přesně!","Bravo!"]));
    if(matchedThisBoard>=matchPairs.length){ matchLock=true; setTimeout(nextMatchBoard,650); }
  } else {
    matchLock=true; matchDirty.add(cz);
    lb.classList.add("bad"); rb.classList.add("bad");
    mascot("sad","Zkus to znovu");
    const sl=selL, sr=selR;
    setTimeout(()=>{
      const a=document.getElementById("L"+sl), b=document.getElementById("R"+sr);
      if(a) a.classList.remove("bad","sel"); if(b) b.classList.remove("bad","sel");
      selL=null; selR=null; matchLock=false;
    },600);
  }
}
function nextMatchBoard(){
  matchBoardIdx++;
  if(matchBoardIdx>=matchBoards.length){ finishMatch(); return; }
  renderMatchBoard();
}
function finishMatch(){
  const acc = matchTotal ? matchClean/matchTotal : 1;
  const stars = acc>=1?3:acc>=0.66?2:acc>=0.33?1:0;
  const gained = matchTotal*8;
  S.xp+=gained; bumpDay(gained); markActivity(); save();
  renderResults({ acc, stars, gained, special:"match" });
}

/* ===== BOSS CHECKPOINT ===== */
function startBoss(){
  mode="boss";
  const lvl=S.level;
  // pull all questions from this level's stories, prefer trick + variety, cap ~8
  let pool=[]; storiesAt(lvl).forEach(s=>s.quiz.forEach(q=>pool.push(q)));
  // add a couple harder items from next level for a real challenge
  const nxt=LEVELS[levelIdx(lvl)+1];
  if(nxt) storiesAt(nxt).forEach(s=>s.quiz.slice(0,1).forEach(q=>pool.push(q)));
  pool=shuffle(pool); pool=pool.slice(0, Math.min(8, pool.length));
  current={ titleCz:"Boss checkpoint", titleEn:`Level ${lvl} challenge`, quiz:pool };
  mascot("think","Ukaž, co umíš! 💪", true);
  startQuiz();
}

/* ===== PLACEMENT TEST ===== */
let placeIdx=0, placeScore={}, placeQs=[];
function buildPlacement(){
  // Self-contained vocabulary questions of increasing level. Comprehension
  // questions can't be used here (they'd reference an unread story), so we test
  // "what does this word mean?" with level-graded vocab — a clean difficulty signal.
  const order=["A1","A2","B1","B1","B2","B2","C1","C1"];
  const qs=[], used=new Set();
  order.forEach(l=>{
    const words=shuffle((VOCAB_BY_LEVEL[l]||[]).filter(w=>!used.has(w)));
    let chosen=null;
    for(const w of words){ if((VOCAB_INDEX[w].en||"").length){ chosen=w; break; } }
    if(!chosen) return;
    used.add(chosen);
    const correct=VOCAB_INDEX[chosen].en;
    const pool=Object.keys(VOCAB_INDEX).filter(x=>x!==chosen && VOCAB_INDEX[x].en!==correct);
    const distractors=[]; const seen=new Set([correct]);
    while(distractors.length<2 && pool.length){
      const x=pool.splice(Math.floor(Math.random()*pool.length),1)[0];
      if(!seen.has(VOCAB_INDEX[x].en)){ distractors.push(VOCAB_INDEX[x].en); seen.add(VOCAB_INDEX[x].en); }
    }
    const opts=shuffle([correct,...distractors]);
    qs.push({ q:`Co znamená „${chosen}"?`, opts, a:opts.indexOf(correct), _level:l });
  });
  return qs;
}
function openPlacement(){
  placeQs=buildPlacement(); placeIdx=0; placeScore={};
  show("placement"); document.getElementById("footer").classList.add("hidden");
  renderPlacement();
}
function renderPlacement(){
  const wrap=document.getElementById("placement");
  if(placeIdx>=placeQs.length){ finishPlacement(); return; }
  const q=placeQs[placeIdx], total=placeQs.length;
  wrap.innerHTML=`
    <div class="placeintro ${placeIdx===0?'':'hidden'}"></div>
    <div class="qcount">RYCHLÝ TEST · ${placeIdx+1} / ${total}</div>
    <div class="qtext">${q.q}</div>
    <div id="pOpts">${q.opts.map((o,i)=>`<button class="opt" onclick="placeAnswer(${i})">${o}</button>`).join("")}</div>
    <div class="qfeedback" id="pFb"></div>`;
  wrap.scrollTop=0;
}
function placeAnswer(i){
  const q=placeQs[placeIdx]; const ok=i===q.a;
  placeScore[q._level]=(placeScore[q._level]||0); if(ok) placeScore[q._level]++;
  document.querySelectorAll("#pOpts .opt").forEach((b,bi)=>{ b.disabled=true; if(bi===q.a) b.classList.add("correct"); if(bi===i&&i!==q.a) b.classList.add("wrong"); });
  setTimeout(()=>{ placeIdx++; renderPlacement(); }, 650);
}
function finishPlacement(){
  // Walk levels upward; she "clears" a level only by getting ALL its questions
  // right. Stop at the first level she doesn't fully clear, and place her there.
  // This avoids over-placing a lucky guesser (one fluked C1 answer no longer
  // vaults her to C1). The adaptive engine bumps her up quickly if under-placed.
  const total={}; placeQs.forEach(q=>{ total[q._level]=(total[q._level]||0)+1; });
  let best="A1";
  for(const l of ["A1","A2","B1","B2","C1"]){
    if(!total[l]) continue;
    if((placeScore[l]||0) >= total[l]) best=l;  // cleared every question at this level
    else break;                                  // first stumble → stop here
  }
  S.level=best; S.placed=true; save();
  mascot("celebrate",`Začneme na úrovni ${best}! 🎯`, true);
  confetti();
  goHome();
}
function skipPlacement(){ S.placed=true; save(); closeSettings(); goHome(); }

/* ===== SETTINGS ===== */
function openSettings(){
  document.getElementById("lvlPicker").innerHTML=LEVELS.map(l=>`<div class="lvlbtn ${l===S.level?'sel':''}" data-l="${l}" onclick="pickLevel('${l}')">${l}</div>`).join("");
  renderReminderBox();
  document.getElementById("scrim").classList.add("show");
}
function closeSettings(){ document.getElementById("scrim").classList.remove("show"); }
function pickLevel(l){ S.level=l; save(); document.querySelectorAll(".lvlbtn").forEach(b=>b.classList.toggle("sel",b.dataset.l===l)); renderHome(); }
function startPlacementFromSettings(){ closeSettings(); openPlacement(); }
function resetAll(){ if(!confirm("Reset all of "+LEARNER+"'s progress?")) return; S=clone(DEFAULTS); save(); closeSettings(); location.reload(); }
document.getElementById("scrim").addEventListener("click",e=>{ if(e.target.id==="scrim") closeSettings(); });

/* ===== DAILY REMINDERS (Web Push) ===== */
const VAPID_PUBLIC_KEY = "BH7uA5Qe3jESy1Xe-WiJeHpxex7SrKDhm_WwDzPf_H_eCqSsASLu5n88ZB5Ldt2kQFzQAVMGuLlWouqRfbJfPpQ";
function urlB64ToUint8Array(b64){
  const pad="=".repeat((4 - b64.length % 4) % 4);
  const base64=(b64+pad).replace(/-/g,"+").replace(/_/g,"/");
  const raw=atob(base64), arr=new Uint8Array(raw.length);
  for(let i=0;i<raw.length;i++) arr[i]=raw.charCodeAt(i);
  return arr;
}
const pushSupported = ("serviceWorker" in navigator) && ("PushManager" in window) && ("Notification" in window);
const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone===true;

function renderReminderBox(){
  const box=document.getElementById("reminderBox"); if(!box) return;
  if(!pushSupported){
    box.innerHTML=`<div class="rem-h">🔔 Denní připomínka · Daily reminder</div><p class="rem-note">To get reminders, open this app from the Home Screen (Share ▸ Add to Home Screen), then reopen and try here.</p>`;
    return;
  }
  const perm = (typeof Notification!=="undefined") ? Notification.permission : "default";
  if(S.remindersOn && perm==="granted"){
    box.innerHTML=`<div class="rem-h">🔔 Denní připomínka · Daily reminder</div><p class="rem-note">Reminders are on for this device. If you haven't yet, send your reminder code to Jan so he can switch them on.</p><button class="btn ghost small" onclick="enableReminders()">Show my reminder code again</button>`;
  } else {
    const hint = (!isStandalone) ? `<p class="rem-note">Tip: add the app to your Home Screen first (Share ▸ Add to Home Screen) — iPhone only allows reminders from there.</p>` : ``;
    box.innerHTML=`<div class="rem-h">🔔 Denní připomínka · Daily reminder</div><p class="rem-note">A gentle daily nudge to keep your streak going.</p>${hint}<button class="btn small" style="background:var(--lvl)" onclick="enableReminders()">Zapnout · Enable</button>`;
  }
}
async function enableReminders(){
  const box=document.getElementById("reminderBox");
  try{
    const perm=await Notification.requestPermission();
    if(perm!=="granted"){ box.innerHTML=`<div class="rem-h">🔔 Daily reminder</div><p class="rem-note" style="color:var(--red)">Notifications weren't allowed. You can turn them on in your phone's Settings for this app, then try again.</p>`; return; }
    const reg=await navigator.serviceWorker.ready;
    let sub=await reg.pushManager.getSubscription();
    if(!sub) sub=await reg.pushManager.subscribe({ userVisibleOnly:true, applicationServerKey:urlB64ToUint8Array(VAPID_PUBLIC_KEY) });
    S.remindersOn=true; save();
    const code=btoa(JSON.stringify(sub));
    showReminderCode(code);
  }catch(e){
    box.innerHTML=`<div class="rem-h">🔔 Daily reminder</div><p class="rem-note" style="color:var(--red)">Couldn't enable: ${e.message}. On iPhone, open the app from the Home Screen icon (not the Safari tab) and try again.</p>`;
  }
}
function showReminderCode(code){
  const box=document.getElementById("reminderBox");
  box.innerHTML=`<div class="rem-h">✅ Skoro hotovo · Almost done</div>
    <p class="rem-note">Reminders are set up on this device. <b>Copy this code and send it to Jan</b> — he switches on your daily reminder. (One-time only.)</p>
    <textarea class="rem-code" id="remCode" readonly>${code}</textarea>
    <button class="btn small" style="background:var(--lvl)" onclick="copyReminderCode()">📋 Kopírovat kód · Copy code</button>
    <span id="remCopied" class="rem-copied"></span>`;
}
function copyReminderCode(){
  const t=document.getElementById("remCode"); t.select();
  const done=()=>{ document.getElementById("remCopied").textContent=" ✓ zkopírováno"; };
  if(navigator.clipboard) navigator.clipboard.writeText(t.value).then(done, ()=>{ document.execCommand("copy"); done(); });
  else { document.execCommand("copy"); done(); }
}

/* ===== BOOT ===== */
load();
if(!S.placed){
  // first-ever open: offer placement
  document.getElementById("welcome").innerHTML="";
  openPlacementWelcome();
} else {
  renderHome();
}
function openPlacementWelcome(){
  show("placement");
  document.getElementById("footer").classList.add("hidden");
  document.getElementById("placement").innerHTML=`
    <div class="welcomebig">
      <div class="mole-hi">🦔</div>
      <h1>Ahoj ${LEARNER}! 👋</h1>
      <p>Vítej ve své češtině. Let's find your level with 8 quick questions — no pressure, it just decides where to start.</p>
      <button class="btn" onclick="openPlacement()">Začít rychlý test · Start</button>
      <button class="btn ghost" style="margin-top:10px" onclick="skipPlacement()">Přeskočit · Skip (start at A2)</button>
    </div>`;
}
