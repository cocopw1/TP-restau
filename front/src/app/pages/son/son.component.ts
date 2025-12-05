import { Component, ElementRef, ViewChild, AfterViewInit, NgZone, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-son',
  templateUrl: './son.component.html',
  styleUrls: ['./son.component.css']
})
export class SonComponent implements AfterViewInit, OnDestroy {
  @ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>;

  currentTrack = 'sound/cacaestcuit.mp3'; // Chemin dans public/
  isPlaying = false;
  
  // Variables pour la hauteur du saut (en pixels)
  bassLevel = 0;
  midLevel = 0;
  trebleLevel = 0;

  private audioContext!: AudioContext;
  private analyser!: AnalyserNode;
  private source!: MediaElementAudioSourceNode;
  private animationFrameId: number | null = null;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit() {
    // On n'initialise l'audio qu'au clic pour respecter les règles du navigateur
  }

  initAudio() {
    if (this.audioContext) return;

    // 1. Création du contexte
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // 2. Création de l'analyser
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 512; // Résolution (plus c'est haut, plus c'est précis mais coûteux)

    // 3. Connexion de la source HTML Audio -> Analyser -> Sortie (Haut-parleurs)
    this.source = this.audioContext.createMediaElementSource(this.audioPlayerRef.nativeElement);
    this.source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
  }

  togglePlay() {
    const audioEl = this.audioPlayerRef.nativeElement;

    if (!this.audioContext) {
      this.initAudio();
    }

    // Reprendre le contexte s'il est suspendu (règle autoplay browser)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    if (this.isPlaying) {
      audioEl.pause();
      this.isPlaying = false;
      this.stopAnimationLoop();
    } else {
      audioEl.play();
      this.isPlaying = true;
      // On lance la boucle d'analyse hors de la zone Angular pour la perf
      this.ngZone.runOutsideAngular(() => {
        this.renderLoop();
      });
    }
  }

  // La boucle d'animation (60fps)
  renderLoop() {
    if (!this.isPlaying) return;

    this.animationFrameId = requestAnimationFrame(() => this.renderLoop());

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    // Remplir le tableau avec les données de fréquence actuelles (0 à 255)
    this.analyser.getByteFrequencyData(dataArray);

    // Découpage approximatif du spectre
    // Basses : début du tableau
    // Médiums : milieu
    // Aigus : fin
    
    const bassAvg = this.getAverage(dataArray, 0, bufferLength * 0.1); // 10% inférieurs
    const midAvg = this.getAverage(dataArray, bufferLength * 0.1, bufferLength * 0.5); 
    const trebleAvg = this.getAverage(dataArray, bufferLength * 0.5, bufferLength); 

    // Mise à jour des variables visuelles (Multiplicateur pour ajuster la hauteur du saut)
    // On utilise ngZone.run pour dire à Angular de mettre à jour la vue
    this.ngZone.run(() => {
      this.bassLevel = Math.max(0, (bassAvg - 100) * 1.5); // -100 pour ignorer le bruit de fond
      this.midLevel = Math.max(0, (midAvg - 50) * 1.5);
      this.trebleLevel = Math.max(0, (trebleAvg - 30) * 2); 
    });
  }

  // Utilitaire pour calculer la moyenne d'une plage de fréquences
  private getAverage(array: Uint8Array, start: number, end: number): number {
    let sum = 0;
    const count = end - start;
    for (let i = Math.floor(start); i < Math.floor(end); i++) {
      sum += array[i];
    }
    return count > 0 ? sum / count : 0;
  }

  stopAnimationLoop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.bassLevel = 0;
    this.midLevel = 0;
    this.trebleLevel = 0;
  }

  ngOnDestroy() {
    this.stopAnimationLoop();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}