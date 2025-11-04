import { CinematicSlideshow } from '@/components/CinematicSlideshow';
import { watchesData } from '@/data/watches-data';

export default function CollectionStories() {
  return (
    <div className="w-full min-h-screen bg-black">
      <CinematicSlideshow watches={watchesData} />
    </div>
  );
}
