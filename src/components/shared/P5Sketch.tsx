import React, { createRef, useEffect } from 'react';

const P5 = require('p5');

/* eslint-disable import/no-mutable-exports */
let p5Instance:any;

async function saveImage(fileName:string) {
  if (!p5Instance) return undefined;
  const canvas = document?.getElementById('defaultCanvas0') as HTMLCanvasElement;
  const dataUrl = canvas.toDataURL();
  const blob = await (await fetch(dataUrl)).blob();
  const file = new File([blob], `${fileName}.jpg`, { type: 'image/jpeg' });
  return file;
}

function P5Sketch({ sketch, config }:{sketch:string, config: { [key: string]: any }}) {
  Object.keys(config).forEach((key:any) => {
    window[key] = config[key];
  });

  const canvas = createRef<HTMLDivElement>();

  useEffect(() => {
    if (canvas.current !== null) {
      p5Instance?.remove();
      p5Instance = new P5(sketch as any, 'p5Id');
    }
  }, [canvas.current]);

  return (
    <div data-testid="canvas" id="p5Id" className="p5Sketch" ref={canvas} />
  );
}

export default P5Sketch;
export { saveImage };
