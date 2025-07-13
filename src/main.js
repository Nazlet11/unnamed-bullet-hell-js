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
    let speed = 1.70;
    let diagonalSpeed = speed / Math.sqrt(2); //  1.2020815280171306
    let diagonalSpeedslow = 0.601040764;
    let score = 0;
    let killcount = 0;
    // nombre de kills pour savoir si on ameliore l'attaque paprce que ce sera decidé par le nombre de kill et qui se reset qd on prend un coup
    let killcount_upgrade = 0;
    // tableau keys
    const keys = {};




    // Texte 
    const style = new TextStyle({
      fill: 0xfccccc,
      fontSize: 72,
    });

    // initialisation du texte
    const text = new Text({
    text: 'score : ' + score,
    });





  
  ////////////////////// Faut aussi faire en sorte que le perso puisse pas sortir de l'écran





  //// Fonction tirt

  // j'ai pas reussi a faire un wait(); comme dans python ou jsp parce que tt est en async ou juste cc parce que c'est du javascript jsp dc
  // dc jvais faire un if le temps depuis le dernier tir est au dessus du cooldown la on tire

  // unix time stamp depuis le dernier tir
  let depuisderniertir = 0;
  // cooldown entre chaquetir en ms
  let cooldown = 120;





  // on rentre en parametre la position des tir ou ils commencent
  async function tir(x, y){

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





  


  
  //// Fonction collision pour joueur

  function isColliding(sprite1, sprite2) {
    const bounds1 = sprite1.getBounds();
    const bounds2 = sprite2.getBounds();


    return (
      bounds1.x + 30 < bounds2.x + bounds2.width &&
      bounds1.x - 30 + bounds1.width > bounds2.x &&
      bounds1.y + 45 < bounds2.y + bounds2.height &&
      bounds1.y - 45 + bounds1.height > bounds2.y
    );
  }

  //// Fonction pour collision

  function isCollidingtir(sprite1, sprite2) {
  const bounds1 = sprite1.getBounds();
  const bounds2 = sprite2.getBounds();


  return (
    bounds1.x + 10< bounds2.x + bounds2.width &&
    bounds1.x - 10+ bounds1.width > bounds2.x &&
    bounds1.y + 15< bounds2.y + bounds2.height &&
    bounds1.y - 15+ bounds1.height > bounds2.y
  );
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

  // fix diagonal haut gauche
  function marcheGauche(){
    if (keys['z'] && keys['q']) {
      mc.x -= diagonalSpeed;
      mc.y -= diagonalSpeed;
    } else if (keys['q']) {     
      mc.x -= speed;
    } else if (keys['z']) {
      mc.y -= speed;
    }
  }

  // fix diagonal haut droit
  function marcheHaut(){
    if (keys['z'] && keys['d']) {
      mc.x += diagonalSpeed;
      mc.y -= diagonalSpeed;
    } else if (keys['d']) {
      mc.x += speed;
    } else if (keys['z']) {
      mc.y -= speed;
    }
  }

  // fix diagonal bas gauche
  function marcheBas(){
    if (keys['s'] && keys['q']) {
      mc.y += diagonalSpeed;
      mc.x -= diagonalSpeed;
    } else if (keys['s']) {
      mc.y += speed
    } else if (keys['q']) {
      mc.x -= speed;
    }
  }


  // fix diagonal bas droit
  function marcheDroit(){
    if (keys['s'] && keys['d']) {
      mc.y += diagonalSpeed;
      mc.x += diagonalSpeed;
    } else if (keys['s']) {
      mc.y += speed
    } else if (keys['d']) {
      mc.x += speed;
    }
  }



  //// Fonction pour determiner si on upgrade le shoot
  //jvais le mettre ds la fonction tir nn enft laisse tomber
  function getUpgradestate(nombredekill){
    if (nombredekill < 10) return "1";
    if (nombredekill >= 10 && nombredekill < 30) return "2";
    if (nombredekill > 30) return "3";
  }






  // detecte les touches pressées

  window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    keys[key] = true;
    // ralentit si on presse latouche j
    if (key === 'j') {
      speed = 0.85;
      diagonalSpeed = diagonalSpeedslow;
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
      speed = 1.70;
      diagonalSpeed = 1.2020815280171306
    }


  });






    app.stage.addChild(text);
    app.stage.addChild(mc);




















  












    // la game loop cogno

    app.ticker.add((time) =>
    {
      text.text = 'score : ' + score;





      marcheGauche();
      marcheHaut();
      marcheBas();
      marcheDroit();
          









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
          tir(tircoord_x, tircoord_y - 100);
          tir(tircoord_x, tircoord_y + 100);
          break;
        case "3":
          cooldown = 50;
          tir(tircoord_x, tircoord_y);
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
        if (isCollidingtir(proj, ennemi)) {
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
      xp.y += 0.5; 

      if (isCollidingtir(mc, xp)) {
        giveScore(xp);
        app.stage.removeChild(xp);
        xps.splice(k, 1);
      }
    }





  });



})();
