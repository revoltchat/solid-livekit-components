// @livekit/components-react@2.0.4
// Apache-2.0

import type { TrackReference, TrackReferenceOrPlaceholder } from '@livekit/components-core'
import { TrackRefContext } from '../context/track-reference-context'
import { Accessor, Component, For } from 'solid-js'

/** @public */
export interface TrackLoopProps {
  /** Track references to loop over. You can the use `useTracks()` hook to get TrackReferences. */
  tracks: Accessor<TrackReference[] | TrackReferenceOrPlaceholder[]>
  /** The template component to be used in the loop. */
  children: Component
}

/**
 * The `TrackLoop` component loops over tracks. It is for example a easy way to loop over all participant camera and screen share tracks.
 * `TrackLoop` creates a `TrackRefContext` for each track that you can use to e.g. render the track.
 *
 * @example
 * ```tsx
 * const trackRefs = useTracks([Track.Source.Camera]);
 * <TrackLoop tracks={trackRefs} >
 *  <TrackRefContext.Consumer>
 *    {(trackRef) => trackRef && <VideoTrack trackRef={trackRef}/>}
 *  </TrackRefContext.Consumer>
 * <TrackLoop />
 * ```
 * @public
 */
export function TrackLoop({ tracks, ...props }: TrackLoopProps) {
  return (
    <For each={tracks()}>
      {trackReference => (
        <TrackRefContext.Provider value={trackReference}>
          {props.children({})}
        </TrackRefContext.Provider>
      )}
    </For>
  )
}
