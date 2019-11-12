'use strict';

class monitor_ctrl {

  constructor(mod) {

    this.m = mod;
    this.c = mod.command;
    this.s = mod.settings;

    // command
    this.c.add('ctrl', {
      'shake': () => {
        this.s.enableShake = !this.s.enableShake;
        // temporary
        if (this.m.region !== 'na')
          this.set_camera_shake();
        this.send(`Camera shake ${this.s.enableShake ? 'en' : 'dis'}abled.`);
      },
      '$default': () => {
        this.send(`Invalid argument. usage : ctrl [shake]`);
      }
    });

    // code
    // block drunken screen abnomality
    this.m.hook('S_ABNORMALITY_BEGIN', 3, (e) => {
      if (this.m.settings.abnormality.includes(e.id))
        return false;
    });

    // block screen zoom scripts
    this.m.hook('S_START_ACTION_SCRIPT', 'raw', () => false);

    // replace forced sky change in glm
    let _ = this.m.tryHook('S_FIELD_EVENT_ON_ENTER', 'raw', () => {
      this.m.setTimeout(() => {
        this.m.trySend('S_AERO', 1, {
          enabled: true,
          blendTime: 1,
          aeroSet: "ab1_aeroset.AERO.DST_AB1_AERO"
        })
      }, 2000);
    });
    if (!_) {
      this.m.warn('Unmapped protocol packet \<S_FIELD_EVENT_ON_ENTER\>.');
    }

    // block unnecessary spawns of fish aesthetics
    this.m.hook('S_SPAWN_NPC', 11, { order: 10 }, (e) => {
      if (e.npcName === '투명NPC_낚시_물고기표현')
        return false;
    });

    // block camera shake
    this.set_camera_shake();

  }

  destructor() {
    this.c.remove('ctrl');
  }

  // helper
  set_camera_shake() { this.m.clientInterface.configureCameraShake(this.s.enableShake, 0.3, 0.3); }

  send() { this.c.message(': ' + [...arguments].join('\n\t - ')); }

}

module.exports = monitor_ctrl;