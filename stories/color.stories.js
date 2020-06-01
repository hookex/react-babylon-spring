import React, {useState} from 'react'
import {Engine, Scene, useHover} from 'react-babylonjs';
import {Vector3} from '@babylonjs/core/Maths/math';
import {useSprings, useSpring, animated} from '../dist/react-babylon-spring';
import './style.css';

export default {title: 'react babylon spring'};

function WithSpring() {
  const colorProps = useSpring({
    from: {
      color: [0, 0, 1, 1]
    },
    to: async next => {
      while (true) {
        await next({color: [0, 1, 0, 1]})
        await next({color: [1, 0, 0, 1]})
        await next({color: [1, 1, 0, 1]})
        await next({color: [0, 1, 0, 1]})
        await next({color: [0, 1, 1, 1]})
      }
    }
  });

  const [hovered, setHovered] = useState(false);

  const [refGround] = useHover(_ => {
    setHovered(true);
  }, _ => {
    setHovered(false);
  });

  const groundProps = useSpring({
    color: hovered ? [0, 1, 0, 1] : [0, 0, 1, 1],
  });

  return (
    <>
      <freeCamera name='camera1' position={new Vector3(0, 5, -10)} setTarget={[Vector3.Zero()]}/>
      <animated.hemisphericLight name='light1' intensity={0.7} direction={Vector3.Up()}/>
      <sphere name='sphere1' diameter={3} segments={16} position={new Vector3(0, 1.5, 0)}>
        <animated.standardMaterial name='material' diffuseColor={colorProps.color}/>
      </sphere>
      <ground ref={refGround} name='ground1' width={6} height={6} subdivisions={2}>
        <animated.standardMaterial name='ground-material' diffuseColor={groundProps.color}/>
      </ground>
    </>
  )
}

export const ColorChange = () => (
  <div style={{flex: 1, display: 'flex'}}>
    <Engine antialias adaptToDeviceRatio canvasId='babylonJS'>
      <Scene>
        <WithSpring/>
      </Scene>
    </Engine>
  </div>
)
