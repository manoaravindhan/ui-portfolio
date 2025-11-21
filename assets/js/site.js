// Smooth scrolling for internal links and a simple counter animation
document.addEventListener('DOMContentLoaded', function () {
  // Easter egg: type 'mano' to trigger confetti and secret modal
  var eggSequence = 'mano';
  var eggIndex = 0;
  function showEasterEgg() {
    // Confetti
    var c = document.createElement('canvas');
    c.style.position = 'fixed';
    c.style.left = 0;
    c.style.top = 0;
    c.style.width = '100vw';
    c.style.height = '100vh';
    c.style.pointerEvents = 'none';
    c.style.zIndex = 9999;
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    document.body.appendChild(c);
    var ctx = c.getContext('2d');
    var pieces = [];
    for (var i=0;i<120;i++) {
      pieces.push({
        x: Math.random()*c.width,
        y: -20,
        r: 8+Math.random()*12,
        vx: (Math.random()-0.5)*2.2,
        vy: 2+Math.random()*2.5,
        color: 'hsl('+(Math.random()*360)+',80%,60%)',
        a: Math.random()*Math.PI*2
      });
    }
    var frame = 0;
    function drawConfetti() {
      ctx.clearRect(0,0,c.width,c.height);
      pieces.forEach(function(p){
        p.x += p.vx; p.y += p.vy; p.a += 0.08;
        ctx.save();
        ctx.translate(p.x,p.y);
        ctx.rotate(p.a);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(0,0,p.r,0,Math.PI*2);
        ctx.fill();
        ctx.restore();
      });
      frame++;
      if (frame < 90) requestAnimationFrame(drawConfetti);
      else document.body.removeChild(c);
    }
    drawConfetti();
    // Secret modal
    var modal = document.createElement('div');
    modal.innerHTML = '<div style="background:rgba(11,16,32,0.98);color:#e6eef8;padding:2rem 2.5rem;border-radius:16px;box-shadow:0 8px 40px rgba(124,58,237,0.18);max-width:340px;margin:120px auto;font-size:1.2rem;text-align:center;position:relative;"><span style="font-size:2.2rem;">🎉</span><br><strong>Hi, fellow dev!</strong><br><br>You found the easter egg.<br><span style="color:#7c3aed;font-weight:600;">Keep building awesome stuff!</span><br><button id="egg-close" style="margin-top:1.5rem;padding:.5rem 1.2rem;border-radius:8px;background:linear-gradient(90deg,#7c3aed,#06b6d4);color:#fff;border:none;font-weight:600;cursor:pointer;">Close</button></div>';
    modal.style.position = 'fixed';
    modal.style.left = 0;
    modal.style.top = 0;
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = 10000;
    modal.style.background = 'rgba(11,16,32,0.72)';
    document.body.appendChild(modal);
    document.getElementById('egg-close').onclick = function(){ document.body.removeChild(modal); };
  }
  document.addEventListener('keydown', function(e){
    if (e.key.toLowerCase() === eggSequence[eggIndex]) {
      eggIndex++;
      if (eggIndex === eggSequence.length) {
        showEasterEgg();
        eggIndex = 0;
      }
    } else {
      eggIndex = 0;
    }
  });
  // Dynamic header background opacity on scroll
  var header = document.querySelector('.site-header');
  var lastOpacity = 0.7;
  function setHeaderOpacity(op) {
    if (!header) return;
    header.style.background = 'rgba(11,16,32,' + op + ')';
    header.style.backdropFilter = 'blur(8px)';
    header.style.boxShadow = '0 2px 16px rgba(0,0,0,0.08)';
  }
  function updateHeaderOpacity() {
    var scrollY = window.scrollY || window.pageYOffset;
    var op = scrollY < 10 ? 0.7 : Math.min(0.98, 0.7 + scrollY/220);
    if (Math.abs(op - lastOpacity) > 0.01) {
      setHeaderOpacity(op);
      lastOpacity = op;
    }
  }
  setHeaderOpacity(0.7);
  window.addEventListener('scroll', updateHeaderOpacity);
  window.addEventListener('resize', updateHeaderOpacity);
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        var target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Animated counter when visible
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target') || '0', 10);
    var duration = 1200; // ms
    var start = null;
    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = String(target);
      }
    }
    window.requestAnimationFrame(step);
  }

  var counter = document.getElementById('exp-counter');
  if (counter) {
    // Use IntersectionObserver to start when visible
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(counter);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      obs.observe(counter);
    } else {
      // fallback
      animateCounter(counter);
    }
  }

  // Reveal-on-scroll for elements with .reveal
  var revealElems = document.querySelectorAll('.reveal');
  if (revealElems.length) {
    if ('IntersectionObserver' in window) {
      var rObs = new IntersectionObserver(function (entries, robserver) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            robserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      revealElems.forEach(function (el) { rObs.observe(el); });
    } else {
      // fallback: reveal all
      revealElems.forEach(function(el){ el.classList.add('visible'); });
    }
  }

  // Simple testimonial carousel (auto-advance)
  var carousel = document.querySelector('.testimonials');
  if (carousel) {
    var items = carousel.querySelectorAll('.testimonial');
    var idx = 0;
    function showIndex(i){ items.forEach(function(it,j){ it.style.display = (i===j)?'block':'none'; }); }
    showIndex(idx);
    setInterval(function(){ idx = (idx+1)%items.length; showIndex(idx); }, 4500);
  }

  /* ------------------ Typewriter intro ------------------ */
  function typeText(el, text, speed, cb) {
    var i = 0;
    el.textContent = '';
    var cursor = document.createElement('span');
    cursor.className = 'typed-cursor';
    el.parentNode.insertBefore(cursor, el.nextSibling);
    function step() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(step, speed);
      } else {
        if (cb) cb();
        // keep cursor for a short while then fade
        setTimeout(function(){ cursor.style.opacity = '0'; }, 900);
      }
    }
    step();
  }
  var typedEl = document.getElementById('typed-intro');
  if (typedEl) {
    var introText = 'I build resilient web applications and delightful user interfaces. Currently at Informatica.';
    // start typing after a short delay or when hero reveals
    setTimeout(function(){ typeText(typedEl, introText, 26); }, 600);
  }

  /* ------------------ Particles background ------------------ */
  function initParticles(canvasId) {
    var c = document.getElementById(canvasId);
    if (!c) return;
    var ctx = c.getContext('2d');
    var DPR = window.devicePixelRatio || 1;
    function resize(){
      c.width = c.clientWidth * DPR;
      c.height = c.clientHeight * DPR;
      ctx.setTransform(DPR,0,0,DPR,0,0);
    }
    window.addEventListener('resize', resize);
    resize();

    var particles = [];
    var count = Math.max(12, Math.floor(c.clientWidth/70));
    for (var i=0;i<count;i++){
      particles.push({
        x: Math.random()*c.clientWidth,
        y: Math.random()*c.clientHeight,
        r: 6 + Math.random()*18,
        vx: (Math.random()-0.5)*0.4,
        vy: -0.15 - Math.random()*0.5,
        alpha: 0.05 + Math.random()*0.12
      });
    }

    function draw(){
      ctx.clearRect(0,0,c.clientWidth,c.clientHeight);
      particles.forEach(function(p){
        p.x += p.vx; p.y += p.vy;
        if (p.y + p.r < -20) { p.y = c.clientHeight + 20; p.x = Math.random()*c.clientWidth; }
        if (p.x - p.r > c.clientWidth + 30) p.x = -30;
        if (p.x + p.r < -30) p.x = c.clientWidth + 30;
        ctx.beginPath();
        var g = ctx.createRadialGradient(p.x, p.y, p.r*0.1, p.x, p.y, p.r);
        g.addColorStop(0, 'rgba(124,58,237,'+ (p.alpha+0.08) +')');
        g.addColorStop(1, 'rgba(6,182,212,'+ (p.alpha) +')');
        ctx.fillStyle = g;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }
  initParticles('particles-canvas');

  /* Slight blob path morph (very light) */
  (function animateBlob(){
    var path = document.getElementById('blobPath');
    if (!path) return;
    var t = 0;
    function tick(){
      t += 0.0025;
      var s = 1 + Math.sin(t)*0.035;
      path.setAttribute('transform','scale('+s+')');
      requestAnimationFrame(tick);
    }
    tick();
  })();

  // Handle Netlify contact form submission via AJAX to show success message without reload
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var formData = new FormData(contactForm);
      // Netlify expects form data POST to same origin
      fetch('/', { method: 'POST', body: formData })
        .then(function (resp) {
          if (resp.ok) {
            contactForm.reset();
            var s = document.getElementById('contact-success');
            if (s) { s.style.display = 'block'; }
          } else {
            alert('Sorry — there was a problem submitting the form.');
          }
        })
        .catch(function () { alert('Network error. Please try again later.'); });
    });
  }
});
