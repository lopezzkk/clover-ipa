// ===================== V91 · visual "Grimório": HUD e menu inicial novos (azul-noite, ouro e carmesim) =====================
// Tudo fica sob body.rpg2. O visual antigo continua disponível em Configurações > VISUAL > Clássico.
{const css=`
body.rpg2{--r-nv1:#1a2150;--r-nv2:#0c1024;--r-nv3:#262f6e;--r-gd:#d8b45a;--r-gd2:#f3dc95;--r-gd3:#8a6a2a;--r-cr:#9a1f2e;--r-cr2:#d8404c;--r-pa:#ecdfbf;--r-pa2:#d6c193;--r-ink:#3a2814;--r-f:'Cinzel',Georgia,'Noto Serif','DejaVu Serif',serif}
body.rpg2 #hud{--neon:#d8b45a;--neo2:#f3dc95;--pan:rgba(14,18,44,.88);--pan2:rgba(28,34,78,.92);--gold:#f0cf72;color:#f2e8cf}
/* ---------- ficha do jogador ---------- */
body.rpg2 #portrait{border:3px solid var(--r-gd);box-shadow:0 0 0 2px var(--r-nv2),0 0 0 4px var(--r-cr),0 3px 10px #000b;background:var(--r-nv2)}
body.rpg2 #pbg stop:first-child{stop-color:#3b4690}body.rpg2 #pbg stop:last-child{stop-color:#0c1024}
body.rpg2 .lvb{border:0;border-radius:0;background:linear-gradient(180deg,var(--r-cr2),var(--r-cr) 55%,#5a0c18);color:var(--r-pa);font-family:var(--r-f);font-weight:900;clip-path:polygon(0 0,100% 0,100% 62%,50% 100%,0 62%);padding-bottom:3px;min-width:clamp(20px,6vh,26px);height:clamp(22px,6.6vh,28px);right:-6px;bottom:-6px;filter:drop-shadow(0 0 0 var(--r-gd));box-shadow:none;text-shadow:0 1px 1px #000}
body.rpg2 .pt-wrap::after{content:'';position:absolute;right:-8px;bottom:-8px;width:calc(clamp(20px,6vh,26px) + 4px);height:calc(clamp(22px,6.6vh,28px) + 4px);background:var(--r-gd);clip-path:polygon(0 0,100% 0,100% 62%,50% 100%,0 62%);z-index:-1}
body.rpg2 .pc-body{background:linear-gradient(180deg,rgba(30,38,88,.94),rgba(12,16,38,.94));border:1px solid var(--r-gd);border-left:0;border-radius:0 3px 3px 0;box-shadow:inset 0 0 0 2px var(--r-nv2),inset 0 0 0 3px #d8b45a44,0 3px 10px #0008;position:relative}
body.rpg2 .pc-body::before{content:'';position:absolute;right:8px;top:-5px;width:9px;height:9px;background:var(--r-gd);transform:rotate(45deg);box-shadow:0 0 0 2px var(--r-nv2)}
body.rpg2 .pc-body::after{content:'';position:absolute;right:-1px;bottom:-1px;width:14px;height:14px;border-right:2px solid var(--r-gd2);border-bottom:2px solid var(--r-gd2)}
body.rpg2 .pc-name #h-name{font-family:var(--r-f);font-weight:700;letter-spacing:.3px;color:var(--r-pa);font-size:clamp(10px,3vh,14px)}
body.rpg2 .pc-rank{color:var(--r-gd);font-style:italic}
body.rpg2 .bl{font-family:var(--r-f);font-weight:700;color:var(--r-gd2)!important;letter-spacing:0;font-size:clamp(7px,2.1vh,9px)}
body.rpg2 .trk{border-radius:1px;background:linear-gradient(180deg,#05060f,#141833);box-shadow:inset 0 0 0 1px #d8b45a99,0 0 0 1px #000}
body.rpg2 .trk i{position:relative}
body.rpg2 .trk i::after{content:'';position:absolute;left:0;right:0;top:0;height:40%;background:linear-gradient(180deg,#ffffff55,transparent)}
body.rpg2 .hpf{background:linear-gradient(90deg,#5e0a16,#b8202e 45%,#ff5560)!important}
body.rpg2 .mpf{background:linear-gradient(90deg,#14246e,#2f5fd8 50%,#7ec4ff)!important}
body.rpg2 .trk em{font-family:var(--r-f);font-weight:700;letter-spacing:.3px}
body.rpg2 .xpw{background:#05060f!important;box-shadow:inset 0 0 0 1px #d8b45a88!important;border-radius:1px!important}
body.rpg2 #h-xp{background:linear-gradient(90deg,#8a6a2a,#f3dc95)!important}
/* ---------- missão: pergaminho com selo ---------- */
body.rpg2 #h-quest{background:linear-gradient(180deg,var(--r-pa),var(--r-pa2));border:1px solid var(--r-gd3);border-left:1px solid var(--r-gd3);border-radius:2px;color:var(--r-ink);box-shadow:0 3px 10px #0009,inset 0 0 18px #8a6a2a55;position:relative;padding-left:12px;margin-left:6px}
body.rpg2 #h-quest::before,body.rpg2 #h-quest::after{content:'';position:absolute;left:-5px;right:-5px;height:6px;border-radius:3px;background:linear-gradient(180deg,#a07a3a,#5a3e18)}
body.rpg2 #h-quest::before{top:-3px}body.rpg2 #h-quest::after{bottom:-3px}
body.rpg2 .qh{color:var(--r-cr);font-family:var(--r-f);font-weight:900;letter-spacing:1px}
body.rpg2 .qi{background:radial-gradient(circle at 40% 35%,#e0505a,var(--r-cr) 60%,#5a0c18);color:var(--r-pa);box-shadow:0 0 0 2px #5a0c1855}
body.rpg2 .qn{color:#24180a;font-family:var(--r-f);font-weight:700}
body.rpg2 .qo{color:#5a4426}
/* ---------- local, menu e minimapa ---------- */
body.rpg2 .loc .lt{background:linear-gradient(180deg,#b82a3a,var(--r-cr) 55%,#640f1c)!important;border:0!important;border-radius:0!important;clip-path:polygon(0 0,100% 0,100% 100%,0 100%,9px 50%);padding:4px 14px 4px 16px!important;color:var(--r-pa)!important;box-shadow:none!important}
body.rpg2 .loc .lt b{font-family:var(--r-f);letter-spacing:.5px;color:var(--r-pa)}
body.rpg2 .loc .lt small{color:#f3dc95!important}
body.rpg2 .loc .pin{color:var(--r-gd2)!important}
body.rpg2 #qm-btn{background:linear-gradient(180deg,var(--r-nv3),var(--r-nv2));border:1px solid var(--r-gd);border-radius:2px;color:var(--r-gd2);font-family:var(--r-f);box-shadow:inset 0 0 0 2px var(--r-nv2),inset 0 0 0 3px #d8b45a33}
body.rpg2 #qm-btn.on{background:var(--r-gd);color:var(--r-nv2)}
body.rpg2 .mmw{border:3px solid var(--r-gd);box-shadow:0 0 0 3px var(--r-nv2),0 0 0 5px #d8b45a99,0 4px 14px #000b;background:#10143a;overflow:visible}
body.rpg2 #mm{border-radius:50%}
body.rpg2 .mmw::after{content:'';position:absolute;inset:-3px;border-radius:50%;pointer-events:none;background:repeating-conic-gradient(var(--r-gd2) 0 1.6deg,transparent 1.6deg 22.5deg);-webkit-mask:radial-gradient(circle,transparent calc(50% - 7px),#000 calc(50% - 6px));mask:radial-gradient(circle,transparent calc(50% - 7px),#000 calc(50% - 6px));opacity:.85}
body.rpg2 .mmN{top:-9px;width:18px;height:18px;line-height:18px;text-align:center;border-radius:50%;background:radial-gradient(circle at 40% 35%,#e0505a,var(--r-cr) 60%,#5a0c18);color:var(--r-pa);font-family:var(--r-f);font-size:10px;box-shadow:0 0 0 2px var(--r-gd);z-index:2}
/* ---------- magias: arcos góticos sobre uma base ---------- */
body.rpg2 #h-skills{background:linear-gradient(180deg,rgba(30,38,88,.88),rgba(10,13,32,.92));border:1px solid var(--r-gd);border-radius:3px;box-shadow:inset 0 0 0 2px var(--r-nv2),inset 0 0 0 3px #d8b45a33,0 4px 12px #000a;padding:6px 6px 5px}
body.rpg2 #h-skills::before{content:'';position:absolute;left:50%;top:-6px;width:10px;height:10px;transform:translateX(-50%) rotate(45deg);background:var(--r-gd);box-shadow:0 0 0 2px var(--r-nv2)}
body.rpg2 .sk{border:1.5px solid var(--r-gd);border-radius:50% 50% 4px 4px / 34% 34% 4px 4px;background:radial-gradient(circle at 50% 38%,color-mix(in srgb,var(--g) 22%,#1c2250),#080a1c 75%);box-shadow:inset 0 0 0 2px #0c1024,inset 0 -6px 10px #0008,0 2px 4px #0009}
body.rpg2 .sk::after{border-radius:inherit}
body.rpg2 .sk .num{left:50%;top:auto;bottom:-1px;transform:translateX(-50%);background:var(--r-cr);color:var(--r-pa);border-radius:2px;font-family:var(--r-f);padding:0 4px;font-size:9px;box-shadow:0 0 0 1px var(--r-gd)}
body.rpg2 .sk .cst{right:auto;left:50%;transform:translateX(-50%);bottom:auto;top:1px;color:#a8d4ff}
/* ---------- botões de ação: círculos rúnicos ---------- */
body.rpg2 #a-atk{border:3px solid var(--r-gd);background:radial-gradient(circle at 50% 38%,#d8404c,#8a1424 55%,#3a0610);color:var(--r-pa);box-shadow:0 0 0 3px var(--r-nv2),0 0 0 5px #d8b45a88,0 5px 16px #000b,inset 0 0 14px #000a}
body.rpg2 #a-atk::before{content:'';position:absolute;inset:7px;border-radius:50%;border:1px dashed #f3dc9599;pointer-events:none;animation:r91spin 18s linear infinite}
body.rpg2 .ab{border:2px solid var(--r-gd);background:radial-gradient(circle at 50% 38%,#2e3878,#0c1024 70%);color:var(--r-gd2);box-shadow:0 0 0 2px var(--r-nv2),0 0 0 3.5px #d8b45a55,0 3px 10px #000a}
body.rpg2 .ab.on{background:radial-gradient(circle at 50% 38%,var(--r-gd2),var(--r-gd) 60%,var(--r-gd3));color:var(--r-nv2)}
body.rpg2 #h-sec{background:linear-gradient(180deg,rgba(30,38,88,.9),rgba(10,13,32,.92));border:1px solid var(--r-gd);border-radius:3px}
body.rpg2 .sc{border:1px solid #d8b45acc;border-radius:50%;background:radial-gradient(circle at 50% 38%,#2e3878,#0c1024 70%);color:var(--r-gd2)}
body.rpg2 .sc.on{background:radial-gradient(circle at 50% 38%,#e0505a,var(--r-cr) 60%,#4a0812);color:var(--r-pa);border-color:var(--r-gd2)}
body.rpg2 #h-bar{background:linear-gradient(180deg,rgba(30,38,88,.9),rgba(10,13,32,.92));border:1px solid var(--r-gd);border-radius:2px}
body.rpg2 #h-bar .lg{color:var(--r-gd)!important}
body.rpg2 .bb{color:#cfc4a8}body.rpg2 .bb.on{color:var(--r-gd2)}
body.rpg2 #h-msg{background:linear-gradient(180deg,rgba(30,38,88,.92),rgba(10,13,32,.92))!important;border:1px solid var(--r-gd)!important;border-radius:2px!important;color:var(--r-pa)!important}
/* ---------- joystick: círculo de runas ---------- */
body.rpg2 #joy{border:2px solid #d8b45aaa!important;background:radial-gradient(circle,rgba(26,33,80,.55) 0 52%,transparent 53%),repeating-conic-gradient(#d8b45a66 0 2deg,transparent 2deg 30deg),radial-gradient(circle,rgba(10,13,32,.45),rgba(10,13,32,.25))!important;box-shadow:0 0 0 3px #0c102455,inset 0 0 0 6px #0c102466!important}
body.rpg2 #joy .ar{color:var(--r-gd2)!important}
body.rpg2 #knob{background:radial-gradient(circle at 40% 35%,#fff4c8,var(--r-gd) 55%,var(--r-gd3))!important;border:2px solid #fff4c8!important;box-shadow:0 0 12px #d8b45a99,0 2px 6px #000a!important}
/* ---------- bússola de missão, avisos e faixa de região ---------- */
body.rpg2 #qind{background:linear-gradient(180deg,rgba(30,38,88,.95),rgba(10,13,32,.95))!important;border:1px solid var(--r-gd)!important;border-radius:2px!important;box-shadow:inset 0 0 0 2px var(--r-nv2),0 3px 10px #0009!important}
body.rpg2 #qind .qa{background:radial-gradient(circle at 40% 35%,var(--r-gd2),var(--r-gd) 60%,var(--r-gd3));box-shadow:0 0 0 2px var(--r-nv2),0 0 0 3px var(--r-gd3)}
body.rpg2 #qind b{color:var(--r-gd2);font-family:var(--r-f)}
body.rpg2 #toast{background:linear-gradient(180deg,var(--r-pa),var(--r-pa2));color:var(--r-ink);border:1px solid var(--r-gd3);border-radius:2px;font-weight:700}
body.rpg2 #bnr h3{font-family:var(--r-f);font-weight:900;letter-spacing:4px;color:var(--r-gd2);text-shadow:0 2px 0 #000,0 0 18px #d8b45a99}
body.rpg2 #bnr p{font-family:var(--r-f);color:var(--r-pa);letter-spacing:2px}
body.rpg2 #bnr:before{left:-18%;right:-18%;height:150%;background:linear-gradient(90deg,transparent,rgba(12,16,40,.9) 18%,rgba(12,16,40,.9) 82%,transparent);border-top:1px solid #d8b45a99;border-bottom:1px solid #d8b45a99;border-image:linear-gradient(90deg,transparent,var(--r-gd),transparent) 1}
#v91vig{position:fixed;inset:0;pointer-events:none;z-index:3;opacity:0;transition:opacity .4s;box-shadow:inset 0 0 90px 30px #a0101ecc}
#v91vig.on{animation:r91pul 1.1s ease-in-out infinite}
body:not(.rpg2) #v91vig,body.inmenu #v91vig{display:none}
@keyframes r91spin{to{transform:rotate(360deg)}}
@keyframes r91pul{0%,100%{opacity:.35}50%{opacity:.85}}
/* ================= MENU INICIAL ================= */
body.rpg2 #menu{color:var(--r-pa)}
body.rpg2 .sky{background:radial-gradient(ellipse at 72% 18%,#33397a 0,#171d48 34%,#0a0d22 72%),#070918}
body.rpg2 .moon{left:46%;right:auto;top:6%;width:min(30vh,24vw);background:radial-gradient(circle at 32% 36%,#e9d6a0 0 7%,transparent 8%),radial-gradient(circle at 62% 60%,#e2cc92 0 9%,transparent 10%),radial-gradient(circle at 40% 38%,#fffaf0,#f6e6b8 45%,#d9bb72 78%,#a88446);box-shadow:0 0 70px 20px #f0cf7240,0 0 160px 60px #d8b45a22}
body.rpg2 #twg stop:first-child{stop-color:#2a2f66}body.rpg2 #twg stop:last-child{stop-color:#0c0f26}
body.rpg2 .castle path[fill="#1d8a3c"]{fill:var(--r-cr)}
body.rpg2 .castle use{color:var(--r-gd2)!important}
body.rpg2 .castle path[stroke="#3dff6a"],body.rpg2 #menu .bg path[stroke="#3dff6a"]{stroke:#d8b45a}
body.rpg2 .hero{filter:drop-shadow(0 0 16px #d8b45a44);opacity:.85}
body.rpg2 #capg stop:first-child{stop-color:#6a1424}body.rpg2 #capg stop:last-child{stop-color:#1a050a}
body.rpg2 .hero use{color:var(--r-gd)!important}body.rpg2 .hero path[fill="#0a3a18"]{fill:#3a0a14}body.rpg2 .hero path[fill="#103f1f"]{fill:#4a0c18}body.rpg2 .hero path[stroke="#3dff6a"]{stroke:#d8b45a}
body.rpg2 .fc{color:var(--r-gd2);filter:drop-shadow(0 0 8px #d8b45a);opacity:.75}
body.rpg2 .forest path[fill="#0a2814"]{fill:#121540}body.rpg2 .forest polygon[fill="#0b2f16"]{fill:#0e1236}body.rpg2 .forest polygon[fill="#08240f"]{fill:#0a0d2a}body.rpg2 .forest path[fill="#061a0c"]{fill:#080a20}body.rpg2 .forest path[stroke="#3dff6a"]{stroke:#d8b45a}
body.rpg2 .mw{filter:drop-shadow(0 3px 6px #000c)}
body.rpg2 .mb{--c1:#283276;--c2:#10143a;--gl:var(--r-gd);font-family:var(--r-f);font-weight:700;letter-spacing:2px;color:var(--r-pa);clip-path:polygon(0 0,100% 0,95% 50%,100% 100%,0 100%,3.5% 50%);justify-content:flex-start;padding-left:clamp(18px,4vw,30px)}
body.rpg2 .mb::before{clip-path:polygon(0 0,100% 0,95% 50%,100% 100%,0 100%,3.5% 50%);inset:2px;background:linear-gradient(180deg,var(--c1),var(--c2))}
body.rpg2 .mb::after{content:'';position:absolute;left:12%;right:14%;bottom:5px;height:1px;background:linear-gradient(90deg,transparent,#d8b45a77,transparent);z-index:-1}
body.rpg2 .mb svg{fill:var(--r-gd2)}
body.rpg2 .mb small{font-family:'Rajdhani',system-ui,sans-serif;letter-spacing:1px;color:var(--r-gd2)}
body.rpg2 .mb.play{--c1:#c22e3e;--c2:#5a0c18;--gl:var(--r-gd2)}
body.rpg2 .mb.mp{--c1:#2c2e3e;--c2:#121320;--gl:#7c7a70;color:#b8b4a4}
body.rpg2 .mb.cu{--c1:#3a2c78;--c2:#151036}
body.rpg2 .mb.co{--c1:#283276;--c2:#10143a;color:var(--r-pa)}
body.rpg2 .l1{font-family:var(--r-f);font-weight:900;letter-spacing:6px;color:var(--r-gd2);-webkit-text-stroke:0;text-shadow:0 2px 0 #6a4a14,0 4px 0 #2a1a06,0 0 26px #d8b45a66;transform:none}
body.rpg2 .l2{font-family:var(--r-f);font-weight:700;letter-spacing:14px;margin-top:6px;font-size:clamp(20px,6vh,52px)!important;color:var(--r-cr2);-webkit-text-stroke:0;text-shadow:0 2px 0 #3a0610,0 0 14px #d8404c66;transform:none;position:relative}
body.rpg2 .lclv{color:var(--r-gd);filter:drop-shadow(0 0 10px #d8b45a99)}
body.rpg2 .slogan,body.rpg2 .foot{display:none}
body.rpg2 .welcome{background:linear-gradient(180deg,var(--r-nv3),var(--r-nv2));border:1px solid var(--r-gd);border-radius:2px;box-shadow:inset 0 0 0 2px var(--r-nv2),inset 0 0 0 3px #d8b45a33;font-family:var(--r-f)}
body.rpg2 .welcome b,body.rpg2 .welcome.accw b{color:var(--r-gd2)}
body.rpg2 .welcome svg{fill:var(--r-gd2)}
body.rpg2 .news{background:linear-gradient(180deg,var(--r-pa),var(--r-pa2));border:1px solid var(--r-gd3);border-radius:2px;color:var(--r-ink);box-shadow:0 4px 14px #000a,inset 0 0 22px #8a6a2a55}
body.rpg2 .news::before,body.rpg2 .news::after{content:'';position:absolute;left:-5px;right:-5px;height:7px;border-radius:4px;background:linear-gradient(180deg,#a07a3a,#5a3e18)}
body.rpg2 .news::before{top:-4px}body.rpg2 .news::after{bottom:-4px}
body.rpg2 .news h4{color:var(--r-cr);font-family:var(--r-f);letter-spacing:1px}
body.rpg2 .news li::marker{color:var(--r-cr)}
body.rpg2 .news small{color:#6a5232}
body.rpg2 .fsb2{background:linear-gradient(180deg,var(--r-nv3),var(--r-nv2));border:1px solid var(--r-gd);border-radius:2px;color:var(--r-gd2);font-family:var(--r-f)}
body.rpg2 .ib{background:conic-gradient(from 20deg,var(--r-gd3),var(--r-gd2),var(--r-gd),var(--r-gd3),var(--r-gd2),var(--r-gd3));clip-path:none;border-radius:50%;box-shadow:0 3px 8px #000b}
body.rpg2 .ib::before{clip-path:none;border-radius:50%;inset:3px;background:radial-gradient(circle at 50% 38%,#2e3878,#0c1024 75%)}
body.rpg2 .ib svg{fill:var(--r-gd2)}
#v91card{display:none}
body.rpg2 #v91card{display:block;position:absolute;background:linear-gradient(180deg,rgba(30,38,88,.94),rgba(12,16,38,.94));border:1px solid var(--r-gd);border-radius:2px;box-shadow:inset 0 0 0 2px var(--r-nv2),inset 0 0 0 3px #d8b45a33,0 4px 14px #000a;padding:8px 12px 9px;color:var(--r-pa);font-size:clamp(11px,2.3vh,14px);box-sizing:border-box}
#v91card h5{margin:0 0 5px;font-family:var(--r-f);font-weight:900;letter-spacing:2px;color:var(--r-gd2);font-size:1em;display:flex;align-items:center;gap:6px}
#v91card h5::before,#v91card h5::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,transparent,var(--r-gd))}
#v91card h5::after{background:linear-gradient(90deg,var(--r-gd),transparent)}
#v91card .r{display:flex;justify-content:space-between;gap:10px;padding:2px 0;border-bottom:1px solid #d8b45a22}
#v91card .r span{color:#c8bc9c}#v91card .r b{color:var(--r-pa);font-family:var(--r-f)}
#v91card .nm{font-family:var(--r-f);font-weight:700;font-size:1.15em;color:var(--r-pa);text-align:center;margin-bottom:3px}
#v91card .em{color:#c8bc9c;text-align:center;font-style:italic}
@media (orientation:landscape){
 body.rpg2 .mc{left:5vw;top:52%;transform:translateY(-50%);width:min(360px,40vw);align-items:stretch}
 body.rpg2 .logo{text-align:left;padding-left:6px}
 body.rpg2 .lclv{margin:0 0 -2px}
 body.rpg2 .hero{left:auto;right:30vw;height:66vh}
 body.rpg2 .news{left:auto;right:16px;bottom:auto;top:calc(env(safe-area-inset-top,0px) + 58px);width:min(270px,29vw)}
 body.rpg2 #v91card{right:16px;width:min(270px,29vw);bottom:calc(env(safe-area-inset-bottom,0px) + 14px + clamp(46px,9vh,58px) + 14px)}
 body.rpg2 .icons{right:16px;width:min(270px,29vw);justify-content:space-between}
 body.rpg2 .fsb2{left:auto;right:calc(16px + min(270px,29vw) + 14px);top:calc(env(safe-area-inset-top,0px) + 10px);min-height:36px;padding:5px 10px;font-size:12px}
}
@media (orientation:landscape) and (max-height:430px){
 body.rpg2 .news li:nth-child(n+3){display:none}
}
@media (orientation:portrait){
 body.rpg2 #v91card{display:none}
 body.rpg2 .fsb2{font-size:0;padding:0;width:46px;min-height:46px;display:grid;place-items:center}
 body.rpg2 .fsb2::after{content:'⛶';font-size:22px}
 body.rpg2 .icons{left:auto;right:12px;transform:none;gap:6px}
 body.rpg2 .ib{width:48px;height:48px}
}
/* painéis do menu */
body.rpg2 #menu .panel{background:linear-gradient(160deg,#161c46f7,#0a0d22f7);border:1.5px solid var(--r-gd);border-radius:4px;box-shadow:inset 0 0 0 3px #0a0d22,inset 0 0 0 4px #d8b45a44,0 0 30px #0009}
body.rpg2 #menu .panel h2{font-family:var(--r-f);font-weight:900;color:var(--r-gd2);letter-spacing:3px}
body.rpg2 #menu .panel h5{color:var(--r-gd2)!important;font-family:var(--r-f);letter-spacing:1px}
body.rpg2 #menu .back{background:linear-gradient(180deg,var(--r-nv3),var(--r-nv2));border:1px solid var(--r-gd);border-radius:2px;color:var(--r-gd2);font-family:var(--r-f)}
body.rpg2 #menu .tb{background:#10143a;border:1px solid #d8b45a66;color:#d8ccb0;border-radius:2px}
body.rpg2 #menu .tb.on{background:linear-gradient(180deg,var(--r-gd2),var(--r-gd));border-color:var(--r-gd2);color:var(--r-nv2)}
body.rpg2 #menu .tg{border-color:var(--r-gd);background:#10143a}
body.rpg2 #menu .tg.on{background:var(--r-cr)}body.rpg2 #menu .tg.on::after{background:var(--r-gd2)}
body.rpg2 #menu .act{background:linear-gradient(180deg,#c22e3e,#5a0c18)}
body.rpg2 #menu .act.sec{background:#10143a;border:1px solid #d8b45a88}
`;
 const st=document.createElement('style');st.id='v91css';st.textContent=css;document.head.appendChild(st);
 let mode='novo';try{mode=localStorage.getItem('hudv')||'novo'}catch(e){}
 window.v91Set=function(m){mode=m;try{localStorage.setItem('hudv',m)}catch(e){}document.body.classList.toggle('rpg2',m!=='classico');try{if(typeof mCfg=='function'&&document.getElementById('m-cfg').classList.contains('on'))mCfg()}catch(e){}};
 document.body.classList.toggle('rpg2',mode!=='classico');
 // vinheta vermelha quando a vida está baixa
 const vg=document.createElement('div');vg.id='v91vig';document.body.appendChild(vg);
 setInterval(()=>{try{const r=(typeof P!='undefined'&&P.mhp)?P.hp/P.mhp:1,low=r>0&&r<.3;vg.classList.toggle('on',low);if(!low)vg.style.opacity=0;else vg.style.opacity=''}catch(e){}},300);
 // ficha do mago no menu inicial (dados reais do save; sem save mostra convite)
 const card=document.createElement('div');card.id='v91card';const mm=document.getElementById('m-main');if(mm)mm.appendChild(card);
 window.v91Card=function(){try{let sv=null;try{sv=readSave()}catch(e){}
  const nick=(typeof MP!='undefined'&&MP.nick)?MP.nick:'';const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  if(!sv){card.innerHTML='<h5>FICHA DO MAGO</h5>'+(nick?'<div class="nm">'+esc(nick)+'</div>':'')+'<div class="em">Nenhuma aventura ainda.<br>Toque em JOGAR para receber seu grimório.</div>';return}
  const g=(typeof GR!='undefined'&&GR[sv.g])?GR[sv.g].n:'—';
  card.innerHTML='<h5>FICHA DO MAGO</h5>'+(nick?'<div class="nm">'+esc(nick)+'</div>':'')+'<div class="r"><span>Nível</span><b>'+(sv.lv|0)+'</b></div><div class="r"><span>Grimório</span><b>'+esc(g)+'</b></div><div class="r"><span>Moedas</span><b>'+(sv.coins|0)+'</b></div>'}catch(e){}};
 if(typeof mPlaySub=='function'){const _mp=mPlaySub;mPlaySub=function(){const r=_mp.apply(this,arguments);v91Card();return r}}
 try{v91Card()}catch(e){}
 // opção em Configurações
 if(typeof mCfg=='function'){const _mc=mCfg;mCfg=function(){const r=_mc.apply(this,arguments);try{const b=document.getElementById('cf-b'),cls=document.body.classList.contains('rpg2');
  b.insertAdjacentHTML('afterbegin','<h5 style="color:#b8ff3a;margin:4px 0">VISUAL DO HUD E DO MENU</h5><div class="tabs2"><button class="tb'+(cls?' on':'')+'" onclick="v91Set(\'novo\')">Grimório (novo)</button><button class="tb'+(cls?'':' on')+'" onclick="v91Set(\'classico\')">Clássico</button></div><p class="hint">Grimório: azul-noite, ouro e carmesim. Clássico: o visual verde antigo.</p>')}catch(e){}return r}}
}

// ================= V95 · guarda as listas de magias de cada versão (para a tela "Escolher magias") =================
try{window.GRHIST=window.GRHIST||{};for(const k in GR){if(GR[k]&&Array.isArray(GR[k].s))(GRHIST[k]=GRHIST[k]||[]).push(GR[k].s.slice())}}catch(e){}

