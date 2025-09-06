(function(){
  var roots = document.querySelectorAll('[data-story2]');
  if(!roots.length) return;
  var prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var smallScreen = matchMedia('(max-width: 980px)').matches;
  if (smallScreen) return; // Use simplified mobile variant; skip observers entirely
  roots.forEach(function(root){
    var media = root.querySelector('[data-media]');
    var caption = root.querySelector('[data-caption]');
    var steps = Array.prototype.slice.call(root.querySelectorAll('[data-step]'));
    var markers = Array.prototype.slice.call(root.querySelectorAll('[data-marker]'));
    function setActive(idx){
      if(idx<0 || idx>=steps.length) return;
      steps.forEach(function(s){ s.classList.remove('active'); });
      markers.forEach(function(m){ m.classList.remove('active'); m.removeAttribute('aria-current'); });
      steps[idx].classList.add('active');
      markers[idx].classList.add('active');
      markers[idx].setAttribute('aria-current','step');
      var src = steps[idx].getAttribute('data-image');
      var cap = steps[idx].getAttribute('data-caption') || '';
      if(media && src){ media.setAttribute('src', src); }
      if(caption){ caption.textContent = cap; }
    }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          var idx = steps.indexOf(e.target);
          if(idx !== -1) setActive(idx);
        }
      });
    }, { root: null, rootMargin: '-30% 0px -55% 0px', threshold: 0.01 });
    steps.forEach(function(s){ io.observe(s); });
    markers.forEach(function(btn, idx){
      btn.addEventListener('click', function(){
        var target = document.getElementById('step-' + idx);
        if(target) target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'center' });
      });
      btn.addEventListener('keydown', function(e){
        if(e.key==='Enter' || e.key===' '){ e.preventDefault(); btn.click(); }
      });
    });
    // Disable parallax transform on small screens and when reduced motion is preferred
    if(!prefersReduced && !smallScreen){
      var ticking = false;
      var onScroll = function(){
        if(ticking) return; ticking = true;
        requestAnimationFrame(function(){
          var rect = root.getBoundingClientRect();
          var progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
          var delta = (progress - 0.5) * 24;
          if(media) media.style.transform = 'translateY(' + delta.toFixed(1) + 'px)';
          ticking = false;
        });
      };
      document.addEventListener('scroll', onScroll, { passive:true });
      onScroll();
    } else {
      if(media) media.style.transform = 'none';
    }
  });
})();
