"use strict";

class Vector {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  plus(vector) {
    //   if (vector instanceof Vector) {
    //     return new Vector(this.x + vector.x, this.y + vector.y);
    //   } else {
    //     throw new Error("Можно прибавлять к вектору только вектор типа Vector");
    //   }
    // }
    // times(multiplier) {
    //   return new Vector(this.x * multiplier, this.y * multiplier);
    // }

    // исправление1
    if (!(vector instanceof Vector)) {
      throw new Error("Можно прибавлять к вектору только вектор типа Vector");
    }
    return new Vector(this.x + vector.x, this.y + vector.y);
  }
}

// const start = new Vector(30, 50);
// const moveTo = new Vector(5, 10);
// const finish = start.plus(moveTo.times(2));

// console.log(`Исходное расположение: ${start.x}:${start.y}`);
// console.log(`Текущее расположение: ${finish.x}:${finish.y}`);

class Actor {
  // constructor(pos, size, speed) {
  //   this.pos = pos || new Vector(0, 0);
  //   this.size = size || new Vector(1, 1);
  //   this.speed = speed || new Vector(0, 0);
  // }

  // исправление2
  constructor(
    pos = new Vector(0, 0),
    size = new Vector(1, 1),
    speed = new Vector(0, 0)
  ) {
    this.pos = pos;
    this.size = size;
    this.speed = speed;
  }

  act() {}

  get left() {
    return this.pos.x;
  }

  get top() {
    return this.pos.y;
  }

  get right() {
    return this.pos.x + this.size.x;
  }

  get bottom() {
    return this.pos.y + this.size.y;
  }

  get type() {
    return "actor";
  }

  isIntersect(actor) {
    //   if (actor && actor instanceof Actor) {
    //     if (actor === this) return false;
    //     return actor.left <= this.left &&
    //       actor.right >= this.right &&
    //       actor.top <= this.top &&
    //       actor.bottom >= this.bottom
    //       ? false
    //       : true;
    //   } else {
    //     throw new Error("Не является экземпляром класса Actor");
    //   }
    // }

    // исправление3
    if (!(actor instanceof Actor)) {
      throw new Error("Не является экземпляром класса Actor");
    }
    if (actor === this) return true;
    if (
      actor.left >= this.left &&
      actor.right <= this.right &&
      actor.top >= this.top &&
      actor.bottom >= this.bottom
    ) {
      return true;
    }
    return false;
  }
}

// const items = new Map();
// const player = new Actor();
// items.set('Игрок', player);
// items.set('Первая монета', new Actor(new Vector(10, 10)));
// items.set('Вторая монета', new Actor(new Vector(15, 5)));

// function position(item) {
//   return ['left', 'top', 'right', 'bottom']
//     .map(side => `${side}: ${item[side]}`)
//     .join(', ');
// }

// function movePlayer(x, y) {
//   player.pos = player.pos.plus(new Vector(x, y));
// }

// function status(item, title) {
//   console.log(`${title}: ${position(item)}`);
//   if (player.isIntersect(item)) {
//     console.log(`Игрок подобрал ${title}`);
//   }
// }

// items.forEach(status);
// movePlayer(10, 10);
// items.forEach(status);
// movePlayer(5, -5);
// items.forEach(status);

class Level {
  constructor(grid, actors) {
    this.grid = grid;
    this.actors = actors;
    //this.player = { type: "player" };
    this.player = actors.find(item => item.type == "player"); // undefined: нет ни одного Actor с типом player
    this.height = grid.length;
    //this.width = grid[0].length;
    this.width = grid.sort((a, b) => b.length - a.length);
    this.status = null;
    this.finishDelay = 1;
  }

  isFinished() {
    return this.status != null && finishDelay < 0;
  }

  actorAt(actor) {
    if (!(actor instanceof Actor)) {
      throw new Error("Не является объектом Actor");
    }
    //return actor.isIntersect(actor) ? actor;
    this.actors.find(item => item.isIntersect(actor));
  }

  obstacleAt(pos, size) {
    let obstacle = undefined;
    if (pos instanceof Vector && size instanceof Vector) {
      this.grid.forEach((row, index) => {
        obstacle = row.find((col, index) => {
          return col != undefined && (col[pos.x] || col[pos.x + size.x])
            ? this.grid[pos.x]
            : undefined;
        });
      });

      if (this.height < pos.y + size.y) obstacle = "lava";
      if (this.width < pos.x + size.x) obstacle = "wall";
      if (this.height - (pos.y + size.y) < 0) obstacle = "wall";
      if (this.width - (pos.x + size.x) < 0) obstacle = "wall";

      return obstacle;
    } else {
      throw new Error("Не является объектом Vector");
    }
  }

  removeActor(actor) {
    this.actors.forEach((item, index, arr) => {
      if (item === actor) arr.splice(index, 1);
    });
  }

  noMoreActors(type) {
    return !this.actors.find(item => item.type == type);
  }

  playerTouched(typeObstacle, objCoin) {
    //console.log(objCoin);
    if (this.status) {
      return;
    }

    if (typeObstacle == "lava" || typeObstacle == "fireball") {
      this.status = "lost";
    }

    if (typeObstacle == "coin" && objCoin.prototype.type == "actor") {
      //const index = this.actors.indexOf(objCoin);
      //this.actors.splice(index, 1);
      this.removeActor(objCoin);
    }

    if (this.noMoreActors("coin")) this.status = "won";

    // if (!this.actors.find(item => item.type == 'coin' )) {
    //     this.status = 'won';
    // }
  }
}

// const grid = [[undefined, undefined], ["wall", "wall"]];

// function MyCoin(title) {
//   this.type = "coin";
//   this.title = title;
// }
// MyCoin.prototype = Object.create(Actor);
// MyCoin.constructor = MyCoin;

// const goldCoin = new MyCoin("Золото");
// const bronzeCoin = new MyCoin("Бронза");
// const player = new Actor();
// const fireball = new Actor();

// const level = new Level(grid, [goldCoin, bronzeCoin, player, fireball]);

// level.playerTouched("coin", goldCoin);
// level.playerTouched("coin", bronzeCoin);

// if (level.noMoreActors("coin")) {
//   console.log("Все монеты собраны");
//   console.log(`Статус игры: ${level.status}`);
// }

// const obstacle = level.obstacleAt(new Vector(1, 1), player.size);
// if (obstacle) {
//   console.log(`На пути препятствие: ${obstacle}`);
// }

// const otherActor = level.actorAt(player);
// console.log(otherActor, fireball);
// if (otherActor === fireball) {
//   console.log("Пользователь столкнулся с шаровой молнией");
// }

class LevelParser {
  constructor(dictionary) {
    //console.log(dictionary);
    this.dictionary = dictionary;
  }

  actorFromSymbol(symbolOfLevel) {
    //const keys = Object.keys(this.dictionary);
    for (let i in this.dictionary) {
      //console.log(i, this.dictionary[i]);
      if (i === symbolOfLevel) return this.dictionary[i];
    }
    //return keys.forEach(item => item === symbolOfLevel);
  }

  obstacleFromSymbol(symbolOfLevel) {
    switch (symbolOfLevel) {
      case "x":
        return "wall";
        break;
      case "!":
        return "lava";
        break;
      default:
        return undefined;
    }
  }

  createGrid(grid) {
    let result = [];
    grid.forEach(item => {
      let row = [];
      item.split("").forEach(sym => row.push(this.obstacleFromSymbol(sym)));
      result.push(row);
    });
    //console.log(result);
    return result;
  }

  createActors(grid) {
    let result = [];
    grid.forEach((item, y) => {
      item.split("").forEach((sym, x) => {
        const res = this.actorFromSymbol(sym);
        if (typeof res === "function") {
          const actor = new res(new Vector(x, y));
          if (actor instanceof Actor) {
            actor && result.push(actor);
          }
        }
      });
    });
    return result;
  }

  parse(grid) {
    return new Level(this.createGrid(grid), this.createActors(grid));
  }
}

const plan = [" @ ", "x!x"];

const actorsDict = Object.create(null);
actorsDict["@"] = Actor;

const parser = new LevelParser(actorsDict);
const level = parser.parse(plan);

level.grid.forEach((line, y) => {
  line.forEach((cell, x) => console.log(`(${x}:${y}) ${cell}`));
});

level.actors.forEach(actor =>
  console.log(`(${actor.pos.x}:${actor.pos.y}) ${actor.type}`)
);
