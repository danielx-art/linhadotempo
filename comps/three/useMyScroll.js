import { useCallback, useEffect } from 'react'
import { useSpring, config } from '@react-spring/core'
import { useGesture } from '@use-gesture/react'

export default function useMyScroll(bounds, props) {
  
  const [{ pos }, set] = useSpring(() => ({ pos: 0, config: config.slow }))

  const fn = useCallback(
    ({ xy: [, cy], previous: [, py], memo = pos.get() }) => {
      const newP = memo + cy - py;
      set({ pos: newP })
      return newP
    },
    [bounds, pos, set]
  );

  const bind = useGesture(
    { 
      onWheel: fn
    }, 
    props.config
  );

  //useEffect(() => props.config && props.config.domTarget && bind(), [props.config, bind]);

  return pos;
}
