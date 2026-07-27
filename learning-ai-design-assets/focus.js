(() => {
  const STORAGE_KEY = 'learningai-learning-rhythm-v1';
  const today = new Date().toLocaleDateString('en-CA');
  const IDLE_LIMIT_SECONDS=10*60;
  const MIN_SESSION_SECONDS=60;
  const defaults = {date:today,secondsToday:0,totalSeconds:0,sessions:0,lastSessionTotalSeconds:0,goalDays:0,goalRecordedFor:'',running:false,startedAt:0,lastActivityAt:0,pauseReason:'',nextCheckpointSeconds:25*60,checkpointMinutes:25,activeIntervalMinutes:25,activeServerSessionId:'',soundEnabled:false,badges:{}};
  let state;
  try{state={...defaults,...JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}}catch{state={...defaults}}
  state.badges={...defaults.badges,...state.badges};
  if(Number(state.checkpointMinutes)<10||Number(state.checkpointMinutes)>60)state.checkpointMinutes=25;
  if(state.date!==today){state.date=today;state.secondsToday=0;state.running=false;state.startedAt=0;state.activeIntervalMinutes=state.checkpointMinutes;state.nextCheckpointSeconds=state.checkpointMinutes*60}

  const toggle=document.querySelector('#timerToggle');
  const finish=document.querySelector('#timerFinish');
  const clock=document.querySelector('#timerClock');
  const status=document.querySelector('#timerStatus');
  const intervalRing=document.querySelector('#dialValue');
  const checkpointLabel=document.querySelector('#checkpointLabel');
  const checkpointLength=document.querySelector('#checkpointLength');
  const plannedMinutes=document.querySelector('#plannedMinutes');
  const estimateLessons=document.querySelector('#estimateLessons');
  const estimateArcTime=document.querySelector('#estimateArcTime');
  const estimateCourseTime=document.querySelector('#estimateCourseTime');
  const soundEnabled=document.querySelector('#soundEnabled');
  const dialog=document.querySelector('#checkpointDialog');
  /* The dashboard's "A little learning, often" panel, rendered here from this
     same timer. It is deliberately not a second implementation: learning-rhythm.js
     owns the identical state key, and running both on one page would commit the
     elapsed seconds twice. */
  const rhythmToggle=document.querySelector('#focusToggle');
  const rhythmClock=document.querySelector('#focusClock');
  const rhythmRing=document.querySelector('#focusRingValue');
  const rhythmFeedback=document.querySelector('#focusFeedback');
  const rhythmCircumference=2*Math.PI*66;
  const GOAL_SECONDS=25*60;
  if(rhythmRing)rhythmRing.style.strokeDasharray=String(rhythmCircumference);
  const circumference=2*Math.PI*91;
  let audioContext;
  let checkpointShown=false;
  intervalRing.style.strokeDasharray=String(circumference);
  checkpointLength.value=String(state.checkpointMinutes||25);
  soundEnabled.checked=state.soundEnabled!==false;

  /* ── Circular interval dial ───────────────────────────────────────────────
     The minutes control used to be a linear rainbow range. The dial below is
     the visible, focusable control; #checkpointLength stays in the DOM, hidden
     and unfocusable, as the single value everything else already reads. So the
     timer logic, the <output>, and the lesson estimates are untouched.

     Geometry: a 270° sweep starting at 135° (lower left) and running clockwise
     to 45° (lower right). Angles are computed here rather than applied as CSS
     rotations because the site's "no motion" setting clears every transform
     with !important and would otherwise unwind the dial itself. */
  const dial=document.querySelector('#minuteDial');
  const dialFill=document.querySelector('#dialFill');
  const dialKnob=document.querySelector('#dialKnob');
  const dialKnobHalo=document.querySelector('#dialKnobHalo');
  const dialTicks=document.querySelector('#dialTicks');
  const dialMinutes=document.querySelector('#dialMinutes');
  const dialNote=document.querySelector('#dialNote');
  const DIAL_MIN=Number(checkpointLength.min)||10;
  const DIAL_MAX=Number(checkpointLength.max)||60;
  const DIAL_STEP=Number(checkpointLength.step)||5;
  const DIAL_START=135;
  const DIAL_SWEEP=270;
  const SVG_NS='http://www.w3.org/2000/svg';
  let dialDragging=false;
  let dialPointerId=null;

  const clampMinutes=value=>Math.min(DIAL_MAX,Math.max(DIAL_MIN,value));
  const stepMinutes=value=>clampMinutes(Math.round(clampMinutes(value)/DIAL_STEP)*DIAL_STEP);
  const dialAngle=minutes=>(DIAL_START+((clampMinutes(minutes)-DIAL_MIN)/(DIAL_MAX-DIAL_MIN))*DIAL_SWEEP)*Math.PI/180;
  const dialPoint=(minutes,radius)=>{const angle=dialAngle(minutes);return{x:100+radius*Math.cos(angle),y:100+radius*Math.sin(angle)}};
  const dialNoteFor=minutes=>minutes<20?'a short, honest slice':minutes<25?'a gentle session':minutes<=30?'recommended':minutes<=45?'a deep session':'plan a pause inside it';
  let committedMinutes=Number(checkpointLength.value)||25;

  function buildDialTicks(){
    if(!dialTicks)return;
    for(let minutes=DIAL_MIN;minutes<=DIAL_MAX;minutes+=DIAL_STEP){
      const major=minutes%10===0;
      const inner=dialPoint(minutes,major?63:66);
      const outer=dialPoint(minutes,71);
      const line=document.createElementNS(SVG_NS,'line');
      line.setAttribute('x1',inner.x.toFixed(2));line.setAttribute('y1',inner.y.toFixed(2));
      line.setAttribute('x2',outer.x.toFixed(2));line.setAttribute('y2',outer.y.toFixed(2));
      if(major)line.setAttribute('class','is-major');
      dialTicks.append(line);
      if(!major)continue;
      const label=dialPoint(minutes,55);
      const text=document.createElementNS(SVG_NS,'text');
      text.setAttribute('x',label.x.toFixed(2));text.setAttribute('y',label.y.toFixed(2));
      text.textContent=String(minutes);
      dialTicks.append(text);
    }
  }

  /* Geometry only. During a drag the knob follows the raw pointer angle so the
     movement stays continuous; on release it animates to the stepped value. */
  function paintDial(minutes,animate){
    if(!dial)return;
    const fraction=(clampMinutes(minutes)-DIAL_MIN)/(DIAL_MAX-DIAL_MIN);
    dial.classList.toggle('is-dragging',!animate);
    dialFill.style.strokeDashoffset=String((100-fraction*100).toFixed(2));
    const knob=dialPoint(minutes,78);
    dialKnob.setAttribute('cx',knob.x.toFixed(2));
    dialKnob.setAttribute('cy',knob.y.toFixed(2));
    dialKnobHalo.setAttribute('cx',knob.x.toFixed(2));
    dialKnobHalo.setAttribute('cy',knob.y.toFixed(2));
  }

  function paintDialText(minutes){
    if(!dial)return;
    dialMinutes.textContent=String(minutes);
    dialNote.textContent=dialNoteFor(minutes);
    dial.setAttribute('aria-valuenow',String(minutes));
    dial.setAttribute('aria-valuetext',`${minutes} minutes${minutes===25?', the recommended length':''}`);
  }

  /* Write the value everything else reads, then let the existing listeners run.
     `commit` is false mid-drag: the estimate updates live, the stored plan does
     not move until the pointer is released. */
  function setPlannedMinutes(minutes,commit){
    const stepped=stepMinutes(minutes);
    const changed=String(stepped)!==String(checkpointLength.value);
    checkpointLength.value=String(stepped);
    if(changed)checkpointLength.dispatchEvent(new Event('input',{bubbles:true}));
    else renderTimeEstimate();
    /* A drag reaches its final value mid-gesture, so "did the input change on
       this call" is not the same question as "has the learner's plan changed
       since it was last stored". Track the stored value separately or the
       release commits nothing. */
    if(commit&&stepped!==committedMinutes){
      committedMinutes=stepped;
      checkpointLength.dispatchEvent(new Event('change',{bubbles:true}));
    }
    return stepped;
  }

  function minutesFromPointer(event){
    const box=dial.getBoundingClientRect();
    const degrees=Math.atan2(event.clientY-(box.top+box.height/2),event.clientX-(box.left+box.width/2))*180/Math.PI;
    let offset=degrees-DIAL_START;
    while(offset<0)offset+=360;
    while(offset>=360)offset-=360;
    /* The 90° gap at the bottom is not part of the scale. Land on whichever end
       of the sweep the pointer is closer to instead of jumping across it. */
    if(offset>DIAL_SWEEP)offset=offset<DIAL_SWEEP+45?DIAL_SWEEP:0;
    return DIAL_MIN+(offset/DIAL_SWEEP)*(DIAL_MAX-DIAL_MIN);
  }

  function wireDial(){
    if(!dial)return;
    buildDialTicks();
    dial.addEventListener('pointerdown',event=>{
      if(event.button!==undefined&&event.button!==0)return;
      dialPointerId=event.pointerId;
      dialDragging=true;
      dial.setPointerCapture(event.pointerId);
      dial.focus({preventScroll:true});
      const raw=minutesFromPointer(event);
      setPlannedMinutes(raw,false);
      paintDial(raw,false);
      event.preventDefault();
    });
    dial.addEventListener('pointermove',event=>{
      if(!dialDragging||dialPointerId!==event.pointerId)return;
      event.preventDefault();
      const raw=minutesFromPointer(event);
      setPlannedMinutes(raw,false);
      paintDial(raw,false);
    });
    const releaseDial=event=>{
      if(dialPointerId!==event.pointerId)return;
      if(dial.hasPointerCapture(event.pointerId))dial.releasePointerCapture(event.pointerId);
      dialPointerId=null;
      dialDragging=false;
      /* Settle on a real value rather than wherever the finger stopped. */
      const settled=setPlannedMinutes(Number(checkpointLength.value),true);
      paintDial(settled,true);
    };
    dial.addEventListener('pointerup',releaseDial);
    dial.addEventListener('pointercancel',releaseDial);
    dial.addEventListener('keydown',event=>{
      const current=Number(checkpointLength.value)||25;
      let next=current;
      if(event.key==='ArrowRight'||event.key==='ArrowUp')next=current+DIAL_STEP;
      else if(event.key==='ArrowLeft'||event.key==='ArrowDown')next=current-DIAL_STEP;
      else if(event.key==='PageUp')next=current+DIAL_STEP*2;
      else if(event.key==='PageDown')next=current-DIAL_STEP*2;
      else if(event.key==='Home')next=DIAL_MIN;
      else if(event.key==='End')next=DIAL_MAX;
      else return;
      event.preventDefault();
      paintDial(setPlannedMinutes(next,true),true);
    });
  }

  const lessons=Array.isArray(window.LESSONS)?window.LESSONS:[];
  const arcNames=[...new Set(lessons.map(lesson=>lesson.arc))];
  /* Lesson 01 in this course opens ./lesson-one.html, the bespoke free lesson,
     not the V2 engine's chapter-1. It is different content and a different
     length, so an estimate that quotes chapter-1's figure promises a lesson that
     does not exist at that link. Same helper and same literal as the catalog in
     lessons.html — tools/estimate-lesson-time.mjs owns both numbers, `--apply`
     rewrites them and `--check` fails if either drifts — so Focus and the
     catalog cannot quote different lengths for the same lesson. */
  const LESSON_ONE_MINUTES=17;
  const minutesFor=lesson=>Number(lesson?.num)===1?LESSON_ONE_MINUTES:(Number(lesson?.minutes)||0);
  const sumMinutes=group=>group.reduce((total,lesson)=>total+minutesFor(lesson),0);
  const formatMinutes=minutes=>minutes>=60?`${Math.floor(minutes/60)} hour${Math.floor(minutes/60)===1?'':'s'} ${minutes%60?`${minutes%60} minutes`:''}`.trim():`${minutes} minutes`;

  /* The estimate used to walk from lessons[0] every time, so a learner twenty
     lessons in was still told "about 1 lesson fits" and quoted Lesson 1 forever.
     Start where the dashboard's "Continue Lesson N" starts. The first expression
     below is character-for-character the one progress.html uses for its continue
     link and its arc targets, so the two pages cannot name different lessons;
     everything after it is the run this session could work through, since
     finishing one lesson unlocks the next. No stored progress — a signed-out
     learner, a fresh browser, or course-state.js failing to load — reads as
     nothing started, which is the truthful default. */
  function upcomingLessons(){
    const state=window.LearningAICourseState?.snapshot?.();
    if(!state)return lessons.slice();
    const start=lessons.find(lesson=>state.isUnlocked(lesson)&&!state.isDone(lesson.id));
    if(!start)return [];
    return lessons.slice(lessons.indexOf(start)).filter(lesson=>!state.isDone(lesson.id));
  }

  function renderTimeEstimate(){
    const minutes=Number(checkpointLength.value)||25;
    plannedMinutes.textContent=`${minutes} minutes`;
    checkpointLength.setAttribute('aria-valuetext',`${minutes} minutes${minutes===25?' recommended':''}`);
    paintDialText(minutes);
    if(!dialDragging)paintDial(minutes,true);
    const upcoming=upcomingLessons();
    const next=upcoming[0]||null;
    let used=0,count=0;
    for(const lesson of upcoming){const lessonMinutes=minutesFor(lesson);if(used+lessonMinutes>minutes)break;used+=lessonMinutes;count+=1}
    /* Four cases, and none of them may show a blank or a zero. The dial floor is
       10 minutes and the shortest lesson in the course is longer than that, so
       "nothing fits" is a real choice rather than an error — and it is also what
       a learner sees whenever the lesson they are actually on happens to be a
       long one. Say what that lesson costs and that stopping part-way loses
       nothing, which is true: lesson.html saves a draft at every step. */
    estimateLessons.textContent=!lessons.length
      ?'Lesson lengths appear once the course list has loaded.'
      :!next
        ?`All ${lessons.length} lessons complete — this time is yours to revisit a lesson or build a project.`
        :count
          ?`About ${count===1?'1 lesson fits':`${count} lessons fit`} (${used} minutes), starting with Lesson ${next.num}: ${next.title}`
          :`Not quite one lesson — Lesson ${next.num}, ${next.title}, takes about ${minutesFor(next)} minutes. Start anyway; your place is saved at every step.`;
    const arcIndex=next?arcNames.indexOf(next.arc):-1;
    const arcLeft=arcIndex<0?[]:upcoming.filter(lesson=>lesson.arc===next.arc);
    estimateArcTime.textContent=!lessons.length?''
      :arcIndex<0?`All ${arcNames.length} arcs complete`
      :`Arc ${arcIndex+1} · ${arcLeft.length} lesson${arcLeft.length===1?'':'s'} left · about ${formatMinutes(sumMinutes(arcLeft))}`;
    estimateCourseTime.textContent=!lessons.length?''
      :next?`Full course · ${upcoming.length} of ${lessons.length} lessons left · about ${formatMinutes(sumMinutes(upcoming))}`
      :`Full course · ${lessons.length} of ${lessons.length} lessons complete`;
  }

  if(state.running){state.lastActivityAt=Date.now();localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}
  const liveElapsed=()=>state.running?Math.max(0,Math.floor((Math.min(Date.now(),Number(state.lastActivityAt||Date.now())+IDLE_LIMIT_SECONDS*1000)-state.startedAt)/1000)):0;
  const secondsToday=()=>state.secondsToday+liveElapsed();
  const totalSeconds=()=>state.totalSeconds+liveElapsed();
  const newSessionId=()=>crypto.randomUUID?.()||`focus-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  async function syncCompletedSession(sessionSeconds,clientSessionId){
    if(!clientSessionId||sessionSeconds<MIN_SESSION_SECONDS)return;
    const result=await window.LearningAIAPI.queueMinutes({minutes:Math.max(1,Math.round(sessionSeconds/60)),clientSessionId});
    status.textContent=result.ok?'Session saved to your LearningAI account.':'Session saved on this device. It will sync to your account when the connection returns.';
  }

  function commit(){if(!state.running)return;const elapsed=liveElapsed();state.secondsToday+=elapsed;state.totalSeconds+=elapsed;state.startedAt=Date.now()}
  function recordGoal(){if(secondsToday()>=25*60&&state.goalRecordedFor!==today){state.goalRecordedFor=today;state.goalDays+=1}}
  function formatDuration(seconds){const hours=Math.floor(seconds/3600);const minutes=Math.floor((seconds%3600)/60);const remainder=seconds%60;return hours?`${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(remainder).padStart(2,'0')}`:`${String(minutes).padStart(2,'0')}:${String(remainder).padStart(2,'0')}`}
  function save(){commit();recordGoal();localStorage.setItem(STORAGE_KEY,JSON.stringify(state));window.dispatchEvent(new CustomEvent('learningai:rhythm'))}
  function pauseIfIdle(){if(!state.running||Date.now()-Number(state.lastActivityAt||Date.now())<IDLE_LIMIT_SECONDS*1000)return false;commit();state.running=false;state.startedAt=0;state.pauseReason='away';localStorage.setItem(STORAGE_KEY,JSON.stringify(state));return true}
  function recordActivity(){if(!state.running)return;state.lastActivityAt=Date.now();state.pauseReason='';localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}

  function unlockAudio(){if(!audioContext)audioContext=new(window.AudioContext||window.webkitAudioContext)();if(audioContext.state==='suspended')audioContext.resume()}
  function chime(){if(!state.soundEnabled)return;unlockAudio();const now=audioContext.currentTime;[523.25,659.25,783.99].forEach((frequency,index)=>{const oscillator=audioContext.createOscillator();const gain=audioContext.createGain();oscillator.type='sine';oscillator.frequency.value=frequency;gain.gain.setValueAtTime(0,now+index*.16);gain.gain.linearRampToValueAtTime(.105,now+index*.16+.035);gain.gain.exponentialRampToValueAtTime(.001,now+index*.16+.65);oscillator.connect(gain).connect(audioContext.destination);oscillator.start(now+index*.16);oscillator.stop(now+index*.16+.7)})}

  function showCheckpoint(){if(checkpointShown)return;checkpointShown=true;commit();state.running=false;state.startedAt=0;recordGoal();localStorage.setItem(STORAGE_KEY,JSON.stringify(state));window.dispatchEvent(new CustomEvent('learningai:rhythm'));chime();dialog.showModal();render()}
  function render(){pauseIfIdle();const elapsed=secondsToday();const sessionElapsed=Math.max(0,totalSeconds()-Number(state.lastSessionTotalSeconds||0));const activeMinutes=Number(state.activeIntervalMinutes)||state.checkpointMinutes;const checkpoint=Math.max(state.nextCheckpointSeconds||activeMinutes*60,1);const segmentStart=Math.max(0,checkpoint-activeMinutes*60);const segmentProgress=Math.min(1,Math.max(0,(elapsed-segmentStart)/(checkpoint-segmentStart)));clock.textContent=formatDuration(elapsed);intervalRing.style.strokeDashoffset=String(circumference*(1-segmentProgress));checkpointLabel.textContent=`next check-in · ${formatDuration(Math.max(0,checkpoint-elapsed))}`;toggle.textContent=state.running?'Pause focus':elapsed?'Resume focus':'Start focus';toggle.setAttribute('aria-pressed',String(state.running));finish.disabled=sessionElapsed<MIN_SESSION_SECONDS;finish.title=finish.disabled?'Learn for at least one minute before finishing a session.':'';status.textContent=state.running?'Your learning time is being counted.':state.pauseReason==='away'?'Paused after 10 minutes without activity. Your time is saved.':elapsed?'Paused. Your time is saved on this device.':'Ready when you are.';renderRhythmPanel(elapsed);if(state.running&&elapsed>=checkpoint)showCheckpoint()}

  function renderRhythmPanel(elapsed){
    if(!rhythmClock)return;
    rhythmClock.textContent=formatDuration(elapsed);
    rhythmRing.style.strokeDashoffset=String(rhythmCircumference*(1-Math.min(1,elapsed/GOAL_SECONDS)));
    rhythmToggle.textContent=state.running?'Pause learning':elapsed?'Resume learning':'Start learning';
    rhythmToggle.setAttribute('aria-pressed',String(state.running));
    rhythmFeedback.textContent=state.running?'Learning time is being counted.'
      :state.pauseReason==='away'?'Paused after 10 minutes without activity. Your time is saved.'
      :elapsed>=GOAL_SECONDS?'Daily recommendation reached. Well done.'
      :elapsed?'Paused. Your time is saved on this device.':'Ready when you are.';
  }

  function toggleRunning(){unlockAudio();if(state.running){commit();state.running=false;state.startedAt=0}else{state.activeServerSessionId ||= newSessionId();state.running=true;state.startedAt=Date.now();state.lastActivityAt=Date.now();state.pauseReason='';if(secondsToday()>=state.nextCheckpointSeconds)state.nextCheckpointSeconds=secondsToday()+state.checkpointMinutes*60}save();render()}
  toggle.addEventListener('click',toggleRunning);
  rhythmToggle?.addEventListener('click',toggleRunning);
  finish.addEventListener('click',()=>{commit();const sessionSeconds=totalSeconds()-Number(state.lastSessionTotalSeconds||0),sessionId=state.activeServerSessionId||newSessionId();if(sessionSeconds<MIN_SESSION_SECONDS){status.textContent='Learn for at least one minute before finishing a session.';render();return}state.running=false;state.startedAt=0;state.sessions+=1;state.lastSessionTotalSeconds=totalSeconds();state.activeServerSessionId='';recordGoal();save();status.textContent='Session saved on this device. Syncing to your account…';render();void syncCompletedSession(sessionSeconds,sessionId)});
  checkpointLength.addEventListener('input',renderTimeEstimate);
  checkpointLength.addEventListener('change',()=>{state.checkpointMinutes=Number(checkpointLength.value);state.activeIntervalMinutes=state.checkpointMinutes;state.nextCheckpointSeconds=secondsToday()+state.activeIntervalMinutes*60;checkpointShown=false;save();renderTimeEstimate();render()});
  soundEnabled.addEventListener('change',()=>{state.soundEnabled=soundEnabled.checked;if(state.soundEnabled)unlockAudio();save()});
  document.querySelector('#checkpointDone').addEventListener('click',()=>{const sessionSeconds=totalSeconds()-Number(state.lastSessionTotalSeconds||0),sessionId=state.activeServerSessionId||newSessionId();state.sessions+=1;state.lastSessionTotalSeconds=totalSeconds();state.activeServerSessionId='';checkpointShown=false;save();dialog.close();status.textContent='Session saved on this device. Syncing to your account…';render();void syncCompletedSession(sessionSeconds,sessionId)});
  dialog.addEventListener('cancel',event=>{event.preventDefault();status.textContent='Choose “Finish for now” or a continuation time so your checkpoint is saved correctly.'});
  dialog.querySelectorAll('[data-continue]').forEach(button=>button.addEventListener('click',()=>{state.activeIntervalMinutes=Number(button.dataset.continue);const extra=state.activeIntervalMinutes*60;state.nextCheckpointSeconds=secondsToday()+extra;state.running=true;state.startedAt=Date.now();checkpointShown=false;save();dialog.close();render()}));

  ['pointerdown','keydown','wheel','touchstart'].forEach(type=>document.addEventListener(type,recordActivity,{passive:true}));

  window.addEventListener('pagehide',save);
  /* Finishing a lesson in another tab moves the lesson this session should start
     from, so the estimate has to be re-read rather than computed once at load. */
  window.addEventListener('learningai:progress',renderTimeEstimate);
  const PROGRESS_KEYS=[window.LearningAICourseState?.key,'learningai-first-lesson-complete'];
  window.addEventListener('storage',event=>{if(!event.key||PROGRESS_KEYS.includes(event.key))renderTimeEstimate()});
  const previewName=new URLSearchParams(location.search).get('name')||window.LearningAIUser?.displayName||'Aarav';
  document.querySelector('#greeting').textContent=`Welcome back, ${previewName}`;
  void window.LearningAIAPI.flushMinuteQueue();
  if(new URLSearchParams(location.search).get('checkpoint')==='preview')setTimeout(()=>dialog.showModal(),350);
  wireDial();setInterval(render,1000);renderTimeEstimate();render();
})();
