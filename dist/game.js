(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
  var __require = (x) => {
    if (typeof require !== "undefined")
      return require(x);
    throw new Error('Dynamic require of "' + x + '" is not supported');
  };
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };

  // code/main.js
  var import_kaboom = __toModule(__require("https://unpkg.com/kaboom@2000.2.9/dist/kaboom.js"));

  // code/big.js
  function big() {
    let timer = 0;
    let isBig = false;
    let destScale = 1;
    return {
      id: "big",
      require: ["scale"],
      update() {
        if (isBig) {
          timer -= dt();
          if (timer <= 0) {
            this.smallify();
          }
        }
        this.scale = this.scale.lerp(vec2(destScale), dt() * 6);
      },
      isBig() {
        return isBig;
      },
      smallify() {
        destScale = 1;
        timer = 0;
        isBig = false;
      },
      biggify(time) {
        destScale = 2;
        timer = time;
        isBig = true;
      }
    };
  }
  __name(big, "big");

  // code/patrol.js
  function patrol(speed = 60, dir = 1) {
    return {
      id: "patrol",
      require: ["pos", "area"],
      add() {
        this.on("collide", (obj, col) => {
          if (col.isLeft() || col.isRight()) {
            dir = -dir;
          }
        });
      },
      update() {
        this.move(speed * dir, 0);
      }
    };
  }
  __name(patrol, "patrol");

  // code/assets.js
  function loadAssets() {
    loadSprite("bean", "sprites/bean.png");
    loadSprite("ghosty", "sprites/ghosty.png");
    loadSprite("spike", "sprites/spike.png");
    loadSprite("grass", "sprites/grass.png");
    loadSprite("prize", "sprites/jumpy.png");
    loadSprite("apple", "sprites/apple.png");
    loadSprite("portal", "sprites/portal.png");
    loadSprite("coin", "sprites/coin.png");
    loadSound("coin", "sounds/score.mp3");
    loadSound("powerup", "sounds/powerup.mp3");
    loadSound("blip", "sounds/blip.mp3");
    loadSound("hit", "sounds/hit.mp3");
    loadSound("portal", "sounds/portal.mp3");
    loadSprite("rect", "sprites/rect.png");
    loadSound("explode", "sounds/explode.mp3");
    loadSprite("bg", "sprites/background.jpg");
  }
  __name(loadAssets, "loadAssets");

  // code/main.js
  (0, import_kaboom.default)();
  loadAssets();
  var JUMP_FORCE = 1320;
  var MOVE_SPEED = 480;
  var FALL_DEATH = 2400;
  var LEVELS = [
    [
      "                          $",
      "              !            $",
      "                          $",
      "                          $",
      "                          $",
      "           $$         =   $",
      "  %      ====         =   $",
      "     !!!              =   $",
      "                      =    ",
      "       ^^      = >    =   @",
      "==========================="
    ],
    [
      "     $    $   ! $    $   !  $",
      "     $   ! $    $    $  !   $",
      "    !     !                  ",
      "        !                 !  ",
      " =              !        !   ",
      " =       !         !         ",
      " =                     !!    ",
      " =     >     >   >  >!!    ^@",
      "==========================="
    ],
    [
      "     $    $    $    $     $",
      "     $    $    $    $     $",
      "                           ",
      "                           ",
      "                           ",
      "                           ",
      "   %                       ",
      "           > ^^  > @",
      "==========================="
    ],
    [
      "     $    $    $    $     $",
      "     $    $    $    $     $",
      "                        @  ",
      "                           ",
      "                  ==       ",
      "   ==     ==               ",
      "                           ",
      "                           ",
      "==========================="
    ]
  ];
  var levelConf = {
    width: 64,
    height: 64,
    "=": () => [
      sprite("grass"),
      area(),
      solid(),
      origin("bot")
    ],
    "$": () => [
      sprite("coin"),
      area(),
      pos(0, -9),
      origin("bot"),
      "coin"
    ],
    "%": () => [
      sprite("prize"),
      area(),
      solid(),
      origin("bot"),
      "prize"
    ],
    "^": () => [
      sprite("spike"),
      area(),
      solid(),
      origin("bot"),
      "danger"
    ],
    "#": () => [
      sprite("apple"),
      area(),
      origin("bot"),
      body(),
      "apple"
    ],
    "!": () => [
      sprite("rect"),
      area(),
      solid(),
      origin("bot"),
      "rect"
    ],
    ">": () => [
      sprite("ghosty"),
      area(),
      origin("bot"),
      body(),
      patrol(),
      "enemy"
    ],
    "@": () => [
      sprite("portal"),
      area({ scale: 0.5 }),
      origin("bot"),
      pos(0, -12),
      "portal"
    ]
  };
  scene("game", ({ levelId, coins } = { levelId: 0, coins: 0 }) => {
    layers(["bg", "obj", "ui"], "obj");
    gravity(3200);
    const background = add([
      sprite("bg"),
      pos(width() / 2, height() / 2),
      origin("center"),
      scale(1.75),
      fixed()
    ]);
    const level = addLevel(LEVELS[levelId != null ? levelId : 0], levelConf);
    const player = add([
      sprite("bean"),
      pos(0, 0),
      area(),
      scale(1),
      body(),
      big(),
      origin("bot")
    ]);
    player.onUpdate(() => {
      camPos(player.pos);
      if (player.pos.y >= FALL_DEATH) {
        shake();
        go("lose");
      }
    });
    player.onCollide("danger", () => {
      shake();
      go("lose");
      play("hit");
    });
    player.onCollide("portal", () => {
      play("portal");
      if (levelId + 1 < LEVELS.length) {
        go("game", {
          levelId: levelId + 1,
          coins
        });
      } else {
        go("win");
      }
    });
    player.onGround((l) => {
      if (l.is("enemy")) {
        player.jump(JUMP_FORCE * 1.5);
        destroy(l);
        addKaboom(player.pos);
        play("powerup");
      }
    });
    player.onCollide("enemy", (e, col) => {
      if (!col.isBottom()) {
        go("lose");
        play("hit");
        shake();
      }
    });
    let hasApple = false;
    player.onHeadbutt((obj) => {
      if (obj.is("prize") && !hasApple) {
        const apple = level.spawn("#", obj.gridPos.sub(0, 1));
        apple.jump();
        hasApple = true;
        play("blip");
      }
    });
    player.onCollide("apple", (a) => {
      destroy(a);
      player.biggify(3);
      hasApple = false;
      play("powerup");
    });
    player.onGround((rect) => {
      if (rect.is("rect")) {
        player.jump(JUMP_FORCE * 1.5);
        destroy(rect);
        addKaboom(player.pos);
        play("explode");
      }
    });
    let coinPitch = 0;
    onUpdate(() => {
      if (coinPitch > 0) {
        coinPitch = Math.max(0, coinPitch - dt() * 100);
      }
    });
    player.onCollide("coin", (c) => {
      destroy(c);
      play("coin", {
        detune: coinPitch
      });
      coinPitch += 100;
      coins += 1;
      coinsLabel.text = coins;
    });
    const coinsLabel = add([
      text(coins),
      pos(24, 24),
      fixed()
    ]);
    onKeyPress("space", () => {
      if (player.isGrounded()) {
        player.jump(JUMP_FORCE);
      }
    });
    onKeyDown("left", () => {
      player.move(-MOVE_SPEED, 0);
    });
    onKeyDown("right", () => {
      player.move(MOVE_SPEED, 0);
    });
    onKeyPress("down", () => {
      player.weight = 3;
    });
    onKeyRelease("down", () => {
      player.weight = 1;
    });
    onKeyPress("f", () => {
      fullscreen(!fullscreen());
    });
  });
  scene("lose", () => {
    const background = add([
      sprite("bg"),
      pos(width() / 2, height() / 2),
      origin("center"),
      scale(1.75),
      fixed()
    ]);
    add([text("GAME OVER! LMAO"), origin("center"), pos(width() / 2, height() / 2)]);
    onKeyPress(() => go("game"));
  });
  scene("win", () => {
    const background = add([
      sprite("bg"),
      pos(width() / 2, height() / 2),
      origin("center"),
      scale(1.75),
      fixed()
    ]);
    add([text("YOU WON!! GG"), origin("center"), pos(width() / 2, height() / 2)]);
    onKeyPress(() => go("game"));
  });
  go("game");
})();
//# sourceMappingURL=game.js.map
