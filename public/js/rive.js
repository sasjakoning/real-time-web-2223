import mainScript from './script.js';

// Initialize Rive and load character
async function character(canvas, id, skin) {
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


        if(skin == "skin0"){
          skins.value = 0;
        } else if(skin == "skin1"){
          skins.value = 1;
        } else if(skin == "skin2"){
          skins.value = 2;
        }

        mainScript.initAnims(frontWalk, backWalk, leftWalk, rightWalk, skins, id);
  
      },
    });
}


export default {
    character
}