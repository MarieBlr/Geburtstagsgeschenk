// main.js - steuert die Szenenabfolge
(function(){
  const scenes = Array.from(document.querySelectorAll('.scene'));
  const app = document.getElementById('app');
  const btn = document.getElementById('next-button');
  let idx = 0;
  let timeouts = [];

  // --- Adjustable timing variables (easy to find and edit) ---
  const cfg = {
    papierZoomDuration: 800, // ms -> keep in sync with --papier-zoom-duration
    waitAfterMapMs: 2000, // delay before pin drops
    scene2TextDelay: 3000, // ms until heading appears in scene 2
    ankerToPeopleDelay: 2000, // ms until captain appears after anker
    crewDelayAfterCaptain: 1000, // ms until crew appears after captain
  };

  function clearAllTimeouts(){ timeouts.forEach(t=>clearTimeout(t)); timeouts=[] }

  function showScene(i){
    clearAllTimeouts();
    scenes.forEach((s,si)=>{ s.classList.toggle('visible', si===i) });
    // reset transient styles used by animations
    resetTransient();
    // scene-specific entry actions
    switch(i){
      case 0: // initial
        app.className = 'app bg-pale-blue';
        break;

      case 1: // papier -> zoom -> gold -> map -> pin
        app.className = 'app';
        // start with pale blue removed
        const papier = document.getElementById('papier');
        const map = document.getElementById('map');
        const pin = document.getElementById('pin');
        // ensure initial states
        papier.classList.remove('zoom'); map.style.opacity = 0; pin.classList.remove('drop');
        // zoom papier
        timeouts.push(setTimeout(()=>{
          papier.classList.add('zoom');
        }, 50));
        // after zoom, switch background to gold and reveal map
        timeouts.push(setTimeout(()=>{
          app.classList.add('bg-gold');
          map.style.opacity = 1;
        }, cfg.papierZoomDuration + 80));
        // after map has been visible for some time, drop pin
        timeouts.push(setTimeout(()=>{
          pin.classList.add('drop');
        }, cfg.papierZoomDuration + cfg.waitAfterMapMs));
        break;

      case 2: // white background, top wave, boat rocks, then heading after delay
        app.className = 'app';
        app.style.backgroundColor = '#ffffff';
        const boat = document.getElementById('boat');
        const scene2Heading = document.getElementById('scene2-heading');
        boat.classList.remove('rock'); scene2Heading.style.opacity = 0;
        // start rocking immediately
        timeouts.push(setTimeout(()=> boat.classList.add('rock'), 80));
        // show heading after configured delay
        timeouts.push(setTimeout(()=> scene2Heading.style.opacity = 1, cfg.scene2TextDelay));
        break;

      case 3: // pale blue; anker drops, then captain then crew; include steuerrad visible initially
        app.className = 'app bg-pale-blue';
        const anker = document.getElementById('anker');
        const captain = document.getElementById('captain');
        const crew = document.getElementById('crew');
        const capCaption = document.getElementById('captain-caption');
        const crewCaption = document.getElementById('crew-caption');
        const steuerrad = document.getElementById('steuerrad');
        // reset visuals
        anker.classList.remove('drop'); captain.style.opacity=0; crew.style.opacity=0; capCaption.style.opacity=0; crewCaption.style.opacity=0; steuerrad.style.opacity=1;
        // drop anker
        timeouts.push(setTimeout(()=> anker.classList.add('drop'), 80));
        // after anker settle, show captain (on right) then crew after short delay
        timeouts.push(setTimeout(()=>{
          captain.style.transition='opacity .4s ease'; captain.style.opacity=1; capCaption.style.opacity=1;
        }, cfg.ankerToPeopleDelay));
        timeouts.push(setTimeout(()=>{
          crew.style.transition='opacity .4s ease'; crew.style.opacity=1; crewCaption.style.opacity=1;
        }, cfg.ankerToPeopleDelay + cfg.crewDelayAfterCaptain));
        break;

      case 4: // boats row - remove previous items
        app.className = 'app';
        // hide steuerrad/captain/crew quickly
        ['steuerrad','captain','crew','captain-caption','crew-caption','anker'].forEach(id=>{
          const el = document.getElementById(id); if(el) el.style.opacity = 0;
        });
        break;

      case 5: // final white content
        app.className = 'app'; app.style.backgroundColor = '#ffffff';
        break;
    }
  }

  function resetTransient(){
    // clear inline backgroundColor set earlier
    app.style.backgroundColor = '';
    // ensure bg-gold class removed unless scene 1 explicitly sets it
    app.classList.remove('bg-gold');
  }

  function nextScene(){
    idx = (idx + 1);
    if(idx >= scenes.length) idx = scenes.length-1; // stop at last scene
    showScene(idx);
  }

  // init
  btn.addEventListener('click', ()=>{
    nextScene();
  });

  // expose for debugging in console
  window.__story = {showScene, nextScene, cfg};

})();
