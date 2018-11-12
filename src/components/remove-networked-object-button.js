AFRAME.registerComponent("remove-networked-object-button", {
  init() {
    this.onClick = e => {
      if (!NAF.utils.isMine(this.targetEl) && !NAF.utils.takeOwnership(this.targetEl)) return;

      // HACK currently superhands does not simulate -end events
      // when an object is removed, so we do it here for now to ensure any
      // super hands who have this element are cleared.
      const allSuperHands = document.querySelectorAll("[super-hands]");
      let cleared = 0;
      window.setTimeout(() => {
        for (let i = 1; i < 4; i++) {
          // 0th is the `a-mixin` in hub.html
          const superHands = allSuperHands[i].components["super-hands"];

          superHands.el.emit(superHands.data.grabEndButtons[0], { targetEntity: this.targetEl });
          superHands.el.emit(superHands.data.colliderEndEvent[0], {
            [superHands.data.colliderEndEventProperty]: this.targetEl
          });
          superHands.el.emit(superHands.data.stretchEndButtons[0], this.targetEl);
          superHands.el.emit(superHands.data.dragDropEndButtons[0], this.targetEl);
          superHands.el.emit(superHands.data.activateEndButtons[0], this.targetEl);

          superHands.el.emit(superHands.data.grabEndButtons[0], { targetEntity: this.el });
          superHands.el.emit(superHands.data.colliderEndEvent[0], {
            [superHands.data.colliderEndEventProperty]: this.el
          });
          superHands.el.emit(superHands.data.stretchEndButtons[0], this.el);
          superHands.el.emit(superHands.data.dragDropEndButtons[0], this.el);
          superHands.el.emit(superHands.data.activateEndButtons[0], this.el);
          cleared = cleared + 1;
          if (cleared === 3) {
            window.setTimeout(() => {
              this.targetEl.parentNode.removeChild(this.targetEl);
            }, 0);
          }
        }
      }, 0); // Do work next frame after everything else listening to `grab-start` happens.
    };

    NAF.utils.getNetworkedEntity(this.el).then(networkedEl => {
      this.targetEl = networkedEl;
    });
  },

  play() {
    this.el.addEventListener("grab-start", this.onClick);
  },

  pause() {
    this.el.removeEventListener("grab-start", this.onClick);
  }
});
