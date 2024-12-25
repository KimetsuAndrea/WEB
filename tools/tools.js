export function delay(ms) {
  return new Promise((i) => setTimeout(i, ms));
}

export class Colors {
  constructor(color) {
    if (typeof color === "string") {
      if (color.startsWith("#")) {
        this.hex = color;
        this.rgb = Colors.hexToRgb(color);
        this.hsl = Colors.rgbToHsl(this.rgb.r, this.rgb.g, this.rgb.b);
      }
    } else if (Array.isArray(color)) {
      if (color.length === 3) {
        this.rgb = { r: color[0], g: color[1], b: color[2] };
        this.hex = Colors.rgbToHex(this.rgb.r, this.rgb.g, this.rgb.b);
        this.hsl = Colors.rgbToHsl(this.rgb.r, this.rgb.g, this.rgb.b);
      } else if (color.length === 4) {
        this.rgb = { r: color[0], g: color[1], b: color[2], a: color[3] };
        this.hex = Colors.rgbToHex(
          this.rgb.r,
          this.rgb.g,
          this.rgb.b,
          this.rgb.a
        );
        this.hsl = Colors.rgbToHsl(this.rgb.r, this.rgb.g, this.rgb.b);
      }
    } else if (color && typeof color === "object") {
      // HSL object (e.g., { h: 360, s: 100, l: 50 })
      if ("h" in color && "s" in color && "l" in color) {
        this.hsl = color;
        this.rgb = Colors.hslToRgb(color.h, color.s, color.l);
        this.hex = Colors.rgbToHex(this.rgb.r, this.rgb.g, this.rgb.b);
      }
    }
  }

  static rgbToHex(r, g, b, a = 1) {
    if (a < 1) {
      r = Math.round(r * a + (1 - a) * 255);
      g = Math.round(g * a + (1 - a) * 255);
      b = Math.round(b * a + (1 - a) * 255);
    }
    return `#${((1 << 24) | (r << 16) | (g << 8) | b)
      .toString(16)
      .slice(1)
      .toUpperCase()}`;
  }

  static hexToRgb(hex) {
    const match = hex.replace("#", "").match(/.{1,2}/g);
    return match
      ? {
          r: parseInt(match[0], 16),
          g: parseInt(match[1], 16),
          b: parseInt(match[2], 16),
        }
      : null;
  }

  static rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const hsl = { h: 0, s: 0, l: (max + min) / 2 };

    const delta = max - min;
    if (delta !== 0) {
      hsl.s = delta / (1 - Math.abs(2 * hsl.l - 1));
      switch (max) {
        case r:
          hsl.h = (g - b) / delta + (g < b ? 6 : 0);
          break;
        case g:
          hsl.h = (b - r) / delta + 2;
          break;
        case b:
          hsl.h = (r - g) / delta + 4;
          break;
      }
      hsl.h /= 6;
    }

    hsl.h *= 360;
    hsl.s *= 100;
    hsl.l *= 100;

    return hsl;
  }

  static hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let rgb;
    if (h >= 0 && h < 60) rgb = [c, x, 0];
    else if (h >= 60 && h < 120) rgb = [x, c, 0];
    else if (h >= 120 && h < 180) rgb = [0, c, x];
    else if (h >= 180 && h < 240) rgb = [0, x, c];
    else if (h >= 240 && h < 300) rgb = [x, 0, c];
    else rgb = [c, 0, x];

    return {
      r: Math.round((rgb[0] + m) * 255),
      g: Math.round((rgb[1] + m) * 255),
      b: Math.round((rgb[2] + m) * 255),
    };
  }

  applyHsl(hAdjustment = 0, sAdjustment = 0, lAdjustment = 0) {
    const adjustedHsl = { ...this.hsl };
    adjustedHsl.h = (adjustedHsl.h + hAdjustment) % 360;
    adjustedHsl.s = Math.min(100, Math.max(0, adjustedHsl.s + sAdjustment));
    adjustedHsl.l = Math.min(100, Math.max(0, adjustedHsl.l + lAdjustment));
    const newRgb = Colors.hslToRgb(adjustedHsl.h, adjustedHsl.s, adjustedHsl.l);
    const newHex = Colors.rgbToHex(newRgb.r, newRgb.g, newRgb.b);

    return new Colors(newHex);
  }

  absSL(sValue = this.hsl.s, lValue = this.hsl.l) {
    const adjustedHsl = { ...this.hsl };
    adjustedHsl.s = Math.min(100, Math.max(0, sValue));
    adjustedHsl.l = Math.min(100, Math.max(0, lValue));

    const newRgb = Colors.hslToRgb(adjustedHsl.h, adjustedHsl.s, adjustedHsl.l);

    const newHex = Colors.rgbToHex(newRgb.r, newRgb.g, newRgb.b);

    return new Colors(newHex);
  }

  getL() {
    return this.hsl.l;
  }

  getS() {
    return this.hsl.s;
  }

  applyHslRelative(hPercentage = 0, sPercentage = 0, lPercentage = 0) {
    const adjustedHsl = { ...this.hsl };

    adjustedHsl.h = (adjustedHsl.h + hPercentage * 360) % 360;
    adjustedHsl.s = Math.min(
      100,
      Math.max(0, adjustedHsl.s * (1 + sPercentage))
    );
    adjustedHsl.l = Math.min(
      100,
      Math.max(0, adjustedHsl.l * (1 + lPercentage))
    );
    const newRgb = Colors.hslToRgb(adjustedHsl.h, adjustedHsl.s, adjustedHsl.l);
    const newHex = Colors.rgbToHex(newRgb.r, newRgb.g, newRgb.b);

    return new Colors(newHex);
  }

  mix(dominantColor, dominant = 0.5) {
    const dominantRgb = dominantColor.rgb || dominantColor;
    const newR = Math.round(
      this.rgb.r * (1 - dominant) + dominantRgb.r * dominant
    );
    const newG = Math.round(
      this.rgb.g * (1 - dominant) + dominantRgb.g * dominant
    );
    const newB = Math.round(
      this.rgb.b * (1 - dominant) + dominantRgb.b * dominant
    );
    const newHex = Colors.rgbToHex(newR, newG, newB);

    return new Colors(newHex);
  }

  getType() {
    if (this.hex) return "HEX";
    if (this.rgb) return "RGB";
    if (this.hsl) return "HSL";
    return "Unknown";
  }

  getHex() {
    return this.hex;
  }

  getRgb() {
    return this.rgb;
  }

  getHsl() {
    return this.hsl;
  }

  bnw() {
    return this.absSL(0, this.getL());
  }
  /**
   *
   * @param {string} imageUrl
   * @returns {Promise<Colors>}
   */
  static async extractDominantColor(imageUrl) {
    return new Promise((callback) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        let r = 0,
          g = 0,
          b = 0;
        let pixelCount = pixels.length / 4;

        for (let i = 0; i < pixels.length; i += 4) {
          r += pixels[i];
          g += pixels[i + 1];
          b += pixels[i + 2];
        }

        r = Math.round(r / pixelCount);
        g = Math.round(g / pixelCount);
        b = Math.round(b / pixelCount);

        callback(new Colors([r, g, b]));
      };
      img.src = imageUrl;
    });
  }

  applyOpacity(opacity) {
    const clampedOpacity = Math.min(1, Math.max(0, opacity));

    if (this.rgb.a !== undefined) {
      this.rgb.a = clampedOpacity;
    } else {
      this.rgb = { ...this.rgb, a: clampedOpacity };
    }

    const hex = Colors.rgbToHex(this.rgb.r, this.rgb.g, this.rgb.b, this.rgb.a);

    return new Colors(hex);
  }

  static setCSS(key, value, target = document.documentElement) {
    target.style.setProperty(key, value);
  }

  static youNames = [
    "--ml-1",
    "--ml-2",
    "--ml-3",
    "--ml-4",
    "--ml-5",
    "--ml-6",
    "--ml-7",
    "--ml-8",
    "--ml-bg",
    "--ml-error",
    "--ml-success",
    "--ml-warning",
    "--ml-info",
    "--ml-surface",
    "--ml-text",
    "--ml-text-light",
    "--ml-border",
    "--ml-white",
    "--m-3",
    "--m-bg",
    "--m-1",
    "--m-4",
    "--m-header",
    "--old-acc",
    "--old-dark",
    "--old-c",
  ];
  static orig = [];

  static async autoYou(url, target = document.body) {
    const styles = getComputedStyle(target);
    const allVars = this.youNames.map((i) => [
      i,
      new Colors(styles.getPropertyValue(i)),
    ]);
    console.log(allVars);
    this.orig = allVars;

    const dominant =
      url instanceof Colors ? url : await Colors.extractDominantColor(url);

    for (const [key, color] of allVars) {
      const s = color.getS();
      const l = color.getL();
      const newColor = dominant.absSL(s, l);
      // this.setCSS(key, newColor.getHex());
      this.cache.push([key, newColor]);
    }
    if (this.isDark) {
      this.toggleDarkMode();
    } else {
      this.toggleLightMode();
    }
  }

  flipLightness() {
    const s = this.getS();
    const l = this.getL();
    const newColor = this.absSL(s, 100 - l);
    return newColor;
  }

  static isAdaptive = true;

  static async disableAdaptiveMode() {
    this.isAdaptive = false;

    return this.isDark ? this.toggleDarkMode() : this.toggleLightMode();
  }

  static async enableAdaptiveMode() {
    this.isAdaptive = true;
    return this.isDark ? this.toggleDarkMode() : this.toggleLightMode();
  }
  static cache = [];

  static async toggleDarkMode() {
    this.isDark = true;
    for (const [key, color] of this.isAdaptive ? this.cache : this.orig) {
      const l = color.getL();
      const newColor = color.absSL(
        color.getS(),
        100 - (l > 50 ? l + 2 : l - 15)
      );
      this.setCSS(key, newColor.getHex());
    }
    for (const [key, color] of this.isAdaptive ? this.cache : this.orig) {
      const l = color.getL();
      const newColor = color.absSL(
        color.getS(),
        100 - (l > 50 ? l + 2 : l - 15)
      );
      this.setCSS(key + "--bnw", newColor.bnw().getHex());
    }
  }

  static async toggleLightMode() {
    this.isDark = false;
    for (const [key, color] of this.isAdaptive ? this.cache : this.orig) {
      this.setCSS(key, color.getHex());
    }
    for (const [key, color] of this.isAdaptive ? this.cache : this.orig) {
      this.setCSS(key + "--bnw", color.bnw().getHex());
    }
  }
}
