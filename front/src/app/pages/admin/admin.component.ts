import { Component } from '@angular/core';

// Interface pour typer les boutons
interface GameButton {
  label: string;
  handler: () => void;
}

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  // On utilise 'styles' ici pour intégrer le CSS nécessaire au jeu
  styles: [`
    .game-container {
      font-family: sans-serif;
      text-align: center;
      padding: 20px;
      min-height: 80vh; /* Prend de la place */
      transition: background-color 0.5s, color 0.5s;
      border-radius: 10px;
    }
    .abandon-state {
      background-color: black;
      color: white;
    }
    #output {
      margin: 30px 0;
      font-size: 1.5em;
      min-height: 2em;
      font-weight: 500;
    }
    .game-btn {
      margin: 10px;
      padding: 10px 20px;
      font-size: 1.1em;
    }
  `]
})
export class AdminComponent {
  // Variables d'état du jeu
  phoneNumber: (number | string)[] = Array(10).fill(10);
  currentDigit = 0;
  bottomLimit = 0;
  topLimit = 9;
  guess = 0;
  stage = 'choix';
  originalDigit = -1;
  messageSent = 0;
  wrongIndex = 0;
  failedGuess = 0;
  
  // Variables d'interface
  outputText = 'Veuillez renseigner votre numéro.';
  buttons: GameButton[] = [];
  isAbandoned = false;

  constructor() {
    this.wrongIndex = this.randomInt(1, 9);
    // Initialisation du premier bouton
    this.buttons = [{ label: 'Commencer', handler: () => this.startGame() }];
  }

  // --- Fonctions utilitaires ---

  randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  formatPhoneNumber(): string {
    return this.phoneNumber.map(d => d === 10 ? '?' : d).join('');
  }

  setButtons(actions: GameButton[]) {
    this.buttons = actions;
  }

  checkSoftlock(callback: () => void): boolean {
    if (this.bottomLimit > this.topLimit) {
      this.outputText = "Tu t'es trompé, non? On recommence!";
      this.bottomLimit = 0;
      this.topLimit = 9;
      // Pause pour afficher le message, puis relance la logique
      setTimeout(() => callback(), 1500);
      return true;
    }
    return false;
  }

  // --- Logique du jeu ---

  startGame() {
    this.currentDigit = 0;
    this.startDigitGuessing();
  }

  /** 1. Logique principale pour deviner les 10 chiffres */
  startDigitGuessing() {
    if (this.currentDigit >= 10) {
      this.injectWrongDigit();
      return;
    }

    // Réinitialisation pour la nouvelle tentative
    if (this.phoneNumber[this.currentDigit] !== 10) {
      this.currentDigit++;
      this.bottomLimit = 0;
      this.topLimit = 9;
      this.startDigitGuessing();
      return;
    }

    this.guess = this.randomInt(this.bottomLimit, this.topLimit);
    this.outputText = `Est-ce que le chiffre en position ${this.currentDigit + 1} est ${this.guess}?`;

    this.setButtons([
      { label: "Oui", handler: () => this.handleChoice('oui') },
      { label: "Non, c'est trop bas", handler: () => this.handleChoice('plus_haut') },
      { label: "Non, c'est trop haut", handler: () => this.handleChoice('plus_bas') }
    ]);
  }

  handleChoice(action: string) {
    const nextAction = () => this.startDigitGuessing();

    if (action === 'oui') {
      this.phoneNumber[this.currentDigit] = this.guess;
      this.currentDigit++;
      this.bottomLimit = 0;
      this.topLimit = 9;
    } else if (action === 'plus_haut') {
      this.bottomLimit = this.guess + 1;
    } else if (action === 'plus_bas') {
      this.topLimit = this.guess - 1;
    }

    if (!this.checkSoftlock(nextAction)) {
      nextAction();
    }
  }

  /** 2. Insertion d'un digit incorrect */
  injectWrongDigit() {
    let wrongValue = this.randomInt(0, 9);
    // S'assurer que la nouvelle valeur est différente
    while (wrongValue === this.phoneNumber[this.wrongIndex]) {
      wrongValue = this.randomInt(0, 9);
    }

    this.originalDigit = this.phoneNumber[this.wrongIndex] as number;
    this.phoneNumber[this.wrongIndex] = wrongValue;
    this.currentDigit = this.wrongIndex;

    this.stage = 'validation_initiale';
    this.outputText = `Ton numéro est bien ${this.formatPhoneNumber()}?`;

    this.setButtons([
      { label: "Oui", handler: () => this.handleInitialValidationYes() },
      { label: "Non", handler: () => this.startCorrectionPhase() }
    ]);
  }

  handleInitialValidationYes() {
    this.outputText += ' Es-tu sûr?';
    this.setButtons([
      { label: "Oui", handler: () => this.handleInitialValidationYes() },
      { label: "Non", handler: () => this.startCorrectionPhase() }
    ]);
  }

  /** 3. Phase de correction */
  startCorrectionPhase() {
    this.stage = 'correction';
    this.bottomLimit = 0;
    this.topLimit = 9;
    this.findWrongDigit();
  }

  /** Étape 3a. Recherche du chiffre incorrect */
  findWrongDigit() {
    if (this.phoneNumber[this.currentDigit] === this.originalDigit) {
      this.finalValidation();
      return;
    }

    let digitGuess = this.randomInt(this.bottomLimit, this.topLimit);
    
    if (this.messageSent === 0) {
      this.outputText = `Est-ce que le chiffre en position ${digitGuess + 1} est correct? (Numéro actuel: ${this.formatPhoneNumber()})`;
    }

    this.setButtons([
      { label: "Non", handler: () => this.handleDigitCorrection('non', digitGuess) },
      { label: "Oui, c'est un chiffre à gauche de celui-là qui est incorrect", handler: () => this.handleDigitCorrection('gauche', digitGuess) },
      { label: "Oui, c'est un chiffre à droite de celui-là qui est incorrect", handler: () => this.handleDigitCorrection('droite', digitGuess) }
    ]);
  }

  handleDigitCorrection(action: string, checkedPosition: number) {
    if (action === 'non') {
      if (checkedPosition === this.wrongIndex) {
        this.currentDigit = checkedPosition;
        this.bottomLimit = 0;
        this.topLimit = 9;
        this.guessTheValue();
        return;
      } else {
        this.outputText += " Hmm, je crois que ce chiffre est correct...";
        this.messageSent++;
        return;
      }
    } else if (action === 'gauche') {
      this.topLimit = checkedPosition - 1;
      this.messageSent = 0;
    } else if (action === 'droite') {
      this.bottomLimit = checkedPosition + 1;
      this.messageSent = 0;
    }

    if (!this.checkSoftlock(() => this.findWrongDigit())) {
      this.findWrongDigit();
    }
  }

  /** Étape 3b. Deviner la valeur du chiffre incorrect */
  guessTheValue() {
    this.guess = this.randomInt(this.bottomLimit, this.topLimit);
    if (this.failedGuess === 0) {
      this.outputText = `Est-ce que le chiffre en position ${this.currentDigit + 1} est ${this.guess}?`;
    } else {
      this.outputText = `Hmm, je ne crois pas... Est-ce que le chiffre en position ${this.currentDigit + 1} est ${this.guess}?`;
    }

    this.setButtons([
      { label: "Oui", handler: () => this.handleValueGuess('oui') },
      { label: "Non, c'est trop bas", handler: () => this.handleValueGuess('plus_haut') },
      { label: "Non, c'est trop haut", handler: () => this.handleValueGuess('plus_bas') }
    ]);
  }

  handleValueGuess(action: string) {
    if (action === 'oui') {
      if (this.guess === this.originalDigit) {
        this.phoneNumber[this.currentDigit] = this.guess;
        this.finalValidation();
      } else {
        this.bottomLimit = 0;
        this.topLimit = 9;
        this.failedGuess = 1;
        this.guessTheValue();
      }
      return;
    } else if (action === 'plus_haut') {
      this.bottomLimit = this.guess + 1;
    } else if (action === 'plus_bas') {
      this.topLimit = this.guess - 1;
    }

    if (!this.checkSoftlock(() => this.guessTheValue())) {
      this.guessTheValue();
    }
  }

  /** 4. Validation finale */
  finalValidation() {
    this.outputText = `Donc finalement, ton numéro est bien ${this.formatPhoneNumber()}?`;
    this.setButtons([
      { label: "Oui", handler: () => this.handleFinalValidationYes() },
      { label: "Non", handler: () => this.handleFinalValidationNo() }
    ]);
  }

  handleFinalValidationYes() {
    this.outputText = "Super! Merci!";
    this.setButtons([]);
  }

  handleFinalValidationNo() {
    this.isAbandoned = true; // Déclenche le fond noir via la classe CSS
    this.outputText = "Bon j'abandonne. Au revoir.";
    this.setButtons([]);
  }
}