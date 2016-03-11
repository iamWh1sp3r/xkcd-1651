var XKCD_1651 = {
  defaultCategory: 0x0001,
  wheelsCategory: 0x0002
};

(function () {
  "use strict";

  // Matter.js module aliases
  var Bodies = Matter.Bodies,
      Common = Matter.Common,
      Composites = Matter.Composites,
      Engine = Matter.Engine,
      Events = Matter.Events,
      MouseConstraint = Matter.MouseConstraint,
      World = Matter.World;

  // create a Matter.js engine
  var engine = Engine.create(document.getElementById('canvas-container')),
      world = engine.world;

  // set rendering options
  var renderOptions = engine.render.options;
      renderOptions.showAxes = true;
      renderOptions.showPositions = true;
      // renderOptions.wireframes = false;

  addBodies();
  addConstraints();
  addEvents();

  var crane = new Crane(world);
  var car = new Car(world);

  // run the engine
  Events.on(engine, 'beforeUpdate', engineBeforeUpdate);
  Engine.run(engine);

  function addBodies() {
    var ground = Bodies.rectangle(600, 600, 500, 50, { isStatic: true });
    World.add(world, ground);

    var slope = Bodies.rectangle(850, 580, 500, 50, { isStatic: true, angle: -0.09 });
    World.add(world, slope);

    // var car = Composites.car(900, 400, 100, 40, 30);
    // World.add(world, car);
  }

  function addConstraints() {
    var mouseConstraint = MouseConstraint.create(engine);
    World.add(world, mouseConstraint);
  }

  function addEvents() {
    document.onkeydown = keydown;
    document.onkeyup = keyup;
  }

  function engineBeforeUpdate(event) {
    crane.update();
  }

  function keydown(event) {
    crane.keydown(event);
  }

  function keyup(event) {
    crane.keyup(event);
  }
})();
