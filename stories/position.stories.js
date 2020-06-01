import React, {useState} from 'react'
import {Engine, Scene, useHover, useClick} from 'react-babylonjs';
import {Vector3} from '@babylonjs/core/Maths/math';
import {useSprings, useSpring, animated} from '../dist/react-babylon-spring';
import './style.css';

export default {title: 'react babylon spring'};

let alpha = 0;

function WithSpring() {
  const [refSphereHover, isHovering] = useHover(_ => {
    set({
      radius: 10,
    })
  }, _ => {
    set({
      radius: 12,
    })
  });

  const [refSphereClick] = useClick(_ => {
    alpha += Math.PI * 2;
    setProps({
      rotation: [0, alpha, 0]
    })
  });

  const lightProps = useSpring({
    intensity: 1,
    color: [0.9, 0.8, 0.7, 1],
    from: {
      intensity: 0.5
    },
    delay: 1000,
    config: {
      duration: 500,
    },
  });

  const [props, setProps] = useSpring(() => ({
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scaling: isHovering ? [2, 2, 2] : [1, 1, 1],
    color: isHovering ? [0.3, 0.6, 0.9, 1] : [0.9, 0.8, 0.7, 1],
    groundPosition: isHovering ? [0, -3, 0] : [0, 0, 0],
    from: {
      position: [-100, -100, 0],
      rotation: [0, Math.PI * 100, 0],
      color: [0, 0, 0, 1]
    }
  }));

  const [cameraProps, set, stop] = useSpring(() => ({
    alpha,
    beta: Math.PI / 4,
    radius: 12,
    from: {
      beta: Math.PI / 2,
    }
  }));

  const refCb = (instance) => {
    refSphereClick.current = instance;
    refSphereHover.current = instance;
  };

  return (
    <>
      <animated.arcRotateCamera name='camera1' alpha={0} beta={cameraProps.beta} radius={cameraProps.radius}
                         target={Vector3.Zero()}/>
      <animated.hemisphericLight name='light1'
                          diffuse={lightProps.color}
                          intensity={lightProps.intensity}
                          direction={Vector3.Up()}/>
      <animated.sphere ref={refCb} name='sphere1' diameter={3} segments={16}
                scaling={props.scaling}
                position={new Vector3(0, 1.5, 0)}>
        <animated.standardMaterial name='material' diffuseColor={props.color}/>
      </animated.sphere>
      <animated.ground position={props.groundPosition}
                name='ground1' width={6} height={6} subdivisions={2}/>

      <animated.transformNode name='group' rotation={props.rotation} position={props.position}>
        <animated.sphere name='sphere1' diameter={0.4} segments={16}
                  position={new Vector3(4, 2, 0)}>
        </animated.sphere>
      </animated.transformNode>

    </>
  )
}

export const SphereRotate = () => (
  <div style={{flex: 1, display: 'flex'}}>
    <Engine antialias adaptToDeviceRatio canvasId='babylonJS'>
      <Scene>
        <WithSpring/>
      </Scene>
    </Engine>
  </div>
)
