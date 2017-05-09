var kick = new Kick(context);
var now = context.currentTime;
kick.trigger(now);
kick.trigger(now + 0.5);
kick.trigger(now + 1);