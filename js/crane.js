function Crane(world) {
  "use strict";

  var Bodies = Matter.Bodies,
      Body = Matter.Body,
      Vector = Matter.Vector,
      Vertices = Matter.Vertices,
      World = Matter.World;

  this.keydown = keydown;
  this.keyup = keyup;
  this.update = update;

  var segments = {
    a: {
      rotation: 0,
      limit: 0.5,
      speed: 0.01,
      rotationChange: 0,
      size: { w: 30, h: 175 },
      position: { x: 400, y: 579.5 },
      body: function() { return segmentBody(this); }
    },
    b: {
      rotation: 0,
      limit: 2.4,
      speed: 0.02,
      rotationChange: 0,
      size: { w: 20, h: 150 },
      body: function() { return segmentBody(this); }
    },
    la: {
      rotation: 0,
      size: { w: 10, h: 90 },
      body: function() { return segmentBody(this); }
    },
    lb: {
      rotation: 0,
      size: { w: 10, h: 50 },
      body: function() { return segmentBody(this); }
    },
    ra: {
      rotation: 0,
      size: { w: 10, h: 90 },
      body: function() { return segmentBody(this); }
    },
    rb: {
      rotation: 0,
      size: { w: 10, h: 50 },
      body: function() { return segmentBody(this); }
    }
  };

  var claw = {
    angle: 0.7,
    angleChange: 0,
    angleSpeed: 0.01,
    rotation: 0,
    rotationSpeed: 0.015,
    rotationChange: 0
  };

  World.add(world, [
    segments.a.body(),
    segments.b.body(),
    segments.la.body(),
    segments.lb.body(),
    segments.ra.body(),
    segments.rb.body()
  ]);

  function segmentBody(segment) {
    if (!segment.$body) {
      segment.$body = Bodies.rectangle(0, 0, segment.size.w, segment.size.h, { isStatic: true });
    }

    return segment.$body;
  }

  function keydown(event) {
    switch(event.keyCode) {
      case 37: // left
        claw.rotationChange = -claw.rotationSpeed;
        break;
      case 38: // down
        claw.angleChange = claw.angleSpeed;
        break;
      case 39: // right
        claw.rotationChange = claw.rotationSpeed;
        break;
      case 40: // up
        claw.angleChange = -claw.angleSpeed;
        break;
      case 65: // a
        segments.b.rotationChange = -segments.b.speed;
        break;
      case 83: // s
        segments.b.rotationChange = segments.b.speed;
        break;
      case 88: // x
        segments.a.rotationChange = segments.a.speed;
        break;
      case 90: // z
        segments.a.rotationChange = -segments.a.speed;
        break;
    }
  }

  function keyup(event) {
    switch(event.keyCode) {
      case 37:  // left
        claw.rotationChange = 0;
        break;
      case 38:  // down
        claw.angleChange = 0;
        break;
      case 39:  // right
        claw.rotationChange = 0;
        break;
      case 40:  // up
        claw.angleChange = 0;
        break;
      case 65: // a
        segments.b.rotationChange = 0;
        break;
      case 83: // s
        segments.b.rotationChange = 0;
        break;
      case 88:  // x
        segments.a.rotationChange = 0;
        break;
      case 90:  // z
        segments.a.rotationChange = 0;
        break;
    }
  }

  function update() {
    applySegmentChanges(segments.a);
    applySegmentChanges(segments.b);
    applyClawChanges();
    updatePositions();
  }

  function segmentPosition(angle, position, size) {
    var up = -angle + Math.PI/2,
        cos = Math.cos(up),
        sin = Math.sin(up);

    return {
      center: {
        x: position.x + cos * (size.h/2),
        y: position.y - sin * (size.h/2)
      },
      tip: {
        x: position.x + cos * (size.h),
        y: position.y - sin * (size.h)
      }
    };
  }

  function applyClawChanges() {
    claw.angle = Math.min(Math.max(claw.angle + claw.angleChange, 0.44), 1.18);
    claw.rotation = Math.min(Math.max(claw.rotation + claw.rotationChange, -1.65), 1.65);
  }

  function applySegmentChanges(segment) {
    segment.rotation = Math.min(Math.max(segment.rotation + segment.rotationChange, -segment.limit), segment.limit);
  }

  function updateSegment(body, position, rotation) {
    Body.setVelocity(body, Vector.sub(position, body.position));
    Body.setPosition(body, position);
    Body.setAngularVelocity(body, rotation - body.angle);
    Body.setAngle(body, rotation);
  }

  function updatePositions() {
    var segPos, clawPos, segRot, clawRot;

    // segment a
    segRot = segments.a.rotation;
    segPos = segmentPosition(segRot, segments.a.position, segments.a.size);
    updateSegment(segments.a.body(), segPos.center, segRot);

    // segment b
    segRot += segments.b.rotation;
    segPos = segmentPosition(segRot, segPos.tip, segments.b.size);
    updateSegment(segments.b.body(), segPos.center, segRot);

    // left claw
    clawRot = segRot + claw.rotation - claw.angle;
    clawPos = segmentPosition(clawRot, segPos.tip, segments.la.size);
    updateSegment(segments.la.body(), clawPos.center, clawRot);

    clawRot += 1.2;
    clawPos = segmentPosition(clawRot, clawPos.tip, segments.lb.size);
    updateSegment(segments.lb.body(), clawPos.center, clawRot);

    // right claw
    clawRot = segRot + claw.rotation  + claw.angle;
    clawPos = segmentPosition(clawRot, segPos.tip, segments.ra.size);
    updateSegment(segments.ra.body(), clawPos.center, clawRot);

    clawRot -= 1.2;
    clawPos = segmentPosition(clawRot, clawPos.tip, segments.rb.size);
    updateSegment(segments.rb.body(), clawPos.center, clawRot);
  }
}
