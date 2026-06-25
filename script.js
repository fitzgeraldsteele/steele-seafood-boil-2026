/* ============================================================
   4th of July Seafood Boil — interactions
   Intro sequence, confetti, scroll fireworks, wipe, audio.
   All audio is user-initiated. Missing audio files fail silently.
   ============================================================ */

(function () {
  "use strict";

  var overlay = document.getElementById("intro-overlay");
  var startBtn = document.getElementById("start-btn");
  var stage = document.getElementById("anim-stage");
  var jets = stage ? stage.querySelector(".anim-jets") : null;
  var eagle = stage ? stage.querySelector(".anim-eagle") : null;
  var wipe = document.getElementById("wipe");
  var replayBtn = document.getElementById("replay-btn");

  var sndEagle = document.getElementById("snd-eagle");
  var sndJet = document.getElementById("snd-jet");
  var sndFirework = document.getElementById("snd-firework");

  var prefersReduced = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function play(snd) {
    if (!snd) return;
    try {
      snd.currentTime = 0;
      var p = snd.play();
      if (p && p.catch) p.catch(function () {});
    } catch (e) {}
  }

  /* ---------- Intro sequence ---------- */
  function runIntro() {
    if (prefersReduced) { finishIntro(); return; }
    stage.classList.add("run");
    // 1. Jets fly across + sound
    play(sndJet);
    jets.classList.add("anim-stage-jets-fly");
    // 2. Eagle flies in
    setTimeout(function () {
      eagle.classList.add("anim-stage-eagle-in");
      play(sndEagle);
    }, 1100);
    // 3. Burst confetti
    setTimeout(function () { burstConfetti(160); }, 1700);
    // 4. Clear stage, reveal page
    setTimeout(function () {
      stage.classList.remove("run");
      finishIntro();
    }, 2600);
  }

  function finishIntro() {
    overlay.classList.add("hidden");
    document.body.style.overflow = "";
    setTimeout(function () { if (overlay && overlay.parentNode) overlay.style.display = "none"; }, 800);
  }

  if (startBtn) {
    document.body.style.overflow = "hidden";
    startBtn.addEventListener("click", function () {
      // prime audio within user gesture
      [sndEagle, sndJet, sndFirework].forEach(function (s) {
        if (!s) return;
        try { s.play().then(function(){ s.pause(); s.currentTime = 0; }).catch(function(){}); } catch (e) {}
      });
      runIntro();
    });
  }

  if (replayBtn) {
    replayBtn.addEventListener("click", function () { play(sndEagle); burstConfetti(120); });
  }

  /* ============================================================
     CONFETTI ENGINE (lightweight canvas)
     ============================================================ */
  var canvas = document.getElementById("confetti");
  var ctx = canvas ? canvas.getContext("2d") : null;
  var pieces = [];
  var COLORS = ["#bf0a30", "#ffffff", "#002868", "#ffd700", "#ce1126", "#fcd116", "#003893"];
  var W, H;

  function resize() {
    if (!canvas) return;
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  function addPiece(x, y, burst) {
    var ang = Math.random() * Math.PI * 2;
    var speed = burst ? (3 + Math.random() * 7) : (1 + Math.random() * 2);
    pieces.push({
      x: x, y: y,
      vx: Math.cos(ang) * speed * (burst ? 1 : 0.4),
      vy: burst ? Math.sin(ang) * speed - 3 : (1 + Math.random() * 2),
      size: 4 + Math.random() * 6,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      life: 1
    });
  }

  function burstConfetti(n) {
    if (prefersReduced || !ctx) return;
    var cx = W / 2, cy = H * 0.42;
    for (var i = 0; i < n; i++) addPiece(cx, cy, true);
  }
  window.__burstConfetti = burstConfetti;

  // Ambient gentle confetti
  var ambientOn = !prefersReduced;
  function ambient() {
    if (ambientOn && ctx && pieces.length < 90 && Math.random() < 0.4) {
      addPiece(Math.random() * W, -10, false);
    }
  }

  function tick() {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    ambient();
    for (var i = pieces.length - 1; i >= 0; i--) {
      var p = pieces[i];
      p.vy += 0.12; // gravity
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      if (p.life < 1) p.life -= 0.004;
      if (p.y > H + 20 || p.life <= 0) { pieces.splice(i, 1); continue; }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    }
    requestAnimationFrame(tick);
  }
  if (ctx) tick();

  /* ============================================================
     SCROLL-TRIGGERED FIREWORKS (THE DUMP + footer)
     ============================================================ */
  if ("IntersectionObserver" in window) {
    var fwObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          burstConfetti(140);
          play(sndFirework);
          fwObserver.unobserve(e.target); // once
        }
      });
    }, { threshold: 0.6 });

    var dump = document.querySelector(".t-item.dump");
    var footer = document.getElementById("footer");
    if (dump) fwObserver.observe(dump);
    if (footer) fwObserver.observe(footer);

    /* Section reveal wipe on first view (nav-less, scroll-based — subtle, no sound) */
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.style.transition = "opacity .6s ease, transform .6s ease";
          e.target.style.opacity = "1";
          e.target.style.transform = "none";
          revealObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll(".section").forEach(function (s, idx) {
      if (idx === 0) return; // hero stays
      s.style.opacity = "0";
      s.style.transform = "translateY(30px)";
      revealObserver.observe(s);
    });
  }

  /* ============================================================
     OPTIONAL: wipe flash helper (exposed for future nav)
     ============================================================ */
  window.__wipe = function () {
    if (!wipe || prefersReduced) return;
    wipe.classList.remove("go");
    void wipe.offsetWidth; // reflow
    wipe.classList.add("go");
  };

})();
