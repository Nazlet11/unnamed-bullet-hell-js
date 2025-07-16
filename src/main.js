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

    // Load the bunny texture
    const texturemc = await Assets.load('/public/perso/TEST.png');
    const textureprojectile = await Assets.load('/public/trucs/projectile.png');
    const textureennemi1 = await Assets.load('/public/ennemi/stage1/ennemi1.png');
    const texturexp = await Assets.load('/public/trucs/XP.png');
    

    // cree les sprites 
    const mc = new Sprite(texturemc);
    const projectile = new Sprite(textureprojectile);
    const ennemi1 = new Sprite(textureennemi1);
    const xp = new Sprite(texturexp);

    ///sprite.width = 200;
    ///sprite.height = 400;
    ///sprite.scale.set(1, 1);

    // Cree l objet bounds
    const bounds = new Bounds();

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
    let score = 0;
    let killcount = 0;
    // nombre de kills pour savoir si on ameliore l'attaque paprce que ce sera decidé par le nombre de kill et qui se reset qd on prend un coup
    let killcount_upgrade = 0;
    // tableau keys
    const keys = {};

    const CONTROLS = {
      'up': 'z',
      'down': 's',
      'left': 'q',
      'right': 'd',
      'shoot': 'k',
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

  // on rentre en parametre la position des tir ou ils commencent
  function tir(x, y){

    // temps en unix de "mtn"
    const mtn = Date.now();

    // (unix time stamp de mtn - unix time stamp du dernier tir < cooldown)
    if (mtn - depuisderniertir < cooldown) return; // si trop tot sort de la fonction
    depuisderniertir = mtn; // sinon, on enregistre le moment du tir
    
    // crée un nv sprite
    const projectile = new Sprite(textureprojectile);

    // place les projectiles au dessus du perso
    projectile.x = x;
    projectile.y = y;
    // l applique au truc

    app.stage.addChild(projectile);
    projectiles.push(projectile);
  }




  function tirDouble(x, y){

    // temps en unix de "mtn"
    const mtn = Date.now();

    // (unix time stamp de mtn - unix time stamp du dernier tir < cooldown)
    if (mtn - depuisderniertir < cooldown) return; // si trop tot sort de la fonction
    depuisderniertir = mtn; // sinon, on enregistre le moment du tir

    // crée un nv sprite
    const projectileDroit = new Sprite(textureprojectile);

    // place les projectiles au dessus du perso
    projectileDroit.x = x + 20;
    projectileDroit.y = y;
    // l applique au truc

    app.stage.addChild(projectileDroit);
    projectiles.push(projectileDroit);

    const projectileGauche = new Sprite(textureprojectile);

    // place les projectiles au dessus du perso
    projectileGauche.x = x - 20;
    projectileGauche.y = y;
    // l applique au truc

    app.stage.addChild(projectileGauche);
    projectiles.push(projectileGauche);
  }


  //// Fonction collision pour joueur

  function isColliding(sprite1, sprite2, shrinkAmount = 40) {
    const bounds1 = sprite1.getBounds();
    const bounds2 = sprite2.getBounds();
    // Ajuste les bords du sprite1 pour la collision
    const squaredDist = (bounds1.x + bounds2.x) ** 2 + (bounds1.y + bounds2.y) ** 2;
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
    mov = { x: 0, y: 0 };
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
    // ralentit si on presse latouche j
    if (key === 'j') {
      playerSpeed = SPEEDSLOW;
      playerDiagonalSpeed = DIAGONALSPEEDSLOW;
    }

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
    // relache j
    if (key === 'j') {
      playerSpeed = SPEED;
      playerDiagonalSpeed = DIAGONALSPEED;
    }


  });


    app.stage.addChild(text);
    app.stage.addChild(mc);


    // la game loop cogno

    app.ticker.add((time) =>
    {
      text.text = 'score : ' + score;

      let move = movement(keys, CONTROLS, playerSpeed, playerDiagonalSpeed);
      mc.x += move.x;
      mc.y += move.y;

    // Applique les limites de la zone de jeu
    applyGameZoneBounds(mc, app.screen.width, app.screen.height);

    // lance les projectiles si on presse k
    if (keys['k']) {
        // coordonnee de ou ca tire
        let tircoord_x = mc.x - 15;
        let tircoord_y = mc.y - 55;

      switch (getUpgradestate(killcount_upgrade)) {
        case "1":
          tir(tircoord_x, tircoord_y);
          break;
        case "2":
          cooldown = 60;
          tirDouble(tircoord_x, tircoord_y);

          break;
        case "3":
          cooldown = 50;
          tirDouble(tircoord_x, tircoord_y);
          break;
        default:
          tir(tircoord_x, tircoord_y);
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
