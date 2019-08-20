import { paths } from "../systems/userinput/paths";
import { SOUND_FREEZE, SOUND_THAW } from "../systems/sound-effects-system";

/**
 * Toggles freezing of network traffic on the given event.
 * @namespace network
 * @component freeze-controller
 */
AFRAME.registerComponent("freeze-controller", {
  init: function() {
    this.onToggle = this.onToggle.bind(this);
  },

  tick: function() {
    const scene = this.el.sceneEl;
    if (!scene.is("entered")) return;

    const userinput = scene.systems.userinput;
    const inspecting = !!scene.systems["hubs-systems"].cameraSystem.inspected;
    const ensureFrozen = userinput.get(paths.actions.ensureFrozen) && !inspecting;
    const thaw = userinput.get(paths.actions.thaw) || inspecting;
    const toggleFreeze = userinput.get(paths.actions.toggleFreeze) && !inspecting;

    const toggleFreezeDueToInput =
      (this.el.is("frozen") && thaw) || (!this.el.is("frozen") && ensureFrozen) || toggleFreeze;

    if (toggleFreezeDueToInput) {
      this.onToggle();
    }
  },

  onToggle: function() {
    window.APP.store.update({ activity: { hasFoundFreeze: true } });
    if (!NAF.connection.adapter) return;
    NAF.connection.adapter.toggleFreeze();
    if (NAF.connection.adapter.frozen) {
      this.el.sceneEl.systems["hubs-systems"].soundEffectsSystem.playSoundOneShot(SOUND_FREEZE);
      this.el.addState("frozen");
    } else {
      this.el.sceneEl.systems["hubs-systems"].soundEffectsSystem.playSoundOneShot(SOUND_THAW);
      this.el.removeState("frozen");
    }
  }
});
