// main.js - steuert die Szenenabfolge
(function(){
  const scenes = Array.from(document.querySelectorAll('.scene'));
  const app = document.getElementById('app');
  const btn = document.getElementById('next-button');
  let idx = 0;
  let timeouts = [];

  // --- Adjustable timing variables (easy to find and edit) ---
  const cfg = {
    papierZoomDuration: 700, // ms -> paper zoom duration
    paperBeforeGoldDelay: 500, // pause after paper zoom before paper fades
    goldMapDelay: 300, // short delay before gold background + map reveal
    mapVisibleDuration: 1400, // time map stays visible before pin drop
    scene2TextDelay: 3000, // ms until heading appears in scene 2
    ankerToPeopleDelay: 2000, // ms until captain appears after anker
    crewDelayAfterCaptain: 1000, // ms until crew appears after captain
  };

  function clearAllTimeouts(){ timeouts.forEach(t=>clearTimeout(t)); timeouts=[] }

  function resetTransient(){
    app.style.backgroundColor = '';
    app.classList.remove('bg-gold');

    const papier = document.getElementById('papier');
    const map = document.getElementById('map');
    const pin = document.getElementById('pin');
    const anker = document.getElementById('anker');
    if (papier) {
      papier.classList.remove('zoom');
      papier.style.opacity = '1';
    }
    if (map) map.style.opacity = '0';
    if (pin) {
      pin.classList.remove('drop');
      pin.style.opacity = '0';
    }
    if (anker) {
      anker.classList.remove('drop');
      anker.style.opacity = '0';
    }
  }

  function showScene(i){
    clearAllTimeouts();
    scenes.forEach((s,si)=>{ s.classList.toggle('visible', si===i) });
    resetTransient();

    switch(i){
      case 0:
        app.className = 'app bg-pale-blue';
        break;

      case 1:
        app.className = 'app';
        app.style.backgroundColor = '#ffffff';
        const papier = document.getElementById('papier');
        const map = document.getElementById('map');
        const pin = document.getElementById('pin');

        if (papier) papier.classList.remove('zoom');
        if (map) map.style.opacity = '0';
        if (pin) {
          pin.classList.remove('drop');
          pin.style.opacity = '0';
        }

        timeouts.push(setTimeout(()=>{
          if (papier) papier.classList.add('zoom');
        }, 120));

        timeouts.push(setTimeout(()=>{
          if (papier) papier.style.opacity = '0';
        }, cfg.papierZoomDuration + cfg.paperBeforeGoldDelay));

        timeouts.push(setTimeout(()=>{
          app.className = 'app bg-gold';
          app.style.backgroundColor = '#f1d16ac1';
          if (map) map.style.opacity = '1';
        }, cfg.papierZoomDuration + cfg.paperBeforeGoldDelay + cfg.goldMapDelay));

        timeouts.push(setTimeout(()=>{
          if (pin) {
            pin.style.opacity = '1';
            pin.classList.add('drop');
          }
        }, cfg.papierZoomDuration + cfg.paperBeforeGoldDelay + cfg.goldMapDelay + cfg.mapVisibleDuration));
        break;

      case 2:
        app.className = 'app';
        app.style.backgroundColor = '#ffffff';
        const boat = document.getElementById('boat');
        const scene2Heading = document.getElementById('scene2-heading');
        if (boat) boat.classList.remove('rock');
        if (scene2Heading) scene2Heading.style.opacity = '0';
        timeouts.push(setTimeout(()=> boat && boat.classList.add('rock'), 80));
        timeouts.push(setTimeout(()=> scene2Heading && (scene2Heading.style.opacity = '1'), cfg.scene2TextDelay));
        break;

      case 3:
        app.className = 'app bg-pale-blue';
        const anker = document.getElementById('anker');
        const captain = document.getElementById('captain');
        const crew = document.getElementById('crew');
        const capCaption = document.getElementById('captain-caption');
        const crewCaption = document.getElementById('crew-caption');
        

        if (anker) {
          anker.classList.remove('drop');
          anker.style.opacity = '0';
        }
        if (captain) captain.style.opacity = '0';
        if (crew) crew.style.opacity = '0';
        if (capCaption) capCaption.style.opacity = '0';
        if (crewCaption) crewCaption.style.opacity = '0';
      

        timeouts.push(setTimeout(()=> {
          if (anker) {
            anker.style.opacity = '1';
            anker.classList.add('drop');
          }
        }, 80));
        timeouts.push(setTimeout(()=>{
          if (captain) captain.style.opacity = '1';
          if (capCaption) capCaption.style.opacity = '1';
        }, cfg.ankerToPeopleDelay));
        timeouts.push(setTimeout(()=>{
          if (crew) crew.style.opacity = '1';
          if (crewCaption) crewCaption.style.opacity = '1';
        }, cfg.ankerToPeopleDelay + cfg.crewDelayAfterCaptain));
        break;

      case 4:
        app.className = 'app';
        ['captain','crew','captain-caption','crew-caption','anker'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.style.opacity = '0';
        });
        break;

      case 5:
        app.className = 'app';
        app.style.backgroundColor = '#ffffff';
        break;
    }
  }

  function nextScene(){
    idx = idx + 1;
    if (idx >= scenes.length) idx = scenes.length - 1;
    showScene(idx);
  }

  btn.addEventListener('click', () => nextScene());
  window.__story = { showScene, nextScene, cfg };
})();

