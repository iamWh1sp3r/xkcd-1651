function Car(world) {
  "use strict";

  var Bodies = Matter.Bodies,
      Body = Matter.Body,
      Composite = Matter.Composite;

  var group = Body.nextGroup(true),
      wheelBase = -20,
      wheelAOffset = -width * 0.5 + wheelBase,
      wheelBOffset = width * 0.5 - wheelBase,
      wheelYOffset = 0;

  var car = Composite.create({ label: 'Car' }),
      body = Bodies.trapezoid(xx, yy, width, height, 0.3, {
          collisionFilter: {
              group: group
          },
          friction: 0.01,
          chamfer: {
              radius: 10
          }
      });

  var wheelA = Bodies.circle(xx + wheelAOffset, yy + wheelYOffset, wheelSize, {
      collisionFilter: {
          group: group
      },
      friction: 0.8,
      density: 0.01
  });

  var wheelB = Bodies.circle(xx + wheelBOffset, yy + wheelYOffset, wheelSize, {
      collisionFilter: {
          group: group
      },
      friction: 0.8,
      density: 0.01
  });

  var axelA = Constraint.create({
      bodyA: body,
      pointA: { x: wheelAOffset, y: wheelYOffset },
      bodyB: wheelA,
      stiffness: 0.2
  });

  var axelB = Constraint.create({
      bodyA: body,
      pointA: { x: wheelBOffset, y: wheelYOffset },
      bodyB: wheelB,
      stiffness: 0.2
  });

  Composite.addBody(car, body);
  Composite.addBody(car, wheelA);
  Composite.addBody(car, wheelB);
  Composite.addConstraint(car, axelA);
  Composite.addConstraint(car, axelB);

  return car;
}
