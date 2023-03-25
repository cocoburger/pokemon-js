const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');


canvas.width = 1024;
canvas.height = 576;

// 전체 픽셀에서 충돌 픽셀만 구해야 하는데 양이 많기 때문에 70개씩 자름
const collisionsMap = [];
for ( let i = 0; i < collisions.length; i += 70 ) {
  collisionsMap.push(collisions.slice(i, 70 + i));
}

class Boundary {
  static width = 48;
  static height = 48;

  constructor( { position } ) {
    this.position = position;
    this.width = 48;
    this.height = 48;
  }

  draw() {
    c.fillStyle = 'rgba(255, 0, 0, 0.0)';
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

const boundaries = [];
const offset = {
  x: -735,
  y: -650
};

// 1025 값은 충돌막이므로 바운더리에 값을 넣어준다.
collisionsMap.forEach(( row, i ) => {
  row.forEach(( symbol, j ) => {
    if ( symbol === 1025 ) {
      boundaries.push(new Boundary({
        position: {
          x: j * Boundary.width + offset.x,
          y: i * Boundary.height + offset.y
        }
      }));
    }
  });
});

const image = new Image();
image.src = './img/Pellet Town.png';

const playerImage = new Image();
playerImage.src = './img/playerDown.png';

class Sprite {
  constructor( {
                 position,
                 velocity,
                 image,
                 frames = { max: 1 }
               } ) {
    this.position = position;
    this.image = image;
    this.frames = frames;
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
      console.log(this.width);
      console.log(this.height);

    };
  }

  draw() {
    c.drawImage(
        this.image,
        0,
        0,
        this.image.width / this.frames.max,
        this.image.height,
        this.position.x,
        this.position.y,
        this.image.width / this.frames.max,
        this.image.height,
    ); // 캐릭터의 시작 위치
  }
}


const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerImage,
  frames: {
    max: 4
  }
});

const background = new Sprite({ position: { x: offset.x, y: offset.y }, image: image });

const keys = {
  w: {
    pressed: false
  },
  a: {
    pressed: false
  },
  s: {
    pressed: false
  },
  d: {
    pressed: false
  }
};

const testBoundary = new Boundary({
  position: {
    x: 400,
    y: 400
  }
});
const movables = [ background, ...boundaries ];

function rectangleCollision( { rect1, rect2 } ) {
  return (
      rect1.position.x + rect1.width >= rect2.position.x
      && rect1.position.x <= rect2.position.x + rect2.width
      && rect1.position.y <= rect2.position.y + rect2.height
      && rect1.position.y + rect1.height >= rect2.position.y
  );
}

function animate() {
  window.requestAnimationFrame(animate);
  background.draw();
  boundaries.forEach(boundary => {
    boundary.draw();
    if ( rectangleCollision({ rect1: player, rect2: boundary }) ) {
      console.log('colliding');
    }
  });
  player.draw();

  let moving = true;

  if ( keys.w.pressed && lastKey === 'w' ) {
    for ( let i = 0; i < boundaries.length; i++ ) {
      const boundary = boundaries[i];
      if ( rectangleCollision({
        rect1: player, rect2: {
          ...boundary, position: {
            x: boundary.position.x,
            y: boundary.position.y + 3
          }
        }
      }) ) {
        moving = false;
        break;
      }
    }
    if ( moving ) {
      movables.forEach(movables => {
        movables.position.y += 3;
      });
    }

    // background.position.y += 3;
    // testBoundary.position.y += 3;
  } else if ( keys.a.pressed && lastKey === 'a' ) {
    for ( let i = 0; i < boundaries.length; i++ ) {
      const boundary = boundaries[i];
      if ( rectangleCollision({
        rect1: player, rect2: {
          ...boundary, position: {
            x: boundary.position.x + 3,
            y: boundary.position.y
          }
        }
      }) ) {
        moving = false;
        break;
      }
    }
    if ( moving ) {
      movables.forEach(movables => {
        movables.position.x += 3;
      });
    }
  } else if ( keys.s.pressed && lastKey === 's' ) {
    for ( let i = 0; i < boundaries.length; i++ ) {
      const boundary = boundaries[i];
      if ( rectangleCollision({
        rect1: player, rect2: {
          ...boundary, position: {
            x: boundary.position.x,
            y: boundary.position.y - 3,
          }
        }
      }) ) {
        moving = false;
        break;
      }
    }
    if ( moving )
      movables.forEach(movables => {
        movables.position.y -= 3;
      });
  } else if ( keys.d.pressed && lastKey === 'd' ) {
    for ( let i = 0; i < boundaries.length; i++ ) {
      const boundary = boundaries[i];
      if ( rectangleCollision({
        rect1: player, rect2: {
          ...boundary, position: {
            x: boundary.position.x - 3,
            y: boundary.position.y,
          }
        }
      }) ) {
        moving = false;
        break;
      }
    }
    if ( moving )
      movables.forEach(movables => {
        movables.position.x -= 3;
      });
  }

}

animate();
let lastKey = '';
window.addEventListener('keydown', ( e ) => {
  switch ( e.key ) {
    case 'w':
      keys.w.pressed = true;
      lastKey = 'w';
      break;
    case 'a':
      keys.a.pressed = true;
      lastKey = 'a';
      break;
    case 's':
      keys.s.pressed = true;
      lastKey = 's';
      break;
    case 'd':
      keys.d.pressed = true;
      lastKey = 'd';
      break;
  }
});
window.addEventListener('keyup', ( e ) => {
  switch ( e.key ) {
    case 'w':
      keys.w.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
    case 's':
      keys.s.pressed = false;
      break;
    case 'd':
      keys.d.pressed = false;
      break;
  }
});

