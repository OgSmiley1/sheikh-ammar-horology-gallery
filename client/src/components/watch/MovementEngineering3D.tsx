import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture, Environment } from "@react-three/drei";
import * as THREE from "three";
import { Cog } from "lucide-react";

interface MeshProps {
  textureUrl: string;
}

function WatchMovementMesh({ textureUrl }: MeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(textureUrl);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <cylinderGeometry args={[1.5, 1.5, 0.18, 64]} />
      <meshStandardMaterial
        map={texture}
        metalness={0.85}
        roughness={0.15}
        envMapIntensity={1.2}
      />
    </mesh>
  );
}

function GoldRingMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y -= delta * 0.15;
      meshRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[1.65, 0.04, 16, 100]} />
      <meshStandardMaterial color="#d4af37" metalness={0.95} roughness={0.05} />
    </mesh>
  );
}

function Loader() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-950 rounded-xl">
      <Cog className="w-10 h-10 text-gold-500/40 animate-spin" style={{ animationDuration: "2s" }} />
    </div>
  );
}

interface Props {
  imageUrl: string;
}

export function MovementEngineering3D({ imageUrl }: Props) {
  return (
    <div className="w-full aspect-square max-w-md mx-auto rounded-xl overflow-hidden bg-gray-950">
      <Suspense fallback={<Loader />}>
        <Canvas
          camera={{ position: [0, 1.2, 3.5], fov: 45 }}
          shadows
          gl={{ antialias: true, alpha: true }}
        >
          {/* Lighting — warm gold tones */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[4, 6, 4]}
            intensity={1.5}
            color="#fff8e7"
            castShadow
          />
          <pointLight position={[-3, 2, -3]} intensity={0.6} color="#d4af37" />
          <pointLight position={[3, -1, 3]} intensity={0.3} color="#c0a050" />

          {/* Environment for reflections */}
          <Environment preset="studio" />

          {/* Watch movement disc */}
          <WatchMovementMesh textureUrl={imageUrl} />

          {/* Decorative gold bezel ring */}
          <GoldRingMesh />

          {/* User interaction */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.8}
            autoRotate={false}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
