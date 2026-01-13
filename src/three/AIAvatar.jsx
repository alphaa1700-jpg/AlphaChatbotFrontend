import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useRef } from "react";

export default function AIAvatar({ state }) {
  const ref = useRef();
  const { scene } = useGLTF("/models/ai_avatar.glb");

  useFrame((frameState) => {
    if (!ref.current) return;

    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    const t = Math.min(scrollY / vh, 1);

    // Position & scale (layout-safe)
    ref.current.position.y = 0.3 - t * 1.2;
    ref.current.scale.setScalar(0.9 - t * 0.35);

    // === MOTION ONLY (NO COLOR CHANGES) ===

    // IDLE
    if (state === "idle") {
      ref.current.rotation.y += 0.0015;
      ref.current.position.y +=
        Math.sin(frameState.clock.elapsedTime) * 0.01;
    }

    // THINKING
    if (state === "thinking") {
      ref.current.rotation.y += 0.006;
      ref.current.position.y +=
        Math.sin(frameState.clock.elapsedTime * 6) * 0.02;
    }

    // RESPONDING
    if (state === "responding") {
      ref.current.rotation.y += 0.01;
      ref.current.rotation.x =
        Math.sin(frameState.clock.elapsedTime * 8) * 0.04;
    }
  });

  return (
    <group ref={ref}>
      <primitive object={scene} />
    </group>
  );
}
