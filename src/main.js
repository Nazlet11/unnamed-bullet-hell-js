import { Application, Assets, Sprite, Text, TextStyle, Bounds, Matrix} from 'pixi.js';
import {initDevtools} from '@pixi/devtools';


// place le jeu azu centre de la page
document.body.style.margin = '0';
document.body.style.height = '100vh';
document.body.style.display = 'flex';
document.body.style.justifyContent = 'center';
document.body.style.alignItems = 'center';
 
(async () => {
    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({ background: '#1099bb', 
      width: 670,
      height: 880,
      resolution: 1
    });


    // j ai le gyatt j ai le gyatt j ai le gyatt



    // Dev tools pr chrome
    initDevtools({app});
    globalThis.__PIXI_APP__ = app;

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    // Load the textures
    await Assets.loadBundle('textures', {
      mc: '/public/perso/TEST.png',
      projectile: '/public/trucs/projectile.png',
      ennemi1: '/public/ennemi/stage1/ennemi1.png',
      xp: '/public/trucs/XP.png',
    })
    .catch((error) => {
      console.error('Error loading textures:', error);
    });

    const texturemc = Assets.get('mc');
    const textureprojectile = Assets.get('projectile');
    const textureennemi1 = Assets.get('ennemi1');
    const texturexp = Assets.get('xp');


    // cree les sprites 
    const mc = new Sprite(texturemc);

    ///sprite.width = 200;
    ///sprite.height = 400;
    ///sprite.scale.set(1, 1);


    // creation du tableau des ennemis
    let ennemis = [];
    let projectiles = [];
    let xps = [];

    

    // Met le centre de rotation au centre du sprite juste parce que
    mc.anchor.set(0.5);
    // Placement de base du joueur
    mc.x = app.screen.width / 2;
    mc.y = app.screen.height * 0.72;

    // vitesse 
    const SPEED = 1.70;
    const SPEEDSLOW = 0.85;
    const DIAGONALSPEED = SPEED / Math.sqrt(2); //  1.2020815280171306
    const DIAGONALSPEEDSLOW = SPEEDSLOW / Math.sqrt(2); // 0.6030407640085653
    let playerSpeed = SPEED;
    let playerDiagonalSpeed = DIAGONALSPEED;

    // upgrades
    // nombre de kills pour savoir si on ameliore l'attaque paprce que ce sera decidé par le nombre de kill et qui se reset qd on prend un coup
    let score = 0;
    let killcount_upgrade = 0;
    const COOLDOWNUPDGRADE = {"1": 120, "2": 60, "3": 50};
    const DEFAULTCOOLDOWN = COOLDOWNUPDGRADE["1"]; // Au cas ou il y ait un bug avec les updgrade
    
    // keys
    const keys = {};
    const CONTROLS = {
      'up': 'z',
      'down': 's',
      'left': 'q',
      'right': 'd',
      'shoot': 'k',
      'slow': 'j'
    }


    // Texte 
    const style = new TextStyle({
      fill: 0xfccccc,
      fontSize: 72,
    });

    // initialisation du texte
    const text = new Text({
    text: 'score : ' + score,
    });






  //// Fonction wait 
  //promise
  function promise(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async function wait(ms) {
    await promise(ms); 
  }




  //// Fonction tir

  // j'ai pas reussi a faire un wait(); comme dans python ou jsp parce que tt est en async ou juste cc parce que c'est du javascript jsp dc
  // dc jvais faire un if le temps depuis le dernier tir est au dessus du cooldown la on tire

  // unix time stamp depuis le dernier tir
  let depuisderniertir = 0;
  // cooldown entre chaquetir en ms
  let cooldown = 120;

  function isTooEarly() {
    // temps en unix de "mtn"
    const mtn = Date.now();
    // (unix time stamp de mtn - unix time stamp du dernier tir < cooldown)
    if (mtn - depuisderniertir < cooldown) return true; // si trop tot sort de la fonction
    return false;
  }

  // on rentre en parametre la position des tir ou ils commencent
  function tirMultiple(x, y, offsets=[0]) {
    if (isTooEarly()) return; // si trop tot sort de la fonction

    for (const offset of offsets) {
      const projectile = new Sprite(textureprojectile);
      projectile.x = x + offset;
      projectile.y = y;

      app.stage.addChild(projectile);
      projectiles.push(projectile);
    }
  }



  //// Fonction collision pour joueur

  function isColliding(sprite1, sprite2, shrinkAmount = 40) {
    const bounds1 = sprite1.getBounds();
    const bounds2 = sprite2.getBounds();
    // Ajuste les bords du sprite1 pour la collision
    const squaredDist = (bounds1.x - bounds2.x) ** 2 + (bounds1.y - bounds2.y) ** 2;
    bounds1.radius = Math.max(bounds1.width, bounds1.height) / 2 - shrinkAmount;
    bounds2.radius = Math.max(bounds2.width, bounds2.height) / 2 - shrinkAmount;
    return (squaredDist < (bounds1.radius + bounds2.radius) ** 2);
  }



  //// Fonction pour drop xp 
  function dropXp(coord1, coord2){
    const xpe = new Sprite(texturexp);
      

      xpe.x = coord1;
      xpe.y = coord2;

      
      getGrosxpodd(xpe);

      app.stage.addChild(xpe);
      xps.push(xpe);


  }


  //// Fonction pour incrementer le score
  function getGrosxpodd(sprite) {
    let grosxp = Math.floor(Math.random() * 2);
    if(grosxp === 1) {
      sprite.scale.set(1.70, 1.70);
    } 
  }

  function giveScore(sprite){
    let taillegros = 16 * 1.70;
    if (sprite.width === taillegros) score += 30;
    score += 20;
  }

  //// Fonctions pour marcher dans chaque direction
  //laisse tomber ca c est du spaghetti code admire

  function movement(keys, controls, playerSpeed, playerDiagonalSpeed) {
    let mov = { x: 0, y: 0 };
    if (keys[controls['up']]) {
      mov.y -= playerSpeed;
    }
    if (keys[controls['down']]) {
      mov.y += playerSpeed;
    }
    if (keys[controls['left']]) {
      mov.x -= playerSpeed;
    }
    if (keys[controls['right']]) {
      mov.x += playerSpeed;
    }

    // Fix diagonal speed
    if (mov.x !== 0 && mov.y !== 0) {
      mov.x *= playerDiagonalSpeed;
      mov.y *= playerDiagonalSpeed;
    }
    return mov;
  }

  function applyGameZoneBounds(sprite, screenWidth, screenHeight) {
    // Applique les limites de la zone de jeu
    if (sprite.x < 0) sprite.x = 0;
    if (sprite.x > screenWidth) sprite.x = screenWidth;
    if (sprite.y < 0) sprite.y = 0;
    if (sprite.y > screenHeight) sprite.y = screenHeight;
  }

  //// Fonction pour determiner si on upgrade le shoot
  //jvais le mettre ds la fonction tir nn enft laisse tomber
  function getUpgradestate(nombredekill){
    const thresholds = [
      {"min": 30, "upgradeState": "3"},
      {"min": 10, "upgradeState": "2"},
      {"min": 0, "upgradeState": "1"}
    ]
    for (const threshold of thresholds) {
      if (nombredekill >= threshold.min) {
        return threshold.upgradeState;
      }
    }
  }

  
  // detecte les touches pressées

  window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    keys[key] = true;

    if (key === 't') {
      for (let i = 0; i < 15; i++) {
        const ennemitest = new Sprite(textureennemi1);
        ennemitest.x = Math.random() * app.screen.width;
        ennemitest.y = Math.random() * app.screen.height * 0.5;
        app.stage.addChild(ennemitest);
       ennemis.push(ennemitest);
      }
    }



  });

  // detecte les touches relachées

  window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    keys[key] = false;


  });


    app.stage.addChild(text);
    app.stage.addChild(mc);


    // la game loop cogno

    app.ticker.add((time) =>
    {
    text.text = 'score : ' + score;

    // met a jour la vitesse du joueur en fonction de la touche slow
    if (keys[CONTROLS['slow']]) {
      playerSpeed = SPEEDSLOW;
      playerDiagonalSpeed = DIAGONALSPEEDSLOW;
    } else {
      playerSpeed = SPEED;
      playerDiagonalSpeed = DIAGONALSPEED;
    }

    let move = movement(keys, CONTROLS, playerSpeed, playerDiagonalSpeed);
    mc.x += move.x;
    mc.y += move.y;

    // Applique les limites de la zone de jeu
    applyGameZoneBounds(mc, app.screen.width, app.screen.height);

    let upgradeState = getUpgradestate(killcount_upgrade);
    cooldown = COOLDOWNUPDGRADE[upgradeState] || DEFAULTCOOLDOWN;

    // lance les projectiles si on presse k
    if (keys[CONTROLS['shoot']]) {
        // coordonnee de ou ca tire
        let tircoord_x = mc.x - 15;
        let tircoord_y = mc.y - 55;

      switch (getUpgradestate(killcount_upgrade)) {
        case "1":
          tirMultiple(tircoord_x, tircoord_y);
          break;
        default:
          // tir double
          tirMultiple(tircoord_x, tircoord_y, [-15, 15]);
          break;
      }
    }


    // detecte la collision entre ennemi et joueur
    for (const ennemi of ennemis){
      if (isColliding(mc, ennemi)) {
        ennemi.destroy();
      }
    }


    // boucle pr chaque projectiles et les fait descendre

    for (let i = projectiles.length - 1; i >= 0; i--) {
    const proj = projectiles[i];
    proj.y -= 10;

      // supprime s'il sort de l'écran
      if (proj.y < 0) {
        app.stage.removeChild(proj);
        projectiles.splice(i, 1);
      continue;
      }

      // verifie collision avec ennemis
      for (let j = ennemis.length - 1; j >= 0; j--) {
        const ennemi = ennemis[j];
        if (isColliding(proj, ennemi, 10)) {
          dropXp(ennemi.x, ennemi.y);
          killcount_upgrade += 1;

          app.stage.removeChild(proj);
          projectiles.splice(i, 1);

          app.stage.removeChild(ennemi);
          ennemis.splice(j, 1);
          break; // sort de la boucle ennemis
        }
      }
    }

    // boucle pr fait descendre  xp et gerer collision
    for (let k = xps.length - 1; k >= 0; k--) {
      const xp = xps[k];
      xp.y += 0.75; 

      if (isColliding(mc, xp, 10)) {
        giveScore(xp);
        app.stage.removeChild(xp);
        xps.splice(k, 1);
      }
    }
    
  });

})();
