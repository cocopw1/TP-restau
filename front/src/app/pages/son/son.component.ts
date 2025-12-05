import { Component, ElementRef, ViewChild, AfterViewInit, NgZone, OnDestroy, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface VortexCat {
  angle: number;
  distance: number;
  hue: number;
  scale: number;
  x: number;
  y: number;
  rotation: number;
  frequencyIndex: number; 
}

@Component({
  selector: 'app-son',
  templateUrl: './son.component.html',
  styleUrls: ['./son.component.css']
})
export class SonComponent implements AfterViewInit, OnDestroy {
  @ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>;

  tracks = [
    { name: 'Cradles', path: '/sound/SubUrban-CRADLES.mp3' },
    { name: 'Royalty', path: '/sound/Neoni-Royalty.mp3' },
    { name: 'Grateful', path: '/sound/NEFFEX-Grateful.mp3' }
  ];

  currentTrack = this.tracks[0].path; 
  isPlaying = false;
  
  cats: VortexCat[] = [];
  
  centerX = 0;
  centerY = 0;
  globalRotation = 0; 
  baseRadius = 200; 

  private audioContext!: AudioContext;
  private analyser!: AnalyserNode;
  private animationFrameId: number | null = null;

  constructor(
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initVortex();
      this.initAudioContext();
      this.renderLoop(); // Lance la boucle tout de suite
    }
  }

  

private initAudioContext() {
  if (!this.audioContext) {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 512;
    const source = this.audioContext.createMediaElementSource(this.audioPlayerRef.nativeElement);
    source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
  }
}

  initVortex() {
    this.centerX = window.innerWidth / 2;
    this.centerY = window.innerHeight / 2;
    this.cats = [];

    const numberOfCats = 10;
    
    for (let i = 0; i < numberOfCats; i++) {
      this.cats.push({
        angle: (i / numberOfCats) * (Math.PI * 2),
        distance: this.baseRadius,
        hue: (i / numberOfCats) * 360,
        scale: 1,
        x: 0, 
        y: 0,
        rotation: 0,
        frequencyIndex: i * 4 
      });
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.centerX = window.innerWidth / 2;
    this.centerY = window.innerHeight / 2;
  }

  @HostListener('document:click')
  handleUserInteraction() { 
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    if (!this.isPlaying) {
      this.audioPlayerRef.nativeElement.play();
      this.isPlaying = true;
    }
  }

  changeTrack(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.isPlaying = true;
    this.audioPlayerRef.nativeElement.pause();
    this.currentTrack = selectElement.value;
    setTimeout(() => {
      this.audioPlayerRef.nativeElement.load();
      this.tryStartAudio(true);
    }, 100);
  }

  tryStartAudio(forcePlay: boolean) {
    if (!isPlatformBrowser(this.platformId)) return;
    if (forcePlay) {
      this.audioPlayerRef.nativeElement.play().catch(err => console.log("Lecture bloquée"));
    }
  }

  renderLoop() {
    this.animationFrameId = requestAnimationFrame(() => this.renderLoop());

    if (!this.isPlaying) {
      return;
    }

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);

    const globalEnergy = this.getAverage(dataArray, 0, 40);
    this.globalRotation += 0.002 + (globalEnergy / 25000); 

    this.cats.forEach((cat, i) => {
       const dataIndex = Math.floor(cat.frequencyIndex);
       const safeIndex = Math.min(dataIndex, bufferLength - 1);
       
       const rawIntensity = dataArray[safeIndex];

       // --- ÉGALISEUR ---
       let adjustedIntensity = 0;
       if (safeIndex < 5) {
         adjustedIntensity = rawIntensity * 0.9; // Basses
       } else if (safeIndex < 20) {
         adjustedIntensity = rawIntensity * 1.5; // Mediums
       } else {
         adjustedIntensity = rawIntensity *1.0; // Aigus (Boostés)
       }

       // --- VISUEL ---
       
       const bounce = adjustedIntensity * 0.5; 
       const currentRadius = this.baseRadius + bounce;

       cat.x = this.centerX + Math.cos(cat.angle + this.globalRotation) * currentRadius;
       cat.y = this.centerY + Math.sin(cat.angle + this.globalRotation) * currentRadius;

       cat.scale = 1.0 + (adjustedIntensity / 300);

       cat.rotation = (cat.angle + this.globalRotation) * (180 / Math.PI) + 90;

       cat.hue = (i * 30 + (globalEnergy / 10)) % 360; 
    });

    this.ngZone.run(() => { /* Update View */ });
  }

  private getAverage(array: Uint8Array, start: number, end: number): number {
    let sum = 0;
    for (let i = start; i < end; i++) sum += array[i];
    return sum / (end - start || 1);
  }

  stopAnimationLoop() { if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId); }

  ngOnDestroy() {
    this.stopAnimationLoop();
    if (this.audioContext && this.audioContext.state !== 'closed') this.audioContext.close();
  }
}