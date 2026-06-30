'use client';

import AddTrackButton from '../../buttons/AddTrackButton';
import AiButton from '../../buttons/AiButton';

export default function ActionButtons() {
  return (
    <div className="flex shrink-0 items-center gap-3">
      <AiButton className="hidden md:flex" />
      <AddTrackButton />
    </div>
  );
}
