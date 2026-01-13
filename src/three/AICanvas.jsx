import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";

export default function AICanvas({ children }) {
  return (
    <Canvas
  camera={{ position: [0, 0, 3], fov: 45 }}
  style={{
    position: "fixed",
    inset: 0,
    zIndex: 0,
  }}
>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 3]} intensity={1} />

      {/* Environment */}
      <Environment preset="night" />

      {/* Controls (locked for now) */}
      <OrbitControls enableZoom={false} enablePan={false} />

      {children}
    </Canvas>
  );
}
