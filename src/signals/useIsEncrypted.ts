// @livekit/components-react@2.0.4
// Apache-2.0

import { LocalParticipant, Participant } from 'livekit-client'
import { encryptionStatusObservable } from '@livekit/components-core'
import { useEnsureParticipant, useEnsureRoom } from '../context'
import { useObservableState } from './internal'
import { createMemo } from 'solid-js'

/**
 * @alpha
 */
export function useIsEncrypted(participant?: Participant) {
  const p = useEnsureParticipant(participant)
  const room = useEnsureRoom()

  const observer = createMemo(() => encryptionStatusObservable(room(), p))
  const isEncrypted = useObservableState(
    observer(),
    p instanceof LocalParticipant ? p.isE2EEEnabled : p.isEncrypted,
  )
  return isEncrypted
}
