// @livekit/components-react@2.0.4
// Apache-2.0

import { connectionStateObserver } from '@livekit/components-core'
import type { Room } from 'livekit-client'
import { useEnsureRoom } from '../context'
import { useObservableState } from './internal'
import { createMemo } from 'solid-js'

/**
 * The `useConnectionState` hook allows you to simply implement your own `ConnectionState` component.
 *
 * @example
 * ```tsx
 * const connectionState = useConnectionState(room);
 * ```
 * @public
 */
export function useConnectionState(room?: Room) {
  // passed room takes precedence, if not supplied get current room context
  const r = useEnsureRoom(room)
  const observable = createMemo(() => connectionStateObserver(r), [r])
  const connectionState = useObservableState(observable(), r.state)
  return connectionState
}
