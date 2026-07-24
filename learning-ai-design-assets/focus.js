(() => {
  const STORAGE_KEY = 'learningai-learning-rhythm-v1';
  const today = new Date().toLocaleDateString('en-CA');
  const IDLE_LIMIT_SECONDS=10*60;
  const MIN_SESSION_SECONDS=60;
  const defaults = {date:today,secondsToday:0,totalSeconds:0,sessions:0,lastSessionTotalSeconds:0,goalDays:0,goalRecordedFor:'',running:false,startedAt:0,lastActivityAt:0,pauseReason:'',nextCheckpointSeconds:25*60,checkpointMinutes:25,activeIntervalMinutes:25,soundEnabled:false,badges:{}};
  let state;
  try{state={...defaults,...JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}}catch{state={...defaults}}
  state.badges={...defaults.badges,...state.badges};
  if(Number(state.checkpointMinutes)<10||Number(state.checkpointMinutes)>60)state.checkpointMinutes=25;
  if(state.date!==today){state.date=today;state.secondsToday=0;state.running=false;state.startedAt=0;state.activeIntervalMinutes=state.checkpointMinutes;state.nextCheckpointSeconds=state.checkpointMinutes*60}

  const toggle=document.querySelector('#timerToggle');
  const finish=document.querySelector('#timerFinish');
  const clock=document.querySelector('#timerClock');
  const status=document.querySelector('#timerStatus');
  const dial=document.querySelector('#dialValue');
  const checkpointLabel=document.querySelector('#checkpointLabel');
  const checkpointLength=document.querySelector('#checkpointLength');
  const plannedMinutes=document.querySelector('#plannedMinutes');
  const estimateLessons=document.querySelector('#estimateLessons');
  const estimateArcTime=document.querySelector('#estimateArcTime');
  const estimateCourseTime=document.querySelector('#estimateCourseTime');
  const soundEnabled=document.querySelector('#soundEnabled');
  const dialog=document.querySelector('#checkpointDialog');
  const circumference=2*Math.PI*91;
  let audioContext;
  let checkpointShown=false;
  dial.style.strokeDasharray=String(circumference);
  checkpointLength.value=String(state.checkpointMinutes||25);
  soundEnabled.checked=state.soundEnabled!==false;

  const lessons=Array.isArray(window.LESSONS)?window.LESSONS:[];
  const courseMinutes=lessons.reduce((sum,lesson)=>sum+Number(lesson.minutes||0),0)||502;
  const firstArcMinutes=lessons.slice(0,5).reduce((sum,lesson)=>sum+Number(lesson.minutes||0),0)||47;
  const formatMinutes=minutes=>minutes>=60?`${Math.floor(minutes/60)} hour${Math.floor(minutes/60)===1?'':'s'} ${minutes%60?`${minutes%60} minutes`:''}`.trim():`${minutes} minutes`;
  function renderTimeEstimate(){
    const minutes=Number(checkpointLength.value)||25;
    plannedMinutes.textContent=`${minutes} minutes`;
    checkpointLength.setAttribute('aria-valuetext',`${minutes} minutes${minutes===25?' recommended':''}`);
    let used=0,count=0;
    for(const lesson of lessons){const lessonMinutes=Number(lesson.minutes||0);if(used+lessonMinutes>minutes)break;used+=lessonMinutes;count+=1}
    const first=lessons[0];
    estimateLessons.textContent=count?`About ${count} lesson${count===1?'':'s'} fit (${used} minutes)`:`Start ${first?.title||'lesson one'}; it takes about ${first?.minutes||10} minutes`;
    estimateArcTime.textContent=`Arc 1 · 5 lessons · about ${firstArcMinutes} minutes`;
    estimateCourseTime.textContent=`Full course · 50 lessons · about ${formatMinutes(courseMinutes)}`;
  }

  if(state.running){state.lastActivityAt=Date.now();localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}
  const liveElapsed=()=>state.running?Math.max(0,Math.floor((Math.min(Date.now(),Number(state.lastActivityAt||Date.now())+IDLE_LIMIT_SECONDS*1000)-state.startedAt)/1000)):0;
  const secondsToday=()=>state.secondsToday+liveElapsed();
  const totalSeconds=()=>state.totalSeconds+liveElapsed();

  function commit(){if(!state.running)return;const elapsed=liveElapsed();state.secondsToday+=elapsed;state.totalSeconds+=elapsed;state.startedAt=Date.now()}
  function recordGoal(){if(secondsToday()>=25*60&&state.goalRecordedFor!==today){state.goalRecordedFor=today;state.goalDays+=1}}
  function formatDuration(seconds){const hours=Math.floor(seconds/3600);const minutes=Math.floor((seconds%3600)/60);const remainder=seconds%60;return hours?`${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(remainder).padStart(2,'0')}`:`${String(minutes).padStart(2,'0')}:${String(remainder).padStart(2,'0')}`}
  function save(){commit();recordGoal();localStorage.setItem(STORAGE_KEY,JSON.stringify(state));window.dispatchEvent(new CustomEvent('learningai:rhythm'))}
  function pauseIfIdle(){if(!state.running||Date.now()-Number(state.lastActivityAt||Date.now())<IDLE_LIMIT_SECONDS*1000)return false;commit();state.running=false;state.startedAt=0;state.pauseReason='away';localStorage.setItem(STORAGE_KEY,JSON.stringify(state));return true}
  function recordActivity(){if(!state.running)return;state.lastActivityAt=Date.now();state.pauseReason='';localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}

  function unlockAudio(){if(!audioContext)audioContext=new(window.AudioContext||window.webkitAudioContext)();if(audioContext.state==='suspended')audioContext.resume()}
  function chime(){if(!state.soundEnabled)return;unlockAudio();const now=audioContext.currentTime;[523.25,659.25,783.99].forEach((frequency,index)=>{const oscillator=audioContext.createOscillator();const gain=audioContext.createGain();oscillator.type='sine';oscillator.frequency.value=frequency;gain.gain.setValueAtTime(0,now+index*.16);gain.gain.linearRampToValueAtTime(.105,now+index*.16+.035);gain.gain.exponentialRampToValueAtTime(.001,now+index*.16+.65);oscillator.connect(gain).connect(audioContext.destination);oscillator.start(now+index*.16);oscillator.stop(now+index*.16+.7)})}

  function showCheckpoint(){if(checkpointShown)return;checkpointShown=true;commit();state.running=false;state.startedAt=0;recordGoal();localStorage.setItem(STORAGE_KEY,JSON.stringify(state));window.dispatchEvent(new CustomEvent('learningai:rhythm'));chime();dialog.showModal();render()}
  function render(){pauseIfIdle();const elapsed=secondsToday();const sessionElapsed=Math.max(0,totalSeconds()-Number(state.lastSessionTotalSeconds||0));const activeMinutes=Number(state.activeIntervalMinutes)||state.checkpointMinutes;const checkpoint=Math.max(state.nextCheckpointSeconds||activeMinutes*60,1);const segmentStart=Math.max(0,checkpoint-activeMinutes*60);const segmentProgress=Math.min(1,Math.max(0,(elapsed-segmentStart)/(checkpoint-segmentStart)));clock.textContent=formatDuration(elapsed);dial.style.strokeDashoffset=String(circumference*(1-segmentProgress));checkpointLabel.textContent=`next check-in · ${formatDuration(Math.max(0,checkpoint-elapsed))}`;toggle.textContent=state.running?'Pause focus':elapsed?'Resume focus':'Start focus';toggle.setAttribute('aria-pressed',String(state.running));finish.disabled=sessionElapsed<MIN_SESSION_SECONDS;finish.title=finish.disabled?'Learn for at least one minute before finishing a session.':'';status.textContent=state.running?'Your learning time is being counted.':state.pauseReason==='away'?'Paused after 10 minutes without activity. Your time is saved.':elapsed?'Paused. Your time is saved on this device.':'Ready when you are.';if(state.running&&elapsed>=checkpoint)showCheckpoint()}

  toggle.addEventListener('click',()=>{unlockAudio();if(state.running){commit();state.running=false;state.startedAt=0}else{state.running=true;state.startedAt=Date.now();state.lastActivityAt=Date.now();state.pauseReason='';if(secondsToday()>=state.nextCheckpointSeconds)state.nextCheckpointSeconds=secondsToday()+state.checkpointMinutes*60}save();render()});
  finish.addEventListener('click',()=>{commit();if(totalSeconds()-Number(state.lastSessionTotalSeconds||0)<MIN_SESSION_SECONDS){status.textContent='Learn for at least one minute before finishing a session.';render();return}state.running=false;state.startedAt=0;state.sessions+=1;state.lastSessionTotalSeconds=totalSeconds();recordGoal();save();status.textContent='Session saved. Return when your attention is ready.';render()});
  checkpointLength.addEventListener('input',renderTimeEstimate);
  checkpointLength.addEventListener('change',()=>{state.checkpointMinutes=Number(checkpointLength.value);state.activeIntervalMinutes=state.checkpointMinutes;state.nextCheckpointSeconds=secondsToday()+state.activeIntervalMinutes*60;checkpointShown=false;save();renderTimeEstimate();render()});
  soundEnabled.addEventListener('change',()=>{state.soundEnabled=soundEnabled.checked;if(state.soundEnabled)unlockAudio();save()});
  document.querySelector('#checkpointDone').addEventListener('click',()=>{state.sessions+=1;state.lastSessionTotalSeconds=totalSeconds();checkpointShown=false;save();dialog.close();status.textContent='Session complete. Your time and achievements are saved.';render()});
  dialog.addEventListener('cancel',event=>{event.preventDefault();status.textContent='Choose “Finish for now” or a continuation time so your checkpoint is saved correctly.'});
  dialog.querySelectorAll('[data-continue]').forEach(button=>button.addEventListener('click',()=>{state.activeIntervalMinutes=Number(button.dataset.continue);const extra=state.activeIntervalMinutes*60;state.nextCheckpointSeconds=secondsToday()+extra;state.running=true;state.startedAt=Date.now();checkpointShown=false;save();dialog.close();render()}));

  ['pointerdown','keydown','wheel','touchstart'].forEach(type=>document.addEventListener(type,recordActivity,{passive:true}));

  window.addEventListener('pagehide',save);
  const previewName=new URLSearchParams(location.search).get('name')||window.LearningAIUser?.displayName||'Aarav';
  document.querySelector('#greeting').textContent=`Welcome back, ${previewName}`;
  if(new URLSearchParams(location.search).get('checkpoint')==='preview')setTimeout(()=>dialog.showModal(),350);
  setInterval(render,1000);renderTimeEstimate();render();
})();
