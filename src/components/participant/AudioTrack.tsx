// @livekit/components-react@2.0.4
// Apache-2.0

import { useMediaTrackBySourceOrName } from '../../signals/useMediaTrackBySourceOrName'
import type { TrackReference } from '@livekit/components-core'
import { log } from '@livekit/components-core'
import { RemoteAudioTrack, RemoteTrackPublication } from 'livekit-client'
import { useEnsureTrackRef } from '../../context'
import type { JSX } from 'solid-js/jsx-runtime'
import { createEffect } from 'solid-js'

/** @public */
export interface AudioTrackProps extends JSX.AudioHTMLAttributes<HTMLAudioElement> {
  /** The track reference of the track from which the audio is to be rendered. */
  trackRef?: TrackReference

  onSubscriptionStatusChanged?: (subscribed: boolean) => void
  /** Sets the volume of the audio track. By default, the range is between `0.0` and `1.0`. */
  volume?: number
  /**
   * Mutes the audio track if set to `true`.
   * @remarks
   * If set to `true`, the server will stop sending audio track data to the client.
   * @alpha
   */
  muted?: boolean
}

/**
 * The AudioTrack component is responsible for rendering participant audio tracks.
 * This component must have access to the participant's context, or alternatively pass it a `Participant` as a property.
 *
 * @example
 * ```tsx
 *   <ParticipantTile>
 *     <AudioTrack trackRef={trackRef} />
 *   </ParticipantTile>
 * ```
 *
 * @see `ParticipantTile` component
 * @public
 */
export function AudioTrack({
  trackRef,
  onSubscriptionStatusChanged,
  volume,
  ...props
}: AudioTrackProps) {
  const trackReference = useEnsureTrackRef(trackRef)

  let mediaEl: HTMLAudioElement | undefined

  const { elementProps, isSubscribed, track, publication } = useMediaTrackBySourceOrName(
    trackReference,
    {
      element: () => mediaEl,
      props,
    },
  )

  createEffect(() => {
    onSubscriptionStatusChanged?.(!!isSubscribed())
  })

  createEffect(() => {
    const t = track()
    if (t === undefined || volume === undefined) {
      return
    }
    if (t instanceof RemoteAudioTrack) {
      t.setVolume(volume)
    } else {
      log.warn('Volume can only be set on remote audio tracks.')
    }
  })

  createEffect(() => {
    const pub = publication()
    if (pub === undefined || props.muted === undefined) {
      return
    }
    if (pub instanceof RemoteTrackPublication) {
      pub.setEnabled(!props.muted)
    } else {
      log.warn('Can only call setEnabled on remote track publications.')
    }
  })

  return <audio ref={mediaEl} {...elementProps()} />
}
