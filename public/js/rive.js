import mainScript from './script.js';


async function character(canvas) {
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
        riveLoaded();

        const inputs = canvasCharacter.stateMachineInputs("character-states");

        

        const frontWalk = inputs.find((i) => i.name === "front-walk");
        const backWalk = inputs.find((i) => i.name === "back-walk");
        const leftWalk = inputs.find((i) => i.name === "left-walk");
        const rightWalk = inputs.find((i) => i.name === "right-walk");

        // mainScript.initAnims(frontWalk, backWalk, leftWalk, rightWalk);
  
      },
    });

    function riveLoaded(){
      console.log(canvasCharacter.animator.stateMachines);
      const stateMachine = canvasCharacter.animator.stateMachines
      mainScript.sendRiveStateMachine(stateMachine);
    };

}


export default {
    character
}