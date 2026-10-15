/**
 * ChromaCloset - Main Application Logic & Interactive Controller
 */

// Application State
const AppState = {
  wardrobe: [],
  selectedScenario: 'night_party',
  timeOfDay: 'night',
  temperature: 'mild',
  matchingMethod: 'all', // 'all', 'complementary', 'monochromatic', 'analogous', 'neutral_anchor'
  lockedItemId: null,
  activeView: 'stylist', // 'stylist', 'wardrobe', 'theory', 'saved'
  generatedOutfits: [],
  selectedOutfitIndex: 0,
  savedLooks: [],
  wardrobeFilterCategory: 'all',
  wardrobeFilterColor: 'all',
  wardrobeSearchQuery: '',
  audioFeedback: true
};

// Subtle Web Audio API tactile feedback
const SoundFX = {
  ctx: null,
  init() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    } catch (e) {}
  },
  click() {
    if (!AppState.audioFeedback) return;
    try {
      if (!this.ctx) this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {}
  },
  success() {
    if (!AppState.audioFeedback) return;
    try {
      if (!this.ctx) this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.08); // E5
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.18);
    } catch (e) {}
  }
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  SoundFX.init();
  initStorage();
  initUIEventListeners();
  renderWardrobeFilters();
  renderWardrobeGrid();
  populateLockedItemDropdown();
  generateOutfits();
  renderSavedLooks();
  initTheoryWheel();
});

function initStorage() {
  AppState.wardrobe = WardrobeStore.getAll();
  try {
    const saved = localStorage.getItem('chromacloset_saved_looks_v1');
    if (saved) AppState.savedLooks = JSON.parse(saved);
  } catch (e) {
    AppState.savedLooks = [];
  }
}

function saveSavedLooks() {
  try {
    localStorage.setItem('chromacloset_saved_looks_v1', JSON.stringify(AppState.savedLooks));
  } catch (e) {}
  renderSavedLooks();
}

// UI Event Listeners
function initUIEventListeners() {
  // Navigation tabs
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      SoundFX.click();
      const view = e.currentTarget.dataset.view;
      switchView(view);
    });
  });

  // Scenario Buttons
  document.querySelectorAll('.scenario-card').forEach(card => {
    card.addEventListener('click', (e) => {
      SoundFX.click();
      document.querySelectorAll('.scenario-card').forEach(c => c.classList.remove('active'));
      e.currentTarget.classList.add('active');
      AppState.selectedScenario = e.currentTarget.dataset.scenario;
      
      // Auto adjust recommended time of day
      const rules = ColorEngine.getScenarioRules(AppState.selectedScenario);
      if (rules.timeOfDay && rules.timeOfDay !== 'all_day') {
        AppState.timeOfDay = rules.timeOfDay;
        updateTimePillsUI();
      }
      
      generateOutfits();
    });
  });

  // Time of Day Pills
  document.querySelectorAll('.time-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      SoundFX.click();
      document.querySelectorAll('.time-pill').forEach(p => p.classList.remove('active'));
      e.currentTarget.classList.add('active');
      AppState.timeOfDay = e.currentTarget.dataset.time;
      generateOutfits();
    });
  });

  // Temperature / Weather Select
  const tempSelect = document.getElementById('tempSelect');
  if (tempSelect) {
    tempSelect.addEventListener('change', (e) => {
      AppState.temperature = e.target.value;
      generateOutfits();
    });
  }

  // Matching Method Pills
  document.querySelectorAll('.method-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      SoundFX.click();
      document.querySelectorAll('.method-pill').forEach(p => p.classList.remove('active'));
      e.currentTarget.classList.add('active');
      AppState.matchingMethod = e.currentTarget.dataset.method;
      generateOutfits();
    });
  });

  // Locked item select
  const lockSelect = document.getElementById('lockItemSelect');
  if (lockSelect) {
    lockSelect.addEventListener('change', (e) => {
      SoundFX.click();
      AppState.lockedItemId = e.target.value || null;
      populateLockedItemDropdown();
      generateOutfits();
      if (AppState.lockedItemId) {
        const item = AppState.wardrobe.find(i => i.id === AppState.lockedItemId);
        showToast(`Anchor piece set: "${item ? item.name : 'Garment'}". All outfits built around it.`);
      } else {
        showToast('Anchor lock cleared. Harmonizing entire wardrobe.');
      }
    });
  }

  // Regenerate Button
  const btnRegenerate = document.getElementById('btnRegenerate');
  if (btnRegenerate) {
    btnRegenerate.addEventListener('click', () => {
      SoundFX.click();
      generateOutfits();
      showToast('Generated fresh harmonic outfits based on color theory!');
    });
  }

  // Wardrobe search input
  const searchInput = document.getElementById('wardrobeSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      AppState.wardrobeSearchQuery = e.target.value.toLowerCase().trim();
      renderWardrobeGrid();
    });
  }

  // Add Item Modal
  const btnOpenAddModal = document.getElementById('btnOpenAddModal');
  const btnCloseAddModal = document.getElementById('btnCloseAddModal');
  const addModal = document.getElementById('addItemModal');

  if (btnOpenAddModal && addModal) {
    btnOpenAddModal.addEventListener('click', () => {
      SoundFX.click();
      openAddGarmentModal();
    });
  }

  if (btnCloseAddModal && addModal) {
    btnCloseAddModal.addEventListener('click', () => {
      addModal.classList.remove('active');
    });
  }

  // Add Garment Form Submit
  const addForm = document.getElementById('addGarmentForm');
  if (addForm) {
    addForm.addEventListener('submit', handleAddGarmentSubmit);
  }

  // Color picker sync in modal
  const itemColorInput = document.getElementById('itemColor');
  const itemHexText = document.getElementById('itemHexText');
  const detectedColorLabel = document.getElementById('detectedColorLabel');
  if (itemColorInput && itemHexText) {
    itemColorInput.addEventListener('input', (e) => {
      itemHexText.value = e.target.value.toUpperCase();
      const cName = ColorEngine.getClosestColorName(e.target.value);
      if (detectedColorLabel) detectedColorLabel.textContent = cName;
      updateModalLivePreview();
    });
    itemHexText.addEventListener('input', (e) => {
      if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
        itemColorInput.value = e.target.value;
        const cName = ColorEngine.getClosestColorName(e.target.value);
        if (detectedColorLabel) detectedColorLabel.textContent = cName;
        updateModalLivePreview();
      }
    });
  }

  // Preset color chips in modal
  document.querySelectorAll('.preset-color-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      const hex = e.currentTarget.dataset.hex;
      if (itemColorInput) itemColorInput.value = hex;
      if (itemHexText) itemHexText.value = hex.toUpperCase();
      if (detectedColorLabel) detectedColorLabel.textContent = e.currentTarget.dataset.name;
      updateModalLivePreview();
    });
  });

  // Category select in modal to update subtype options
  const categorySelect = document.getElementById('itemCategory');
  if (categorySelect) {
    categorySelect.addEventListener('change', updateSubtypeOptions);
  }

  // Reset to default wardrobe
  const btnResetWardrobe = document.getElementById('btnResetWardrobe');
  if (btnResetWardrobe) {
    btnResetWardrobe.addEventListener('click', () => {
      if (confirm('Reset wardrobe to original 28 curated designer pieces?')) {
        AppState.wardrobe = WardrobeStore.resetToDefault();
        AppState.lockedItemId = null;
        populateLockedItemDropdown();
        renderWardrobeGrid();
        generateOutfits();
        showToast('Wardrobe reset to designer capsule collection.');
      }
    });
  }

  // Save current look
  const btnSaveLook = document.getElementById('btnSaveLook');
  if (btnSaveLook) {
    btnSaveLook.addEventListener('click', saveCurrentLook);
  }

  // Audio mute toggle
  const btnMuteToggle = document.getElementById('btnAudioToggle');
  if (btnMuteToggle) {
    btnMuteToggle.addEventListener('click', () => {
      AppState.audioFeedback = !AppState.audioFeedback;
      btnMuteToggle.innerHTML = AppState.audioFeedback ? '🔊' : '🔇';
      showToast(AppState.audioFeedback ? 'Sound effects enabled' : 'Sound effects muted');
    });
  }
}

function updateTimePillsUI() {
  document.querySelectorAll('.time-pill').forEach(pill => {
    if (pill.dataset.time === AppState.timeOfDay) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });
}

function switchView(viewName) {
  AppState.activeView = viewName;
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === viewName);
  });
  document.querySelectorAll('.view-section').forEach(sec => {
    sec.classList.toggle('active', sec.id === `view-${viewName}`);
  });

  if (viewName === 'wardrobe') {
    renderWardrobeGrid();
  } else if (viewName === 'theory') {
    initTheoryWheel();
  } else if (viewName === 'saved') {
    renderSavedLooks();
  }
}

// OUTFIT GENERATION ENGINE
function generateOutfits() {
  const wardrobe = AppState.wardrobe;
  const tops = wardrobe.filter(i => i.category === 'tops');
  const bottoms = wardrobe.filter(i => i.category === 'bottoms');
  const footwear = wardrobe.filter(i => i.category === 'footwear');
  const outerwear = wardrobe.filter(i => i.category === 'outerwear');
  const socks = wardrobe.filter(i => i.category === 'socks' || i.category === 'accessories');

  if (tops.length === 0 || bottoms.length === 0 || footwear.length === 0) {
    renderEmptyOutfitsNotice();
    return;
  }

  // Scenario context guidelines
  const isNight = AppState.timeOfDay === 'night' || AppState.selectedScenario === 'night_party';
  const isCold = AppState.temperature === 'cold' || AppState.selectedScenario === 'autumn_layering';

  // Filter candidates by locked item if active
  let lockedItem = null;
  if (AppState.lockedItemId) {
    lockedItem = wardrobe.find(i => i.id === AppState.lockedItemId);
  }

  const combinations = [];

  // Generate candidate outfits:
  // Core: Top + Bottom + Footwear
  // Layer: Outerwear (compulsory in cold or night party, or optional)
  // Accent: Socks or Belt
  tops.forEach(top => {
    if (lockedItem && lockedItem.category === 'tops' && lockedItem.id !== top.id) return;

    bottoms.forEach(bottom => {
      if (lockedItem && lockedItem.category === 'bottoms' && lockedItem.id !== bottom.id) return;

      footwear.forEach(shoes => {
        if (lockedItem && lockedItem.category === 'footwear' && lockedItem.id !== shoes.id) return;

        // Candidate outerwear list: if cold/night, try all outer jackets plus 1 no-outerwear option
        const outerOptions = (isCold || isNight || outerOptionsNeeded(AppState.selectedScenario))
          ? outerwear.slice(0, 5)
          : [null, ...outerwear.slice(0, 3)];

        outerOptions.forEach(outer => {
          if (lockedItem && lockedItem.category === 'outerwear' && (!outer || lockedItem.id !== outer.id)) return;

          // Pick most harmonic socks/accessory for this combo
          const candidateItems = [top, bottom, shoes];
          if (outer) candidateItems.unshift(outer);

          let bestSock = null;
          let bestSockScore = -1;

          socks.forEach(sock => {
            if (lockedItem && (lockedItem.category === 'socks' || lockedItem.category === 'accessories') && lockedItem.id !== sock.id) return;
            const testPair = ColorEngine.evaluateColorPair(shoes.color, sock.color);
            if (testPair.score > bestSockScore) {
              bestSockScore = testPair.score;
              bestSock = sock;
            }
          });

          if (bestSock) candidateItems.push(bestSock);

          // Full color harmony evaluation
          const evaluation = ColorEngine.evaluateOutfitHarmony(candidateItems, AppState.selectedScenario);

          // Matching Method Filter Check
          if (filterByMethod(evaluation.harmonyLabel, AppState.matchingMethod)) {
            combinations.push({
              items: candidateItems,
              evaluation,
              score: evaluation.score,
              harmonyLabel: evaluation.harmonyLabel
            });
          }
        });
      });
    });
  });

  // Sort by score descending
  combinations.sort((a, b) => b.score - a.score);

  // Pick top distinct outfits (avoid 5 nearly identical outfits with just 1 sock difference)
  const distinctOutfits = [];
  const seenCombos = new Set();

  for (const combo of combinations) {
    const key = combo.items.map(i => i.id).slice(0, 3).sort().join('-');
    if (!seenCombos.has(key)) {
      seenCombos.add(key);
      distinctOutfits.push(combo);
      if (distinctOutfits.length >= 8) break;
    }
  }

  AppState.generatedOutfits = distinctOutfits;
  AppState.selectedOutfitIndex = 0;

  renderOutfitCardsGrid();
  renderActiveOutfitStudio();
}

function outerOptionsNeeded(scenario) {
  return scenario === 'night_party' || scenario === 'autumn_layering' || scenario === 'business_formal';
}

function filterByMethod(harmonyLabel, method) {
  if (method === 'all') return true;
  if (method === 'complementary' && harmonyLabel.toLowerCase().includes('complementary')) return true;
  if (method === 'monochromatic' && harmonyLabel.toLowerCase().includes('monochromat')) return true;
  if (method === 'analogous' && harmonyLabel.toLowerCase().includes('analogous')) return true;
  if (method === 'neutral_anchor' && (harmonyLabel.toLowerCase().includes('anchor') || harmonyLabel.toLowerCase().includes('minimalist'))) return true;
  return false;
}

// RENDER GENERATED OUTFITS LIST
function renderOutfitCardsGrid() {
  const container = document.getElementById('outfitsGrid');
  if (!container) return;

  if (AppState.generatedOutfits.length === 0) {
    container.innerHTML = `
      <div class="empty-state-card">
        <div class="empty-icon">🧥</div>
        <h3>No Exact Combos Matched</h3>
        <p>Try switching the Matching Method to "All Harmonies" or add more items to your wardrobe.</p>
        <button class="btn btn-secondary" onclick="AppState.matchingMethod = 'all'; generateOutfits();">Reset Filter</button>
      </div>
    `;
    return;
  }

  container.innerHTML = AppState.generatedOutfits.map((combo, idx) => {
    const isSelected = idx === AppState.selectedOutfitIndex;
    const scoreColor = combo.score >= 90 ? '#10B981' : (combo.score >= 80 ? '#F59E0B' : '#6366F1');

    return `
      <div class="outfit-preview-card ${isSelected ? 'selected' : ''}" onclick="selectOutfit(${idx})">
        <div class="card-header-flex">
          <span class="harmony-tag">${combo.harmonyLabel}</span>
          <div class="score-badge" style="border-color: ${scoreColor}; color: ${scoreColor};">
            ${combo.score}% Match
          </div>
        </div>

        <div class="palette-swatch-row">
          ${combo.items.map(item => `
            <div class="swatch-circle" style="background-color: ${item.color};" title="${item.name} (${item.colorName})"></div>
          `).join('')}
        </div>

        <div class="items-mini-list">
          ${combo.items.map(item => `
            <div class="mini-item-row">
              <span class="mini-cat-label">${formatCategory(item.category)}:</span>
              <span class="mini-item-name">${item.name}</span>
            </div>
          `).join('')}
        </div>

        <div class="card-footer-flex">
          <span class="view-detail-hint">Click to Inspect Look →</span>
        </div>
      </div>
    `;
  }).join('');
}

function selectOutfit(index) {
  SoundFX.click();
  AppState.selectedOutfitIndex = index;
  renderOutfitCardsGrid();
  renderActiveOutfitStudio();
}

// RENDER ACTIVE OUTFIT CANVAS / STUDIO
function renderActiveOutfitStudio() {
  const studio = document.getElementById('outfitStudioCanvas');
  if (!studio) return;

  const current = AppState.generatedOutfits[AppState.selectedOutfitIndex];
  if (!current) {
    studio.innerHTML = `<div class="empty-studio-notice">Select an outfit from the list above to inspect.</div>`;
    return;
  }

  const { items, evaluation, score, harmonyLabel } = current;
  const rules = ColorEngine.getScenarioRules(AppState.selectedScenario);

  // SVG Layered Mannequin / Outfit Rack
  studio.innerHTML = `
    <div class="studio-header">
      <div class="studio-title-area">
        <span class="scenario-context-badge">${rules.icon} ${rules.title} • ${AppState.timeOfDay.toUpperCase()}</span>
        <h2 class="studio-outfit-title">${harmonyLabel}</h2>
      </div>
      <div class="studio-score-container">
        <div class="harmony-gauge">
          <svg viewBox="0 0 36 36" class="circular-chart">
            <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
            <path class="circle-progress" stroke-dasharray="${score}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
            <text x="18" y="20.35" class="percentage">${score}%</text>
          </svg>
          <div class="gauge-label">Harmony Index</div>
        </div>
      </div>
    </div>

    <!-- MAIN INTERACTIVE STUDIO CONTENT -->
    <div class="studio-split-layout">
      <!-- LEFT: VISUAL MANNEQUIN / CLOTHING STACK -->
      <div class="mannequin-column">
        <div class="garment-stack-board">
          ${renderGarmentStack(items)}
        </div>
      </div>

      <!-- RIGHT: COLOR THEORY BREAKDOWN & STYLIST INSIGHT -->
      <div class="analysis-column">
        <!-- 60-30-10 COLOR PROPORTION BAR -->
        <div class="analysis-card">
          <div class="analysis-card-title">
            <span>🎨 60-30-10 Sartorial Proportion</span>
            <span class="proportion-tag">${evaluation.proportionScore}% Optimal</span>
          </div>
          <p class="analysis-subtext">Dominant base grounds the body, secondary hue coordinates, 10% accent provides visual magnetism.</p>
          <div class="proportion-bar-container">
            ${renderProportionBar(items)}
          </div>
          <div class="palette-chips-grid">
            ${items.map(it => `
              <div class="palette-chip-item">
                <span class="chip-color-square" style="background-color: ${it.color};"></span>
                <div class="chip-info">
                  <div class="chip-name">${it.colorName || it.name}</div>
                  <div class="chip-hex">${it.color} • ${it.category}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- INTERACTIVE COLOR WHEEL GEOMETRY EMBED -->
        <div class="analysis-card">
          <div class="analysis-card-title">
            <span>🧭 Color Wheel Geometry</span>
            <span class="wheel-type-tag">${harmonyLabel}</span>
          </div>
          <div class="outfit-wheel-wrapper">
            <div id="outfitWheelContainer" class="outfit-wheel-canvas-container"></div>
            <div class="wheel-explanation-text">
              <strong>Harmonic Spatial Layout:</strong> 
              ${evaluation.scenarioExplanation}
            </div>
          </div>
        </div>

        <!-- NIGHT PARTY / SCENARIO STYLIST ADVICE -->
        <div class="analysis-card stylist-notes-card">
          <div class="analysis-card-title">
            <span>👔 Stylist Scenario Strategy</span>
            <span class="scenario-pill">${rules.icon} For ${rules.title}</span>
          </div>
          <div class="stylist-tips-list">
            ${evaluation.stylistTips.map(tip => `
              <div class="stylist-tip-item">${tip}</div>
            `).join('')}
          </div>
        </div>

        <!-- ACTION BUTTONS -->
        <div class="studio-actions-row">
          <button class="btn btn-primary btn-glow" id="btnSaveLook" onclick="saveCurrentLook()">
            ★ Save Look to Lookbook
          </button>
          <button class="btn btn-secondary" onclick="lockCurrentPiecePrompt()">
            🔒 Lock a Piece from This Look
          </button>
        </div>
      </div>
    </div>
  `;

  // Draw the outfit's geometric color wheel
  drawOutfitColorWheel(items);
}

// Render the visual layered clothes on the styling rack
function renderGarmentStack(items) {
  // Sort items in sartorial top-down human body order: Outerwear -> Top -> Bottom -> Socks -> Shoes -> Accessories
  const order = { outerwear: 1, tops: 2, bottoms: 3, socks: 4, footwear: 5, accessories: 6 };
  const sorted = [...items].sort((a, b) => (order[a.category] || 9) - (order[b.category] || 9));

  return sorted.map(item => {
    const isLocked = AppState.lockedItemId === item.id;
    return `
      <div class="garment-rack-card ${isLocked ? 'locked-border' : ''}">
        <div class="garment-card-left">
          <div class="garment-icon-frame" style="border-color: ${item.color}40;">
            ${GarmentSvgFactory.getSvg(item.iconType || item.subType || 'tshirt', item.color)}
          </div>
        </div>
        <div class="garment-card-center">
          <div class="garment-category-badge">${formatCategory(item.category)} • ${item.fabric || 'Tailored'}</div>
          <h4 class="garment-name">${item.name}</h4>
          <div class="garment-color-meta">
            <span class="color-dot" style="background-color: ${item.color};"></span>
            <span class="color-name-text">${item.colorName || item.color}</span>
            <span class="formality-badge">${formatFormality(item.formality)}</span>
          </div>
        </div>
        <div class="garment-card-right">
          <button class="lock-toggle-btn ${isLocked ? 'active' : ''}" 
                  onclick="toggleLockItem('${item.id}')" 
                  title="${isLocked ? 'Unlock piece' : 'Lock piece for outfits'}">
            ${isLocked ? '🔒 Locked' : '🔓 Lock'}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Render 60-30-10 visual bar
function renderProportionBar(items) {
  // 60% Dominant (Bottom or Outerwear), 30% Secondary (Top), 10% Accent (Footwear/Socks)
  const bottom = items.find(i => i.category === 'bottoms') || items[1] || items[0];
  const top = items.find(i => i.category === 'tops') || items[0];
  const accent = items.find(i => i.category === 'footwear') || items.find(i => i.category === 'socks') || items[items.length - 1];

  return `
    <div class="proportion-segment prop-60" style="background-color: ${bottom.color};" title="60% Dominant Anchor: ${bottom.name}">
      <span class="prop-label">60%</span>
    </div>
    <div class="proportion-segment prop-30" style="background-color: ${top.color};" title="30% Secondary Harmony: ${top.name}">
      <span class="prop-label">30%</span>
    </div>
    <div class="proportion-segment prop-10" style="background-color: ${accent.color};" title="10% Accent Pop: ${accent.name}">
      <span class="prop-label">10%</span>
    </div>
  `;
}

// Draw dynamic SVG Color Wheel for the outfit
function drawOutfitColorWheel(items) {
  const container = document.getElementById('outfitWheelContainer');
  if (!container) return;

  const size = 220;
  const center = size / 2;
  const radius = 78;
  const innerRadius = 52;

  // 12 hue segments
  const segments = 12;
  const arcPaths = [];
  for (let i = 0; i < segments; i++) {
    const angleStart = (i * 30 - 15) * Math.PI / 180;
    const angleEnd = ((i + 1) * 30 - 15) * Math.PI / 180;
    const hue = i * 30;

    const x1 = center + radius * Math.cos(angleStart);
    const y1 = center + radius * Math.sin(angleStart);
    const x2 = center + radius * Math.cos(angleEnd);
    const y2 = center + radius * Math.sin(angleEnd);
    const x3 = center + innerRadius * Math.cos(angleEnd);
    const y3 = center + innerRadius * Math.sin(angleEnd);
    const x4 = center + innerRadius * Math.cos(angleStart);
    const y4 = center + innerRadius * Math.sin(angleStart);

    arcPaths.push(`
      <path d="M${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z"
            fill="hsl(${hue}, 70%, 48%)" opacity="0.4" />
    `);
  }

  // Outfit color nodes
  const nodes = [];
  const lines = [];

  items.forEach(it => {
    const hsl = ColorEngine.hexToHsl(it.color);
    const isN = ColorEngine.isNeutral(hsl, it.color);

    // If neutral, plot near center; if chroma, plot on the wheel ring by hue angle
    let nodeRadius = isN ? (innerRadius * 0.45) : (radius * 0.85);
    const angleRad = (hsl.h - 90) * Math.PI / 180;
    const nx = center + nodeRadius * Math.cos(angleRad);
    const ny = center + nodeRadius * Math.sin(angleRad);

    nodes.push({
      x: nx,
      y: ny,
      color: it.color,
      name: it.name,
      isNeutral: isN
    });
  });

  // Connect chroma nodes with harmonic chords
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      lines.push(`
        <line x1="${nodes[i].x}" y1="${nodes[i].y}" x2="${nodes[j].x}" y2="${nodes[j].y}"
              stroke="rgba(255, 255, 255, 0.4)" stroke-width="1.8" stroke-dasharray="3 3"/>
      `);
    }
  }

  container.innerHTML = `
    <svg viewBox="0 0 ${size} ${size}" class="outfit-wheel-svg">
      <!-- Background Ring -->
      <circle cx="${center}" cy="${center}" r="${radius + 4}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="2"/>
      <circle cx="${center}" cy="${center}" r="${innerRadius}" fill="#14171f" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      
      <!-- Color wheel arcs -->
      ${arcPaths.join('')}
      
      <!-- Harmony geometric vectors -->
      ${lines.join('')}
      
      <!-- Garment Nodes -->
      ${nodes.map(n => `
        <circle cx="${n.x}" cy="${n.y}" r="8" fill="${n.color}" stroke="#FFFFFF" stroke-width="2.5" class="wheel-node-pulse">
          <title>${n.name}</title>
        </circle>
      `).join('')}

      <circle cx="${center}" cy="${center}" r="12" fill="#0b0d11" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
      <text x="${center}" y="${center + 3.5}" text-anchor="middle" font-size="9" fill="#9CA3AF" font-weight="600">HUE</text>
    </svg>
  `;
}

// TOGGLE LOCK ITEM
function toggleLockItem(itemId) {
  SoundFX.click();
  if (AppState.lockedItemId === itemId) {
    AppState.lockedItemId = null;
    showToast('Unlocked piece. Generator is free to mix any items.');
  } else {
    AppState.lockedItemId = itemId;
    const item = AppState.wardrobe.find(i => i.id === itemId);
    showToast(`Locked: "${item ? item.name : 'Piece'}". Matching outfits built around it.`);
  }
  populateLockedItemDropdown();
  generateOutfits();
}

function lockCurrentPiecePrompt() {
  const current = AppState.generatedOutfits[AppState.selectedOutfitIndex];
  if (!current) return;
  const pickerOptions = current.items.map(it => `• ${it.name} (${it.category})`).join('\n');
  alert(`To lock a piece, click the 'Lock' button directly on any garment card in the stack.\n\nCurrent items in look:\n${pickerOptions}`);
}

// SAVE CURRENT LOOK
function saveCurrentLook() {
  const current = AppState.generatedOutfits[AppState.selectedOutfitIndex];
  if (!current) return;

  const newSaved = {
    id: 'look-' + Date.now(),
    date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
    scenario: AppState.selectedScenario,
    scenarioTitle: ColorEngine.getScenarioRules(AppState.selectedScenario).title,
    score: current.score,
    harmonyLabel: current.harmonyLabel,
    items: current.items
  };

  AppState.savedLooks.unshift(newSaved);
  saveSavedLooks();
  SoundFX.success();
  showToast('Look saved to your personal Lookbook!');
}

// WARDROBE VIEW RENDERING
function renderWardrobeFilters() {
  const catContainer = document.getElementById('wardrobeCategoryFilters');
  if (!catContainer) return;

  const categories = [
    { key: 'all', label: 'All Items' },
    { key: 'tops', label: 'Tops' },
    { key: 'outerwear', label: 'Outerwear' },
    { key: 'bottoms', label: 'Bottoms' },
    { key: 'footwear', label: 'Footwear' },
    { key: 'socks', label: 'Socks & Details' }
  ];

  catContainer.innerHTML = categories.map(cat => `
    <button class="filter-chip ${AppState.wardrobeFilterCategory === cat.key ? 'active' : ''}" 
            onclick="setWardrobeCategoryFilter('${cat.key}')">
      ${cat.label}
    </button>
  `).join('');
}

function setWardrobeCategoryFilter(catKey) {
  SoundFX.click();
  AppState.wardrobeFilterCategory = catKey;
  renderWardrobeFilters();
  renderWardrobeGrid();
}

function renderWardrobeGrid() {
  const grid = document.getElementById('wardrobeGrid');
  if (!grid) return;

  let items = AppState.wardrobe;

  // Filter category
  if (AppState.wardrobeFilterCategory !== 'all') {
    if (AppState.wardrobeFilterCategory === 'socks') {
      items = items.filter(i => i.category === 'socks' || i.category === 'accessories');
    } else {
      items = items.filter(i => i.category === AppState.wardrobeFilterCategory);
    }
  }

  // Filter search
  if (AppState.wardrobeSearchQuery) {
    items = items.filter(i => 
      i.name.toLowerCase().includes(AppState.wardrobeSearchQuery) ||
      (i.colorName && i.colorName.toLowerCase().includes(AppState.wardrobeSearchQuery)) ||
      (i.fabric && i.fabric.toLowerCase().includes(AppState.wardrobeSearchQuery))
    );
  }

  // Update counter
  const countEl = document.getElementById('wardrobeTotalCount');
  if (countEl) countEl.textContent = `${items.length} ${items.length === 1 ? 'Garment' : 'Garments'}`;

  if (items.length === 0) {
    grid.innerHTML = `
      <div class="empty-wardrobe-msg">
        <h3>No garments found matching filters</h3>
        <p>Try searching another keyword or add a new piece to your collection.</p>
        <button class="btn btn-primary" onclick="openAddGarmentModal()">+ Add New Garment</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = items.map(item => {
    const isLocked = AppState.lockedItemId === item.id;
    return `
      <div class="wardrobe-garment-card">
        <div class="garment-card-top">
          <span class="cat-pill">${formatCategory(item.category)}</span>
          <div class="card-action-icons">
            <button class="icon-action-btn ${isLocked ? 'active' : ''}" 
                    onclick="toggleLockItem('${item.id}')" title="Lock for outfit generation">
              ${isLocked ? '🔒' : '🔓'}
            </button>
            <button class="icon-action-btn delete-btn" onclick="deleteGarment('${item.id}')" title="Delete garment">
              ✕
            </button>
          </div>
        </div>

        <div class="garment-illustration-box" style="background: radial-gradient(circle at center, ${item.color}25 0%, transparent 70%);">
          ${GarmentSvgFactory.getSvg(item.iconType || item.subType || 'tshirt', item.color)}
        </div>

        <div class="garment-card-bottom">
          <h4 class="card-item-title">${item.name}</h4>
          <div class="card-color-strip">
            <span class="color-badge-dot" style="background-color: ${item.color};"></span>
            <span class="color-badge-name">${item.colorName || item.color}</span>
          </div>
          <div class="card-meta-tags">
            <span class="tag-meta">${item.fabric || 'Textured'}</span>
            <span class="tag-meta">${formatFormality(item.formality)}</span>
          </div>

          <button class="btn-match-this" onclick="matchAroundPiece('${item.id}')">
            ✨ Find Outfits With This Piece
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function matchAroundPiece(itemId) {
  SoundFX.click();
  AppState.lockedItemId = itemId;
  populateLockedItemDropdown();
  switchView('stylist');
  generateOutfits();
  const item = AppState.wardrobe.find(i => i.id === itemId);
  showToast(`Locked "${item ? item.name : 'Piece'}". Generated looks that match!`);
}

function deleteGarment(id) {
  SoundFX.click();
  const item = AppState.wardrobe.find(i => i.id === id);
  if (confirm(`Remove "${item ? item.name : 'garment'}" from your wardrobe?`)) {
    AppState.wardrobe = WardrobeStore.deleteItem(id);
    if (AppState.lockedItemId === id) AppState.lockedItemId = null;
    populateLockedItemDropdown();
    renderWardrobeGrid();
    generateOutfits();
    showToast('Garment removed from closet.');
  }
}

// POPULATE LOCKED DROPDOWN & SYNC WIDGET
function populateLockedItemDropdown() {
  const select = document.getElementById('lockItemSelect');
  const widget = document.getElementById('anchorPieceWidget');
  const statusPill = document.getElementById('anchorStatusPill');
  const clearBtn = document.getElementById('btnClearLockBtn');

  if (select) {
    const currentVal = AppState.lockedItemId || '';
    select.innerHTML = `
      <option value="">None (Harmonize All Wardrobe Pieces)</option>
      ${AppState.wardrobe.map(it => `
        <option value="${it.id}" ${it.id === currentVal ? 'selected' : ''}>
          🔒 ${it.name} (${formatCategory(it.category)} - ${it.colorName})
        </option>
      `).join('')}
    `;
    select.value = currentVal;
  }

  // Update status indicators and clear button
  if (AppState.lockedItemId) {
    const lockedGarment = AppState.wardrobe.find(i => i.id === AppState.lockedItemId);
    const itemName = lockedGarment ? lockedGarment.name : 'Piece';
    if (widget) widget.classList.add('is-locked');
    if (statusPill) {
      statusPill.textContent = `🔒 Locked: ${itemName}`;
      statusPill.classList.add('active');
    }
    if (clearBtn) clearBtn.style.display = 'inline-flex';
  } else {
    if (widget) widget.classList.remove('is-locked');
    if (statusPill) {
      statusPill.textContent = 'Harmonizing Entire Closet';
      statusPill.classList.remove('active');
    }
    if (clearBtn) clearBtn.style.display = 'none';
  }
}

// CLEAR LOCK HELPER
function clearLockItem() {
  SoundFX.click();
  AppState.lockedItemId = null;
  populateLockedItemDropdown();
  generateOutfits();
  showToast('Anchor lock cleared. Harmonizing entire wardrobe.');
}

// ADD GARMENT MODAL
function openAddGarmentModal() {
  const modal = document.getElementById('addItemModal');
  if (!modal) return;
  modal.classList.add('active');
  updateSubtypeOptions();
  updateModalLivePreview();
}

function openMoodboardModal() {
  SoundFX.click();
  const modal = document.getElementById('moodboardModal');
  if (modal) modal.classList.add('active');
}

function closeMoodboardModal() {
  SoundFX.click();
  const modal = document.getElementById('moodboardModal');
  if (modal) modal.classList.remove('active');
}

function updateSubtypeOptions() {
  const cat = document.getElementById('itemCategory').value;
  const subSelect = document.getElementById('itemSubtype');
  if (!subSelect) return;

  const optionsMap = {
    tops: [
      { val: 'shirt_button', label: 'Dress / Button Shirt' },
      { val: 'tshirt', label: 'T-Shirt / Crewneck' },
      { val: 'polo', label: 'Polo Shirt' },
      { val: 'sweater', label: 'Knit Sweater' }
    ],
    outerwear: [
      { val: 'leather_jacket', label: 'Leather / Biker Jacket' },
      { val: 'blazer', label: 'Tailored Blazer' },
      { val: 'overcoat', label: 'Wool Overcoat' },
      { val: 'denim_jacket', label: 'Denim Jacket' },
      { val: 'overshirt', label: 'Field Overshirt' }
    ],
    bottoms: [
      { val: 'trousers', label: 'Pleated / Dress Trousers' },
      { val: 'jeans', label: 'Denim Jeans' },
      { val: 'chinos', label: 'Tapered Chinos' }
    ],
    footwear: [
      { val: 'boots', label: 'Chelsea / Leather Boots' },
      { val: 'sneakers', label: 'Sneakers' },
      { val: 'loafers', label: 'Loafers' },
      { val: 'dress_shoes', label: 'Oxford / Derby Shoes' }
    ],
    socks: [
      { val: 'socks', label: 'Socks' }
    ],
    accessories: [
      { val: 'belt', label: 'Leather Belt' }
    ]
  };

  const list = optionsMap[cat] || optionsMap.tops;
  subSelect.innerHTML = list.map(o => `<option value="${o.val}">${o.label}</option>`).join('');
  updateModalLivePreview();
}

function updateModalLivePreview() {
  const preview = document.getElementById('modalGarmentPreview');
  if (!preview) return;
  const color = document.getElementById('itemColor').value;
  const sub = document.getElementById('itemSubtype').value || 'tshirt';
  preview.innerHTML = GarmentSvgFactory.getSvg(sub, color);
}

function handleAddGarmentSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('itemName').value.trim();
  const category = document.getElementById('itemCategory').value;
  const subType = document.getElementById('itemSubtype').value;
  const color = document.getElementById('itemColor').value;
  const formality = document.getElementById('itemFormality').value;
  const season = document.getElementById('itemSeason').value;
  const fabric = document.getElementById('itemFabric').value.trim() || 'Cotton Blend';

  if (!name) {
    alert('Please give your garment a name');
    return;
  }

  const newItem = {
    id: `${category}-${Date.now()}`,
    name,
    category,
    subType,
    color,
    colorName: ColorEngine.getClosestColorName(color),
    formality,
    season,
    fabric,
    iconType: subType
  };

  AppState.wardrobe = WardrobeStore.addItem(newItem);
  populateLockedItemDropdown();
  renderWardrobeGrid();
  generateOutfits();

  document.getElementById('addItemModal').classList.remove('active');
  document.getElementById('addGarmentForm').reset();
  SoundFX.success();
  showToast(`Added "${newItem.name}" to your closet!`);
}

// SAVED LOOKS RENDERING
function renderSavedLooks() {
  const container = document.getElementById('savedLooksGrid');
  if (!container) return;

  if (AppState.savedLooks.length === 0) {
    container.innerHTML = `
      <div class="empty-saved-notice">
        <div class="empty-icon">📖</div>
        <h3>Your Lookbook is Empty</h3>
        <p>Generate harmonic outfits in the Stylist Studio and click "Save Look" to store your favorite party, date, and business combinations.</p>
        <button class="btn btn-primary" onclick="switchView('stylist')">Go to Stylist Studio</button>
      </div>
    `;
    return;
  }

  container.innerHTML = AppState.savedLooks.map(look => `
    <div class="saved-look-card">
      <div class="saved-card-header">
        <div>
          <span class="saved-scenario-badge">${look.scenarioTitle || 'Custom Occasion'}</span>
          <div class="saved-date">${look.date}</div>
        </div>
        <div class="saved-score-badge">${look.score}% Match</div>
      </div>

      <h3 class="saved-look-title">${look.harmonyLabel}</h3>

      <div class="saved-items-preview">
        ${look.items.map(it => `
          <div class="saved-item-row">
            <span class="saved-dot" style="background-color: ${it.color};"></span>
            <span class="saved-item-name">${it.name}</span>
          </div>
        `).join('')}
      </div>

      <div class="saved-actions">
        <button class="btn btn-secondary btn-sm" onclick="recallSavedLook('${look.id}')">Wear / Inspect</button>
        <button class="btn-delete-saved" onclick="deleteSavedLook('${look.id}')">✕</button>
      </div>
    </div>
  `).join('');
}

function recallSavedLook(lookId) {
  const look = AppState.savedLooks.find(l => l.id === lookId);
  if (!look) return;

  AppState.selectedScenario = look.scenario || 'night_party';
  AppState.generatedOutfits = [{
    items: look.items,
    evaluation: ColorEngine.evaluateOutfitHarmony(look.items, look.scenario),
    score: look.score,
    harmonyLabel: look.harmonyLabel
  }];
  AppState.selectedOutfitIndex = 0;

  switchView('stylist');
  renderOutfitCardsGrid();
  renderActiveOutfitStudio();
  showToast('Recalled look from your Lookbook!');
}

function deleteSavedLook(lookId) {
  if (confirm('Delete this saved look from your Lookbook?')) {
    AppState.savedLooks = AppState.savedLooks.filter(l => l.id !== lookId);
    saveSavedLooks();
    showToast('Look removed.');
  }
}

// COLOR THEORY LAB (INTERACTIVE EDUCATIONAL COMPONENT)
function initTheoryWheel() {
  const container = document.getElementById('theoryWheelContainer');
  if (!container) return;

  const hues = [
    { name: 'Red', h: 0, hex: '#EF4444' },
    { name: 'Red-Orange', h: 30, hex: '#F97316' },
    { name: 'Orange / Rust', h: 45, hex: '#EA580C' },
    { name: 'Amber / Camel', h: 60, hex: '#EAB308' },
    { name: 'Yellow-Green', h: 90, hex: '#84CC16' },
    { name: 'Olive / Green', h: 120, hex: '#22C55E' },
    { name: 'Emerald / Pine', h: 150, hex: '#10B981' },
    { name: 'Teal', h: 180, hex: '#06B6D4' },
    { name: 'Navy / Blue', h: 220, hex: '#3B82F6' },
    { name: 'Indigo', h: 250, hex: '#6366F1' },
    { name: 'Purple / Plum', h: 280, hex: '#A855F7' },
    { name: 'Burgundy / Magenta', h: 330, hex: '#EC4899' }
  ];

  const size = 260;
  const center = size / 2;
  const radius = 95;
  const innerRadius = 55;

  let activeHueIndex = 8; // Navy by default

  function renderInteractiveWheel(selectedIndex) {
    const segments = hues.map((hueObj, i) => {
      const angleStart = (i * 30 - 15) * Math.PI / 180;
      const angleEnd = ((i + 1) * 30 - 15) * Math.PI / 180;
      const isSelected = i === selectedIndex;
      const r = isSelected ? radius + 8 : radius;

      const x1 = center + r * Math.cos(angleStart);
      const y1 = center + r * Math.sin(angleStart);
      const x2 = center + r * Math.cos(angleEnd);
      const y2 = center + r * Math.sin(angleEnd);
      const x3 = center + innerRadius * Math.cos(angleEnd);
      const y3 = center + innerRadius * Math.sin(angleEnd);
      const x4 = center + innerRadius * Math.cos(angleStart);
      const y4 = center + innerRadius * Math.sin(angleStart);

      return `
        <path d="M${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 0 0 ${x4} ${y4} Z"
              fill="${hueObj.hex}" 
              stroke="${isSelected ? '#FFFFFF' : '#14171f'}" 
              stroke-width="${isSelected ? 3 : 1.5}"
              class="wheel-interactive-segment"
              data-index="${i}"
              style="cursor: pointer; transition: all 0.2s;" />
      `;
    }).join('');

    // Vector connecting selected to its opposite (Complementary)
    const compIndex = (selectedIndex + 6) % 12;
    const a1 = (selectedIndex * 30) * Math.PI / 180;
    const a2 = (compIndex * 30) * Math.PI / 180;
    const p1x = center + (radius * 0.75) * Math.cos(a1);
    const p1y = center + (radius * 0.75) * Math.sin(a1);
    const p2x = center + (radius * 0.75) * Math.cos(a2);
    const p2y = center + (radius * 0.75) * Math.sin(a2);

    container.innerHTML = `
      <svg viewBox="0 0 ${size} ${size}" class="theory-wheel-svg">
        <circle cx="${center}" cy="${center}" r="${radius + 10}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="2"/>
        <g id="wheelSegmentsGroup">${segments}</g>
        <line x1="${p1x}" y1="${p1y}" x2="${p2x}" y2="${p2y}" stroke="#FFFFFF" stroke-width="2.5" stroke-dasharray="4 4"/>
        <circle cx="${p1x}" cy="${p1y}" r="6" fill="${hues[selectedIndex].hex}" stroke="#FFF" stroke-width="2"/>
        <circle cx="${p2x}" cy="${p2y}" r="6" fill="${hues[compIndex].hex}" stroke="#FFF" stroke-width="2"/>
        <circle cx="${center}" cy="${center}" r="22" fill="#14171f" stroke="rgba(255,255,255,0.15)"/>
        <text x="${center}" y="${center + 4}" text-anchor="middle" font-size="10" fill="#E5E7EB" font-weight="700">180°</text>
      </svg>
    `;

    // Add click listeners to segments
    container.querySelectorAll('.wheel-interactive-segment').forEach(seg => {
      seg.addEventListener('click', (e) => {
        SoundFX.click();
        const idx = parseInt(e.target.dataset.index, 10);
        renderInteractiveWheel(idx);
        renderTheoryDetails(idx);
      });
    });
  }

  function renderTheoryDetails(idx) {
    const selected = hues[idx];
    const comp = hues[(idx + 6) % 12];
    const analog1 = hues[(idx + 11) % 12];
    const analog2 = hues[(idx + 1) % 12];

    const detailsBox = document.getElementById('theoryDetailsBox');
    if (!detailsBox) return;

    detailsBox.innerHTML = `
      <div class="theory-active-header">
        <div class="theory-color-title-row">
          <span class="theory-badge-circle" style="background-color: ${selected.hex};"></span>
          <h3>Selected Hue: ${selected.name}</h3>
        </div>
        <p class="theory-desc-text">In sartorial color theory, ${selected.name} is a high-impact hue. Here is how master stylists pair it:</p>
      </div>

      <div class="theory-rules-grid">
        <div class="theory-rule-card">
          <div class="rule-title">⚡ Complementary Opposite</div>
          <div class="partner-row">
            <span class="rule-dot" style="background-color: ${comp.hex};"></span>
            <strong>${comp.name}</strong>
          </div>
          <p class="rule-text">Opposite on the wheel. Wear one as the dominant piece and the other as an accent pop (e.g. Navy suit + Camel coat, or Forest Green shirt + Burgundy loafers).</p>
        </div>

        <div class="theory-rule-card">
          <div class="rule-title">🌿 Analogous Harmony</div>
          <div class="partner-row">
            <span class="rule-dot" style="background-color: ${analog1.hex};"></span>
            <span class="rule-dot" style="background-color: ${analog2.hex};"></span>
            <strong>${analog1.name} & ${analog2.name}</strong>
          </div>
          <p class="rule-text">Neighbors on the wheel. Creates seamless, relaxed continuity ideal for casual weekend or tonal evening elegance.</p>
        </div>

        <div class="theory-rule-card">
          <div class="rule-title">🛡️ Foolproof Neutral Anchors</div>
          <div class="partner-row">
            <span class="rule-dot" style="background-color: #111215;"></span>
            <span class="rule-dot" style="background-color: #6B7280;"></span>
            <span class="rule-dot" style="background-color: #F3F4F6;"></span>
            <strong>Obsidian, Slate & Chalk</strong>
          </div>
          <p class="rule-text">Neutrals absorb high saturation and make ${selected.name} look tailored and expensive rather than overpowering.</p>
        </div>
      </div>
    `;
  }

  renderInteractiveWheel(activeHueIndex);
  renderTheoryDetails(activeHueIndex);
  initPaletteSimulator();
}

// LIVE PALETTE SIMULATOR IN THEORY LAB
function initPaletteSimulator() {
  const c1 = document.getElementById('simColor1');
  const c2 = document.getElementById('simColor2');
  const c3 = document.getElementById('simColor3');
  if (!c1 || !c2 || !c3) return;

  function runSim() {
    const hex1 = c1.value;
    const hex2 = c2.value;
    const hex3 = c3.value;

    const mockItems = [
      { name: 'Layer / Top', category: 'tops', color: hex1, formality: 'smart_casual' },
      { name: 'Trousers / Bottom', category: 'bottoms', color: hex2, formality: 'smart_casual' },
      { name: 'Footwear / Accent', category: 'footwear', color: hex3, formality: 'smart_casual' }
    ];

    const result = ColorEngine.evaluateOutfitHarmony(mockItems, AppState.selectedScenario);
    const scoreEl = document.getElementById('simScoreValue');
    const labelEl = document.getElementById('simScoreLabel');
    const descEl = document.getElementById('simFeedbackText');

    if (scoreEl) scoreEl.textContent = `${result.score}%`;
    if (labelEl) labelEl.textContent = result.harmonyLabel;
    if (descEl) {
      descEl.innerHTML = `
        <strong>Stylist Verdict:</strong> ${result.scenarioExplanation}
        <br><br>
        <strong>60-30-10 Balance:</strong> ${result.proportionScore}% Optimal. 
        ${result.proportionScore >= 90 ? 'Excellent neutral foundation grounding statement colors.' : 'Consider making one piece a grounding neutral (Black, Navy, Slate, or White).'}
      `;
    }
  }

  [c1, c2, c3].forEach(input => input.addEventListener('input', runSim));
  runSim();
}

// UTILITY HELPERS
function formatCategory(cat) {
  const map = {
    tops: 'Top',
    outerwear: 'Outerwear',
    bottoms: 'Bottoms',
    footwear: 'Footwear',
    socks: 'Socks',
    accessories: 'Accessory'
  };
  return map[cat] || cat;
}

function formatFormality(formality) {
  const map = {
    casual: 'Casual',
    smart_casual: 'Smart Casual',
    business_formal: 'Business Formal',
    party_glam: 'Party / Night Glam'
  };
  return map[formality] || formality;
}

function showToast(message) {
  const toast = document.getElementById('appToast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('visible');
  setTimeout(() => {
    toast.classList.remove('visible');
  }, 2800);
}
