let pdfCache;
const SCALING = 2;

init();

document.getElementById('previous-all').onclick = ()=>{
  config.current = config.start;
  renderPage();
}

document.getElementById('previous').onclick = ()=>{
  config.current--;
  renderPage();
}

document.getElementById('next-all').onclick = ()=>{
  config.current = config.end;
  renderPage();
}

document.getElementById('next').onclick = ()=>{
  config.current++;
  renderPage();
}

document.getElementById('pdf-area').onclick = ()=>{
  if(config.end && config.stepped < config.step && config.current < config.end){
    config.current++;
    config.stepped++;
    renderPage(false);
  } else {
    config.stepped = 1;
    randomizePages();
  }
}

document.body.addEventListener('keydown', (e)=>{
  e = e || window.event;
  const keyPressed = e.which || e.keyCode;
  const key = {
    left: 37,
    // up: 38,
    right: 39,
    // down: 40,
    space: 32,
    backspace: 8,
    enter: 13
  }

  switch (keyPressed) {
    case key.left:
      document.getElementById('previous').click();
      break;
    case key.right:
      document.getElementById('next').click();
      break;
    case key.space:
    case key.enter:
      document.getElementById('pdf-area').click();
      break;
    case key.backspace:
      if(config.last && /(?:^|\/).*\.pdf/i.test(config.filename)){
        config.current = config.last;
        renderPage();
      }
      break;
    default:

  }
});

window.addEventListener('resize', ()=>{
  Object.assign(document.getElementById('pdf-container').style, getTrueWindowDimension());
});

function init(){
  config.stepped = 1;
  config.userEnd = config.end;

  if(Array.isArray(config.random) && config.random.length > 0){
    config.current = config.random[0]
  } else {
    config.current = config.start;
  }

  document.getElementById('title').innerHTML = config.filename;
  Object.assign(document.getElementById('pdf-container').style, getTrueWindowDimension());
  randomizePages();
}

function getTrueWindowDimension(){
  return {
    height: (window.innerHeight - document.getElementById('nav-area').offsetHeight) + 'px',
    width: window.innerWidth + 'px'
  };
}

function setPageNav(){
  if(config.current >= config.step + config.start){
    document.getElementById('previous-all').disabled = false;
    document.getElementById('previous').disabled = false;
  } else {
    document.getElementById('previous-all').disabled = true;
    document.getElementById('previous').disabled = true;
  }

  if((!config.end) || config.current <= config.end - config.step){
    document.getElementById('next-all').disabled = false;
    document.getElementById('next').disabled = false;
  } else {
    document.getElementById('next-all').disabled = true;
    document.getElementById('next').disabled = true;
  }
}

async function randomizePages(){
  if(!pdfCache || config.random === true || !(/(?:^|\/).*\.pdf/i.test(config.filename))){
    await pdfjsLib.getDocument('/file?filename=' + encodeURIComponent(config.filename))
      .then(pdf=>{
        pdfCache = pdf;
        config.end = config.userEnd || pdfCache.numPages;
        document.getElementById('page-label-total').innerHTML = pdfCache.numPages;
      });
  }

  config.last = config.current;

  if(config.random){
    if(Array.isArray(config.random)){
      config.current = config.random[Math.floor(Math.random() * config.random.length)];
    } else {
      config.current = (Math.floor(Math.random() * (config.end - config.start + 1)/config.step) * config.step)
        + config.start;
    }
  } else {
    if((!config.end) || config.current <= config.end - config.step){
      config.current++;
    }
  }

  if(config.current !== config.last){
    renderPage();
  }
}

function renderPage(resetStep){
  if(resetStep !== false){
    config.stepped = config.step;
  }

  if(pdfCache === undefined){
    return;
  }

  pdfCache.getPage(config.current)
    .then(page=>{
      console.log('Page', config.current);

      const canvas = document.getElementById('pdf-area');
      const context = canvas.getContext('2d');
      const viewport = page.getViewport(SCALING);
      const trueHeight = parseInt(getTrueWindowDimension().height);

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      if(canvas.offsetHeight > trueHeight){
        Object.assign(canvas.style, {
          top: '0',
          left: '50%',
          transform: 'translateX(-50%)'
        });
      } else if (canvas.offsetHeight < trueHeight){
        Object.assign(canvas.style, {
          top: '50%',
          left: '0',
          transform: 'translateY(-50%)'
        });
      }

      if(viewport.height > viewport.width){
        Object.assign(canvas.style, {
          height: 'auto',
          width: '100%'
        });
      } else {
        Object.assign(canvas.style, {
          height: '100%',
          width: 'auto'
        });
      }

      page.render({canvasContext: context, viewport: viewport});

      document.getElementById('page-label-current').innerHTML = config.current;
      Object.assign(document.getElementById('pdf-container'), {
        scrollTop: 0,
        scrollLeft: 0
      });

      setPageNav();
      canvas.focus();
    });
}
