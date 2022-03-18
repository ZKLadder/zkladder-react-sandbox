import React, { createRef, useEffect } from 'react';

const P5 = require('p5');

let p5Instance:any;

async function saveImage(fileName:string, width:number, height:number) {
  return new Promise((resolve) => {
    if (!p5Instance) resolve(undefined);

    const image = new Image();
    const canvas = document?.getElementById('defaultCanvas0') as HTMLCanvasElement;
    const dataUrl = canvas.toDataURL();

    image.onload = async () => {
      const resizedCopy = document.createElement('canvas');
      resizedCopy.width = width;
      resizedCopy.height = height;
      resizedCopy?.getContext('2d')?.drawImage(image, 0, 0, width, height);
      const resizedUrl = resizedCopy.toDataURL();
      const blob = await (await fetch(resizedUrl)).blob();
      const file = new File([blob], `${fileName}.jpg`, { type: 'image/jpeg' });
      resolve(file);
    };

    image.src = dataUrl;
  });
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
