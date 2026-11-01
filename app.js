// =========================================================================
// 🦖 신비한 생물 탐험대 (나는 누구일까요? & 진짜 vs 가짜!) 메인 애플리케이션
// =========================================================================

const ALL_CATEGORIES = ['육지동물', '공룡·고대생물', '곤충·바다생물', '합성·상상생물'];
const CATEGORY_META = {
  '육지동물': { emoji: '🦁', label: '육지동물' },
  '공룡·고대생물': { emoji: '🦖', label: '공룡·고대생물' },
  '곤충·바다생물': { emoji: '🦋', label: '곤충·바다생물' },
  '합성·상상생물': { emoji: '🧪', label: '합성·상상생물' }
};

// 상태 관리
let currentGameMode = 'WHO_AM_I'; // 'WHO_AM_I' | 'REAL_OR_FAKE' | 'MIXED'
let activeSubMode = 'WHO_AM_I';   // 현재 문제의 실제 서브모드
let selectedCategories = new Set(['육지동물', '공룡·고대생물', '곤충·바다생물']);
let selectedCountLimit = 'ALL';   // '10' | '20' | 'ALL'

let deck = [];
let currentIndex = 0;
let revealedHintStep = 0;         // 0 ~ 3
let isChoseongForced = false;
let isAnswerRevealed = false;
let streakCount = 0;
const solvedCreatureIds = new Set();
const wikiPhotoCache = new Map();

// DOM 참조
const modeTabBtns = document.querySelectorAll('.mode-tab-btn');
const categoryChipsEl = document.getElementById('categoryChips');
const selectAllCategoriesBtn = document.getElementById('selectAllCategoriesBtn');
const resetCategoriesBtn = document.getElementById('resetCategoriesBtn');
const countChipsEl = document.getElementById('countChips');
const totalPoolCountEl = document.getElementById('totalPoolCount');
const quizModeBadgeEl = document.getElementById('quizModeBadge');

const correctCountEl = document.getElementById('correctCount');
const streakCountEl = document.getElementById('streakCount');
const modalListCountEl = document.getElementById('modalListCount');
const questionCounterEl = document.getElementById('questionCounter');
const progressBarFillEl = document.getElementById('progressBarFill');

const currentSubModeBadgeEl = document.getElementById('currentSubModeBadge');
const categoryBadgeEl = document.getElementById('categoryBadge');
const rarityBadgeEl = document.getElementById('rarityBadge');
const hintStepIndicatorsEl = document.getElementById('hintStepIndicators');
const stepDot1 = document.getElementById('stepDot1');
const stepDot2 = document.getElementById('stepDot2');
const stepDot3 = document.getElementById('stepDot3');

// 뷰 A (나는 누구일까요?)
const whoAmIViewEl = document.getElementById('whoAmIView');
const mysteryQuestionMarkEl = document.getElementById('mysteryQuestionMark');
const mysteryEmojiPreviewEl = document.getElementById('mysteryEmojiPreview');
const mysteryBlurPreviewImgEl = document.getElementById('mysteryBlurPreviewImg');
const mysteryStatusCaptionEl = document.getElementById('mysteryStatusCaption');

const choseongCaptionEl = document.getElementById('choseongCaption');
const toggleChoseongInstantBtn = document.getElementById('toggleChoseongInstantBtn');
const choseongDisplayEl = document.getElementById('choseongDisplay');
const habitatPreviewTextEl = document.getElementById('habitatPreviewText');
const sizePreviewTextEl = document.getElementById('sizePreviewText');

const hintCountLabelEl = document.getElementById('hintCountLabel');
const hintGuideTagEl = document.getElementById('hintGuideTag');
const hintListEl = document.getElementById('hintList');
const mcChoicesGridEl = document.getElementById('mcChoicesGrid');
const hintBtn = document.getElementById('hintBtn');
const hintBtnText = document.getElementById('hintBtnText');
const answerBtn = document.getElementById('answerBtn');
const answerBtnText = document.getElementById('answerBtnText');

// 뷰 B (진짜 vs 가짜!)
const realOrFakeViewEl = document.getElementById('realOrFakeView');
const rofVisualContentEl = document.getElementById('rofVisualContent');
const rofSuspectNameTagEl = document.getElementById('rofSuspectNameTag');
const rofClaimTextEl = document.getElementById('rofClaimText');
const rofHintBtn = document.getElementById('rofHintBtn');
const rofHintTextEl = document.getElementById('rofHintText');
const voteRealBtn = document.getElementById('voteRealBtn');
const voteFakeBtn = document.getElementById('voteFakeBtn');

// 정답 공개 영역
const answerZoneEl = document.getElementById('answerZone');
const userFeedbackBannerEl = document.getElementById('userFeedbackBanner');
const feedbackIconEl = document.getElementById('feedbackIcon');
const feedbackTextEl = document.getElementById('feedbackText');

const photoLoadingEl = document.getElementById('photoLoading');
const creaturePhotoEl = document.getElementById('creaturePhoto');
const hybridVisualCardEl = document.getElementById('hybridVisualCard');
const hybridPhoto1El = document.getElementById('hybridPhoto1');
const hybridPhoto2El = document.getElementById('hybridPhoto2');
const hybridLabel1El = document.getElementById('hybridLabel1');
const hybridLabel2El = document.getElementById('hybridLabel2');
const hybridThemeBannerEl = document.getElementById('hybridThemeBanner');
const emojiFallbackCardEl = document.getElementById('emojiFallbackCard');
const fallbackBigEmojiEl = document.getElementById('fallbackBigEmoji');
const fallbackEnTitleEl = document.getElementById('fallbackEnTitle');
const playCreatureSoundBtn = document.getElementById('playCreatureSoundBtn');

const answerRealFakeBadgeEl = document.getElementById('answerRealFakeBadge');
const answerCategoryTagEl = document.getElementById('answerCategoryTag');
const answerHabitatTagEl = document.getElementById('answerHabitatTag');
const answerKoreanNameEl = document.getElementById('answerKoreanName');
const answerEnglishNameEl = document.getElementById('answerEnglishName');
const verdictHighlightBoxEl = document.getElementById('verdictHighlightBox');
const verdictTitleTextEl = document.getElementById('verdictTitleText');
const verdictDescTextEl = document.getElementById('verdictDescText');
const answerFunFactsListEl = document.getElementById('answerFunFactsList');
const markCorrectBtn = document.getElementById('markCorrectBtn');
const nextAfterAnswerBtn = document.getElementById('nextAfterAnswerBtn');

// 하단 컨트롤 & 모달
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const showChoseongStartToggle = document.getElementById('showChoseongStartToggle');
const shuffleBtn = document.getElementById('shuffleBtn');
const listOpenBtn = document.getElementById('listOpenBtn');
const ipadGuideBtn = document.getElementById('ipadGuideBtn');

const creatureListModal = document.getElementById('creatureListModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const searchCreatureInput = document.getElementById('searchCreatureInput');
const creatureGridListEl = document.getElementById('creatureGridList');

const quizResultModal = document.getElementById('quizResultModal');
const resultTrophyEmojiEl = document.getElementById('resultTrophyEmoji');
const resultSubtitleEl = document.getElementById('resultSubtitle');
const resultRankBadgeEl = document.getElementById('resultRankBadge');
const resultTotalQuestionsEl = document.getElementById('resultTotalQuestions');
const resultCorrectQuestionsEl = document.getElementById('resultCorrectQuestions');
const resultAccuracyEl = document.getElementById('resultAccuracy');
const restartSameDeckBtn = document.getElementById('restartSameDeckBtn');
const restartNewDeckBtn = document.getElementById('restartNewDeckBtn');
const closeResultBtn = document.getElementById('closeResultBtn');

const ipadGuideModal = document.getElementById('ipadGuideModal');
const closeIpadGuideBtn = document.getElementById('closeIpadGuideBtn');

// BGM & 사운드 DOM
const bgmToggleBtn = document.getElementById('bgmToggleBtn');
const bgmStatusLabel = document.getElementById('bgmStatusLabel');
const bgmTrackSelect = document.getElementById('bgmTrackSelect');
const sfxToggleCheckbox = document.getElementById('sfxToggleCheckbox');
const muteToggleBtn = document.getElementById('muteToggleBtn');
const bgmVolumeSlider = document.getElementById('bgmVolumeSlider');
const volValueText = document.getElementById('volValueText');

// =========================================================================
// 🎵 탐험 BGM & 동물 울음소리·효과음 신시사이저 엔진
// =========================================================================
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isPlayingBgm = false;
    this.isMuted = false;
    this.volume = 0.35;
    this.currentTrack = 'jungle';
    this.bgmTimer = null;
    this.stepIndex = 0;
  }

  ensureCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  getEffectiveVol(multiplier = 1) {
    if (this.isMuted) return 0;
    return Math.min(1, Math.max(0, this.volume * multiplier));
  }

  toggleBgm() {
    if (this.isPlayingBgm) {
      this.stopBgm();
    } else {
      this.startBgm();
    }
  }

  startBgm() {
    this.ensureCtx();
    if (!this.ctx) return;
    this.stopBgm();
    this.isPlayingBgm = true;
    this.stepIndex = 0;

    const patterns = {
      jungle: {
        tempoMs: 210,
        notes: [261.63, 329.63, 392.0, 523.25, 392.0, 329.63, 293.66, 349.23],
        wave: 'triangle'
      },
      dino: {
        tempoMs: 250,
        notes: [146.83, 146.83, 220.0, 196.0, 174.61, 164.81, 146.83, 130.81],
        wave: 'sawtooth'
      },
      ocean: {
        tempoMs: 280,
        notes: [220.0, 277.18, 329.63, 440.0, 329.63, 277.18, 246.94, 329.63],
        wave: 'sine'
      }
    };

    const playTick = () => {
      if (!this.isPlayingBgm || !this.ctx) return;
      const cfg = patterns[this.currentTrack] || patterns.jungle;
      const freq = cfg.notes[this.stepIndex % cfg.notes.length];
      this.stepIndex++;

      const vol = this.getEffectiveVol(0.18);
      if (vol <= 0) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = cfg.wave;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(vol, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.19);
    };

    const cfg = patterns[this.currentTrack] || patterns.jungle;
    playTick();
    this.bgmTimer = setInterval(playTick, cfg.tempoMs);
    this.syncBgmUi();
  }

  stopBgm() {
    this.isPlayingBgm = false;
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    this.syncBgmUi();
  }

  syncBgmUi() {
    if (this.isPlayingBgm) {
      bgmToggleBtn.classList.add('playing');
      bgmStatusLabel.textContent = '탐험 BGM 일시정지';
    } else {
      bgmToggleBtn.classList.remove('playing');
      bgmStatusLabel.textContent = '탐험 BGM 켜기';
    }
  }

  playSfx(type) {
    if (!sfxToggleCheckbox.checked || this.isMuted) return;
    this.ensureCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const vol = this.getEffectiveVol(0.45);
    if (vol <= 0) return;

    if (type === 'correct') {
      [523.25, 659.25, 783.99, 1046.5].forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + idx * 0.08);
        g.gain.setValueAtTime(vol, now + idx * 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.22);
        osc.connect(g);
        g.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.24);
      });
    } else if (type === 'wrong') {
      [220, 165].forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now + idx * 0.14);
        g.gain.setValueAtTime(vol * 0.7, now + idx * 0.14);
        g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.14 + 0.25);
        osc.connect(g);
        g.connect(this.ctx.destination);
        osc.start(now + idx * 0.14);
        osc.stop(now + idx * 0.14 + 0.26);
      });
    } else if (type === 'hint') {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
      g.gain.setValueAtTime(vol * 0.6, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.connect(g);
      g.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.17);
    }
  }

  playCreatureEffectAndVoice(creature) {
    this.ensureCtx();
    if (this.ctx && !this.isMuted) {
      const now = this.ctx.currentTime;
      const vol = this.getEffectiveVol(0.5);
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();

      if (creature.soundType === 'dino' || creature.soundType === 'roar') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(65, now + 0.55);
        g.gain.setValueAtTime(vol, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.connect(g);
        g.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.62);
      } else if (creature.soundType === 'cute' || creature.soundType === 'chirp') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(700, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(850, now + 0.3);
        g.gain.setValueAtTime(vol, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(g);
        g.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.36);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(640, now + 0.35);
        g.gain.setValueAtTime(vol, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(g);
        g.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.42);
      }
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(
        `${creature.name}. ${creature.verdictTitle.replace(/[⭕❌!]/g, '')}`
      );
      utter.lang = 'ko-KR';
      utter.rate = 1.02;
      window.speechSynthesis.speak(utter);
    }
  }
}

const soundEngine = new SoundEngine();

// =========================================================================
// 🌐 Wikipedia REST API 고화질 사진 로더
// =========================================================================
async function fetchWikiPhotoByTitle(wikiTitle) {
  if (!wikiTitle) return null;
  if (wikiPhotoCache.has(wikiTitle)) {
    return wikiPhotoCache.get(wikiTitle);
  }

  try {
    const endpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`;
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error('Wiki fetch failed');
    const data = await res.json();

    let finalUrl = (data.originalimage && data.originalimage.source) ||
                   (data.thumbnail && data.thumbnail.source) ||
                   null;

    if (data.thumbnail && data.thumbnail.source) {
      finalUrl = data.thumbnail.source.replace(/\/\d+px-/, '/600px-');
    }

    wikiPhotoCache.set(wikiTitle, finalUrl);
    return finalUrl;
  } catch (e) {
    wikiPhotoCache.set(wikiTitle, null);
    return null;
  }
}

function preloadAdjacentCreaturePhotos() {
  if (deck.length === 0) return;
  const current = deck[currentIndex];
  const next = deck[(currentIndex + 1) % deck.length];
  [current, next].forEach((c) => {
    if (!c) return;
    if (c.wikiTitle) fetchWikiPhotoByTitle(c.wikiTitle);
    if (c.secondWikiTitle) fetchWikiPhotoByTitle(c.secondWikiTitle);
  });
}

// =========================================================================
// 🎲 카테고리 필터 & 덱(Deck) 구성
// =========================================================================
function applyRecommendedCategoriesForMode(mode) {
  if (mode === 'WHO_AM_I') {
    // 나는 누구일까요? 모드에서는 실제 동물·공룡·곤충 3개 카테고리를 기본 추천
    selectedCategories = new Set(['육지동물', '공룡·고대생물', '곤충·바다생물']);
  } else {
    // 진짜 vs 가짜! 및 랜덤 믹스 모드에서는 합성·상상생물까지 전체 포함
    selectedCategories = new Set(ALL_CATEGORIES);
  }
}

function renderCategoryChips() {
  categoryChipsEl.innerHTML = '';

  ALL_CATEGORIES.forEach((cat) => {
    const count = CREATURES.filter((c) => c.category === cat).length;
    const meta = CATEGORY_META[cat];
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `category-chip-btn${selectedCategories.has(cat) ? ' active' : ''}`;
    btn.textContent = `${meta.emoji} ${meta.label} (${count})`;

    btn.addEventListener('click', () => {
      if (selectedCategories.has(cat)) {
        if (selectedCategories.size === 1) return; // 최소 1개 유지
        selectedCategories.delete(cat);
      } else {
        selectedCategories.add(cat);
      }
      renderCategoryChips();
      buildDeckAndRender(true);
    });

    categoryChipsEl.appendChild(btn);
  });
}

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildDeckAndRender(shouldShuffle = false) {
  let pool = CREATURES.filter((c) => selectedCategories.has(c.category));

  if (currentGameMode === 'REAL_OR_FAKE') {
    // 진짜 vs 가짜 모드일 때는 반전 매력이 큰 생물들과 합성 생물들을 우선 배치
    const rofPreferred = pool.filter((c) => c.inRealVsFake || !c.isReal);
    if (rofPreferred.length >= 6) {
      pool = rofPreferred;
    }
  }

  totalPoolCountEl.textContent = pool.length;

  if (shouldShuffle) {
    pool = shuffleArray(pool);
  }

  if (selectedCountLimit !== 'ALL') {
    const limit = parseInt(selectedCountLimit, 10);
    deck = pool.slice(0, Math.min(limit, pool.length));
  } else {
    deck = pool;
  }

  currentIndex = 0;
  modalListCountEl.textContent = deck.length;

  const modeTitleMap = {
    WHO_AM_I: '나는 누구일까요?',
    REAL_OR_FAKE: '진짜 vs 가짜!',
    MIXED: '랜덤 믹스 대모험'
  };
  quizModeBadgeEl.textContent = `${modeTitleMap[currentGameMode]} · ${deck.length}문제`;

  renderCurrentQuestion();
}

// =========================================================================
// 🖼️ 현재 문제 렌더링
// =========================================================================
function determineSubModeForCurrentQuestion(creature) {
  if (currentGameMode === 'WHO_AM_I') return 'WHO_AM_I';
  if (currentGameMode === 'REAL_OR_FAKE') return 'REAL_OR_FAKE';
  // MIXED 모드: 합성 생물이면 무조건 REAL_OR_FAKE, 그 외에는 홀짝 번갈아 출제
  if (!creature.isReal) return 'REAL_OR_FAKE';
  return currentIndex % 2 === 0 ? 'WHO_AM_I' : 'REAL_OR_FAKE';
}

function renderChoseongTiles(creature, state) {
  // state: 'MASKED' (❓ 타일) | 'CHOSEONG' (초성 타일) | 'REVEALED' (정답 글자)
  choseongDisplayEl.innerHTML = '';
  const sourceText = state === 'REVEALED' ? creature.name : creature.choseong;
  const words = sourceText.split(' ');

  words.forEach((word) => {
    const wordDiv = document.createElement('div');
    wordDiv.className = 'choseong-word';

    for (const ch of word) {
      if (ch === '(' || ch === ')') continue;
      const tile = document.createElement('div');
      if (state === 'MASKED') {
        tile.className = 'choseong-tile masked';
        tile.textContent = '?';
      } else if (state === 'CHOSEONG') {
        tile.className = 'choseong-tile';
        tile.textContent = ch;
      } else {
        tile.className = 'choseong-tile revealed';
        tile.textContent = ch;
      }
      wordDiv.appendChild(tile);
    }
    choseongDisplayEl.appendChild(wordDiv);
  });
}

function buildMultipleChoices(correctCreature) {
  mcChoicesGridEl.innerHTML = '';
  const sameCategoryPool = CREATURES.filter(
    (c) => c.id !== correctCreature.id && c.category === correctCreature.category
  );
  const otherPool = CREATURES.filter(
    (c) => c.id !== correctCreature.id && c.category !== correctCreature.category
  );

  const distractors = shuffleArray(sameCategoryPool).slice(0, 3);
  while (distractors.length < 3 && otherPool.length > 0) {
    const extra = otherPool.pop();
    if (extra && !distractors.includes(extra)) distractors.push(extra);
  }

  const options = shuffleArray([correctCreature, ...distractors]);

  options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mc-choice-btn';
    btn.innerHTML = `
      <span class="mc-num-badge">${idx + 1}</span>
      <span>${opt.emoji} ${opt.name}</span>
    `;

    btn.addEventListener('click', () => {
      if (isAnswerRevealed) return;
      const allBtns = mcChoicesGridEl.querySelectorAll('.mc-choice-btn');
      allBtns.forEach((b) => (b.disabled = true));

      if (opt.id === correctCreature.id) {
        btn.classList.add('correct');
        handleUserEvaluation(true, `🎉 정답입니다! [${correctCreature.name}] 맞췄어요!`);
      } else {
        btn.classList.add('wrong');
        handleUserEvaluation(false, `아차! 정답은 [${correctCreature.name}]입니다!`);
      }
    });

    mcChoicesGridEl.appendChild(btn);
  });
}

function renderCurrentQuestion() {
  if (deck.length === 0) return;
  const creature = deck[currentIndex];

  isAnswerRevealed = false;
  revealedHintStep = 0;
  isChoseongForced = showChoseongStartToggle.checked;
  activeSubMode = determineSubModeForCurrentQuestion(creature);

  // 진행률 업데이트
  questionCounterEl.textContent = `CREATURE ${currentIndex + 1} / ${deck.length}`;
  const pct = ((currentIndex + 1) / deck.length) * 100;
  progressBarFillEl.style.width = `${pct}%`;

  // 상단 배지 업데이트
  const catMeta = CATEGORY_META[creature.category] || { emoji: '🐾', label: creature.category };
  categoryBadgeEl.textContent = `${catMeta.emoji} ${catMeta.label}`;
  rarityBadgeEl.textContent = creature.rarityBadge;

  // 정답 영역 숨기기
  answerZoneEl.classList.add('hidden');
  userFeedbackBannerEl.classList.add('hidden');
  syncSolvedButtonState(creature.id);

  if (activeSubMode === 'WHO_AM_I') {
    currentSubModeBadgeEl.textContent = '🔍 나는 누구일까요?';
    currentSubModeBadgeEl.classList.remove('mode-rof');
    hintStepIndicatorsEl.classList.remove('hidden');
    whoAmIViewEl.classList.remove('hidden');
    realOrFakeViewEl.classList.add('hidden');

    renderWhoAmIStage(creature);
  } else {
    currentSubModeBadgeEl.textContent = '🕵️ 진짜 vs 가짜!';
    currentSubModeBadgeEl.classList.add('mode-rof');
    hintStepIndicatorsEl.classList.add('hidden');
    whoAmIViewEl.classList.add('hidden');
    realOrFakeViewEl.classList.remove('hidden');

    renderRealOrFakeStage(creature);
  }

  preloadAdjacentCreaturePhotos();
}

function renderWhoAmIStage(creature) {
  // 스텝 점 초기화
  [stepDot1, stepDot2, stepDot3].forEach((d) => d.classList.remove('active'));

  // 미스터리 실루엣 박스 초기화
  mysteryQuestionMarkEl.classList.remove('hidden');
  mysteryEmojiPreviewEl.classList.add('hidden');
  mysteryEmojiPreviewEl.textContent = creature.emoji;
  mysteryBlurPreviewImgEl.classList.add('hidden');
  mysteryStatusCaptionEl.textContent = '힌트를 열어 정체를 추리해 보세요!';

  // 초성 타일
  if (isChoseongForced) {
    renderChoseongTiles(creature, 'CHOSEONG');
    choseongCaptionEl.textContent = '🔤 초성 힌트 오픈됨';
    toggleChoseongInstantBtn.textContent = '글자 수만 보기';
  } else {
    renderChoseongTiles(creature, 'MASKED');
    choseongCaptionEl.textContent = `🔤 이름 글자 수 (${creature.name.replace(/\s+/g, '').length}글자)`;
    toggleChoseongInstantBtn.textContent = '초성 바로 보기';
  }

  habitatPreviewTextEl.textContent = '1단계 힌트에서 공개됩니다';
  sizePreviewTextEl.textContent = '1단계 힌트에서 공개됩니다';

  hintCountLabelEl.textContent = '0 / 3';
  hintGuideTagEl.textContent = '아래 [1단계 힌트 열기] 버튼을 눌러보세요!';
  hintListEl.innerHTML = '';

  hintBtn.disabled = false;
  hintBtnText.textContent = '1단계 힌트 열기 (1/3)';
  answerBtnText.textContent = '정답 확인하기';

  buildMultipleChoices(creature);
}

async function renderRealOrFakeStage(creature) {
  rofClaimTextEl.textContent = creature.claim;
  rofSuspectNameTagEl.textContent = `탐사 대상: ${creature.name} (${creature.enName})`;

  rofHintTextEl.classList.add('hidden');
  rofHintTextEl.textContent = creature.stepHints[0] || '';
  rofHintBtn.textContent = '🔍 탐정 힌트 하나 보기';

  voteRealBtn.disabled = false;
  voteFakeBtn.disabled = false;

  // 미스터리 비주얼 카드 구성
  if (!creature.isReal && creature.hybridTheme) {
    const t = creature.hybridTheme;
    rofVisualContentEl.style.background = `linear-gradient(135deg, ${t.bg1}, ${t.bg2})`;
    rofVisualContentEl.innerHTML = `
      <div class="rof-mystery-collage">
        <span>${t.e1}</span>
        <span style="font-size:1.8rem;">⚡</span>
        <span>${t.e2}</span>
      </div>
      <div class="rof-suspect-name-preview">${creature.name}</div>
      <div class="rof-suspect-sub">${creature.habitat}</div>
    `;
  } else {
    rofVisualContentEl.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(14, 165, 233, 0.25))';
    rofVisualContentEl.innerHTML = `
      <div class="rof-mystery-collage">
        <span>${creature.emoji}</span>
        <span style="font-size:1.8rem;">❓</span>
      </div>
      <div class="rof-suspect-name-preview">${creature.name}</div>
      <div class="rof-suspect-sub">${creature.habitat}</div>
    `;
  }
}

// =========================================================================
// 💡 모드 1: 단계별 힌트 오픈 (1단계 → 2단계 → 3단계 초성·실루엣)
// =========================================================================
async function handleNextHintStep() {
  if (deck.length === 0 || isAnswerRevealed) return;
  const creature = deck[currentIndex];
  if (revealedHintStep >= 3) return;

  revealedHintStep++;
  soundEngine.playSfx('hint');

  const hintText = creature.stepHints[revealedHintStep - 1];
  if (hintText) {
    const li = document.createElement('li');
    li.className = 'hint-item';
    li.textContent = hintText;
    hintListEl.appendChild(li);
  }

  hintCountLabelEl.textContent = `${revealedHintStep} / 3`;

  if (revealedHintStep === 1) {
    stepDot1.classList.add('active');
    habitatPreviewTextEl.textContent = creature.habitat;
    sizePreviewTextEl.textContent = creature.sizeInfo;
    hintBtnText.textContent = '2단계 힌트 열기 (2/3)';
    hintGuideTagEl.textContent = '서식지와 크기가 공개되었어요!';
  } else if (revealedHintStep === 2) {
    stepDot2.classList.add('active');
    mysteryQuestionMarkEl.classList.add('hidden');
    mysteryEmojiPreviewEl.classList.remove('hidden');
    mysteryStatusCaptionEl.textContent = '실루엣 힌트가 나타났어요!';
    hintBtnText.textContent = '3단계 결정적 힌트 & 초성 열기 (3/3)';
    hintGuideTagEl.textContent = '결정적인 특징 단서가 열렸어요!';
  } else if (revealedHintStep === 3) {
    stepDot3.classList.add('active');
    renderChoseongTiles(creature, 'CHOSEONG');
    choseongCaptionEl.textContent = '🔤 3단계 초성 힌트 오픈!';
    hintBtnText.textContent = '💡 모든 힌트 오픈 완료';
    hintBtn.disabled = true;
    hintGuideTagEl.textContent = '모든 힌트가 열렸어요! 정답을 외쳐보세요!';

    // 위키 사진 블러 프리뷰 시도
    const url = await fetchWikiPhotoByTitle(creature.wikiTitle);
    if (url && deck[currentIndex]?.id === creature.id && !isAnswerRevealed) {
      mysteryEmojiPreviewEl.classList.add('hidden');
      mysteryBlurPreviewImgEl.src = url;
      mysteryBlurPreviewImgEl.classList.remove('hidden');
      mysteryStatusCaptionEl.textContent = '흐릿한 사진 힌트! 누구일까요?';
    }
  }
}

// =========================================================================
// 🎉 정답 확인 및 진실 판정
// =========================================================================
function handleUserEvaluation(isCorrect, bannerMessage) {
  userFeedbackBannerEl.classList.remove('hidden', 'feedback-correct', 'feedback-wrong');
  if (isCorrect) {
    userFeedbackBannerEl.classList.add('feedback-correct');
    feedbackIconEl.textContent = '🎉';
    feedbackTextEl.textContent = bannerMessage;
    soundEngine.playSfx('correct');

    const creature = deck[currentIndex];
    if (creature && !solvedCreatureIds.has(creature.id)) {
      solvedCreatureIds.add(creature.id);
      correctCountEl.textContent = solvedCreatureIds.size;
    }
    streakCount++;
    streakCountEl.textContent = `🔥 ${streakCount}`;
  } else {
    userFeedbackBannerEl.classList.add('feedback-wrong');
    feedbackIconEl.textContent = '💡';
    feedbackTextEl.textContent = bannerMessage;
    soundEngine.playSfx('wrong');
    streakCount = 0;
    streakCountEl.textContent = '🔥 0';
  }

  revealAnswerSection();
}

async function revealAnswerSection() {
  if (deck.length === 0) return;
  const creature = deck[currentIndex];

  if (isAnswerRevealed) {
    goToNextQuestion();
    return;
  }

  isAnswerRevealed = true;
  renderChoseongTiles(creature, 'REVEALED');

  // 블러 해제
  if (!mysteryBlurPreviewImgEl.classList.contains('hidden')) {
    mysteryBlurPreviewImgEl.style.filter = 'none';
  }

  // 상단 배지 및 제목 채우기
  if (creature.isReal) {
    answerRealFakeBadgeEl.textContent = '⭕ 실존하는 진짜 생물';
    answerRealFakeBadgeEl.className = 'verdict-pill verdict-real';
    verdictHighlightBoxEl.classList.remove('fake-box');
  } else {
    answerRealFakeBadgeEl.textContent = '❌ 가짜 (합성·상상 생물)';
    answerRealFakeBadgeEl.className = 'verdict-pill verdict-fake';
    verdictHighlightBoxEl.classList.add('fake-box');
  }

  const catMeta = CATEGORY_META[creature.category] || { emoji: '🐾', label: creature.category };
  answerCategoryTagEl.textContent = `${catMeta.emoji} ${catMeta.label}`;
  answerHabitatTagEl.textContent = `📍 ${creature.habitat}`;

  answerKoreanNameEl.textContent = `${creature.emoji} ${creature.name}`;
  answerEnglishNameEl.textContent = `${creature.enName} · ${creature.sizeInfo}`;

  verdictTitleTextEl.textContent = creature.verdictTitle;
  verdictDescTextEl.textContent = creature.verdictDesc;

  // 재미있는 상식 3개
  answerFunFactsListEl.innerHTML = '';
  creature.funFacts.forEach((fact) => {
    const li = document.createElement('li');
    li.textContent = fact;
    answerFunFactsListEl.appendChild(li);
  });

  syncSolvedButtonState(creature.id);
  answerBtnText.textContent = currentIndex === deck.length - 1 ? '탐험 결과 보기 🏆' : '다음 생물로 이동 →';
  nextAfterAnswerBtn.textContent = currentIndex === deck.length - 1 ? '탐험 결과 보기 🏆' : '다음 문제로 이동 →';

  // 사진 영역 초기화
  photoLoadingEl.classList.remove('hidden');
  creaturePhotoEl.classList.add('hidden');
  hybridVisualCardEl.classList.add('hidden');
  emojiFallbackCardEl.classList.add('hidden');

  answerZoneEl.classList.remove('hidden');

  // 가짜(합성) 생물일 경우: 두 원본 동물의 실제 위키 사진을 나란히 해부 비교!
  if (!creature.isReal && creature.secondWikiTitle) {
    const [url1, url2] = await Promise.all([
      fetchWikiPhotoByTitle(creature.wikiTitle),
      fetchWikiPhotoByTitle(creature.secondWikiTitle)
    ]);
    if (deck[currentIndex]?.id !== creature.id) return;
    photoLoadingEl.classList.add('hidden');

    if (url1 && url2) {
      hybridPhoto1El.src = url1;
      hybridPhoto2El.src = url2;
      hybridLabel1El.textContent = creature.hybridParts?.[0] || '합성 원본 1';
      hybridLabel2El.textContent = creature.hybridParts?.[1] || '합성 원본 2';
      hybridThemeBannerEl.textContent = creature.hybridTheme?.label || 'HYBRID ANALYSIS';
      hybridVisualCardEl.classList.remove('hidden');
    } else {
      fallbackBigEmojiEl.textContent = `${creature.hybridTheme?.e1 || '🦈'} + ${creature.hybridTheme?.e2 || '🐎'}`;
      fallbackEnTitleEl.textContent = creature.enName;
      emojiFallbackCardEl.classList.remove('hidden');
    }
    return;
  }

  // 실존 생물일 경우: Wikipedia 고화질 이미지 표시
  const photoUrl = await fetchWikiPhotoByTitle(creature.wikiTitle);
  if (deck[currentIndex]?.id !== creature.id) return;
  photoLoadingEl.classList.add('hidden');

  if (photoUrl) {
    creaturePhotoEl.src = photoUrl;
    creaturePhotoEl.alt = `${creature.name} 실제 사진`;
    creaturePhotoEl.classList.remove('hidden');
  } else {
    fallbackBigEmojiEl.textContent = creature.emoji;
    fallbackEnTitleEl.textContent = creature.enName;
    emojiFallbackCardEl.classList.remove('hidden');
  }
}

// =========================================================================
// ⭕ 맞췄어요 점수 체크 및 네비게이션
// =========================================================================
function syncSolvedButtonState(creatureId) {
  if (solvedCreatureIds.has(creatureId)) {
    markCorrectBtn.classList.add('solved');
    markCorrectBtn.textContent = '✅ 맞춘 문제로 기록됨';
  } else {
    markCorrectBtn.classList.remove('solved');
    markCorrectBtn.textContent = '⭕ 맞췄어요! 점수 추가 (+1)';
  }
}

function toggleMarkCorrect() {
  if (deck.length === 0) return;
  const creature = deck[currentIndex];
  if (solvedCreatureIds.has(creature.id)) {
    solvedCreatureIds.delete(creature.id);
  } else {
    solvedCreatureIds.add(creature.id);
    soundEngine.playSfx('correct');
  }
  correctCountEl.textContent = solvedCreatureIds.size;
  syncSolvedButtonState(creature.id);
}

function goToPrevQuestion() {
  if (deck.length === 0) return;
  currentIndex = (currentIndex - 1 + deck.length) % deck.length;
  renderCurrentQuestion();
}

function goToNextQuestion() {
  if (deck.length === 0) return;
  if (currentIndex === deck.length - 1) {
    openQuizResultModal();
    return;
  }
  currentIndex++;
  renderCurrentQuestion();
}

// =========================================================================
// 📖 생물 도감 모달 & 결과 모달
// =========================================================================
function renderEncyclopediaModal(filterKeyword = '') {
  creatureGridListEl.innerHTML = '';
  const kw = filterKeyword.trim().toLowerCase();

  const list = CREATURES.filter((c) => {
    if (!kw) return true;
    return (
      c.name.toLowerCase().includes(kw) ||
      c.enName.toLowerCase().includes(kw) ||
      c.choseong.includes(kw) ||
      c.category.toLowerCase().includes(kw)
    );
  });

  list.forEach((c) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'encyclopedia-item';
    const realTag = c.isReal ? '⭕ 실존' : '🧪 합성';
    item.innerHTML = `
      <span class="encyclopedia-emoji">${c.emoji}</span>
      <div class="encyclopedia-meta">
        <strong>${c.name}</strong>
        <small>${c.category} · ${realTag}</small>
      </div>
    `;

    item.addEventListener('click', () => {
      // 해당 생물이 현재 덱에 없으면 카테고리에 추가 후 이동
      if (!selectedCategories.has(c.category)) {
        selectedCategories.add(c.category);
        renderCategoryChips();
        buildDeckAndRender(false);
      }
      const targetIdx = deck.findIndex((d) => d.id === c.id);
      if (targetIdx !== -1) {
        currentIndex = targetIdx;
        renderCurrentQuestion();
      }
      creatureListModal.close();
    });

    creatureGridListEl.appendChild(item);
  });
}

function openQuizResultModal() {
  const total = deck.length;
  const solvedInDeck = deck.filter((c) => solvedCreatureIds.has(c.id)).length;
  const accuracy = total > 0 ? Math.round((solvedInDeck / total) * 100) : 0;

  resultTotalQuestionsEl.textContent = total;
  resultCorrectQuestionsEl.textContent = solvedInDeck;
  resultAccuracyEl.textContent = `${accuracy}%`;
  resultSubtitleEl.textContent = `총 ${total}마리의 신비한 생물 탐험을 마쳤습니다!`;

  if (accuracy >= 85) {
    resultTrophyEmojiEl.textContent = '👑';
    resultRankBadgeEl.textContent = '👑 전설의 지구 생물학 대박사님!';
  } else if (accuracy >= 50) {
    resultTrophyEmojiEl.textContent = '🦖';
    resultRankBadgeEl.textContent = '🧭 눈썰미 만점 정글 탐험 대장!';
  } else {
    resultTrophyEmojiEl.textContent = '🐣';
    resultRankBadgeEl.textContent = '🌱 호기심 가득 꼬마 탐험가!';
  }

  soundEngine.playSfx('correct');
  quizResultModal.showModal();
}

// =========================================================================
// 🛡️ <dialog closedby="any"> 미지원 브라우저용 포인터 위치 기반 Light-Dismiss 폴백
// =========================================================================
function setupDialogLightDismissFallbacks() {
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    const outside = (e, dialog) => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };
    for (const dialog of document.querySelectorAll('dialog[closedby="any"]')) {
      let pressedOutside = false;
      dialog.addEventListener('pointerdown', (e) => {
        pressedOutside = outside(e, dialog);
      });
      dialog.addEventListener('pointerup', (e) => {
        if (pressedOutside && outside(e, dialog)) dialog.close();
      });
    }
  }
}

// =========================================================================
// 🎮 이벤트 리스너 바인딩
// =========================================================================
function bindEvents() {
  // 1. 모드 전환 탭
  modeTabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      modeTabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentGameMode = btn.dataset.mode;
      applyRecommendedCategoriesForMode(currentGameMode);
      renderCategoryChips();
      buildDeckAndRender(true);
    });
  });

  // 2. 카테고리 전체 선택 / 추천값 리셋
  selectAllCategoriesBtn.addEventListener('click', () => {
    selectedCategories = new Set(ALL_CATEGORIES);
    renderCategoryChips();
    buildDeckAndRender(false);
  });

  resetCategoriesBtn.addEventListener('click', () => {
    applyRecommendedCategoriesForMode(currentGameMode);
    renderCategoryChips();
    buildDeckAndRender(false);
  });

  // 3. 문제 수 선택
  countChipsEl.querySelectorAll('.count-chip-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      countChipsEl.querySelectorAll('.count-chip-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      selectedCountLimit = btn.dataset.count;
      buildDeckAndRender(false);
    });
  });

  // 4. 모드 1 (나는 누구일까요?) 버튼들
  hintBtn.addEventListener('click', handleNextHintStep);
  answerBtn.addEventListener('click', () => {
    if (isAnswerRevealed) {
      goToNextQuestion();
    } else {
      soundEngine.playSfx('hint');
      revealAnswerSection();
    }
  });

  toggleChoseongInstantBtn.addEventListener('click', () => {
    if (deck.length === 0 || isAnswerRevealed) return;
    const creature = deck[currentIndex];
    isChoseongForced = !isChoseongForced;
    if (isChoseongForced) {
      renderChoseongTiles(creature, 'CHOSEONG');
      choseongCaptionEl.textContent = '🔤 초성 힌트 오픈됨';
      toggleChoseongInstantBtn.textContent = '글자 수만 보기';
    } else {
      renderChoseongTiles(creature, 'MASKED');
      choseongCaptionEl.textContent = `🔤 이름 글자 수 (${creature.name.replace(/\s+/g, '').length}글자)`;
      toggleChoseongInstantBtn.textContent = '초성 바로 보기';
    }
  });

  showChoseongStartToggle.addEventListener('change', () => {
    if (!isAnswerRevealed && deck.length > 0) {
      isChoseongForced = showChoseongStartToggle.checked;
      const creature = deck[currentIndex];
      renderChoseongTiles(creature, isChoseongForced ? 'CHOSEONG' : 'MASKED');
    }
  });

  // 5. 모드 2 (진짜 vs 가짜!) O / X 버튼
  rofHintBtn.addEventListener('click', () => {
    rofHintTextEl.classList.toggle('hidden');
    soundEngine.playSfx('hint');
  });

  voteRealBtn.addEventListener('click', () => {
    if (isAnswerRevealed || deck.length === 0) return;
    const creature = deck[currentIndex];
    voteRealBtn.disabled = true;
    voteFakeBtn.disabled = true;
    if (creature.isReal) {
      handleUserEvaluation(true, `⭕ 정답! [${creature.name}]은(는) 지구에 진짜 존재하는 생물입니다!`);
    } else {
      handleUserEvaluation(false, `❌ 속았네요! [${creature.name}]은(는) 합성·상상으로 만든 가짜 생물입니다!`);
    }
  });

  voteFakeBtn.addEventListener('click', () => {
    if (isAnswerRevealed || deck.length === 0) return;
    const creature = deck[currentIndex];
    voteRealBtn.disabled = true;
    voteFakeBtn.disabled = true;
    if (!creature.isReal) {
      handleUserEvaluation(true, `🎉 대단해요! [${creature.name}]이(가) 가짜 합성 생물이라는 걸 단번에 간파했네요!`);
    } else {
      handleUserEvaluation(false, `😲 반전! 가짜처럼 신기하지만 [${creature.name}]은(는) 진짜 존재하는 생물이랍니다!`);
    }
  });

  // 6. 정답창 사운드 & 점수 & 이동 버튼
  playCreatureSoundBtn.addEventListener('click', () => {
    if (deck.length === 0) return;
    soundEngine.playCreatureEffectAndVoice(deck[currentIndex]);
  });

  markCorrectBtn.addEventListener('click', toggleMarkCorrect);
  nextAfterAnswerBtn.addEventListener('click', goToNextQuestion);
  prevBtn.addEventListener('click', goToPrevQuestion);
  nextBtn.addEventListener('click', goToNextQuestion);

  shuffleBtn.addEventListener('click', () => {
    buildDeckAndRender(true);
    soundEngine.playSfx('hint');
  });

  // 7. BGM 컨트롤
  bgmToggleBtn.addEventListener('click', () => soundEngine.toggleBgm());
  bgmTrackSelect.addEventListener('change', (e) => {
    soundEngine.currentTrack = e.target.value;
    if (soundEngine.isPlayingBgm) soundEngine.startBgm();
  });
  muteToggleBtn.addEventListener('click', () => {
    soundEngine.isMuted = !soundEngine.isMuted;
    muteToggleBtn.textContent = soundEngine.isMuted ? '🔇' : '🔉';
  });
  bgmVolumeSlider.addEventListener('input', (e) => {
    soundEngine.volume = parseFloat(e.target.value);
    volValueText.textContent = `${Math.round(soundEngine.volume * 100)}%`;
  });

  // 8. 모달 열기/닫기
  listOpenBtn.addEventListener('click', () => {
    renderEncyclopediaModal(searchCreatureInput.value);
    creatureListModal.showModal();
  });
  closeModalBtn.addEventListener('click', () => creatureListModal.close());
  searchCreatureInput.addEventListener('input', (e) => {
    renderEncyclopediaModal(e.target.value);
  });

  ipadGuideBtn.addEventListener('click', () => ipadGuideModal.showModal());
  closeIpadGuideBtn.addEventListener('click', () => ipadGuideModal.close());

  restartSameDeckBtn.addEventListener('click', () => {
    quizResultModal.close();
    currentIndex = 0;
    renderCurrentQuestion();
  });
  restartNewDeckBtn.addEventListener('click', () => {
    quizResultModal.close();
    buildDeckAndRender(true);
  });
  closeResultBtn.addEventListener('click', () => quizResultModal.close());

  // 9. 키보드 단축키
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    if (creatureListModal.open || quizResultModal.open || ipadGuideModal.open) return;

    if (e.code === 'KeyH') {
      e.preventDefault();
      if (activeSubMode === 'WHO_AM_I') handleNextHintStep();
      else rofHintBtn.click();
    } else if (e.code === 'Space') {
      e.preventDefault();
      if (isAnswerRevealed) goToNextQuestion();
      else revealAnswerSection();
    } else if (e.code === 'KeyO' && activeSubMode === 'REAL_OR_FAKE' && !isAnswerRevealed) {
      voteRealBtn.click();
    } else if (e.code === 'KeyX' && activeSubMode === 'REAL_OR_FAKE' && !isAnswerRevealed) {
      voteFakeBtn.click();
    } else if (e.code === 'ArrowRight') {
      goToNextQuestion();
    } else if (e.code === 'ArrowLeft') {
      goToPrevQuestion();
    }
  });

  // 10. 아이패드/모바일 좌우 스와이프 제스처
  let touchStartX = 0;
  let touchStartY = 0;
  const quizCardEl = document.getElementById('quizCard');
  quizCardEl.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  quizCardEl.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    const dy = e.changedTouches[0].screenY - touchStartY;
    if (Math.abs(dx) > 75 && Math.abs(dx) > Math.abs(dy) * 1.6) {
      if (dx < 0) goToNextQuestion();
      else goToPrevQuestion();
    }
  }, { passive: true });
}

// 초기화 실행
document.addEventListener('DOMContentLoaded', () => {
  setupDialogLightDismissFallbacks();
  applyRecommendedCategoriesForMode(currentGameMode);
  renderCategoryChips();
  bindEvents();
  buildDeckAndRender(true);
});
