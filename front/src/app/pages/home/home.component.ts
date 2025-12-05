import { Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnDestroy {
  @ViewChild('snakeCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  
  isSnakeVisible = false;
  score = 0;
  
  // Game state
  private snake: {x: number, y: number}[] = [];
  private dir = {x: 1, y: 0};
  private nextDir = {x: 1, y: 0};
  private food = {x: 0, y: 0};
  private intervalId: any;
  private cols = 20;
  private rows = 20;
  private tileSize = 20; // 400px / 20 cols
  
  toggleSnake() {
    this.isSnakeVisible = !this.isSnakeVisible;
    
    if (this.isSnakeVisible) {
      // On attend que le HTML s'affiche (ngIf) avant de lancer
      setTimeout(() => this.startSnake(), 0);
    } else {
      this.stopSnake();
    }
  }

  startSnake() {
    this.stopSnake();
    this.resetGame();
    // Vitesse du jeu
    this.intervalId = setInterval(() => this.stepSnake(), 100);
  }

  stopSnake() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  resetGame() {
    this.snake = [
      {x: 9, y: 10},
      {x: 8, y: 10},
      {x: 7, y: 10}
    ];
    this.dir = {x: 1, y: 0};
    this.nextDir = {x: 1, y: 0};
    this.score = 0;
    this.placeFood();
  }

  placeFood() {
    const occupied = new Set(this.snake.map(s => s.x + "," + s.y));
    let x, y;
    do {
      x = Math.floor(Math.random() * this.cols);
      y = Math.floor(Math.random() * this.rows);
    } while (occupied.has(x + "," + y));
    this.food = {x, y};
  }

  stepSnake() {
    // Empêcher le demi-tour immédiat
    if (this.nextDir.x !== -this.dir.x || this.nextDir.y !== -this.dir.y) {
      this.dir = this.nextDir;
    }

    const head = {x: this.snake[0].x + this.dir.x, y: this.snake[0].y + this.dir.y};

    // Collision murs
    if (head.x < 0 || head.x >= this.cols || head.y < 0 || head.y >= this.rows) {
      return this.resetGame();
    }

    // Collision soi-même
    if (this.snake.some(s => s.x === head.x && s.y === head.y)) {
      return this.resetGame();
    }

    this.snake.unshift(head);

    // Manger la pomme
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      this.placeFood();
    } else {
      this.snake.pop();
    }

    this.drawSnake();
  }

  drawSnake() {
    if (!this.canvasRef) return;
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Fond
    ctx.fillStyle = "#0b1220";
    ctx.fillRect(0, 0, 400, 400);

    // Pomme
    ctx.fillStyle = "#fb7185";
    ctx.fillRect(
      this.food.x * this.tileSize + 3, 
      this.food.y * this.tileSize + 3, 
      this.tileSize - 6, 
      this.tileSize - 6
    );

    // Serpent
    ctx.fillStyle = "#34d399";
    this.snake.forEach((s) => {
      ctx.fillRect(
        s.x * this.tileSize + 2, 
        s.y * this.tileSize + 2, 
        this.tileSize - 4, 
        this.tileSize - 4
      );
    });
  }

  // Écoute des touches clavier
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.isSnakeVisible) return;

    // Empêcher le scroll de la page avec les flèches quand on joue
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].indexOf(event.code) > -1) {
        event.preventDefault();
    }

    if (event.code === "ArrowUp" || event.code === "KeyW") {
        if (this.dir.y === 0) this.nextDir = {x: 0, y: -1};
    }
    else if (event.code === "ArrowDown" || event.code === "KeyS") {
        if (this.dir.y === 0) this.nextDir = {x: 0, y: 1};
    }
    else if (event.code === "ArrowLeft" || event.code === "KeyA") {
        if (this.dir.x === 0) this.nextDir = {x: -1, y: 0};
    }
    else if (event.code === "ArrowRight" || event.code === "KeyD") {
        if (this.dir.x === 0) this.nextDir = {x: 1, y: 0};
    }
    else if (event.code === "Space") {
        this.startSnake();   
    }
  }

  // Nettoyage quand on quitte la page
  ngOnDestroy() {
    this.stopSnake();
  }
}