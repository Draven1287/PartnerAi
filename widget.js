/* ============================================================
   Aside: sitewide chat widget
   Runs Llama 3.2 1B Instruct ENTIRELY IN YOUR BROWSER via WebLLM.
   No API key. No backend. No data leaves your machine.
   ============================================================ */
(function () {
  const STORAGE_HISTORY = 'aside-guide-history';
  const STORAGE_OPEN = 'aside-guide-open';
  const MODEL_ID = 'Llama-3.2-1B-Instruct-q4f32_1-MLC';
  const MODEL_LABEL = 'Llama 3.2 1B';
  const SYSTEM_PROMPT =
    "You are Aside Guide, a friendly AI learning companion on a site called Aside, built by Aarav Shah (a 9th grader). " +
    "You are running entirely in the user's browser using WebLLM: no API keys, no server. " +
    "You are a 1B-parameter model: small, fast, sometimes wrong. Be honest about your limits. " +
    "Help with anything on the site: explain lessons, ask guiding questions, turn vague goals into better prompts, suggest small projects, and encourage users to verify important facts. " +
    "Use a human-centred, inquiry-based teaching style: start from the learner's question, connect ideas to real life, encourage observation, reflection, making, discussion, and responsible use. " +
    "When a user asks you to do schoolwork for them, guide them through the thinking instead of simply completing it. " +
    "Prefer sustainable AI habits: local or open-source tools when practical, smaller models for practice, privacy-aware choices, and using AI only when it adds learning value. " +
    "Keep replies concise (under 200 words) unless asked.";

  let engine = null;
  let loading = false;
  let history = [];

  // --- Prompt coach: look at the user's prompt and offer one short tip ---
  // Returns either { good: [...], improve: [...] } or null if no useful tip.
  function analyzePrompt(text) {
    const t = text.trim();
    const lower = t.toLowerCase();
    const good = [];
    const improve = [];

    const hasRole = /\b(act as|you are an?|pretend you'?re|imagine you'?re|be a)\b/i.test(t);
    const hasExample = /\b(for example|like this|e\.g\.|here'?s an example|such as)\b/i.test(t);
    const hasConstraint = /\b(in \d+|under \d+|exactly \d+|\d+ words?|\d+ bullets?|\d+ sentences?|step.by.step|as a list|in bullets?|in points?)\b/i.test(t);
    const hasContext = /\b(i'?m a |i am a |i'?m an |i am an |i'?m working on|i'?m studying|for my|for a)\b/i.test(t);
    const hasTeach = /\b(teach me|explain|help me understand|how does|walk me through|show me how)\b/i.test(t);
    const askForOutsource = /\b(write my (essay|paper|homework|assignment|report)|do my homework|finish my )\b/i.test(t);
    const veryShort = t.length < 20;
    const shortNoContext = t.length < 50 && !hasContext && !hasRole;

    if (hasRole) good.push("gave it a role");
    if (hasExample) good.push("included examples");
    if (hasConstraint) good.push("gave it a constraint");
    if (hasContext) good.push("told it who you are");
    if (hasTeach) good.push("asked it to teach, not just answer");

    if (askForOutsource) {
      improve.push("Heads up: I'll write this, but you'll learn less doing it that way. Try 'help me think through ___' or 'critique my draft' instead.");
    } else if (veryShort) {
      improve.push("Pretty short. Try adding who you are, what level you want, and what you'll do with the answer. You'll get a much sharper response.");
    } else if (shortNoContext) {
      if (!hasRole) improve.push("Try adding a role, like 'act as a tutor.' It is the biggest single boost in prompt quality.");
    } else {
      if (!hasRole && good.length < 2) improve.push("Try giving me a role, like 'act as a tutor' or 'act as an editor.' It usually creates the biggest jump in answer quality.");
      else if (!hasConstraint && good.length < 2) improve.push("Try a constraint next time, like 'in 100 words' or 'as 3 bullets.' It keeps me focused.");
    }

    if (good.length === 0 && improve.length === 0) return null;
    return { good, improve };
  }

  function formatTip(analysis) {
    if (!analysis) return null;
    const parts = [];
    if (analysis.good.length > 0) {
      const verb = analysis.good.length >= 3 ? "Strong prompt. You" : "Nice. You";
      parts.push(`${verb} ${joinList(analysis.good)}.`);
    }
    if (analysis.improve.length > 0) {
      parts.push(analysis.improve[0]);
    }
    return parts.join(' ');
  }

  function joinList(arr) {
    if (arr.length === 1) return arr[0];
    if (arr.length === 2) return arr[0] + ' and ' + arr[1];
    return arr.slice(0, -1).join(', ') + ', and ' + arr[arr.length - 1];
  }

  // --- Inject DOM ---
  function injectDOM() {
    if (document.querySelector('.widget-fab')) return;

    const fab = document.createElement('button');
    fab.className = 'widget-fab';
    fab.setAttribute('aria-label', 'Open chat');
    fab.innerHTML = `
      <span class="pulse"></span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      </svg>
    `;
    document.body.appendChild(fab);

    const panel = document.createElement('div');
    panel.className = 'widget-panel';
    panel.setAttribute('role', 'dialog');
    panel.innerHTML = `
      <div class="widget-header">
        <span class="dot"></span>
        <div class="title">Aside Guide
          <span class="subtitle">${MODEL_LABEL} · private browser AI</span>
        </div>
        <button class="x" aria-label="Close">×</button>
      </div>
      <div class="widget-body"></div>
      <div class="widget-input">
        <textarea placeholder="Load the guide, then ask anything…" rows="1" disabled></textarea>
        <button class="send" disabled>Send</button>
      </div>
      <div class="widget-footer-actions">
        <button class="clear" title="Clear conversation">Clear</button>
        <button class="info" title="About">About</button>
      </div>
    `;
    document.body.appendChild(panel);

    return { fab, panel };
  }

  function init() {
    const { fab, panel } = injectDOM();
    const body = panel.querySelector('.widget-body');
    const header = panel.querySelector('.widget-header');
    const ta = panel.querySelector('textarea');
    const sendBtn = panel.querySelector('button.send');
    const clearBtn = panel.querySelector('button.clear');
    const infoBtn = panel.querySelector('button.info');
    const closeBtn = panel.querySelector('button.x');

    function open() { panel.classList.add('open'); fab.classList.add('open'); localStorage.setItem(STORAGE_OPEN, '1'); }
    function close() { panel.classList.remove('open'); fab.classList.remove('open'); localStorage.setItem(STORAGE_OPEN, '0'); }
    fab.addEventListener('click', () => panel.classList.contains('open') ? close() : open());
    closeBtn.addEventListener('click', close);

    // Restore conversation history
    try {
      history = JSON.parse(localStorage.getItem(STORAGE_HISTORY) || '[]');
    } catch (e) { history = []; }

    function renderHistory() {
      body.innerHTML = '';
      if (!engine) {
        showStartBox();
        return;
      }
      if (history.length === 0) {
        addSystemMsg(`Ready. Ask me anything about the course, a prompt, a project, or how to use AI without skipping the learning. I will answer and give a quick coaching note when it helps.`);
      } else {
        history.forEach(m => {
          if (m.role === 'tip') addTipMsg(m.content);
          else addMsg(m.content, 'msg-' + m.role);
        });
      }
    }

    function addMsg(text, cls) {
      const d = document.createElement('div');
      d.className = 'msg ' + cls;
      d.textContent = text;
      body.appendChild(d);
      body.scrollTop = body.scrollHeight;
      return d;
    }
    function addSystemMsg(text) { return addMsg(text, 'msg-system'); }
    function addTipMsg(text) {
      const d = document.createElement('div');
      d.className = 'msg msg-tip';
      const lbl = document.createElement('span');
      lbl.className = 'tip-label';
      lbl.textContent = 'Guide note';
      d.appendChild(lbl);
      const txt = document.createElement('span');
      txt.textContent = text;
      d.appendChild(txt);
      body.appendChild(d);
      body.scrollTop = body.scrollHeight;
      return d;
    }

    function saveHistory() {
      localStorage.setItem(STORAGE_HISTORY, JSON.stringify(history));
    }

    function showStartBox() {
      body.innerHTML = '';
      const box = document.createElement('div');
      box.className = 'widget-startbox';
      const hasGPU = 'gpu' in navigator;
      const isFile = location.protocol === 'file:';
      if (hasGPU && !isFile) {
        box.innerHTML = `
          <h4>Your AI guide for the course.</h4>
          <p>Click below to load <strong>${MODEL_LABEL}</strong>, an open-source model that runs on your device. Ask it to explain a lesson, improve a prompt, quiz you, help plan a project, or think through responsible AI use.</p>
          <button class="start">Load guide →</button>
          <p class="fine">First load downloads ~600&nbsp;MB once. No signup, no API key, and the conversation stays on your device.</p>
        `;
        body.appendChild(box);
        box.querySelector('.start').addEventListener('click', loadModel);
      } else {
        const reason = isFile
          ? "This page is open via <code>file://</code>. The in-browser AI needs a real web server (Netlify, Vercel, GitHub Pages: all free)."
          : "Your browser doesn't support WebGPU. Try Chrome or Edge.";
        box.innerHTML = `
          <h4>In-browser AI not available here.</h4>
          <p>${reason}</p>
          <p style="margin-top:0.9rem;color:var(--text);font-size:0.9rem;"><strong>Free open-source chats you can use right now:</strong></p>
          <p style="margin:0.4rem 0;"><a href="https://duckduckgo.com/?q=DuckDuckGo+AI+Chat&ia=chat" target="_blank" rel="noopener" style="color:var(--accent);">▸ DuckDuckGo AI Chat</a> <span style="color:var(--text-faint);font-size:0.8rem;">: anonymous, runs Llama 3.3</span></p>
          <p style="margin:0.4rem 0;"><a href="https://huggingface.co/chat/" target="_blank" rel="noopener" style="color:var(--accent);">▸ Hugging Face Chat</a> <span style="color:var(--text-faint);font-size:0.8rem;">: many open-source models</span></p>
          <p style="margin:0.4rem 0;"><a href="https://lmstudio.ai/" target="_blank" rel="noopener" style="color:var(--accent);">▸ LM Studio</a> <span style="color:var(--text-faint);font-size:0.8rem;">: free desktop app, runs models locally</span></p>
        `;
        body.appendChild(box);
      }
    }

    async function loadModel() {
      if (loading || engine) return;
      loading = true;
      body.innerHTML = '';
      header.classList.remove('ready', 'error');

      const prog = document.createElement('div');
      prog.className = 'widget-progress';
      prog.innerHTML = `
        <div class="label"><strong>Downloading ${MODEL_LABEL}…</strong> <span class="pct">0%</span></div>
        <div class="bar"><div class="fill"></div></div>
        <div class="label" style="margin-top:0.6rem;margin-bottom:0;font-size:0.78rem;">First load only. Then it runs instantly.</div>
      `;
      body.appendChild(prog);

      try {
        const mod = await import('https://esm.run/@mlc-ai/web-llm');
        engine = await mod.CreateMLCEngine(MODEL_ID, {
          initProgressCallback: (report) => {
            const pct = Math.round((report.progress || 0) * 100);
            prog.querySelector('.fill').style.width = pct + '%';
            prog.querySelector('.pct').textContent = pct + '%';
            const label = prog.querySelector('.label strong');
            if (report.text) label.textContent = report.text;
          },
        });
        header.classList.add('ready');
        ta.disabled = false;
        sendBtn.disabled = false;
        ta.placeholder = 'Ask me anything…';
        renderHistory();
        ta.focus();
      } catch (err) {
        console.error(err);
        header.classList.add('error');
        body.innerHTML = '';
        const isFile = location.protocol === 'file:';
        const noWebGPU = !('gpu' in navigator);
        let msg = "Couldn't load Llama in your browser. ";
        if (isFile) msg += "Looks like the page is open via file://: the in-browser model needs a real web server. Once this site is on Netlify or Vercel, it'll work. ";
        else if (noWebGPU) msg += "Your browser doesn't support WebGPU. ";
        else msg += "Could be a network issue. ";
        msg += "In the meantime, try one of these free open-source chats:";
        addSystemMsg(msg);

        // Render fallback links inline.
        const fallback = document.createElement('div');
        fallback.className = 'widget-startbox';
        fallback.innerHTML = `
          <p style="margin:0 0 0.6rem;color:var(--text);font-size:0.9rem;"><strong>Free, no-signup open-source chats:</strong></p>
          <p style="margin:0 0 0.4rem;"><a href="https://duckduckgo.com/?q=DuckDuckGo+AI+Chat&ia=chat" target="_blank" rel="noopener" style="color:var(--accent);">▸ DuckDuckGo AI Chat</a> <span style="color:var(--text-faint);font-size:0.8rem;">(Llama 3.3, Mistral)</span></p>
          <p style="margin:0;"><a href="https://huggingface.co/chat/" target="_blank" rel="noopener" style="color:var(--accent);">▸ Hugging Face Chat</a> <span style="color:var(--text-faint);font-size:0.8rem;">(many open-source models)</span></p>
        `;
        body.appendChild(fallback);
      } finally {
        loading = false;
      }
    }

    async function send() {
      const text = ta.value.trim();
      if (!text || !engine) return;
      addMsg(text, 'msg-user');
      ta.value = '';
      ta.style.height = 'auto';
      ta.disabled = true;
      sendBtn.disabled = true;

      history.push({ role: 'user', content: text });

      // Analyse the prompt now, then show the coaching note after the answer
      // so the latest visible message is the guide note.
      const analysis = analyzePrompt(text);
      const tipText = formatTip(analysis);

      saveHistory();

      const aiDiv = addMsg('', 'msg-ai');
      aiDiv.textContent = '…';

      try {
        // Strip 'tip' entries: they're display-only, not for the model.
        const modelHistory = history.filter(m => m.role === 'user' || m.role === 'assistant');
        const messages = [{ role: 'system', content: SYSTEM_PROMPT }, ...modelHistory];
        const chunks = await engine.chat.completions.create({
          messages,
          stream: true,
          temperature: 0.7,
          max_tokens: 600,
        });
        let acc = '';
        for await (const chunk of chunks) {
          const piece = chunk.choices?.[0]?.delta?.content || '';
          if (piece) {
            if (acc === '') aiDiv.textContent = '';
            acc += piece;
            aiDiv.textContent = acc;
            body.scrollTop = body.scrollHeight;
          }
        }
        history.push({ role: 'assistant', content: acc });
        if (tipText) {
          addTipMsg(tipText);
          history.push({ role: 'tip', content: tipText });
        }
        saveHistory();
      } catch (err) {
        console.error(err);
        aiDiv.textContent = 'Sorry: something went wrong generating that. Try again, or clear and start fresh.';
        if (tipText) {
          addTipMsg(tipText);
          history.push({ role: 'tip', content: tipText });
          saveHistory();
        }
      } finally {
        ta.disabled = false;
        sendBtn.disabled = false;
        ta.focus();
      }
    }

    sendBtn.addEventListener('click', send);
    ta.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
    });
    ta.addEventListener('input', () => {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
    });

    clearBtn.addEventListener('click', () => {
      history = [];
      saveHistory();
      renderHistory();
    });

    infoBtn.addEventListener('click', () => {
      addSystemMsg('About: Aside Guide runs Llama 3.2 1B Instruct, an open-source model from Meta, entirely in your browser using WebLLM (WebGPU). No API key, no server, nothing leaves your machine. It is small, so it can make mistakes. Use it as a guide: ask questions, verify important facts, and keep your own judgment active.');
    });

    // Initial render
    renderHistory();

    // Restore open state
    if (localStorage.getItem(STORAGE_OPEN) === '1') open();
  }

  // Expose a small public API so other scripts can drive the widget.
  window.Aside = {
    open() {
      const fab = document.querySelector('.widget-fab');
      const panel = document.querySelector('.widget-panel');
      if (panel && !panel.classList.contains('open') && fab) fab.click();
    },
    sendPrompt(text) {
      this.open();
      // Wait a tick for the panel to render, then drop the prompt in the textarea.
      setTimeout(() => {
        const ta = document.querySelector('.widget-panel textarea');
        if (!ta) return;
        ta.value = text;
        ta.focus();
        // If the model is loaded, the textarea is enabled: auto-send.
        if (!ta.disabled) {
          const sendBtn = document.querySelector('.widget-panel button.send');
          if (sendBtn && !sendBtn.disabled) sendBtn.click();
        }
        // Otherwise leave the prompt in the field for the user to send after loading.
      }, 250);
    },
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
