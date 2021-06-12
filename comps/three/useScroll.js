import { useCallback, useEffect } from 'react'
import { useSpring, config } from '@react-spring/core'
import { useGesture } from 'react-use-gesture'
import clamp from 'lodash/clamp'

export default function useScroll(bounds, props) {
  
  const [{ pos }, set] = useSpring(() => ({ pos: 0, config: config.slow }))

  const fn = useCallback(
    ({ xy: [, cy], previous: [, py], memo = pos.get() }) => {
      const newP = clamp(memo + cy - py, ...bounds)
      set({ pos: newP })
      return newP
    },
    [bounds, pos, set]
  );

  const bind = useGesture({ onWheel: fn, onDrag: fn }, props.config);

  useEffect(() => props.config && props.config.domTarget && bind(), [props.config, bind]);

  //return [y, bind]
  return pos;
}
