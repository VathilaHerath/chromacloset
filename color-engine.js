/**
 * ChromaCloset - Color Theory & Fashion Matching Engine
 * Implements scientific color spaces (RGB, HSL, Hex) & Sartorial Fashion Harmony Heuristics
 */

const ColorEngine = (() => {
  // Convert Hex to RGB
  function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    const num = parseInt(hex, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }

  // Convert RGB to Hex
  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = Math.round(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  // Convert RGB to HSL
  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  // Convert Hex to HSL
  function hexToHsl(hex) {
    const { r, g, b } = hexToRgb(hex);
    return rgbToHsl(r, g, b);
  }

  // Shortest angular distance between two hues on 360 color wheel
  function hueDistance(h1, h2) {
    const diff = Math.abs(h1 - h2) % 360;
    return diff > 180 ? 360 - diff : diff;
  }

  // Determine if a color is a fashion neutral
  // In fashion, neutrals include: Black, White, Charcoal, Heather Gray, Beige, Tan/Camel, Navy, Dark Indigo, Cream, Khaki, Dark Brown
  function isNeutral(hsl, hex = '') {
    const { s, l, h } = hsl;
    
    // Very low saturation is almost always neutral (grays, whites, blacks)
    if (s <= 18) return true;
    
    // Extreme lightness (whites, chalk) or darkness (blacks, midnight)
    if (l >= 90 || l <= 14) return true;
    
    // Fashion Navy/Midnight Blue: Hue between 210 and 240, low-mid saturation, dark lightness
    if (h >= 210 && h <= 245 && s <= 45 && l <= 30) return true;
    
    // Earthy Tan / Camel / Khaki / Dark Brown: Hue 25-45, moderate saturation, variable lightness
    if (h >= 20 && h <= 48 && s <= 38 && l <= 55) return true;
    
    // Olive/military drab: Hue 60-95, low saturation, low-mid lightness
    if (h >= 60 && h <= 100 && s <= 28 && l <= 40) return true;
    
    return false;
  }

  // Detect temperature: warm (20° to 160°), cool (180° to 320°), or neutral
  function getTone(hsl) {
    if (isNeutral(hsl)) return 'neutral';
    const { h } = hsl;
    if (h >= 15 && h <= 165) return 'warm';
    if (h >= 170 && h <= 320) return 'cool';
    return 'warm'; // reds/magentas wrap
  }

  // Human-readable color naming dictionary
  const COLOR_NAMES = [
    { name: 'Obsidian Black', hex: '#111215', h: 0, s: 0, l: 7 },
    { name: 'Charcoal Slate', hex: '#2C3038', h: 220, s: 12, l: 20 },
    { name: 'Heather Gray', hex: '#6B7280', h: 218, s: 11, l: 46 },
    { name: 'Chalk White', hex: '#F3F4F6', h: 210, s: 20, l: 96 },
    { name: 'Crisp White', hex: '#FFFFFF', h: 0, s: 0, l: 100 },
    { name: 'Sandstone Cream', hex: '#F5EBE1', h: 32, s: 45, l: 92 },
    { name: 'Camel Tan', hex: '#C19A6B', h: 33, s: 42, l: 59 },
    { name: 'Rich Cognac', hex: '#8B4513', h: 25, s: 75, l: 31 },
    { name: 'Midnight Navy', hex: '#0F1D38', h: 218, s: 57, l: 14 },
    { name: 'Royal Indigo', hex: '#1D4ED8', h: 224, s: 80, l: 48 },
    { name: 'Sky Chambray', hex: '#93C5FD', h: 213, s: 94, l: 78 },
    { name: 'Forest Pine', hex: '#1B4332', h: 154, s: 42, l: 19 },
    { name: 'Sage Green', hex: '#84A98C', h: 133, s: 19, l: 59 },
    { name: 'Olive Utility', hex: '#556B2F', h: 82, s: 39, l: 30 },
    { name: 'Burgundy Wine', hex: '#631D2D', h: 346, s: 55, l: 25 },
    { name: 'Crimson Rust', hex: '#991B1B', h: 0, s: 70, l: 35 },
    { name: 'Terracotta Clay', hex: '#C86446', h: 14, s: 56, l: 53 },
    { name: 'Mustard Saffron', hex: '#D97706', h: 32, s: 95, l: 44 },
    { name: 'Emerald Velvet', hex: '#065F46', h: 163, s: 88, l: 20 },
    { name: 'Dusty Lavender', hex: '#A78BFA', h: 257, s: 93, l: 77 },
    { name: 'Deep Plum', hex: '#4C1D95', h: 263, s: 67, l: 35 },
    { name: 'Blush Rose', hex: '#F472B6', h: 330, s: 81, l: 70 }
  ];

  function getClosestColorName(hex) {
    const { r, g, b } = hexToRgb(hex);
    let bestDist = Infinity;
    let bestName = 'Custom Hue';
    COLOR_NAMES.forEach(c => {
      const rgb = hexToRgb(c.hex);
      // Euclidean distance in RGB space
      const dist = Math.sqrt(
        Math.pow(r - rgb.r, 2) * 0.3 +
        Math.pow(g - rgb.g, 2) * 0.59 +
        Math.pow(b - rgb.b, 2) * 0.11
      );
      if (dist < bestDist) {
        bestDist = dist;
        bestName = c.name;
      }
    });
    return bestName;
  }

  // Analyze pairwise color compatibility
  function evaluateColorPair(hex1, hex2) {
    const hsl1 = hexToHsl(hex1);
    const hsl2 = hexToHsl(hex2);
    const n1 = isNeutral(hsl1, hex1);
    const n2 = isNeutral(hsl2, hex2);

    // Rule 1: Neutral + Neutral (Classic Foundation: e.g. Black + White, Navy + Gray, Tan + Cream)
    if (n1 && n2) {
      // Lightness contrast makes neutral pairs pop (avoiding identical muddy tones unless intentional)
      const lightDiff = Math.abs(hsl1.l - hsl2.l);
      const score = lightDiff > 25 ? 96 : 88;
      return {
        harmonyType: 'Neutral Harmony',
        score,
        reason: 'Timeless neutral synergy with balanced value contrast.'
      };
    }

    // Rule 2: Neutral + Chroma (The #1 Foolproof Fashion Rule: Neutral Anchor + Statement Color)
    if (n1 || n2) {
      const chromaHsl = n1 ? hsl2 : hsl1;
      const neutralHsl = n1 ? hsl1 : hsl2;
      const lightDiff = Math.abs(hsl1.l - hsl2.l);
      
      // Bonus if high contrast or complementary brightness
      let score = 94;
      if (lightDiff > 35) score += 4;
      if (chromaHsl.s > 70 && neutralHsl.l < 25) score += 2; // Bright vibrant + Obsidian black is a stunner

      return {
        harmonyType: 'Neutral Anchor',
        score: Math.min(100, score),
        reason: 'Neutral piece grounds the vibrant hue, creating refined elegance.'
      };
    }

    // Both are chroma (non-neutral). Let's evaluate color wheel relationship:
    const dist = hueDistance(hsl1.h, hsl2.h);

    // Monochromatic (Same hue family, different lightness/saturation)
    if (dist <= 20) {
      const lightDiff = Math.abs(hsl1.l - hsl2.l);
      if (lightDiff >= 20) {
        return {
          harmonyType: 'Monochromatic Tonal',
          score: 95,
          reason: 'Sophisticated tonal gradation within the same hue family.'
        };
      } else {
        return {
          harmonyType: 'Monochromatic Similar',
          score: 82,
          reason: 'Close tonal proximity; slight contrast adjustment recommended.'
        };
      }
    }

    // Analogous (Adjacent on color wheel, 20° - 50°: e.g., Navy + Teal, Olive + Mustard, Terracotta + Burgundy)
    if (dist > 20 && dist <= 50) {
      return {
        harmonyType: 'Analogous Harmony',
        score: 93,
        reason: 'Adjacent colors create organic, flowing unity inspired by nature.'
      };
    }

    // Complementary (Opposite on wheel, 150° - 180°: e.g., Navy + Camel/Rust, Forest Green + Burgundy)
    if (dist >= 145 && dist <= 180) {
      // In clothing, complementary is best when one is deeper or less saturated than the other
      const satDiff = Math.abs(hsl1.s - hsl2.s);
      const lightDiff = Math.abs(hsl1.l - hsl2.l);
      const score = (satDiff > 15 || lightDiff > 20) ? 96 : 89;
      return {
        harmonyType: 'Dynamic Complementary',
        score,
        reason: 'High-energy color wheel opposites providing bold visual balance.'
      };
    }

    // Split Complementary / Triadic (100° - 140°)
    if (dist >= 100 && dist <= 140) {
      return {
        harmonyType: 'Triadic Chord',
        score: 87,
        reason: 'Rich multi-tonal dialogue with vibrant sartorial personality.'
      };
    }

    // Moderate dissonance (50° - 90°)
    return {
      harmonyType: 'Eclectic Accent',
      score: 74,
      reason: 'Experimental color interval; best balanced with neutral accessories.'
    };
  }

  // Evaluate full outfit combination (top, bottom, shoes, outerwear?, socks/details?)
  function evaluateOutfitHarmony(items, scenario = 'night_party') {
    if (!items || items.length === 0) {
      return { score: 0, title: 'Incomplete', breakdown: [], tips: [] };
    }

    const colors = items.map(it => ({
      name: it.name,
      category: it.category,
      hex: it.color,
      hsl: hexToHsl(it.color),
      isNeutral: isNeutral(hexToHsl(it.color), it.color),
      formality: it.formality || 'smart_casual'
    }));

    // Calculate pairwise scores between adjacent and key garments:
    // Outerwear <-> Top
    // Top <-> Bottom
    // Bottom <-> Footwear
    // Footwear <-> Socks (if present)
    // Outerwear <-> Bottom
    let pairScores = [];
    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        const pair = evaluateColorPair(colors[i].hex, colors[j].hex);
        pairScores.push({
          item1: colors[i].name,
          item2: colors[j].name,
          ...pair
        });
      }
    }

    const avgPairScore = pairScores.reduce((sum, p) => sum + p.score, 0) / (pairScores.length || 1);

    // 60-30-10 Fashion Proportion Rule Analysis
    // 60% Dominant (usually Bottom or Outerwear/Suit)
    // 30% Secondary (Top / Shirt)
    // 10% Accent (Shoes, socks, pocket square, jewelry)
    const neutralCount = colors.filter(c => c.isNeutral).length;
    const chromaCount = colors.length - neutralCount;
    
    let proportionScore = 90;
    let harmonyLabel = 'Balanced Palette';

    if (chromaCount === 0) {
      // Full neutral palette (all black, or black + white + slate)
      proportionScore = 96;
      harmonyLabel = 'Nocturnal Monochrome Minimalist';
    } else if (chromaCount === 1) {
      // 1 Chroma Pop + Neutrals (The gold standard sartorial rule)
      proportionScore = 98;
      harmonyLabel = 'Anchor & Statement Pop';
    } else if (chromaCount === 2) {
      // 2 Chromas: check if they are complementary or analogous
      const nonNeutrals = colors.filter(c => !c.isNeutral);
      const dist = hueDistance(nonNeutrals[0].hsl.h, nonNeutrals[1].hsl.h);
      if (dist <= 45 || (dist >= 145 && dist <= 180)) {
        proportionScore = 94;
        harmonyLabel = dist <= 45 ? 'Harmonic Analogous Duo' : 'Dynamic Complementary Pair';
      } else {
        proportionScore = 80;
        harmonyLabel = 'Multi-Hue Statement';
      }
    } else {
      // 3 or more non-neutrals can look chaotic unless festival/editorial
      proportionScore = 70;
      harmonyLabel = 'Complex Multi-Chroma';
    }

    // Scenario Context Compatibility
    let scenarioBonus = 0;
    let scenarioExplanation = '';
    const scenarioRules = getScenarioRules(scenario);

    // Check formality coherence
    const formalities = items.map(it => it.formality || 'casual');
    const hasFormal = formalities.includes('formal') || formalities.includes('party_glam');
    const hasCasual = formalities.includes('casual');
    const formalityPenalty = (hasFormal && hasCasual && !scenarioRules.allowsHighLowMix) ? -8 : 0;

    // Check scenario specific color & vibe
    const hasDarkDominance = colors.filter(c => c.hsl.l < 30).length >= 1;
    const hasHighContrast = checkContrastRatio(colors);

    if (scenario === 'night_party') {
      if (hasDarkDominance) scenarioBonus += 5;
      if (hasHighContrast) scenarioBonus += 4;
      if (colors.some(c => c.hex.toLowerCase() === '#111215' || c.hsl.l <= 15)) scenarioBonus += 3;
      scenarioExplanation = 'Optimized for nighttime ambiance: sleek dark foundation with confident contrast and evening presence.';
    } else if (scenario === 'business_formal') {
      if (neutralCount >= 2 && colors.every(c => c.hsl.s < 75)) scenarioBonus += 6;
      scenarioExplanation = 'Executive sartorial discipline: grounded neutrals and dignified saturation hierarchy.';
    } else if (scenario === 'casual_coffee') {
      if (colors.some(c => c.isNeutral || c.hsl.l > 40)) scenarioBonus += 5;
      scenarioExplanation = 'Effortless lifestyle appeal: relaxed tonal comfort and versatile daylight warmth.';
    } else if (scenario === 'romantic_date') {
      if (colors.some(c => ['#631d2d', '#1b4332', '#0f1d38', '#111215', '#c19a6b'].includes(c.hex.toLowerCase()) || (c.hsl.l < 45 && c.hsl.s > 25))) {
        scenarioBonus += 6;
      }
      scenarioExplanation = 'Intimate & magnetic: tailored silhouette with alluring, rich depth.';
    } else if (scenario === 'summer_day') {
      const lightTones = colors.filter(c => c.hsl.l > 60).length;
      if (lightTones >= 2) scenarioBonus += 6;
      scenarioExplanation = 'Sun-ready respiration: crisp light-reflecting values with refreshing open tones.';
    } else if (scenario === 'autumn_layering') {
      const warmEarthy = colors.filter(c => (c.hsl.h >= 15 && c.hsl.h <= 90) || c.isNeutral).length;
      if (warmEarthy >= 2) scenarioBonus += 6;
      scenarioExplanation = 'Rich textural layering with warm foliage and heritage earth tones.';
    }

    // Aggregate overall score (clamped between 50 and 99)
    let totalScore = Math.round((avgPairScore * 0.5) + (proportionScore * 0.35) + scenarioBonus + formalityPenalty);
    totalScore = Math.max(55, Math.min(99, totalScore));

    // Generate Tailored Stylist Tips
    const stylistTips = generateStylistAdvice(items, scenario, totalScore, harmonyLabel);

    return {
      score: totalScore,
      harmonyLabel,
      scenarioExplanation,
      pairBreakdown: pairScores,
      proportionScore,
      stylistTips,
      palette: colors.map(c => ({
        name: getClosestColorName(c.hex),
        hex: c.hex,
        hsl: c.hsl,
        category: c.category,
        isNeutral: c.isNeutral
      }))
    };
  }

  function checkContrastRatio(colors) {
    if (colors.length < 2) return false;
    const minL = Math.min(...colors.map(c => c.hsl.l));
    const maxL = Math.max(...colors.map(c => c.hsl.l));
    return (maxL - minL) > 45;
  }

  function getScenarioRules(scenarioKey) {
    const scenarios = {
      night_party: {
        title: 'Night Party & Clubbing',
        icon: '🍸',
        timeOfDay: 'night',
        idealVibe: 'Sleek, dark foundations, bold texture, striking accent pop',
        allowsHighLowMix: true,
        recommendedHues: ['Obsidian Black', 'Midnight Navy', 'Emerald Velvet', 'Burgundy Wine', 'Chalk White']
      },
      romantic_date: {
        title: 'Romantic Dinner & Date',
        icon: '🍷',
        timeOfDay: 'evening',
        idealVibe: 'Rich, sensual tones, tailored silhouette, refined charm',
        allowsHighLowMix: false,
        recommendedHues: ['Burgundy Wine', 'Obsidian Black', 'Camel Tan', 'Forest Pine', 'Sandstone Cream']
      },
      business_formal: {
        title: 'Executive & Formal Business',
        icon: '💼',
        timeOfDay: 'day',
        idealVibe: 'Crisp neutrals, structured tailoring, understated luxury',
        allowsHighLowMix: false,
        recommendedHues: ['Midnight Navy', 'Charcoal Slate', 'Crisp White', 'Heather Gray', 'Rich Cognac']
      },
      casual_coffee: {
        title: 'Casual Weekend & Street',
        icon: '☕',
        timeOfDay: 'afternoon',
        idealVibe: 'Relaxed drape, organic earth tones, comfortable contrast',
        allowsHighLowMix: true,
        recommendedHues: ['Olive Utility', 'Sky Chambray', 'Heather Gray', 'Camel Tan', 'Chalk White']
      },
      summer_day: {
        title: 'Summer Outdoor & Festival',
        icon: '☀️',
        timeOfDay: 'morning',
        idealVibe: 'Linen whites, pastel airiness, vibrant sun warmth',
        allowsHighLowMix: true,
        recommendedHues: ['Chalk White', 'Sky Chambray', 'Sage Green', 'Sandstone Cream', 'Terracotta Clay']
      },
      autumn_layering: {
        title: 'Autumn/Winter Layered',
        icon: '🍂',
        timeOfDay: 'all_day',
        idealVibe: 'Earthy textures, cozy depth, camel & rust harmonies',
        allowsHighLowMix: true,
        recommendedHues: ['Camel Tan', 'Forest Pine', 'Terracotta Clay', 'Mustard Saffron', 'Charcoal Slate']
      }
    };
    return scenarios[scenarioKey] || scenarios.night_party;
  }

  function generateStylistAdvice(items, scenario, score, harmonyLabel) {
    const tips = [];
    const hasOuterwear = items.some(i => i.category === 'outerwear');
    const shoes = items.find(i => i.category === 'footwear');
    const socks = items.find(i => i.category === 'socks' || i.category === 'accessories');

    if (scenario === 'night_party') {
      tips.push('💡 **Lighting Strategy:** Dim party and lounge lighting softens subtle colors. High value contrast (like a white or emerald layer against black) makes you stand out crisply.');
      if (hasOuterwear) {
        tips.push('✨ **Layering Flexibility:** You can remove the jacket as the dancefloor heats up without compromising your core outfit harmony.');
      } else {
        tips.push('🧥 **Stylist Note:** Consider throwing on a structured jacket or leather overshirt if the venue moves outdoors or has night breezes.');
      }
      if (shoes) {
        tips.push(`👟 **Footwear Anchor:** Pairing ${shoes.name} establishes the formality tone—clean and sharp without feeling rigid.`);
      }
    } else if (scenario === 'romantic_date') {
      tips.push('🍷 **Proximity Impact:** In candlelit settings, rich undertones (burgundy, forest green, warm camel) evoke warmth, confidence, and approachable refinement.');
      tips.push('👔 **Texture Depth:** Mix differing fabric textures (e.g., wool knit, crisp cotton, smooth leather) to give the monochrome/tonal look dimensional luxury.');
    } else if (scenario === 'business_formal') {
      tips.push('💼 **Color Discipline:** Keeping to the 60-30-10 rule projects calm authority. Avoid more than one vibrant hue in boardroom settings.');
    } else {
      tips.push('🌿 **Effortless Coordination:** The natural color balance creates a relaxed yet intentionally curated look that feels put-together.');
    }

    if (socks) {
      tips.push(`🧦 **Detail Point:** The ${socks.name} bridges your trousers and footwear for an intentional sartorial punctuation.`);
    }

    return tips;
  }

  return {
    hexToRgb,
    rgbToHex,
    rgbToHsl,
    hexToHsl,
    hueDistance,
    isNeutral,
    getTone,
    getClosestColorName,
    evaluateColorPair,
    evaluateOutfitHarmony,
    getScenarioRules
  };
})();

// Export for browser or node environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ColorEngine;
}
