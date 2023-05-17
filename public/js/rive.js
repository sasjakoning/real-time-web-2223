import mainScript from './script.js';

// Initialize Rive and load character
async function character(canvas, id) {
    const canvasCharacter = await new rive.Rive({
      src: './images/character.riv',
      canvas: canvas,
      autoplay: true,
      stateMachines: 'character-states',
      artboard: 'character',
      fit: rive.Fit.cover,
      onLoad: (_) => {
        console.log("rive file loaded");
        canvasCharacter.resizeDrawingSurfaceToCanvas();

        const inputs = canvasCharacter.stateMachineInputs("character-states");

        const frontWalk = inputs.find((i) => i.name === "front-walk");
        const backWalk = inputs.find((i) => i.name === "back-walk");
        const leftWalk = inputs.find((i) => i.name === "left-walk");
        const rightWalk = inputs.find((i) => i.name === "right-walk");
        const skins = inputs.find((i) => i.name === "skin");
        console.log(skins)

        // set skins to random whole number between 0 and 2

        skins.value = Math.floor(Math.random() * 3);

        mainScript.initAnims(frontWalk, backWalk, leftWalk, rightWalk, skins, id);
  
      },
    });
}


export default {
    character
}