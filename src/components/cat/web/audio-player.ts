// --- Export class ---
export class CAudioPlayer extends HTMLElement {
  private data = "";
  private context: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: MediaElementAudioSourceNode | null = null;
  private freqData: Uint8Array<ArrayBuffer> | null = null;
  private animation: number | null = null;
  private cvsContext: CanvasRenderingContext2D | null = null;
  private isSeeking = false;

  private get audio() {
    return this.querySelector<HTMLAudioElement>("#audio");
  }
  private get canvas() {
    return this.querySelector("canvas")!;
  }
  private get name() {
    return this.querySelector<HTMLHeadingElement>("#title")!;
  }
  private get currentTime() {
    return this.querySelector<HTMLSpanElement>("#current-time")!;
  }
  private get progress() {
    return this.querySelector<HTMLInputElement>("#progress")!;
  }
  private get duration() {
    return this.querySelector<HTMLSpanElement>("#duration")!;
  }
  private get btnPlayPause() {
    return this.querySelector<HTMLButtonElement>("#play-pause")!;
  }
  private get btnStop() {
    return this.querySelector<HTMLButtonElement>("#stop")!;
  }
  private get btnDownload() {
    return this.querySelector<HTMLButtonElement>("#download")!;
  }
  private get volume() {
    return this.querySelector<HTMLInputElement>("#volume")!;
  }

  public connectedCallback() {
    this.btnPlayPause.addEventListener("click", async () => {
      if (!this.audio) return;
      if (this.audio.paused) {
        await this.play();
      } else {
        this.audio.pause();
      }
    });

    this.btnStop.addEventListener("click", () => this.stop());

    this.btnDownload.addEventListener("click", async () => {
      if (!this.data) return;
      const link = document.createElement("a");

      let objectUrl: string | null = null;
      try {
        const response = await fetch(this.data);
        if (!response.ok) {
          throw new Error(`Download failed: ${response.status}`);
        }
        objectUrl = URL.createObjectURL(await response.blob());
        link.href = objectUrl;
      } catch {
        link.href = this.data;
      }

      link.download = this.name.textContent.trim();
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      link.remove();

      if (objectUrl) URL.revokeObjectURL(objectUrl);
    });

    this.progress.addEventListener("pointerdown", () => {
      this.isSeeking = true;
    });
    this.progress.addEventListener("pointerup", () => {
      if (!this.audio) return;
      this.audio.currentTime = Number(this.progress.value);
      this.isSeeking = false;
    });
    this.progress.addEventListener("input", () => {
      if (!this.audio) return;
      const v = Number(this.progress.value);
      this.currentTime.textContent = this.fmtTime(v);
      if (Number.isFinite(this.audio.duration)) {
        this.audio.currentTime = v;
      }
    });

    this.volume.addEventListener("input", () => {
      if (!this.audio) return;
      this.audio.volume = Number(this.volume.value);
    });

    window.addEventListener("resize", this.setCanvasSize);

    this.cvsContext = this.canvas.getContext("2d");
    this.drawVisual();
  }

  public disconnectedCallback() {
    if (this.animation) cancelAnimationFrame(this.animation);
    window.removeEventListener("resize", this.setCanvasSize);
  }

  public init(name: string, src: string) {
    // --- Cleanup ---
    this.source = null;
    this.analyser = null;
    this.context?.close();
    this.context = null;
    this.audio?.remove();
    this.progress.value = "0";
    this.currentTime.textContent = "0:00";

    // --- Inject ---
    const ael = document.createElement("audio");
    ael.crossOrigin = "anonymous";
    ael.id = "audio";
    ael.preload = "metadata";
    ael.volume = Number(this.volume.value);

    const sel = document.createElement("source");
    sel.src = src;
    ael.appendChild(sel);

    this.prepend(ael);

    // --- Bind ---
    ael.addEventListener("loadedmetadata", () => {
      this.progress.max = String(ael.duration);
      this.duration.textContent = this.fmtTime(ael.duration);
    });
    ael.addEventListener("durationchange", () => {
      if (Number.isFinite(ael.duration)) {
        this.progress.max = String(ael.duration);
        this.duration.textContent = this.fmtTime(ael.duration);
      }
    });
    ael.addEventListener("timeupdate", () => {
      if (!this.isSeeking) {
        this.progress.value = String(ael.currentTime);
      }
      this.currentTime.textContent = this.fmtTime(ael.currentTime);
    });
    ael.addEventListener("ended", () => {
      ael.currentTime = 0;
      this.progress.value = "0";
      this.currentTime.textContent = "0:00";
    });

    // --- Setup ---
    this.isSeeking = false;
    this.name.textContent = name;
    this.data = src;

    this.context = new AudioContext();
    this.analyser = this.context.createAnalyser();
    this.source = this.context.createMediaElementSource(this.audio!);

    this.analyser.fftSize = 512;
    this.analyser.smoothingTimeConstant = 0.8;
    this.freqData = new Uint8Array(this.analyser.frequencyBinCount);

    this.source.connect(this.analyser);
    this.analyser.connect(this.context.destination);

    this.setCanvasSize();
  }

  public async play() {
    this.setCanvasSize();
    if (!this.audio) return;

    if (this.context?.state === "suspended") {
      await this.context.resume();
    }
    await this.audio.play();
  }

  public stop() {
    if (!this.audio) return;

    this.audio.pause();
    this.audio.currentTime = 0;
    this.progress.value = "0";
    this.currentTime.textContent = "0:00";
  }

  private drawVisual = () => {
    this.animation = requestAnimationFrame(this.drawVisual);

    const width = this.canvas.width;
    const height = this.canvas.height;
    const pix = window.devicePixelRatio;

    this.cvsContext!.clearRect(0, 0, width, height);

    if (!this.context || !this.analyser || !this.freqData) return;
    this.analyser.getByteFrequencyData(this.freqData);

    const barCount = 16;
    const gapWidth = width / barCount;
    const barWidth = Math.min(10 * pix, gapWidth);

    for (let index = 0; index < barCount; index++) {
      const minFrequency = 20;
      const maxFrequency = this.context.sampleRate / 2;

      const frequency =
        minFrequency *
        Math.pow(maxFrequency / minFrequency, index / (barCount - 1));

      const dataIndex = Math.min(
        this.freqData.length - 1,
        Math.round((frequency / maxFrequency) * (this.freqData.length - 1)),
      );

      const amplitude = this.freqData[dataIndex] / 255;
      const barHeight = Math.max(3 * pix, amplitude * height * 0.9);

      const x = index * gapWidth + (gapWidth - barWidth) / 2;
      const y = (height - barHeight) / 2;

      this.cvsContext!.fillStyle = "#fff";

      this.cvsContext!.fillRect(0, (height - pix) / 2, width, pix);
      this.cvsContext!.beginPath();
      this.cvsContext!.roundRect(x, y, barWidth, barHeight, barWidth / 2);
      this.cvsContext!.fill();
    }
  };

  private setCanvasSize = () => {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = Math.round(rect.width * window.devicePixelRatio);
    this.canvas.height = Math.round(rect.height * window.devicePixelRatio);
  };

  private fmtTime(sec: number) {
    if (!Number.isFinite(sec)) return "0:00";

    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60)
      .toString()
      .padStart(2, "0");

    return `${m}:${s}`;
  }
}

// Register element
customElements.define("c-audio-player", CAudioPlayer);
