"use client"

import { Suspense, useEffect, useMemo, useRef, type ReactNode } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
  Center,
  ContactShadows,
  PerspectiveCamera,
  PresentationControls,
  RoundedBox,
  useGLTF,
} from "@react-three/drei"
import * as THREE from "three"
import type { GearItem } from "./items"
import { debugStore, useDebug, type DeviceParams } from "./debug-store"

// Spin speed comes from the store each frame (getState, no re-render) so dev
// tweaks apply live and hover still accelerates rotation off a plain ref.
// showcase: modulate angular speed by how square-on the front faces the camera
// (front = rotation.y ≡ phase). Slow ~0.2x at front so it lingers there, then
// speed up through the back — a smooth "show the front, then carry on" loop.
function useSpin(hovered: boolean, showcase = false, phase = 0) {
  const ref = useRef<THREE.Group>(null)
  const speed = useRef(0.35)
  useFrame((_, delta) => {
    const { baseSpin, hoverSpin } = debugStore.getState().global
    const target = hovered ? hoverSpin : baseSpin
    speed.current += (target - speed.current) * Math.min(1, delta * 4)
    let scale = 1
    if (showcase && ref.current) {
      // frontness: 1 when the resting face points at camera, 0 at the back
      const frontness = (Math.cos(ref.current.rotation.y - phase) + 1) / 2
      scale = 0.2 + (1 - frontness) * 1.5
    }
    if (ref.current) ref.current.rotation.y += speed.current * scale * delta
  })
  return ref
}

// True while a drag is in progress on this canvas. Lets parallax bow out so it
// doesn't fight PresentationControls. window pointerup catches a release that
// happens outside the canvas.
function useDragging() {
  const dragging = useRef(false)
  const gl = useThree((s) => s.gl)
  useEffect(() => {
    const el = gl.domElement
    const down = () => (dragging.current = true)
    const up = () => (dragging.current = false)
    el.addEventListener("pointerdown", down)
    window.addEventListener("pointerup", up)
    return () => {
      el.removeEventListener("pointerdown", down)
      window.removeEventListener("pointerup", up)
    }
  }, [gl])
  return dragging
}

// Subtle pointer parallax. Leans the model toward the cursor while the inner
// spin keeps turning (nested group: this adds tilt on top of the spin's Y).
// Eases back to neutral when the pointer leaves the card OR while dragging (so
// it doesn't fight the drag-to-rotate).
function Parallax({
  hovered,
  children,
}: {
  hovered: boolean
  children: ReactNode
}) {
  const ref = useRef<THREE.Group>(null)
  const dragging = useDragging()
  useFrame((state) => {
    if (!ref.current) return
    const active = hovered && !dragging.current
    const tx = active ? state.pointer.y * 0.2 : 0
    const ty = active ? state.pointer.x * 0.3 : 0
    ref.current.rotation.x += (tx - ref.current.rotation.x) * 0.08
    ref.current.rotation.y += (ty - ref.current.rotation.y) * 0.08
  })
  return <group ref={ref}>{children}</group>
}

function GLBModel({
  item,
  hovered,
  dp,
  fitTarget,
}: {
  item: GearItem
  hovered: boolean
  dp: DeviceParams
  fitTarget: number
}) {
  const { scene } = useGLTF(item.model!.src, true)
  const cloned = useMemo(() => scene.clone(true), [scene])

  // Normalize any model to a `fitTarget`-unit box regardless of source scale.
  const fitScale = useMemo(() => {
    const box = new THREE.Box3().setFromObject(cloned)
    const size = new THREE.Vector3()
    box.getSize(size)
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    return fitTarget / maxDim
  }, [cloned, fitTarget])

  const spin = useSpin(hovered, item.showcase, dp.rotY)

  return (
    <group ref={spin} rotation={[dp.rotX, dp.rotY, dp.rotZ]}>
      <Center position-y={dp.y} scale={fitScale * dp.scale}>
        <primitive object={cloned} />
      </Center>
    </group>
  )
}

function PrimitiveModel({
  item,
  hovered,
  dp,
}: {
  item: GearItem
  hovered: boolean
  dp: DeviceParams
}) {
  const spin = useSpin(hovered)
  const color = item.accent
  const mat = (
    <meshStandardMaterial color={color} roughness={0.45} metalness={0.35} />
  )

  return (
    <group
      ref={spin}
      position-y={dp.y}
      rotation={[dp.rotX, dp.rotY, dp.rotZ]}
      scale={1.15 * dp.scale}
    >
      {item.shape === "display" && (
        <group>
          <RoundedBox args={[2.4, 1.5, 0.08]} radius={0.06} smoothness={4}>
            {mat}
          </RoundedBox>
          <mesh position={[0, -1.0, 0]}>
            <boxGeometry args={[0.5, 0.5, 0.08]} />
            {mat}
          </mesh>
        </group>
      )}
      {item.shape === "keyboard" && (
        <RoundedBox args={[2.6, 0.22, 1.0]} radius={0.08} smoothness={4}>
          {mat}
        </RoundedBox>
      )}
      {item.shape === "mouse" && (
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1, 1.5, 0.85]}>
          <capsuleGeometry args={[0.55, 0.5, 8, 24]} />
          {mat}
        </mesh>
      )}
      {item.shape === "camera" && (
        <group>
          <RoundedBox args={[1.8, 1.2, 0.7]} radius={0.08} smoothness={4}>
            {mat}
          </RoundedBox>
          <mesh position={[0.1, 0, 0.55]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.42, 0.42, 0.5, 32]} />
            {mat}
          </mesh>
        </group>
      )}
    </group>
  )
}

export default function GearCanvas({
  item,
  hovered,
}: {
  item: GearItem
  hovered: boolean
}) {
  const { global: g, devices } = useDebug()
  const dp = devices[item.id]
  // Per-card lift for models that read too dark (e.g. the black MX Master).
  const lm = item.model?.light ?? 1

  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, g.cameraZ]} fov={g.fov} />
      <ambientLight intensity={g.ambient * lm} />
      <directionalLight position={[3, 4, 5]} intensity={g.keyLight * lm} />
      <directionalLight position={[-4, 2, -3]} intensity={g.fillLight * lm} />
      <Suspense fallback={null}>
        <PresentationControls
          global
          cursor
          snap
          speed={1.2}
          polar={[-0.25, 0.25]}
          azimuth={[-0.5, 0.5]}
          config={{ mass: 1, tension: 200, friction: 26 }}
        >
          <Parallax hovered={hovered}>
            {item.model ? (
              <GLBModel
                item={item}
                hovered={hovered}
                dp={dp}
                fitTarget={g.fitTarget}
              />
            ) : (
              <PrimitiveModel item={item} hovered={hovered} dp={dp} />
            )}
          </Parallax>
        </PresentationControls>
        <ContactShadows
          position={[0, g.shadowY, 0]}
          opacity={g.shadowOpacity}
          scale={g.shadowScale}
          blur={g.shadowBlur}
          far={3}
        />
      </Suspense>
    </Canvas>
  )
}
