let pdfCache;
const SCALING = 2;

config.stepped = 1;
if(Array.isArray(config.random) && config.random.length > 0){
  config.current = config.random[0]
} else {
  config.current = config.start;
}

document.getElementById('title').innerHTML = config.filename;
Object.assign(document.getElementById('pdf-container').style, getTrueWindowDimension());

pdfjsLib.getDocument('/file?filename=' + encodeURIComponent(config.filename))
  .then(pdf=>{
    pdfCache = pdf;
    config.end = config.end || pdfCache.numPages;
    document.getElementById('page-label-total').innerHTML = pdfCache.numPages;
    randomizePages();
  });

document.getElementById('previous-all').onclick = ()=>{
  config.current = config.start;
  renderPage();
}

document.getElementById('previous').onclick = ()=>{
  config.current --;
  renderPage();
}

document.getElementById('next-all').onclick = ()=>{
  config.current = config.end;
  renderPage();
}

document.getElementById('next').onclick = ()=>{
  config.current ++;
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
  const key = e.which || e.keyCode;
});

window.addEventListener('resize', ()=>{
  Object.assign(document.getElementById('pdf-container').style, getTrueWindowDimension());
});

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

function randomizePages(){
  const oldCurrent = config.current;

  if(config.random){
    if(Array.isArray(config.random)){
      config.current = config.random[Math.floor(Math.random() * config.random.length)];
    } else {
      if(pdfCache){
        config.current = (Math.floor(Math.random() * (config.end - config.start + 1)/config.step) * config.step)
          + config.start;
      }
    }
  } else {
    if((!config.end) || config.current <= config.end - config.step){
      config.current++;
    }
  }

  if(config.current !== oldCurrent){
    renderPage();
  }
}

function renderPage(resetStep){
  if(resetStep !== false){
    config.stepped = 1;
  }

  if(pdfCache === undefined){
    return;
  }

  pdfCache.getPage(config.current)
    .then(page=>{
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
    });
}
