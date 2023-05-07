
const game = (function () {

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  const BLACK = '#000';
  const WHITE = '#FFF';
  const GREEN = '#0F0';
  const RED = '#F00';
  const BLUE = '#00F';
  const SCREEN_WIDTH = 288;
  const SCREEN_HEIGHT = 512;

  const birdImg = new Image();
  birdImg.src = 'assets/img/yellowbird-midflap.png';
  const bgImg = new Image();
  bgImg.src = 'assets/img/background-day.png';
  const pipeImg = new Image();
  pipeImg.src = 'assets/img/pipe-green.png';

  const flapSound = new Audio('assets/audio/wing.ogg');
  const pointSound = new Audio('assets/audio/point.ogg');
  const hitSound = new Audio('assets/audio/hit.ogg');

  // Объект птички
  const bird = {
    x: 50,
    y: 150,
    width: 34,
    height: 24,
    speedY: 0,
    gravity: 0.5,
    jumpForce: -10,
    draw: function () {
      ctx.drawImage(birdImg, this.x, this.y);
    },
    update: function () {
      this.speedY += this.gravity;
      this.y += this.speedY;
    },
    flap: function () {
      this.speedY = this.jumpForce;
      flapSound.play();
    },
    isColliding: function (pipe) {
      if (this.x + this.width < pipe.x ||
        this.x > pipe.x + pipe.width ||
        this.y + this.height < pipe.y ||
        this.y > pipe.y + pipe.height) {
        return false;
      }
      return true;
    }
  };


  // Объект труб
  const pipes = {
    top: [],
    bottom: [],
    width: 52,
    height: 320,
    gap: 100,
    speed: 2,
    spawnInterval: 90,
    timer: 0,
    score: 0,
    draw: function () {
      for (let i = 0; i < this.top.length; i++) {
        ctx.drawImage(pipeImg, this.top[i].x, this.top[i].y, this.width, this.height);
        ctx.drawImage(pipeImg, this.bottom[i].x, this.bottom[i].y, this.width, this.height);
      }
    },
    update: function () {
      if (this.timer === 0) {
        const topY = - (Math.random() * 200 + 50);
        const bottomY = topY + this.height + this.gap;
        this.top.push({
          x: SCREEN_WIDTH,
          y: topY,
          counted: false
        });
        this.bottom.push({
          x: SCREEN_WIDTH,
          y: bottomY,
          counted: false
        });
        this.timer = this.spawnInterval;
      } else {
        this.timer--;
      }
      for (let i = 0; i < this.top.length; i++) {
        this.top[i].x -= this.speed;
        this.bottom[i].x -= this.speed;

        if (bird.isColliding(this.top[i]) || bird.isColliding(this.bottom[i])) {
          hitSound.play();
          setTimeout(function () {
            alert('Game over');
            location.reload();
          }, 100);
          break;
        }

        if (this.top[i].x + this.width < bird.x && !this.top[i].counted) {
          this.score++;
          pointSound.play();
          this.top[i].counted = true;
        }

        if (this.top[i].x + this.width < 0) {
          this.top.shift();
          this.bottom.shift();
          i--;
        }
      }

    },// закрываем объект pipes
  };

  function update() {
    ctx.fillStyle = WHITE;
    ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Рисуем задний фон
    ctx.drawImage(bgImg, 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Обновляем и рисуем птичку
    bird.update();
    bird.draw();

    // Обновляем и рисуем трубы
    pipes.update();
    pipes.draw();

    // Рисуем счет
    ctx.fillStyle = BLACK;
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + pipes.score, 10, 25);

    // Проверяем столкновение с землей
    if (bird.y + bird.height > SCREEN_HEIGHT - 10) {
      hitSound.play();
      setTimeout(function () {
        alert('Game over');
        location.reload();
      }, 100);
    }

    // Запрашиваем следующий кадр анимации
    requestAnimationFrame(update);
  }

  // Обработчик нажатия на клавишу
  function handleKeyDown(event) {
    if (event.code === 'Space') {
      bird.flap();
    }
  }

  // Начинаем игру при загрузке страницы
  window.onload = function () {
    // Задаем размер canvas
    canvas.width = SCREEN_WIDTH;
    canvas.height = SCREEN_HEIGHT;
    // Начинаем анимацию
    requestAnimationFrame(update);

    // Добавляем обработчик нажатия на клавишу
    document.addEventListener('keydown', handleKeyDown);
  };


  return {
    bird,
    pipes
  };
})();


