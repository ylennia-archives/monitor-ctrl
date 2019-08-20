'use strict';

module.exports = function MonitorCtrl(mod) {

  // block drunken screen abnomality
  mod.hook('S_ABNORMALITY_BEGIN', 3, (e) => {
    if (mod.settings.abnormality.includes(e.id)) {
      return false;
    }
  });

  // block screen zoom scripts
  mod.hook('S_START_ACTION_SCRIPT', 'raw', () => false);

  // replace forced sky change in glm
  let _ = mod.tryHook('S_FIELD_EVENT_ON_ENTER', 'raw', () => {
    setTimeout(() => {
      mod.trySend('S_AERO', 1, {
        enabled: true,
        blendTime: 1,
        aeroSet: "ab1_aeroset.AERO.DST_AB1_AERO"
      })
    }, 2000);
  });
  if (!_) {
    mod.warn('Unmapped protocol packet \<S_FIELD_EVENT_ON_ENTER\>.');
  }

  // block unnecessary spawns of fish aesthetics
  mod.hook('S_SPAWN_NPC', 11, { order: 10 }, (e) => {
    if (e.npcName === '투명NPC_낚시_물고기표현') {
      return false;
    }
  });

}