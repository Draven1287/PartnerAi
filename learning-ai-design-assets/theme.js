(() => {
  const reviewHost = ['127.0.0.1', 'localhost', '::1', '[::1]'].includes(location.hostname.toLowerCase());
  const review = reviewHost && new URLSearchParams(location.search).get('review') === '1';
  window.LearningAIReviewMode = review;
  if (!review || window.__learningAIReviewStorageGuard) return;
  window.__learningAIReviewStorageGuard = true;
  const setItem = Storage.prototype.setItem;
  const removeItem = Storage.prototype.removeItem;
  const clear = Storage.prototype.clear;
  Storage.prototype.setItem = function (key, value) {
    if (this === window.localStorage && String(key).startsWith('learningai-')) return;
    return setItem.call(this, key, value);
  };
  Storage.prototype.removeItem = function (key) {
    if (this === window.localStorage && String(key).startsWith('learningai-')) return;
    return removeItem.call(this, key);
  };
  Storage.prototype.clear = function () {
    if (this === window.localStorage) return;
    return clear.call(this);
  };
})();
(function () {
  const theme = 'light';
  const savedMotion = localStorage.getItem('learningai-motion');
  const systemPrefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const defaultMotion = systemPrefersReducedMotion ? 'reduced' : 'standard';
  const motion = ['standard', 'reduced', 'none'].includes(savedMotion) ? savedMotion : defaultMotion;
  const savedLight = Number(localStorage.getItem('learningai-light') || 88);
  const savedGlass = Number(localStorage.getItem('learningai-glass') || 90);
  const savedFontScale = localStorage.getItem('learningai-font-scale') || 'normal';
  const light = Math.min(100, Math.max(25, Number.isFinite(savedLight) ? savedLight : 88));
  const glass = Math.min(100, Math.max(25, Number.isFinite(savedGlass) ? savedGlass : 90));
  document.documentElement.dataset.theme = theme;
  applyMotion(motion);
  document.documentElement.style.setProperty('--light-through', String(light / 100));
  document.documentElement.style.setProperty('--light-dim', String((100 - light) / 100 * .36));
  applyGlass(glass);
  applyPop(light);
  applyFontScale(savedFontScale);

  try {
    const prototypeAccount = JSON.parse(localStorage.getItem('learningai-prototype-account') || 'null');
    if (prototypeAccount && typeof prototypeAccount === 'object') {
      window.LearningAIUser = {
        email: String(prototypeAccount.email || ''),
        displayName: String(prototypeAccount.displayName || '').trim() || 'Learner'
      };
    }
  } catch {}

  function applyGlass(value) {
    const t = value / 100;
    const opacity = Math.min(.75, Math.max(.02, 1 - t));
    document.documentElement.dataset.glassTransparency = String(value);
    document.documentElement.style.setProperty('--glass-transparency', t.toFixed(3));
    document.documentElement.style.setProperty('--glass-opacity', opacity.toFixed(3));
    document.documentElement.style.setProperty('--glass-hi', Math.min(.92, opacity + .10).toFixed(3));
    document.documentElement.style.setProperty('--glass-lo', Math.max(.018, opacity * .35).toFixed(3));
    document.documentElement.style.setProperty('--glass-tail', Math.max(.035, opacity * .75).toFixed(3));
    document.documentElement.style.setProperty('--glass-blur', `${Math.round(12 + opacity * 20)}px`);
    document.documentElement.style.setProperty('--glass-saturate', (1.62 - opacity * .60).toFixed(3));
    document.documentElement.style.setProperty('--glass-border', Math.min(.90, .80 + opacity * .20).toFixed(3));
    const scrollOpacity = Math.min(.32, opacity + .10);
    document.documentElement.style.setProperty('--glass-scroll-hi', Math.min(.95, scrollOpacity + .12).toFixed(3));
    document.documentElement.style.setProperty('--glass-scroll-lo', Math.max(.03, scrollOpacity * .45).toFixed(3));
    document.documentElement.style.setProperty('--glass-scroll-tail', Math.max(.06, scrollOpacity * .85).toFixed(3));
    document.documentElement.style.setProperty('--glass-scroll-blur', `${Math.round(15 + scrollOpacity * 20)}px`);
  }

  function applyPop(value) {
    const shade = (100 - value) / 100;
    document.documentElement.style.setProperty('--pop-dark', `rgba(24,27,26,${(.14 + shade * .28).toFixed(3)})`);
    document.documentElement.style.setProperty('--pop-deep', `rgba(24,27,26,${(.06 + shade * .18).toFixed(3)})`);
  }

  function applyMotion(next) {
    const value = ['standard', 'reduced', 'none'].includes(next) ? next : 'standard';
    document.documentElement.dataset.motion = value;
    if (value === 'none') {
      document.querySelectorAll('.is-passing,.is-scrolling,.is-dragging,.is-resetting').forEach(element => {
        element.classList.remove('is-passing', 'is-scrolling', 'is-dragging', 'is-resetting');
      });
    }
    return value;
  }

  function applyFontScale(next) {
    const value = ['normal', 'large', 'xl'].includes(next) ? next : 'normal';
    const scale = value === 'xl' ? 1.5 : value === 'large' ? 1.25 : 1;
    document.documentElement.dataset.fontScale = value;
    // Most prototype screens still contain fixed-pixel type. Scaling only the
    // root font therefore made the setting appear to work while leaving much
    // of the interface unchanged. Use layout zoom where supported so every
    // label, control, lesson, and hit target scales together; retain a root
    // font-size fallback for engines without CSS zoom.
    document.documentElement.style.setProperty('--ui-zoom', String(scale));
    document.documentElement.style.fontSize = '100%';
    return value;
  }

  window.LearningAITheme = {
    setLight(next) {
      const value = Math.min(100, Math.max(25, Number(next)));
      localStorage.setItem('learningai-light', String(value));
      document.documentElement.style.setProperty('--light-through', String(value / 100));
      document.documentElement.style.setProperty('--light-dim', String((100 - value) / 100 * .36));
      applyPop(value);
      window.dispatchEvent(new CustomEvent('learningai:light', {detail: value}));
    },
    setGlass(next) {
      const value = Math.min(100, Math.max(25, Number(next)));
      localStorage.setItem('learningai-glass', String(value));
      applyGlass(value);
      window.dispatchEvent(new CustomEvent('learningai:glass', {detail: value}));
    },
    setMotion(next) {
      const value = applyMotion(next);
      localStorage.setItem('learningai-motion', value);
      window.dispatchEvent(new CustomEvent('learningai:motion', {detail: value}));
    },
    setFontScale(next) {
      const value = applyFontScale(next);
      localStorage.setItem('learningai-font-scale', value);
      window.dispatchEvent(new CustomEvent('learningai:font-scale', {detail: value}));
    }
  };

  function revealCurrentNavRoute() {
    const rail = document.querySelector('.nav-glass nav');
    const current = rail && rail.querySelector('[aria-current="page"]');
    if (!rail || !current || rail.scrollWidth <= rail.clientWidth) return;
    const centered = current.offsetLeft - (rail.clientWidth - current.offsetWidth) / 2;
    rail.scrollLeft = Math.max(0, Math.min(centered, rail.scrollWidth - rail.clientWidth));
  }

  function scheduleCurrentNavRoute() {
    requestAnimationFrame(revealCurrentNavRoute);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleCurrentNavRoute, {once: true});
  } else {
    scheduleCurrentNavRoute();
  }
  window.addEventListener('resize', scheduleCurrentNavRoute, {passive: true});
})();

/* Prototype V2 starting questions. They follow account creation, establish a
   starting point, and unlock the full prototype. Age controls the Adults route. */
(() => {
  const AGE_KEY = 'learningai-age-range-prototype';
  const ASSESSMENT_KEY = 'learningai-diagnostic-prototype';
  const DRAFT_KEY = 'learningai-diagnostic-draft-prototype';
  const ADULT_RANGES = new Set(['19-24','25-34','35-49','50-plus']);
  const AGE_OPTIONS = [
    ['', 'Choose age range'], ['13-15', '13–15'], ['16-18', '16–18'],
    ['19-24', '19–24'], ['25-34', '25–34'], ['35-49', '35–49'],
    ['50-plus', '50+'], ['prefer-not', 'Prefer not to say']
  ];
  const QUESTIONS = [
    { key:'definition', label:'What AI is', title:'When someone says “AI,” what do they mean?', copy:'Pick the answer you could explain and use reliably right now.', options:[
      ['0','A website that gives answers when you type questions.'],
      ['1','A computer program that can copy human writing and conversation.'],
      ['2','A trained model that finds patterns in data and uses those patterns to make predictions or decisions.'],
      ['3','A family of systems: language models, image models, recommendation systems, robots, agents, and tools that can act across software.'] ] },
    { key:'capability', label:'Capabilities', title:'What can modern AI systems actually do?', copy:'Imagine someone says, “AI is just a smarter search engine.” What do you think?', options:[
      ['0','That sounds right. It mostly finds information faster.'],
      ['1','It can answer questions, write drafts, and summarize text.'],
      ['2','It can explain, code, plan, translate, analyze images, simulate conversations, and help build tools.'],
      ['3','It can become part of a workflow: using tools, calling APIs, checking files, running code, and coordinating multi-step work.'] ] },
    { key:'limits', label:'Checking', title:'When should you slow down and check?', copy:'An AI gives a confident answer about a medical, legal, historical, or scientific fact. What would you actually do next?', options:[
      ['0','Trust it if the answer sounds detailed.'],
      ['1','Ask it again and see if it says the same thing.'],
      ['2','Ask for sources, then check reliable sources yourself.'],
      ['3','Treat the answer as a starting point, verify outside the model, and ask what evidence would change the answer.'] ] },
    { key:'learning', label:'Control', title:'How should you use AI without losing control?', copy:'Pick what you would actually do when you are learning something new.', options:[
      ['0','Let it do the main thinking so you can move faster.'],
      ['1','Ask it to explain the answer in easier words.'],
      ['2','Ask for hints, examples, and a check so you still do the important thinking.'],
      ['3','Use it as a tutor, critic, and practice partner while protecting the skill you are trying to build.'] ] },
    { key:'impact', label:'Impact', title:'How do you think about AI’s real-world costs?', copy:'Someone says, “AI has real environmental and social costs.” What would you actually say back?', options:[
      ['0','They are wrong. New technology always wins.'],
      ['1','They are right. AI should probably be avoided.'],
      ['2','The costs are real, but we should compare them with benefits, efficiency improvements, and better infrastructure.'],
      ['3','We should ask better questions: which model, what task, how much energy, what alternative, what social benefit, and who pays the cost?'] ] },
    { key:'systems', label:'Beyond chatbots', title:'What do you know beyond chatbots?', copy:'What comes after typing questions into a chatbot?', options:[
      ['0','Mostly better chatbots.'],
      ['1','Tools that write, summarize, and search faster.'],
      ['2','Personal tutors, coding helpers, research assistants, creative tools, and agents that use software.'],
      ['3','AI systems connected to data, tools, robots, labs, simulations, businesses, and scientific workflows.'] ] }
  ];

  const read = (key, fallback = '') => { try { return localStorage.getItem(key) || fallback; } catch { return fallback; } };
  const readJson = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key) || 'null') || fallback; } catch { return fallback; } };
  const savedAge = () => read(AGE_KEY);
  const isAdult = value => ADULT_RANGES.has(value);
  const ROUTES = new Map([
    ['Dashboard', './stage-1-navigation-proof.html'],
    ['Lessons', './lessons.html'],
    ['Progress', './progress.html'],
    ['Focus', './focus.html'],
    ['Notes', './notes.html'],
    ['Projects', './projects.html'],
    ['Gallery', './gallery.html'],
    ['About', './about.html'],
    ['Teaching AI', './about.html#teaching']
  ]);
  const PRIMARY_ROUTES = ['Dashboard', 'Lessons', 'Progress', 'Focus'];
  const MORE_ROUTES = ['Projects', 'Gallery', 'Notes', 'About', 'Teaching AI'];
  const CURRENT_ROUTE = new Map([
    ['stage-1-navigation-proof.html', 'Dashboard'],
    ['progress.html', 'Progress'],
    ['lessons.html', 'Lessons'],
    ['lesson.html', 'Lessons'],
    ['focus.html', 'Focus'],
    ['notes.html', 'Notes'],
    ['projects.html', 'Projects'],
    ['gallery.html', 'Gallery'],
    ['about.html', 'About'],
    ['adults.html', 'Adults']
  ]);
  const PROTECTED_ROUTES = new Set([
    'stage-1-navigation-proof.html','progress.html','lessons.html','lesson.html','focus.html',
    'notes.html','projects.html','gallery.html','about.html','adults.html','settings.html'
  ]);

  function prototypeName() {
    const fromQuery = new URLSearchParams(location.search).get('name');
    return String(fromQuery || window.LearningAIUser?.displayName || 'Learner').trim() || 'Learner';
  }

  function syncGreeting() {
    const name = prototypeName();
    document.querySelectorAll('.greeting').forEach(element => {
      element.textContent = `Welcome back, ${name}`;
    });
    const dashboardGreeting = document.querySelector('#dashboardGreeting');
    if (dashboardGreeting) dashboardGreeting.textContent = `Welcome back, ${name}.`;
  }

  function syncCanonicalNavigation() {
    const file = location.pathname.split('/').pop() || '';
    const currentLabel = file === 'about.html' && location.hash === '#teaching'
      ? 'Teaching AI'
      : CURRENT_ROUTE.get(file);
    document.querySelectorAll('.nav-glass nav').forEach(nav => {
      nav.setAttribute('aria-label', 'Primary');
      nav.replaceChildren(...PRIMARY_ROUTES.map(label => {
        const link = document.createElement('a');
        link.href = ROUTES.get(label);
        link.textContent = label;
        if (label === currentLabel) link.setAttribute('aria-current', 'page');
        return link;
      }));
    });
  }

  function guardPrototypeRoute() {
    const params = new URLSearchParams(location.search);
    const reviewMode = window.LearningAIReviewMode === true;
    if (reviewMode) {
      document.querySelectorAll('a[href^="./"]').forEach(link => {
        const url = new URL(link.href, location.href);
        if (url.origin === location.origin && url.pathname.includes('/learning-ai-design-assets/')) {
          url.searchParams.set('review', '1');
          link.href = `${url.pathname.split('/').pop()}${url.search}${url.hash}`;
        }
      });
      return true;
    }
    const file = location.pathname.split('/').pop() || '';
    const firstComplete = Boolean(read('learningai-first-lesson-complete'));
    const accountReady = Boolean(read('learningai-prototype-account'));
    const questionsReady = Boolean(read(ASSESSMENT_KEY));
    // Unlock is always derived from the three required milestones. The cached
    // flag is only a convenience for older previews and must never bypass a
    // missing lesson, learner record, or questionnaire.
    const unlocked = firstComplete && accountReady && questionsReady;
    if (unlocked && !read('learningai-site-unlocked')) localStorage.setItem('learningai-site-unlocked', 'true');
    if (!unlocked && read('learningai-site-unlocked')) localStorage.removeItem('learningai-site-unlocked');
    if (file === 'onboarding.html') {
      if (!firstComplete) { location.replace('./lesson-one.html'); return false; }
      if (!accountReady) { location.replace('./access.html'); return false; }
    }
    if (!PROTECTED_ROUTES.has(file) || unlocked) return true;
    const destination = !firstComplete ? './lesson-one.html' : !accountReady ? './access.html' : './onboarding.html';
    location.replace(destination);
    return false;
  }

  function syncAdultsNavigation(age = savedAge()) {
    document.querySelectorAll('.mobile-nav-menu').forEach(menu => {
      menu.querySelector('[data-adults-link]')?.remove();
      if (!isAdult(age)) return;
      const link = document.createElement('a');
      link.href = './adults.html';
      link.dataset.adultsLink = '';
      link.setAttribute('role', 'menuitem');
      link.textContent = 'Adults';
      if (location.pathname.endsWith('/adults.html')) link.setAttribute('aria-current', 'page');
      menu.append(link);
    });
  }

  function syncCoreNavigation() {}

  function setupMobileNavigationMenu() {
    document.querySelectorAll('.nav-glass').forEach(glass => {
      const primary = glass.querySelector('nav[aria-label="Primary"]');
      const settings = glass.querySelector('.settings');
      if (!primary || !settings || glass.querySelector('.mobile-nav-more')) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'mobile-nav-more';
      button.setAttribute('aria-label', 'More LearningAI pages');
      button.setAttribute('aria-haspopup', 'menu');
      button.setAttribute('aria-expanded', 'false');
      button.textContent = 'More';
      const menu = document.createElement('div');
      menu.className = 'mobile-nav-menu';
      menu.hidden = true;
      menu.setAttribute('role', 'menu');
      menu.setAttribute('aria-label', 'All LearningAI pages');
      const file = location.pathname.split('/').pop() || '';
      const currentLabel = file === 'about.html' && location.hash === '#teaching'
        ? 'Teaching AI'
        : CURRENT_ROUTE.get(file);
      if (MORE_ROUTES.includes(currentLabel) || currentLabel === 'Adults') {
        // Keep the visible label as "More" so it matches the accessible name and
        // does not read as a sibling of the settings gear beside it.
        button.classList.add('is-current');
      }
      MORE_ROUTES.forEach(label => {
        const link = document.createElement('a');
        link.href = ROUTES.get(label);
        link.textContent = label;
        link.setAttribute('role', 'menuitem');
        if (label === currentLabel) link.setAttribute('aria-current', 'page');
        menu.append(link);
      });
      const menuItems = () => [...menu.querySelectorAll('[role="menuitem"],a[data-adults-link]')];
      const closeMenu = ({ focusButton = false } = {}) => {
        if (menu.hidden) return;
        menu.hidden = true;
        button.setAttribute('aria-expanded', 'false');
        if (focusButton) button.focus();
      };
      const openMenu = () => {
        menu.hidden = false;
        button.setAttribute('aria-expanded', 'true');
        (menu.querySelector('[aria-current="page"]') || menuItems()[0])?.focus();
      };
      button.addEventListener('click', event => {
        event.stopPropagation();
        if (menu.hidden) openMenu();
        else closeMenu();
      });
      button.addEventListener('keydown', event => {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          openMenu();
        }
      });
      menu.addEventListener('click', event => event.stopPropagation());
      menu.addEventListener('keydown', event => {
        const items = menuItems();
        const index = items.indexOf(document.activeElement);
        let next = -1;
        if (event.key === 'ArrowDown') next = index < 0 ? 0 : (index + 1) % items.length;
        if (event.key === 'ArrowUp') next = index < 0 ? items.length - 1 : (index - 1 + items.length) % items.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = items.length - 1;
        if (next >= 0) {
          event.preventDefault();
          items[next]?.focus();
        }
        if (event.key === 'Escape') {
          event.preventDefault();
          closeMenu({ focusButton:true });
        }
      });
      document.addEventListener('click', () => closeMenu());
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && !menu.hidden) {
          event.preventDefault();
          closeMenu({ focusButton:true });
        }
      });
      settings.before(button);
      glass.append(menu);
    });
    syncAdultsNavigation();
  }

  function propagateReviewMode() {
    if (new URLSearchParams(location.search).get('review') !== '1') return;
    const preserve = root => (root.matches?.('a[href^="./"]') ? [root] : [...root.querySelectorAll?.('a[href^="./"]') || []]).forEach(link => {
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || !url.pathname.includes('/learning-ai-design-assets/')) return;
      url.searchParams.set('review', '1');
      link.href = `${url.pathname.split('/').pop()}${url.search}${url.hash}`;
    });
    preserve(document);
    if (!window.__learningAIReviewObserver) {
      window.__learningAIReviewObserver = new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) preserve(node);
      })));
      window.__learningAIReviewObserver.observe(document.documentElement, { childList:true, subtree:true });
    }
  }

  function buildQuestionnaire(forcePreview = false) {
    if (!location.pathname.endsWith('/onboarding.html')) return;
    if (!forcePreview && read(ASSESSMENT_KEY)) {
      location.replace('./stage-1-navigation-proof.html');
      return;
    }
    const draft = readJson(DRAFT_KEY,{index:0,age:savedAge(),answers:{}});
    draft.answers ||= {};
    const dialog = document.createElement('dialog');
    dialog.className = 'audience-dialog diagnostic-dialog'; dialog.id = 'audienceDialog'; dialog.setAttribute('aria-labelledby','audienceTitle');
    document.body.append(dialog);

    function persistDraft(){ localStorage.setItem(DRAFT_KEY,JSON.stringify(draft)); }
    function renderQuestion(){
      const index = Math.max(0,Math.min(Number(draft.index)||0,QUESTIONS.length-1));
      const question = QUESTIONS[index];
      const answer = draft.answers[question.key] || '';
      /* The four graded options are authored weakest-to-strongest, so the
         highest-scoring answer was always the fourth one. That rewards pattern
         matching rather than honest self-placement. A fixed permutation per
         question spreads the strongest answer across all four positions and is
         stable across Back/Next and reloads, so nobody loses their place. The
         stored value keeps its score regardless of where it is shown.
         "Not sure" stays last: it is an escape hatch, not a graded choice. */
      const OPTION_ORDERS = [[2,0,3,1],[1,3,0,2],[3,1,2,0],[0,2,1,3],[2,3,1,0],[1,0,3,2]];
      const order = OPTION_ORDERS[index % OPTION_ORDERS.length];
      const gradedOptions = order.map(position => question.options[position]).filter(Boolean);
      const questionOptions = [...gradedOptions, ['unsure', 'I’m not sure yet.']];
      dialog.innerHTML = `<form method="dialog" class="audience-card diagnostic-card-prototype">
        <div class="diagnostic-meta"><p class="audience-eyebrow">Starting placement · not graded</p><span>Question ${index+1} of ${QUESTIONS.length}</span></div>
        <div class="diagnostic-progress-prototype" role="progressbar" aria-label="Starting questions" aria-valuemin="1" aria-valuemax="${QUESTIONS.length}" aria-valuenow="${index+1}" aria-valuetext="Question ${index+1} of ${QUESTIONS.length}"><i style="width:${((index+1)/QUESTIONS.length)*100}%"></i></div>
        <p class="diagnostic-promise">About 2 minutes. Your answers record your starting point so the course can be improved. They are not a grade, and they never lock or unlock a lesson.</p>
        <p class="diagnostic-topic">${question.label}</p>
        <h2 id="audienceTitle" tabindex="-1">${question.title}</h2>
        <p class="audience-copy">${question.copy}</p>
        ${index===0 ? `<label class="audience-field"><span>Age range</span><small>LearningAI is built first for ages 13–18 and is open to everyone. This answer only decides whether adult-only guidance appears.</small><select id="audienceAge">${AGE_OPTIONS.map(([value,label])=>`<option value="${value}" ${draft.age===value?'selected':''}>${label}</option>`).join('')}</select></label>`:''}
        <fieldset class="diagnostic-options-prototype"><legend>Choose the closest answer</legend>${questionOptions.map(([value,label],optionIndex)=>`<label><input type="radio" name="${question.key}" value="${value}" ${answer===value?'checked':''}><span><b>${optionIndex+1}</b>${label}</span></label>`).join('')}</fieldset>
        <p class="audience-result" id="audienceResult" aria-live="polite">Choose the answer closest to what you understand today. You can change your starting point later.</p>
        <div class="audience-actions diagnostic-actions"><button class="audience-skip" id="audienceBack" type="button" ${index===0?'disabled':''}>Back</button><button class="audience-primary" id="audienceNext" type="button">${index===QUESTIONS.length-1?'Finish and unlock LearningAI':'Next question'}</button></div>
      </form>`;
      const result = dialog.querySelector('#audienceResult');
      const ageSelect = dialog.querySelector('#audienceAge');
      ageSelect?.addEventListener('change',event=>{ draft.age=event.target.value; persistDraft(); });
      dialog.querySelectorAll(`input[name="${question.key}"]`).forEach(input=>input.addEventListener('change',event=>{ draft.answers[question.key]=event.target.value; persistDraft(); }));
      dialog.querySelector('#audienceBack').addEventListener('click',()=>{ draft.index=Math.max(0,index-1); persistDraft(); renderQuestion(); });
      dialog.querySelector('#audienceNext').addEventListener('click',async()=>{
        const chosen = dialog.querySelector(`input[name="${question.key}"]:checked`);
        if(index===0 && !draft.age){ result.textContent='Choose an age range, or select “Prefer not to say.”'; ageSelect?.focus(); return; }
        if(!chosen){ result.textContent='Choose one answer before continuing.'; dialog.querySelector(`input[name="${question.key}"]`)?.focus(); return; }
        draft.answers[question.key]=chosen.value;
        if(index===0){ localStorage.setItem(AGE_KEY,draft.age); syncAdultsNavigation(draft.age); }
        if(index<QUESTIONS.length-1){ draft.index=index+1; persistDraft(); renderQuestion(); return; }
        const score=QUESTIONS.reduce((sum,item)=>sum+(Number(draft.answers[item.key])||0),0);
        const percent=Math.round(score/(QUESTIONS.length*3)*100);
        const level=percent<45?'Foundation':percent<75?'Explorer':'Builder';
        const completedAt=new Date().toISOString();
        const assessment={ageRange:draft.age,answers:draft.answers,responses:QUESTIONS.map(item=>{const value=String(draft.answers[item.key]||''),label=item.options.find(([optionValue])=>optionValue===draft.answers[item.key])?.[1]||'I’m not sure yet.';return{questionKey:item.key,value,label,answer:value,answerLabel:label}}),scorePercent:percent,level,placementMethod:'self-report',completedAt};
        const account=readJson('learningai-prototype-account',null);
        if(account?.mode==='postgres'&&!window.LearningAIReviewMode){
          const button=dialog.querySelector('#audienceNext');
          button.disabled=true;
          button.textContent='Saving your starting point…';
          const saved=await window.LearningAIAPI?.saveAssessment(assessment);
          if(!saved?.ok){
            button.disabled=false;
            button.textContent='Finish and unlock LearningAI';
            result.textContent=window.LearningAIAPI?.friendlyError(saved)||'Your answers could not be saved. Try again.';
            return;
          }
        }
        localStorage.setItem(ASSESSMENT_KEY,JSON.stringify(assessment));
        localStorage.setItem('learningai-site-unlocked','true');
        localStorage.removeItem(DRAFT_KEY); dialog.close(); location.href='./stage-1-navigation-proof.html';
      });
      document.querySelector('.onboarding-context')?.setAttribute('aria-busy','false');
      requestAnimationFrame(()=>dialog.querySelector('#audienceTitle')?.focus());
    }
    dialog.addEventListener('cancel',event=>event.preventDefault()); renderQuestion(); dialog.showModal();
  }

  function initializeAudience() {
    const previewParams = new URLSearchParams(location.search);
    const forceQuestionnairePreview = previewParams.get('audience') === 'reset';
    if (forceQuestionnairePreview) {
      [AGE_KEY,ASSESSMENT_KEY,DRAFT_KEY,'learningai-site-unlocked'].forEach(key=>localStorage.removeItem(key));
      previewParams.delete('audience'); const cleanQuery = previewParams.toString();
      history.replaceState(null,'',`${location.pathname}${cleanQuery?`?${cleanQuery}`:''}${location.hash}`);
    }
    if (!guardPrototypeRoute()) return;
    syncCanonicalNavigation(); syncCoreNavigation(); syncAdultsNavigation(); setupMobileNavigationMenu(); propagateReviewMode(); syncGreeting();
    if (location.pathname.endsWith('/adults.html') && !isAdult(savedAge())) {
      const destination = savedAge() ? './stage-1-navigation-proof.html?notice=adults' : './onboarding.html?notice=adults';
      location.replace(destination);
      return;
    }
    buildQuestionnaire(forceQuestionnairePreview);
    window.LearningAIAudience = { age:savedAge, isAdult:()=>isAdult(savedAge()), options:()=>AGE_OPTIONS.slice(),
    /* Changing an age range is not a reason to retake six questions and lose a
       recorded starting point. Update the age alone and re-sync the Adults route. */
    setAge(value){ const allowed=AGE_OPTIONS.some(([option])=>option===value); if(!allowed) return false; localStorage.setItem(AGE_KEY,value); syncAdultsNavigation(value); return true; },
    reset(){ if(window.LearningAIReviewMode){ location.href='./onboarding.html?review=1'; return; } [AGE_KEY,ASSESSMENT_KEY,DRAFT_KEY,'learningai-site-unlocked'].forEach(key=>localStorage.removeItem(key)); location.href='./onboarding.html'; } };
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initializeAudience,{once:true}); else initializeAudience();
})();
