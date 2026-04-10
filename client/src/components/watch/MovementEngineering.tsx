import { trpc } from "@/lib/trpc";
import { useCreative } from "@/contexts/CreativeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Cog } from "lucide-react";

interface Props {
  watchId: number;
  mainImageUrl: string | null;
}

type AnimationType = "rotate" | "oscillate" | "pulse" | "none";

function buildAnimation(
  type: AnimationType,
  duration: string,
  delay: string,
  direction: string
): string {
  if (type === "rotate") {
    const deg = direction === "ccw" ? "-360deg" : "360deg";
    return `movement-spin-${direction} ${duration} linear ${delay} infinite`;
  }
  if (type === "oscillate") {
    return `movement-oscillate ${duration} ease-in-out ${delay} infinite alternate`;
  }
  if (type === "pulse") {
    return `movement-pulse ${duration} ease-in-out ${delay} infinite alternate`;
  }
  return "none";
}

export function MovementEngineering({ watchId, mainImageUrl }: Props) {
  const { data: layers, isLoading } = trpc.movementLayers.getByWatch.useQuery({ watchId });
  const { isCinematic } = useCreative();
  const { t } = useLanguage();

  const activeLayers = (layers ?? []).sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div className="relative">
      {/* CSS keyframe injection */}
      <style>{`
        @keyframes movement-spin-cw {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes movement-spin-ccw {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes movement-oscillate {
          from { transform: rotate(-15deg); }
          to { transform: rotate(15deg); }
        }
        @keyframes movement-pulse {
          from { transform: scale(0.97); }
          to { transform: scale(1.03); }
        }
      `}</style>

      {/* Outer glow ring (cinematic only) */}
      {isCinematic && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none z-0"
          style={{
            background: "radial-gradient(ellipse at center, rgba(212,175,55,0.12) 0%, transparent 70%)",
            boxShadow: "0 0 60px rgba(212,175,55,0.2)",
          }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Movement visualization */}
      <div className="relative w-full aspect-square max-w-md mx-auto">
        {isLoading ? (
          <div className="w-full h-full rounded-xl bg-gray-900 animate-pulse flex items-center justify-center">
            <Cog className="w-12 h-12 text-gold-500/30 animate-spin" style={{ animationDuration: "3s" }} />
          </div>
        ) : activeLayers.length === 0 ? (
          /* Fallback: show watch image */
          <div className="relative w-full h-full rounded-xl overflow-hidden bg-gray-900">
            {mainImageUrl ? (
              <img
                src={mainImageUrl}
                alt="Watch"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <Cog className="w-16 h-16 text-gold-500/20" />
                <p className="text-gray-600 text-sm text-center">
                  {t("movement.visualizationComingSoon")}
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Layered movement visualization */
          <div className="relative w-full h-full">
            {activeLayers.map((layer) => (
              <img
                key={layer.id}
                src={layer.imageUrl}
                alt={layer.layerName}
                className="absolute inset-0 w-full h-full object-contain"
                style={{
                  zIndex: layer.zIndex,
                  animation: buildAnimation(
                    layer.animationType as AnimationType,
                    layer.animationDuration,
                    layer.animationDelay,
                    layer.rotationDirection
                  ),
                  transformOrigin: "center center",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Layer legend (cinematic mode shows layer names) */}
      {isCinematic && activeLayers.length > 0 && (
        <motion.div
          className="mt-4 flex flex-wrap gap-2 justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {activeLayers.map((layer) => (
            <span
              key={layer.id}
              className="text-xs px-2 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-500/70"
            >
              {layer.layerName}
            </span>
          ))}
        </motion.div>
      )}
    </div>
  );
}
