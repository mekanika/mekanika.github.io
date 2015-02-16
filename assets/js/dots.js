// ----------------------------------------
// Particle
// ----------------------------------------

function Particle( x, y, radius ) {
  this.init( x, y, radius );
}

Particle.prototype = {

  init: function( x, y, radius ) {

    this.alive = true;

    this.radius = radius || 10;
    this.wander = 0.15;
    this.theta = random( TWO_PI );
    this.drag = 0.0;//92;
    this.color = '#fff';

    this.decay = random(0.995,0.999);

    this.x = x || 0.0;
    this.y = y || 0.0;

    this.vx = 0.0;
    this.vy = 0.0;
  },

  move: function() {

    this.x += this.vx;
    this.y += this.vy;

    this.vx *= this.drag;
    this.vy *= this.drag;

    this.theta += random( -0.1, 0.1 ) * this.wander;
    this.vx += sin( this.theta ) * 0.1;
    this.vy += cos( this.theta ) * 0.1;

    this.radius *= this.decay;
    this.alive = this.radius > 0.5;
  },

  draw: function( ctx ) {

    ctx.beginPath();
    ctx.arc( this.x, this.y, this.radius, 0, TWO_PI );
    ctx.fillStyle = this.color;
    ctx.fill();
  }
};


// ----------------------------------------
// Spawn
// ----------------------------------------

var MAX_PARTICLES = 120;

var particles = [];
var pool = [];

var dots = Sketch.create({
  container: document.getElementById( 'container' )
});

dots.setup = function() {
  for ( var i = 0; i < MAX_PARTICLES; i++ ) dots.spawn(null,null,0.6);
};

dots.spawn = function( x, y, size ) {

  var h = "innerHeight" in window
  ? window.innerHeight
  : document.documentElement.offsetHeight;

  var w = "innerWidth" in window
    ? window.innerWidth
    : document.documentElement.offsetWidth;

  x || (x = random()*w);
  y || (y = random()* h *.7 );

  if ( particles.length >= MAX_PARTICLES )
    pool.push( particles.shift() );

  particle = pool.length ? pool.pop() : new Particle();
  particle.init( x, y, size || random( 1, 4 ) );

  particle.wander = random( 0.5, 2.0 );
  var col = function () {
    var op = random(0.05,0.3).toString().substr(0,3);
    return 'rgba(255,255,255,' +op+')';
  }
  particle.color = col();
  particle.drag = random( 0.2, 0.7 );

  theta = random( TWO_PI );
  force = random( 2, 8 );

  particle.vx = sin( theta ) * force;
  particle.vy = cos( theta ) * force;

  particles.push( particle );
};

dots.update = function() {
  var i, particle;

  for ( i = particles.length - 1; i >= 0; i-- ) {
    particle = particles[i];

    if ( particle.alive ) particle.move();
    else {
      pool.push( particles.splice( i, 1 )[0] );
      dots.spawn();

    }
  }
};

dots.draw = function() {
  dots.globalCompositeOperation  = 'lighter';

  for ( var i = particles.length - 1; i >= 0; i-- ) {
    particles[i].draw( dots );
  }
};

// dots.mousemove = function() {
//   var particle, theta, force, touch, max, i, j, n;
//   for ( i = 0, n = dots.touches.length; i < n; i++ ) {
//     touch = dots.touches[i], max = random( 1, 4 );
//     for ( j = 0; j < max; j++ ) {
//       dots.spawn( touch.x, touch.y );
//     }
//   }
// };
