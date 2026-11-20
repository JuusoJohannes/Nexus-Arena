(() => {
"use strict";
const KEY="nexusArenaSave_v1";
const fresh=()=>({name:"PLAYER ONE",coins:0,xp:0,games:0,hits:0,records:{reflex:0,memory:0,numbers:0},unlocked:["cyan"],theme:"cyan",claimedDay:"",claimedMissions:[],achievements:[],settings:{sound:false,vibration:false}});
let data;
try{data={...fresh(),...JSON.parse(localStorage.getItem(KEY)||"{}")};data.records={...fresh().records,...(data.records||{})};data.settings={...fresh().settings,...(data.settings||{})};}catch{data=fresh();}
let toastTimer,gameTimer,session={};
const $=id=>document.getElementById(id);
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(data));}catch(e){notify("Tallennus ei onnistunut tässä selaimessa.");}render();};
const level=()=>Math.floor(data.xp/100)+1;
const rank=()=>level()>=15?"Nexus Elite":level()>=8?"Veteran":level()>=4?"Operator":"Rookie";
function notify(msg){const el=$("toast");el.textContent=msg;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2300);}
function sound(freq=520){if(!data.settings.sound)return;try{const c=new(window.AudioContext||window.webkitAudioContext)(),o=c.createOscillator(),g=c.createGain();o.frequency.value=freq;g.gain.value=.035;o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.08);o.onended=()=>c.close();}catch{}}
function vibrate(){if(data.settings.vibration&&navigator.vibrate)navigator.vibrate(20);}
function go(page){document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));$("page-"+page)?.classList.add("active");document.querySelectorAll("[data-page]").forEach(b=>b.classList.toggle("active",b.dataset.page===page));window.scrollTo({top:0,behavior:"smooth"});}
function award({xp=0,coins=0}={}){data.xp+=xp;data.coins+=coins;save();}
function render(){
 const lv=level(),progress=data.xp%100;
 $("top-coins").textContent=data.coins;$("home-coins").textContent=data.coins;$("shop-coins").textContent=data.coins;
 $("welcome-name").textContent=data.name;$("home-level").textContent=lv;$("home-xp").textContent=data.xp;$("home-games").textContent=data.games;
 $("home-rank").textContent=rank();$("level-pill").textContent="LVL "+lv;$("xp-progress-label").textContent=progress+" / 100 XP";$("xp-percent").textContent=progress+"%";$("xp-progress").style.width=progress+"%";
 $("profile-avatar").textContent=initials(data.name);$("profile-display-name").textContent=data.name;$("profile-level").textContent="LEVEL "+lv;$("profile-rank").textContent=rank();
 $("profile-games").textContent=data.games;$("profile-xp").textContent=data.xp;$("profile-achievements").textContent=data.achievements.length;
 $("best-reflex").textContent=data.records.reflex;$("best-memory").textContent=data.records.memory;$("best-numbers").textContent=data.records.numbers;
 $("sound-toggle").checked=data.settings.sound;$("vibration-toggle").checked=data.settings.vibration;
 const today=new Date().toDateString(),claimed=data.claimedDay===today;
 $("daily-claim").disabled=claimed;$("daily-claim").textContent=claimed?"BONUS LUNASTETTU":"LUNASTA +50 NC";$("daily-status").textContent=claimed?"Päivän bonus on jo lunastettu.":"Päivittäinen bonus on käytettävissä.";
 $("today-label").textContent=new Intl.DateTimeFormat("fi-FI",{weekday:"short",day:"numeric",month:"short"}).format(new Date()).toUpperCase();
 renderMissions();renderAchievements();renderShop();renderHeaderTheme();
}
function initials(s){return s.trim().split(/\s+/).slice(0,2).map(x=>x[0]||"").join("").toUpperCase()||"P1";}
const missions=[
 {id:"first",icon:"✦",name:"Ensimmäinen yhteys",desc:"Pelaa mikä tahansa peli ensimmäistä kertaa.",reward:40,xp:20,check:()=>data.games>=1},
 {id:"five",icon:"⌁",name:"Arcade-veteraani",desc:"Pelaa yhteensä viisi peliä.",reward:75,xp:35,check:()=>data.games>=5},
 {id:"hits",icon:"◎",name:"Tarkka tähtääjä",desc:"Kerää 30 osumaa Neon Reflexissä.",reward:60,xp:30,check:()=>data.hits>=30},
 {id:"level",icon:"↗",name:"Tasolle kaksi",desc:"Saavuta pelaajataso 2.",reward:50,xp:25,check:()=>level()>=2},
 {id:"memory",icon:"▦",name:"Muistimestari",desc:"Selvitä Memory Gridin vähintään kolmas kierros.",reward:80,xp:40,check:()=>data.records.memory>=3},
 {id:"rush",icon:"01",name:"Numeromestari",desc:"Selvitä Number Rushin kaikki 20 numeroa.",reward:100,xp:50,check:()=>data.records.numbers>=20}
];
function renderMissions(){
 $("mission-list").innerHTML=missions.map(m=>{let done=m.check(),claimed=data.claimedMissions.includes(m.id);return `<div class="mission-item"><div class="mission-icon">${m.icon}</div><div class="mission-copy"><strong>${m.name}</strong><p>${m.desc}</p></div><div class="mission-reward">+${m.reward} NC<br>+${m.xp} XP</div><button class="secondary-btn mission-action" data-mission="${m.id}" ${!done||claimed?"disabled":""}>${claimed?"SAATU":done?"LUNASTA":"KESKEN"}</button></div>`}).join("");
}
const achievements=[
 {id:"play1",icon:"🎮",name:"Ensimmäinen peli",desc:"Pelaa ensimmäinen pelisi.",check:()=>data.games>=1},
 {id:"play10",icon:"⚡",name:"Vakipelaaja",desc:"Pelaa kymmenen peliä.",check:()=>data.games>=10},
 {id:"rich",icon:"◈",name:"Krediittikeräilijä",desc:"Kerää 500 Nexus Coinia.",check:()=>data.coins>=500},
 {id:"xp100",icon:"✧",name:"XP Hunter",desc:"Kerää 100 kokemuspistettä.",check:()=>data.xp>=100},
 {id:"reflex",icon:"⌁",name:"Nopeat refleksit",desc:"Saa Neon Reflexissä 100 pistettä.",check:()=>data.records.reflex>=100},
 {id:"memory",icon:"▦",name:"Muistipankki",desc:"Selvitä Memory Gridin 5. kierros.",check:()=>data.records.memory>=5},
 {id:"numbers",icon:"01",name:"Numerosankari",desc:"Valitse kaikki 20 numeroa.",check:()=>data.records.numbers>=20},
 {id:"level5",icon:"♜",name:"Kokenut operaattori",desc:"Saavuta taso 5.",check:()=>level()>=5},
 {id:"themes",icon:"🎨",name:"Tyylitaju",desc:"Avaa toinen teema.",check:()=>data.unlocked.length>=2}
];
function renderAchievements(){
 achievements.forEach(a=>{if(a.check()&&!data.achievements.includes(a.id)){data.achievements.push(a.id);}});
 $("achievement-list").innerHTML=achievements.map(a=>{let ok=data.achievements.includes(a.id);return `<article class="achievement ${ok?"":"locked"}"><div class="achievement-icon">${ok?a.icon:"🔒"}</div><strong>${a.name}</strong><p>${a.desc}</p><small>${ok?"✓ AVATTU":"LUKITTU"}</small></article>`}).join("");
}
const themes=[
 {id:"cyan",name:"Neon Cyan",desc:"NEXUSin alkuperäinen neon-ilme.",price:0,preview:"preview-cyan"},
 {id:"purple",name:"Quantum Violet",desc:"Syvä violetti ja galaksin sävyt.",price:120,preview:"preview-purple"},
 {id:"green",name:"Matrix Pulse",desc:"Digitaalinen vihreä käyttöliittymä.",price:180,preview:"preview-green"},
 {id:"amber",name:"Solar Flare",desc:"Lämmin kulta ja oranssi neon.",price:250,preview:"preview-amber"}
];
function renderShop(){
 $("shop-list").innerHTML=themes.map(t=>{let owned=data.unlocked.includes(t.id),active=data.theme===t.id;return `<article class="shop-item"><div class="theme-preview ${t.preview}">✧</div><h3>${t.name}</h3><p>${t.desc}</p><div class="shop-bottom"><span class="shop-price">${t.price?`◈ ${t.price} NC`:"ILMAINEN"}</span><button class="${active?"secondary-btn":"primary-btn"}" data-theme="${t.id}" ${active?"disabled":""}>${active?"KÄYTÖSSÄ":owned?"VALITSE": "AVAA"}</button></div></article>`}).join("");
}
function renderHeaderTheme(){
 const colors={cyan:["#080b16","#43e7f5"],purple:["#0d0a18","#b59aff"],green:["#07130f","#72e6b1"],amber:["#171008","#ffd17b"]};
 const c=colors[data.theme]||colors.cyan;document.documentElement.style.setProperty("--bg",c[0]);document.documentElement.style.setProperty("--accent",c[1]);
}
function finishGame(type,score,extra={}) {
 clearInterval(gameTimer);data.games++;data.records[type]=Math.max(data.records[type]||0,score);
 if(type==="reflex")data.hits+=extra.hits||0;
 const xp=Math.max(5,Math.floor(score/2)),coins=Math.max(3,Math.floor(score/5));
 data.xp+=xp;data.coins+=coins;save();sound(720);
 $("modal-game-content").innerHTML=`<div class="result-box"><div class="eyebrow">SESSION COMPLETE</div><h3>${extra.title||"Hyvä peli!"}</h3><div class="result-score">${score}</div><p class="muted">Pistettä / kierrosta</p><div class="game-hud"><span>+${xp}<b>XP</b></span><span>+${coins}<b>NC</b></span></div><button class="primary-btn" id="play-again">PELAA UUDELLEEN ↗</button></div>`;
 $("play-again").onclick=()=>launch(type);
}
function openModal(){ $("game-modal").classList.add("open");$("game-modal").setAttribute("aria-hidden","false");}
function closeModal(){clearInterval(gameTimer);$("game-modal").classList.remove("open");$("game-modal").setAttribute("aria-hidden","true");}
function launch(type){
 openModal();
 if(type==="reflex")startReflex();
 if(type==="memory")startMemory();
 if(type==="numbers")startNumbers();
}
function startReflex(){
 $("modal-title").textContent="NEON REFLEX";
 $("modal-game-content").innerHTML=`<div class="game-hud"><span>PISTEET<b id="g-score">0</b></span><span>AIKA<b id="g-time">20</b></span><span>OSUMAT<b id="g-hits">0</b></span></div><div class="game-stage"><p class="game-instruction" id="g-instruction">Osu hehkuvaan kohteeseen mahdollisimman monta kertaa!</p><div class="reflex-zone" id="reflex-zone"><button class="reflex-target" id="reflex-target" aria-label="Osu kohteeseen"></button></div><p class="muted small">20 sekuntia • Jokainen osuma = 10 pistettä</p></div><button class="primary-btn full-btn" id="reflex-start">ALOITA 20 SEKUNNIN PELI</button>`;
 let score=0,hits=0,time=20,active=false;
 const target=$("reflex-target"),zone=$("reflex-zone");
 function move(){const maxX=zone.clientWidth-60,maxY=zone.clientHeight-60;target.style.left=Math.max(0,Math.random()*maxX)+"px";target.style.top=Math.max(0,Math.random()*maxY)+"px";}
 target.style.display="none";
 $("reflex-start").onclick=()=>{if(active)return;active=true;$("reflex-start").disabled=true;$("g-instruction").textContent="NYT! OSU KOHTEESEEN!";target.style.display="block";move();gameTimer=setInterval(()=>{$("g-time").textContent=--time;if(time<=0){active=false;finishGame("reflex",score,{hits,title:"Neon Reflex valmis!"});}},1000);};
 target.onclick=()=>{if(!active)return;score+=10;hits++;$("g-score").textContent=score;$("g-hits").textContent=hits;move();sound(440+Math.min(hits*12,500));vibrate();};
}
function startMemory(){
 $("modal-title").textContent="MEMORY GRID";
 $("modal-game-content").innerHTML=`<div class="game-hud"><span>KIERROS<b id="m-round">1</b></span><span>ENNÄTYS<b>5</b></span></div><div class="game-stage"><p class="game-instruction" id="m-instruction">Katso valojen järjestys ja toista se napauttamalla ruutuja.</p><div class="memory-grid" id="memory-grid">${Array.from({length:9},(_,i)=>`<button class="memory-cell" data-cell="${i}" aria-label="Ruutu ${i+1}">＋</button>`).join("")}</div><button class="primary-btn" id="memory-start">ALOITA</button></div>`;
 let sequence=[],input=[],round=1,accept=false;
 const cells=[...document.querySelectorAll(".memory-cell")];
 const wait=ms=>new Promise(r=>setTimeout(r,ms));
 async function flash(i){cells[i].classList.add("lit");sound(500+i*35);await wait(430);cells[i].classList.remove("lit");await wait(160);}
 async function show(){accept=false;$("m-instruction").textContent="KATSO JÄRJESTYS...";for(const i of sequence)await flash(i);accept=true;input=[];$("m-instruction").textContent="TOISTA JÄRJESTYS!";}
 $("memory-start").onclick=async()=>{$("memory-start").disabled=true;sequence=[Math.floor(Math.random()*9)];await show();};
 cells.forEach((cell)=>cell.onclick=async()=>{if(!accept)return;const i=Number(cell.dataset.cell);await flash(i);if(i!==sequence[input.length]){accept=false;finishGame("memory",round-1,{title:"Melkein! Kokeile uudelleen."});return;}input.push(i);if(input.length===sequence.length){accept=false;if(round>=5){finishGame("memory",5,{title:"Muistimestari!"});return;}round++;$("m-round").textContent=round;sequence.push(Math.floor(Math.random()*9));setTimeout(show,450);}});
}
function startNumbers(){
 $("modal-title").textContent="NUMBER RUSH";
 $("modal-game-content").innerHTML=`<div class="game-hud"><span>SEURAAVA<b id="n-next">1</b></span><span>AIKA<b id="n-time">30</b></span><span>OSUMAT<b id="n-score">0</b></span></div><div class="game-stage"><p class="game-instruction" id="n-instruction">Valitse numerot 1–20 oikeassa järjestyksessä.</p><div class="number-grid" id="number-grid"></div><button class="primary-btn" id="number-start">ALOITA HAASTE</button></div>`;
 let next=1,time=30,active=false;const grid=$("number-grid");
 const nums=Array.from({length:20},(_,i)=>i+1).sort(()=>Math.random()-.5);
 grid.innerHTML=nums.map(n=>`<button class="number-cell" data-number="${n}">${n}</button>`).join("");
 $("number-start").onclick=()=>{active=true;$("number-start").disabled=true;gameTimer=setInterval(()=>{$("n-time").textContent=--time;if(time<=0){active=false;finishGame("numbers",next-1,{title:"Aika loppui!"});}},1000);};
 grid.querySelectorAll("button").forEach(b=>b.onclick=()=>{if(!active)return;const n=Number(b.dataset.number);if(n===next){b.classList.add("done");b.disabled=true;next++;$("n-next").textContent=next;$("n-score").textContent=next-1;sound(500);vibrate();if(next===21){active=false;finishGame("numbers",20,{title:"Täydellinen suoritus!"});}}else{b.classList.add("wrong");setTimeout(()=>b.classList.remove("wrong"),250);sound(180);}});
}
document.addEventListener("click",e=>{
 const page=e.target.closest("[data-page]");if(page)go(page.dataset.page);
 const link=e.target.closest("[data-page-link]");if(link)go(link.dataset.pageLink);
 const launchBtn=e.target.closest("[data-launch]");if(launchBtn)launch(launchBtn.dataset.launch);
 const mission=e.target.closest("[data-mission]");if(mission){const m=missions.find(x=>x.id===mission.dataset.mission);if(m&&m.check()&&!data.claimedMissions.includes(m.id)){data.claimedMissions.push(m.id);data.coins+=m.reward;data.xp+=m.xp;save();notify("Tehtävä suoritettu! Palkinto lunastettu.");}}
 const theme=e.target.closest("[data-theme]");if(theme){const t=themes.find(x=>x.id===theme.dataset.theme);if(!t)return;if(data.unlocked.includes(t.id)){data.theme=t.id;save();notify("Teema vaihdettu.");}else if(data.coins>=t.price){data.coins-=t.price;data.unlocked.push(t.id);data.theme=t.id;save();notify("Uusi teema avattu!");}else notify("Krediitit eivät riitä.");}
});
$("daily-claim").onclick=()=>{if(data.claimedDay===new Date().toDateString())return;data.claimedDay=new Date().toDateString();data.coins+=50;save();notify("Päivän bonus +50 NC lunastettu!");sound(650);};
$("save-name").onclick=()=>{const n=$("name-input").value.trim().replace(/[<>]/g,"").slice(0,18);if(!n){notify("Kirjoita ensin pelaajan nimi.");return;}data.name=n.toUpperCase();save();notify("Profiilin nimi tallennettu.");};
$("avatar-open").onclick=()=>go("profile");
$("close-modal").onclick=closeModal;
$("game-modal").addEventListener("click",e=>{if(e.target===$("game-modal"))closeModal();});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();});
$("sound-toggle").onchange=e=>{data.settings.sound=e.target.checked;save();};
$("vibration-toggle").onchange=e=>{data.settings.vibration=e.target.checked;save();};
$("export-data").onclick=()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="nexus-arena-save.json";a.click();URL.revokeObjectURL(url);notify("Varmuuskopio ladattu.");};
$("import-data").onchange=async e=>{const file=e.target.files[0];if(!file)return;try{const incoming=JSON.parse(await file.text());if(!incoming||typeof incoming!=="object"||!incoming.records)throw Error();data={...fresh(),...incoming,records:{...fresh().records,...incoming.records},settings:{...fresh().settings,...incoming.settings}};save();notify("Tallennus palautettu.");}catch{notify("Tiedosto ei ole kelvollinen NEXUS-varmuuskopio.");}e.target.value="";};
$("reset-data").onclick=()=>{if(!confirm("Haluatko varmasti poistaa kaikki NEXUS ARENA -tietosi tältä selaimelta? Vie ensin varmuuskopio, jos haluat säilyttää ne."))return;data=fresh();save();$("name-input").value="";notify("Pelitiedot nollattu.");};
$("name-input").value=data.name;
render();
if("serviceWorker" in navigator && location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
})();