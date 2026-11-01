// =========================================================================
// 🦖 신비한 동물 퀴즈 대모험 (초간단 & 사진 중심 키즈 퀴즈)
// =========================================================================

// 상태 관리
let currentMode = 'REAL_OR_FAKE'; // 'REAL_OR_FAKE' | 'WHO_AM_I'
let deck = [];
let currentIndex = 0;
let score = 0;
let isAnswered = false;
let isSoundEnabled = true;

// DOM 참조
const questionCounterEl = document.getElementById('questionCounter');
const scoreBadgeEl = document.getElementById('scoreBadge');
const soundToggleBtn = document.getElementById('soundToggleBtn');
const shuffleBtn = document.getElementById('shuffleBtn');

const modeRealFakeBtn = document.getElementById('modeRealFakeBtn');
const modeWhoAmIBtn = document.getElementById('modeWhoAmIBtn');

// 사진 관련
const photoSkeletonEl = document.getElementById('photoSkeleton');
const singlePhotoWrapperEl = document.getElementById('singlePhotoWrapper');
const mainCreatureImgEl = document.getElementById('mainCreatureImg');

const hybridPhotoWrapperEl = document.getElementById('hybridPhotoWrapper');
const hybridImg1El = document.getElementById('hybridImg1');
const hybridImg2El = document.getElementById('hybridImg2');
const hybridPart1El = document.getElementById('hybridPart1');
const hybridPart2El = document.getElementById('hybridPart2');
const hybridTitleEl = document.getElementById('hybridTitle');

// 문제 텍스트
const questionPromptEl = document.getElementById('questionPrompt');
const questionHintEl = document.getElementById('questionHint');

// 버튼 그룹
const realFakeButtonGroupEl = document.getElementById('realFakeButtonGroup');
const btnVoteReal = document.getElementById('btnVoteReal');
const btnVoteFake = document.getElementById('btnVoteFake');

const whoAmIChoicesGroupEl = document.getElementById('whoAmIChoicesGroup');

// 결과창
const resultSectionEl = document.getElementById('resultSection');
const resultIconEl = document.getElementById('resultIcon');
const resultVerdictTextEl = document.getElementById('resultVerdictText');
const creatureNameHeadingEl = document.getElementById('creatureNameHeading');
const resultFactTextEl = document.getElementById('resultFactText');
const btnNext = document.getElementById('btnNext');

// 네비게이션
const btnPrev = document.getElementById('btnPrev');
const btnSkip = document.getElementById('btnSkip');
const quizCardEl = document.getElementById('quizCard');

// =========================================================================
// 🔊 초간단 신시사이저 효과음 (외부 파일 없이 브라우저 내장 재생)
// =========================================================================
class SimpleSfx {
  constructor() {
    this.ctx = null;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playCorrect() {
    if (!isSoundEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (도-미-솔-도)
    const now = this.ctx.currentTime;
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.18, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.24);
    });
  }

  playWrong() {
    if (!isSoundEnabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const notes = [240, 180];
    const now = this.ctx.currentTime;
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.15, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.22);
    });
  }
}

const sfx = new SimpleSfx();

// =========================================================================
// 🔀 덱(Deck) 구성 및 셔플
// =========================================================================
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function initDeck() {
  deck = shuffle(CREATURES);
  currentIndex = 0;
  score = 0;
  scoreBadgeEl.textContent = '⭐ 0개 맞춤';
  renderQuestion();
}

// =========================================================================
// 🖼️ 문제 렌더링 (사진이 바로 100% 큼직하게 노출!)
// =========================================================================
function renderQuestion() {
  if (deck.length === 0) return;
  const creature = deck[currentIndex];
  isAnswered = false;

  // 상단 진행도
  questionCounterEl.textContent = `${currentIndex + 1} / ${deck.length}`;

  // 결과창 숨기기
  resultSectionEl.classList.add('hidden');
  resultSectionEl.classList.remove('verdict-real-theme', 'verdict-fake-theme');

  // 사진 세팅
  if (creature.isReal) {
    // [진짜 생물] 단독 고화질 실제 사진 (내장 로컬 이미지)
    singlePhotoWrapperEl.classList.remove('hidden');
    hybridPhotoWrapperEl.classList.add('hidden');

    const photoUrl = `images/${encodeURIComponent(creature.wikiTitle)}.jpg`;

    mainCreatureImgEl.onerror = () => {
      // 만약 로컬 로드 실패 시 위키미디어 직접 로드
      mainCreatureImgEl.src = `https://upload.wikimedia.org/wikipedia/commons/thumb/${encodeURIComponent(creature.wikiTitle)}.jpg`;
    };
    mainCreatureImgEl.src = photoUrl;
    mainCreatureImgEl.alt = `${creature.name} 실제 사진`;
  } else {
    // [가짜 합성 생물] 두 동물의 고화질 듀얼 사진 (내장 로컬 이미지)
    singlePhotoWrapperEl.classList.add('hidden');
    hybridPhotoWrapperEl.classList.remove('hidden');

    const p1Url = `images/${encodeURIComponent(creature.wikiTitle)}.jpg`;
    const p2Url = `images/${encodeURIComponent(creature.secondWikiTitle)}.jpg`;

    hybridImg1El.onerror = () => {
      hybridImg1El.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/White_shark.jpg/500px-White_shark.jpg';
    };
    hybridImg2El.onerror = () => {
      hybridImg2El.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Nokota_Horses_cropped.jpg/500px-Nokota_Horses_cropped.jpg';
    };

    hybridImg1El.src = p1Url;
    hybridImg2El.src = p2Url;
    hybridPart1El.textContent = creature.hybridParts?.[0] || '합성 부위 1';
    hybridPart2El.textContent = creature.hybridParts?.[1] || '합성 부위 2';
    hybridTitleEl.textContent = `${creature.emoji} ${creature.name}`;
  }

  // 문제 텍스트 및 버튼 구성
  if (currentMode === 'REAL_OR_FAKE') {
    questionPromptEl.textContent = '이 동물은 세상에 진짜 있을까요?';
    questionHintEl.textContent = creature.claim || `💡 ${creature.stepHints?.[1] || ''}`;

    realFakeButtonGroupEl.classList.remove('hidden');
    whoAmIChoicesGroupEl.classList.add('hidden');

    btnVoteReal.disabled = false;
    btnVoteFake.disabled = false;
  } else {
    // [이름 맞추기 모드]
    questionPromptEl.textContent = '이 동물의 이름은 무엇일까요?';
    questionHintEl.textContent = `💡 초성 힌트: [ ${creature.choseong} ] · ${creature.stepHints?.[1] || ''}`;

    realFakeButtonGroupEl.classList.add('hidden');
    whoAmIChoicesGroupEl.classList.remove('hidden');

    renderChoices(creature);
  }
}

// 4지선다 보기 생성 (이름 맞추기 모드)
function renderChoices(correctCreature) {
  whoAmIChoicesGroupEl.innerHTML = '';

  const others = shuffle(CREATURES.filter((c) => c.id !== correctCreature.id)).slice(0, 3);
  const options = shuffle([correctCreature, ...others]);

  options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice-btn';
    btn.innerHTML = `
      <span class="choice-num">${idx + 1}</span>
      <span>${opt.emoji} ${opt.name}</span>
    `;

    btn.addEventListener('click', () => {
      if (isAnswered) return;
      isAnswered = true;

      const allBtns = whoAmIChoicesGroupEl.querySelectorAll('.choice-btn');
      allBtns.forEach((b) => (b.disabled = true));

      const isCorrect = (opt.id === correctCreature.id);
      if (isCorrect) {
        btn.classList.add('correct');
        handleResult(true, `딩동댕! 🎉 정답은 [${correctCreature.name}]입니다!`);
      } else {
        btn.classList.add('wrong');
        allBtns.forEach((b) => {
          if (b.textContent.includes(correctCreature.name)) b.classList.add('correct');
        });
        handleResult(false, `아차! 💡 정답은 [${correctCreature.name}]이에요!`);
      }
    });

    whoAmIChoicesGroupEl.appendChild(btn);
  });
}

// =========================================================================
// 🎯 판정 및 결과창 표시
// =========================================================================
function handleResult(isCorrect, headline) {
  const creature = deck[currentIndex];

  if (isCorrect) {
    sfx.playCorrect();
    score++;
    scoreBadgeEl.textContent = `⭐ ${score}개 맞춤`;
    resultIconEl.textContent = '🎉';
    resultSectionEl.classList.add('verdict-real-theme');
  } else {
    sfx.playWrong();
    resultIconEl.textContent = '💡';
    resultSectionEl.classList.add('verdict-fake-theme');
  }

  resultVerdictTextEl.textContent = headline;
  creatureNameHeadingEl.textContent = `${creature.emoji} ${creature.name} (${creature.enName})`;
  resultFactTextEl.textContent = creature.verdictDesc || creature.funFacts?.[0] || '';

  btnNext.textContent = (currentIndex === deck.length - 1) ? '처음부터 다시 하기 🔄' : '다음 동물 보러가기 👉';
  resultSectionEl.classList.remove('hidden');

  // 모바일에서 결과창이 보이도록 살짝 스크롤
  resultSectionEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 진짜 vs 가짜 투표 처리
function handleVote(votedReal) {
  if (isAnswered) return;
  isAnswered = true;

  btnVoteReal.disabled = true;
  btnVoteFake.disabled = true;

  const creature = deck[currentIndex];
  const isCorrect = (votedReal === creature.isReal);

  let message = '';
  if (isCorrect) {
    message = creature.isReal
      ? '정답이에요! ⭕ 진짜 존재하는 동물입니다!'
      : '정답이에요! ❌ 합성해서 만든 가짜 동물입니다!';
  } else {
    message = creature.isReal
      ? '놀랍게도! ⭕ 진짜 존재하는 동물이에요!'
      : '속았네요! ❌ 합성해서 만든 가짜 동물이에요!';
  }

  handleResult(isCorrect, message);
}

// 다음 / 이전 이동
function nextQuestion() {
  if (currentIndex === deck.length - 1) {
    initDeck();
  } else {
    currentIndex++;
    renderQuestion();
  }
}

function prevQuestion() {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
}

// =========================================================================
// 🎮 이벤트 리스너 바인딩
// =========================================================================
function bindEvents() {
  // 모드 전환
  modeRealFakeBtn.addEventListener('click', () => {
    currentMode = 'REAL_OR_FAKE';
    modeRealFakeBtn.classList.add('active');
    modeWhoAmIBtn.classList.remove('active');
    renderQuestion();
  });

  modeWhoAmIBtn.addEventListener('click', () => {
    currentMode = 'WHO_AM_I';
    modeWhoAmIBtn.classList.add('active');
    modeRealFakeBtn.classList.remove('active');
    renderQuestion();
  });

  // 진짜 vs 가짜 버튼
  btnVoteReal.addEventListener('click', () => handleVote(true));
  btnVoteFake.addEventListener('click', () => handleVote(false));

  // 다음 / 이전
  btnNext.addEventListener('click', nextQuestion);
  btnPrev.addEventListener('click', prevQuestion);
  btnSkip.addEventListener('click', nextQuestion);

  // 섞기
  shuffleBtn.addEventListener('click', () => {
    initDeck();
  });

  // 소리 토글
  soundToggleBtn.addEventListener('click', () => {
    isSoundEnabled = !isSoundEnabled;
    soundToggleBtn.textContent = isSoundEnabled ? '🔊' : '🔇';
  });

  // 키보드 조작
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowRight') {
      e.preventDefault();
      nextQuestion();
    } else if (e.code === 'ArrowLeft') {
      e.preventDefault();
      prevQuestion();
    } else if (currentMode === 'REAL_OR_FAKE' && !isAnswered) {
      if (e.code === 'KeyO' || e.code === 'Digit1') handleVote(true);
      if (e.code === 'KeyX' || e.code === 'Digit2') handleVote(false);
    }
  });

  // 아이패드 좌우 터치 스와이프
  let startX = 0;
  quizCardEl.addEventListener('touchstart', (e) => {
    startX = e.changedTouches[0].screenX;
  }, { passive: true });

  quizCardEl.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].screenX - startX;
    if (Math.abs(diff) > 80) {
      if (diff < 0) nextQuestion();
      else prevQuestion();
    }
  }, { passive: true });
}

// 시작
document.addEventListener('DOMContentLoaded', () => {
  bindEvents();
  initDeck();
});
