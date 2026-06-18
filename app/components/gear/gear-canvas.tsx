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

function useSpin(hovered: boolean, showcase = false, phase = 0) {
  const ref = useRef<THREE.Group>(null)
  const speed = useRef(0.35)
  useFrame((_, delta) => {
    const { baseSpin, hoverSpin } = debugStore.getState().global
    const target = hovered ? hoverSpin : baseSpin
    speed.current += (target - speed.current) * Math.min(1, delta * 4)
    let scale = 1
    if (showcase && ref.current) {
      const frontness = (Math.cos(ref.current.rotation.y - phase) + 1) / 2
      scale = 0.2 + (1 - frontness) * 1.5
    }
    if (ref.current) ref.current.rotation.y += speed.current * scale * delta
  })
  return ref
}

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
  const mat = (
    <meshStandardMaterial color={item.accent} roughness={0.45} metalness={0.35} />
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

// Mounts only after its Suspense parent resolves (i.e. the GLB has loaded), so
// it's the signal the card uses to drop its loader. Fires once.
function Ready({ onReady }: { onReady?: () => void }) {
  const fired = useRef(false)
  useEffect(() => {
    if (fired.current) return
    fired.current = true
    onReady?.()
  })
  return null
}

export default function GearCanvas({
  item,
  hovered,
  active,
  onReady,
}: {
  item: GearItem
  hovered: boolean
  /** in/near viewport. Drives frameloop: render only on-screen. Off-screen the
   *  canvas freezes on its last frame (model stays — no unmount pop) and the
   *  GPU idles. */
  active: boolean
  /** called once the model has resolved, so the card can fade out its loader. */
  onReady?: () => void
}) {
  const { global: g, devices } = useDebug()
  const dp = devices[item.id]
  const lm = item.model?.light ?? 1

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.75]}
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
        <Ready onReady={onReady} />
      </Suspense>
    </Canvas>
  )
}
