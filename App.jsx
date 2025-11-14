import { Parallax } from "react-parallax";
import { Canvas } from "@react-three/fiber";
import GlassCard from "./GlassCard";
import AlertPanel from "./AlertPanel";
import SafeZoneMap from "./SafeZoneMap";

function ThreeDBox() {
  return (
    <mesh rotation={[0.5, 0.25, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#3da9fc" />
    </mesh>
  );
}

export default function App() {
  return (
    <Parallax bgImage="https://images.unsplash.com/photo-1465101046530-73398c7f28ca" strength={450}>
      <div style={{ minHeight: "100vh", padding: 40 }}>
        <Canvas style={{ height: "400px" }}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <ThreeDBox />
        </Canvas>
        <GlassCard>
          <AlertPanel />
        </GlassCard>
        <GlassCard>
          <SafeZoneMap />
        </GlassCard>
        {/* Add more GlassCards for health tips, etc. */}
      </div>
    </Parallax>
  );
}
