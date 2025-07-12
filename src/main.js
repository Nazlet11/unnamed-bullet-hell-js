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






    // Dev tools pr chrome
    initDevtools({app});
    globalThis.__PIXI_APP__ = app;

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    // Load the bunny texture
    const texturemc = await Assets.load('/public/perso/TEST.png');
    const textureprojectile = await Assets.load('/public/trucs/projectile.png');
    const textureennemi1 = await Assets.load('/public/ennemi/stage1/ennemi1.png');

    // cree les sprites 
    const mc = new Sprite(texturemc);
    const projectile = new Sprite(textureprojectile);
    const ennemi1 = new Sprite(textureennemi1);
    ///sprite.width = 200;
    ///sprite.height = 400;
    ///sprite.scale.set(1, 1);

    // Cree l objet bounds
    const bounds = new Bounds();

    // creation du tableau des ennemis
    let ennemis = [];
    let projectiles = [];

    

    // Met le centre de rotation au centre du sprite juste parce que
    mc.anchor.set(0.5);
    // Placement de base du joueur
    mc.x = app.screen.width / 2;
    mc.y = app.screen.height * 0.72;

    // vitesse 
    let speed = 1.70;
    let diagonalSpeed = speed / Math.sqrt(2);
    let diagonalSpeedslow
    // tableau keys
    const keys = {};




    // Texte 
    const style = new TextStyle({
      fill: 0xfccccc,
      fontSize: 72,
    });

    // initialisation du texte
    const text = new Text({
    text: 'score : ',
    });




  
  ////////////////////// Faut aussi faire en sorte que le perso puisse pas sortir de l'écran





  //// Fonction tirt

  // j'ai pas reussi a faire un wait(); comme dans python ou jsp parce que tt est en async ou juste cc parce que c'est du javascript jsp dc
  // ce que je vais faire c'est faire un if le temps depuis le dernier tir est au dessus du cooldown la on tire

  // unix time stamp depuis le dernier tir
  let depuisderniertir = 0;
  // cooldown entre chaquetir
  let cooldown = 120;

  async function tir(){
      
    // temps en unix de "mtn"
    const mtn = Date.now();

    // (unix time stamp de mtn - unix time stamp du dernier tir < cooldown)
    if (mtn - depuisderniertir < cooldown) return; // si trop tot sort de la fonction
    depuisderniertir = mtn; // sinon, on enregistre le moment du tir
    
    // crée un nv sprite
    const projectile = new Sprite(textureprojectile);
    // place les projectiles au dessus du perso
    projectile.x = mc.x - 15;
    projectile.y = mc.y - 55;
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
    bounds1.x < bounds2.x + bounds2.width &&
    bounds1.x + bounds1.width > bounds2.x &&
    bounds1.y < bounds2.y + bounds2.height &&
    bounds1.y + bounds1.height > bounds2.y
  );
}





















  // detecte les touches pressées

  window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    keys[key] = true;
    // ralentit si on presse latouche j
    if (key === 'j') {
      speed = 1.1;
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
    }


  });






    app.stage.addChild(text);
    app.stage.addChild(mc);
    app.stage.addChild(ennemi1);
































    // la game loop cogno

    app.ticker.add((time) =>
    {

    // if (keys['q']) mc.x -= speed;    // Gauche
    // if (keys['d']) mc.x += speed;    // Droite
    // if (keys['z']) mc.y -= speed;    // Haut
    // if (keys['s']) mc.y += speed;    // Bas

    // fix diagonal haut gauche
    if (keys['z'] && keys['q']) {
      mc.x -= diagonalSpeed;
      mc.y -= diagonalSpeed;
    } else if (keys['q']) {     
      mc.x -= speed;
    } else if (keys['z']) {
      mc.y -= speed;
    }

    // fix diagonal haut droit
    if (keys['z'] && keys['d']) {
      mc.x += diagonalSpeed;
      mc.y -= diagonalSpeed;
    } else if (keys['d']) {
      mc.x += speed;
    } else if (keys['z']) {
      mc.y -= speed;
    }

    
    // fix diagonal bas gauche
    if (keys['s'] && keys['q']) {
      mc.y += diagonalSpeed;
      mc.x -= diagonalSpeed;
    } else if (keys['s']) {
      mc.y += speed
    } else if (keys['q']) {
      mc.x -= speed;
    }

    // fix diagonal bas droit
    if (keys['s'] && keys['d']) {
      mc.y += diagonalSpeed;
      mc.x += diagonalSpeed;
    } else if (keys['s']) {
      mc.y += speed
    } else if (keys['d']) {
      mc.x += speed;
    }


        


    // detecte la collision entre joueur et ennemi


    // detecte la collision entre ennemi et joueur
    for (const ennemi of ennemis){
      if (isColliding(mc, ennemi)) {
        console.log("Collision détectée !");
        ennemi.destroy();
      }
    }



    // lance les projectiles si on presse k
    if (keys['k']) {
      tir();
      
      for (const ennemi of ennemis){
        if (isCollidingtir(projectile, ennemi)){
          app.stage.removeChild(ennemi);
          pp.stage.removeChild(projectile);
        } 
      } 
    }








    
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
          app.stage.removeChild(proj);
          projectiles.splice(i, 1);

          app.stage.removeChild(ennemi);
          ennemis.splice(j, 1);

          break; // sort de la boucle ennemis
        }
      }
    }
  });



})();
