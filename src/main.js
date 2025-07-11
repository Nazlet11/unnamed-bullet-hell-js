import { Application, Assets, Sprite, Text, TextStyle } from 'pixi.js';
import {initDevtools} from '@pixi/devtools';


// place le jeu azu centre de la page
document.body.style.margin = '0';
document.body.style.height = '100vh';
document.body.style.display = 'flex';
document.body.style.justifyContent = 'center';
document.body.style.alignItems = 'center';
 
(async () =>
{

/*
  function createPlayerSheet(){
    let sheet = new PIXI.BaseTexture.from(app.loader.resources["bunny"].url);
    let w = 16;
    let h = 16;


  }
  */

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

    // Met le centre de rotation au centre du sprite juste parce que
    mc.anchor.set(0.5);
    // Placement de base du joueur
    mc.x = app.screen.width / 2;
    mc.y = app.screen.height * 0.72;
    // ennemi test
    ennemi1.x = app.screen.width / 2;
    ennemi1.y = app.screen.height / 4;

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






  // detecte les touches pressées
  window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    keys[key] = true;
    // ralentit si on presse latouche j
    if (key === 'j') {
      speed = 1.1;
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

    

    // lance les projectiles si on presse k
    if (keys['k']) {
      tir();
    }
  });















  

    ////////////////////// Si ce commentaire est tjrs la c est que j ai pas encore geré la suppressions des projectiles parce que il restent indefiniment la dc gros sac confirmed

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

      // faire une deuxieme loop est probablement pas optimisé jsp
      app.ticker.add(() => {
        projectile.y -= 10;

        
      });
    }
})();
