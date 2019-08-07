const scene = new Entity()
const transform = new Transform({
  position: new Vector3(0, 0, 0),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
scene.addComponentOrReplace(transform)
engine.addEntity(scene)

const point1 = new Vector3(8, 0, 8)
const point2 = new Vector3(8, 0, 24)
const point3 = new Vector3(24, 0, 24)
const point4 = new Vector3(24, 0, 8)
const path: Vector3[] = [point1, point2, point3, point4]
const TURN_TIME = 0.9

@Component("timeOut")
export class TimeOut {
  timeLeft: number
  constructor( time: number){
    this.timeLeft = time
  }
}

export const paused = engine.getComponentGroup(TimeOut)

// LerpData component
@Component("lerpData")
export class LerpData {
  array: Vector3[] = path
  origin: number = 0
  target: number = 1
  fraction: number = 0
}

let gnark = new Entity()
gnark.addComponent(new Transform({
  position: new Vector3(5, 0, 5)
}))

let gnarkShape = new GLTFShape('models/gnark.glb')

gnark.addComponent(gnarkShape)

let gnarkAnimator = new Animator()
gnark.addComponent(gnarkAnimator)

gnark.addComponent(new LerpData())

engine.addEntity(gnark)

//Add walk animation
const walkClip = new AnimationState('walk')
gnarkAnimator.addClip(walkClip)
const turnRClip = new AnimationState('turnRight')
turnRClip.looping = false
gnarkAnimator.addClip(turnRClip)
const raiseDeadClip = new AnimationState('raiseDead')
gnarkAnimator.addClip(raiseDeadClip)

walkClip.play()

// Walk System
export class GnarkWalk {
  update(dt: number) {
    if (!gnark.hasComponent(TimeOut) && !raiseDeadClip.playing ){
      let transform = gnark.getComponent(Transform)
      let path = gnark.getComponent(LerpData)
	  walkClip.playing = true
	  turnRClip.playing = false
      if (path.fraction < 1) {
        path.fraction += dt/12
        transform.position = Vector3.Lerp(
          path.array[path.origin],
          path.array[path.target],
          path.fraction
        ) 
      } else {
        path.origin = path.target
        path.target += 1
        if (path.target >= path.array.length) {
          path.target = 0
        }
        path.fraction = 0
        transform.lookAt(path.array[path.target])
        walkClip.pause()
		turnRClip.play()
		turnRClip.looping = false
        gnark.addComponent(new TimeOut(TURN_TIME))
      }
    }
  }
}

engine.addSystem(new GnarkWalk())

export class WaitSystem {
  update(dt: number) {
    for (let ent of paused.entities){
      let time = ent.getComponentOrNull(TimeOut)
      if (time){
        if (time.timeLeft > 0) {
          time.timeLeft -= dt
        } else {
          ent.removeComponent(TimeOut)
        }
      }
    }
  }
}

engine.addSystem(new WaitSystem())

export class BattleCry {
  update() {
    let transform = gnark.getComponent(Transform)
    let path = gnark.getComponent(LerpData)
    let dist = distance(transform.position, camera.position)
    if ( dist < 16) {
      if(raiseDeadClip.playing == false){
        raiseDeadClip.reset()
        raiseDeadClip.playing = true
        walkClip.playing = false
        turnRClip.playing = false
	  }
	  let playerPos = new Vector3(camera.position.x, 0, camera.position.z)
      transform.lookAt(playerPos)
    }
    else if (raiseDeadClip.playing){
      raiseDeadClip.stop()
      transform.lookAt(path.array[path.target])
    }
  }
}

engine.addSystem(new BattleCry())

const camera = Camera.instance

function distance(pos1: Vector3, pos2: Vector3): number {
  const a = pos1.x - pos2.x
  const b = pos1.z - pos2.z
  return a * a + b * b
}

const treeHouse_01 = new Entity()
treeHouse_01.setParent(scene)
const gltfShape = new GLTFShape('models/TreeHouse_01/TreeHouse_01.glb')
treeHouse_01.addComponentOrReplace(gltfShape)
const transform_2 = new Transform({
  position: new Vector3(25.5, 0, 17),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
treeHouse_01.addComponentOrReplace(transform_2)
engine.addEntity(treeHouse_01)

const fencePicketDoor_01 = new Entity()
fencePicketDoor_01.setParent(scene)
const gltfShape_2 = new GLTFShape('models/FencePicketDoor_01/FencePicketDoor_01.glb')
fencePicketDoor_01.addComponentOrReplace(gltfShape_2)
const transform_3 = new Transform({
  position: new Vector3(16.5, 0, 16.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
fencePicketDoor_01.addComponentOrReplace(transform_3)
engine.addEntity(fencePicketDoor_01)

const fencePicketLarge_01 = new Entity()
fencePicketLarge_01.setParent(scene)
const gltfShape_3 = new GLTFShape('models/FencePicketLarge_01/FencePicketLarge_01.glb')
fencePicketLarge_01.addComponentOrReplace(gltfShape_3)
const transform_4 = new Transform({
  position: new Vector3(16.5, 0, 14.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
fencePicketLarge_01.addComponentOrReplace(transform_4)
engine.addEntity(fencePicketLarge_01)

const fencePicketLarge_01_2 = new Entity()
fencePicketLarge_01_2.setParent(scene)
fencePicketLarge_01_2.addComponentOrReplace(gltfShape_3)
const transform_5 = new Transform({
  position: new Vector3(16.5, 0, 21.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
fencePicketLarge_01_2.addComponentOrReplace(transform_5)
engine.addEntity(fencePicketLarge_01_2)

const fencePicketMedium_01 = new Entity()
fencePicketMedium_01.setParent(scene)
const gltfShape_4 = new GLTFShape('models/FencePicketMedium_01/FencePicketMedium_01.glb')
fencePicketMedium_01.addComponentOrReplace(gltfShape_4)
const transform_6 = new Transform({
  position: new Vector3(16.5, 0, 24.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
fencePicketMedium_01.addComponentOrReplace(transform_6)
engine.addEntity(fencePicketMedium_01)

const fencePicketMedium_01_2 = new Entity()
fencePicketMedium_01_2.setParent(scene)
fencePicketMedium_01_2.addComponentOrReplace(gltfShape_4)
const transform_7 = new Transform({
  position: new Vector3(16.5, 0, 9.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
fencePicketMedium_01_2.addComponentOrReplace(transform_7)
engine.addEntity(fencePicketMedium_01_2)

const floorBaseGrass_02 = new Entity()
floorBaseGrass_02.setParent(scene)
const gltfShape_5 = new GLTFShape('models/FloorBaseGrass_02/FloorBaseGrass_02.glb')
floorBaseGrass_02.addComponentOrReplace(gltfShape_5)
const transform_8 = new Transform({
  position: new Vector3(8, 0, 8),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
floorBaseGrass_02.addComponentOrReplace(transform_8)
engine.addEntity(floorBaseGrass_02)

const floorBaseGrass_02_2 = new Entity()
floorBaseGrass_02_2.setParent(scene)
floorBaseGrass_02_2.addComponentOrReplace(gltfShape_5)
const transform_9 = new Transform({
  position: new Vector3(24, 0, 8),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
floorBaseGrass_02_2.addComponentOrReplace(transform_9)
engine.addEntity(floorBaseGrass_02_2)

const floorBaseGrass_02_3 = new Entity()
floorBaseGrass_02_3.setParent(scene)
floorBaseGrass_02_3.addComponentOrReplace(gltfShape_5)
const transform_10 = new Transform({
  position: new Vector3(8, 0, 24),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
floorBaseGrass_02_3.addComponentOrReplace(transform_10)
engine.addEntity(floorBaseGrass_02_3)

const floorBaseGrass_02_4 = new Entity()
floorBaseGrass_02_4.setParent(scene)
floorBaseGrass_02_4.addComponentOrReplace(gltfShape_5)
const transform_11 = new Transform({
  position: new Vector3(24, 0, 24),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
floorBaseGrass_02_4.addComponentOrReplace(transform_11)
engine.addEntity(floorBaseGrass_02_4)

const treePine_02 = new Entity()
treePine_02.setParent(scene)
const gltfShape_6 = new GLTFShape('models/TreePine_02/TreePine_02.glb')
treePine_02.addComponentOrReplace(gltfShape_6)
const transform_12 = new Transform({
  position: new Vector3(29.5, 0, 26),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
treePine_02.addComponentOrReplace(transform_12)
engine.addEntity(treePine_02)

const treePine_03 = new Entity()
treePine_03.setParent(scene)
const gltfShape_7 = new GLTFShape('models/TreePine_03/TreePine_03.glb')
treePine_03.addComponentOrReplace(gltfShape_7)
const transform_13 = new Transform({
  position: new Vector3(30, 0, 18),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
treePine_03.addComponentOrReplace(transform_13)
engine.addEntity(treePine_03)

const fencePicketLarge_01_3 = new Entity()
fencePicketLarge_01_3.setParent(scene)
fencePicketLarge_01_3.addComponentOrReplace(gltfShape_3)
const transform_14 = new Transform({
  position: new Vector3(16.5, 0, 6.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
fencePicketLarge_01_3.addComponentOrReplace(transform_14)
engine.addEntity(fencePicketLarge_01_3)

const fencePicketLarge_01_4 = new Entity()
fencePicketLarge_01_4.setParent(scene)
fencePicketLarge_01_4.addComponentOrReplace(gltfShape_3)
const transform_15 = new Transform({
  position: new Vector3(16.5, 0, 29.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
fencePicketLarge_01_4.addComponentOrReplace(transform_15)
engine.addEntity(fencePicketLarge_01_4)

const fencePicketSmall_01 = new Entity()
fencePicketSmall_01.setParent(scene)
const gltfShape_8 = new GLTFShape('models/FencePicketSmall_01/FencePicketSmall_01.glb')
fencePicketSmall_01.addComponentOrReplace(gltfShape_8)
const transform_16 = new Transform({
  position: new Vector3(16.5, 0, 30.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
fencePicketSmall_01.addComponentOrReplace(transform_16)
engine.addEntity(fencePicketSmall_01)

const fencePicketLarge_01_5 = new Entity()
fencePicketLarge_01_5.setParent(scene)
fencePicketLarge_01_5.addComponentOrReplace(gltfShape_3)
const transform_17 = new Transform({
  position: new Vector3(31.5, 0, 1.5),
  rotation: new Quaternion(0, 0.7071067811865475, 0, 0.7071067811865475),
  scale: new Vector3(1, 1, 1)
})
fencePicketLarge_01_5.addComponentOrReplace(transform_17)
engine.addEntity(fencePicketLarge_01_5)

const fencePicketLarge_01_6 = new Entity()
fencePicketLarge_01_6.setParent(scene)
fencePicketLarge_01_6.addComponentOrReplace(gltfShape_3)
const transform_18 = new Transform({
  position: new Vector3(21.5, 0, 30.5),
  rotation: new Quaternion(0, 0.7071067811865475, 0, 0.7071067811865475),
  scale: new Vector3(1, 1, 1)
})
fencePicketLarge_01_6.addComponentOrReplace(transform_18)
engine.addEntity(fencePicketLarge_01_6)

const fencePicketLarge_01_7 = new Entity()
fencePicketLarge_01_7.setParent(scene)
fencePicketLarge_01_7.addComponentOrReplace(gltfShape_3)
const transform_19 = new Transform({
  position: new Vector3(31.5, 0, 30.5),
  rotation: new Quaternion(0, 0.7071067811865475, 0, 0.7071067811865475),
  scale: new Vector3(1, 1, 1)
})
fencePicketLarge_01_7.addComponentOrReplace(transform_19)
engine.addEntity(fencePicketLarge_01_7)

const fencePicketLarge_01_8 = new Entity()
fencePicketLarge_01_8.setParent(scene)
fencePicketLarge_01_8.addComponentOrReplace(gltfShape_3)
const transform_20 = new Transform({
  position: new Vector3(21.5, 0, 1.5),
  rotation: new Quaternion(0, 0.7071067811865475, 0, 0.7071067811865475),
  scale: new Vector3(1, 1, 1)
})
fencePicketLarge_01_8.addComponentOrReplace(transform_20)
engine.addEntity(fencePicketLarge_01_8)

const fencePicketLarge_01_9 = new Entity()
fencePicketLarge_01_9.setParent(scene)
fencePicketLarge_01_9.addComponentOrReplace(gltfShape_3)
const transform_21 = new Transform({
  position: new Vector3(26.5, 0, 1.5),
  rotation: new Quaternion(0, 0.7071067811865475, 0, 0.7071067811865475),
  scale: new Vector3(1, 1, 1)
})
fencePicketLarge_01_9.addComponentOrReplace(transform_21)
engine.addEntity(fencePicketLarge_01_9)

const fencePicketLarge_01_10 = new Entity()
fencePicketLarge_01_10.setParent(scene)
fencePicketLarge_01_10.addComponentOrReplace(gltfShape_3)
const transform_22 = new Transform({
  position: new Vector3(26.5, 0, 30.5),
  rotation: new Quaternion(0, 0.7071067811865475, 0, 0.7071067811865475),
  scale: new Vector3(1, 1, 1)
})
fencePicketLarge_01_10.addComponentOrReplace(transform_22)
engine.addEntity(fencePicketLarge_01_10)

const flower_04 = new Entity()
flower_04.setParent(scene)
const gltfShape_9 = new GLTFShape('models/Flower_04/Flower_04.glb')
flower_04.addComponentOrReplace(gltfShape_9)
const transform_23 = new Transform({
  position: new Vector3(5.5, 0, 12),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
flower_04.addComponentOrReplace(transform_23)
engine.addEntity(flower_04)

const bush_03 = new Entity()
bush_03.setParent(scene)
const gltfShape_10 = new GLTFShape('models/Bush_03/Bush_03.glb')
bush_03.addComponentOrReplace(gltfShape_10)
const transform_24 = new Transform({
  position: new Vector3(14, 0, 13),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
bush_03.addComponentOrReplace(transform_24)
engine.addEntity(bush_03)

const bush_03_2 = new Entity()
bush_03_2.setParent(scene)
bush_03_2.addComponentOrReplace(gltfShape_10)
const transform_25 = new Transform({
  position: new Vector3(13.5, 0, 18.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
bush_03_2.addComponentOrReplace(transform_25)
engine.addEntity(bush_03_2)

const treePine_02_2 = new Entity()
treePine_02_2.setParent(scene)
treePine_02_2.addComponentOrReplace(gltfShape_6)
const transform_26 = new Transform({
  position: new Vector3(6, 0, 28.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
treePine_02_2.addComponentOrReplace(transform_26)
engine.addEntity(treePine_02_2)

const treePine_02_3 = new Entity()
treePine_02_3.setParent(scene)
treePine_02_3.addComponentOrReplace(gltfShape_6)
const transform_27 = new Transform({
  position: new Vector3(6, 0, 4.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
treePine_02_3.addComponentOrReplace(transform_27)
engine.addEntity(treePine_02_3)

const treePine_02_4 = new Entity()
treePine_02_4.setParent(scene)
treePine_02_4.addComponentOrReplace(gltfShape_6)
const transform_28 = new Transform({
  position: new Vector3(3, 0, 23),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
treePine_02_4.addComponentOrReplace(transform_28)
engine.addEntity(treePine_02_4)

const treePine_03_2 = new Entity()
treePine_03_2.setParent(scene)
treePine_03_2.addComponentOrReplace(gltfShape_7)
const transform_29 = new Transform({
  position: new Vector3(2, 0, 11.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
treePine_03_2.addComponentOrReplace(transform_29)
engine.addEntity(treePine_03_2)

const treePine_01 = new Entity()
treePine_01.setParent(scene)
const gltfShape_11 = new GLTFShape('models/TreePine_01/TreePine_01.glb')
treePine_01.addComponentOrReplace(gltfShape_11)
const transform_30 = new Transform({
  position: new Vector3(7, 0, 16),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
treePine_01.addComponentOrReplace(transform_30)
engine.addEntity(treePine_01)

const treePine_01_2 = new Entity()
treePine_01_2.setParent(scene)
treePine_01_2.addComponentOrReplace(gltfShape_11)
const transform_31 = new Transform({
  position: new Vector3(11.5, 0, 24.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
treePine_01_2.addComponentOrReplace(transform_31)
engine.addEntity(treePine_01_2)

const treePine_02_5 = new Entity()
treePine_02_5.setParent(scene)
treePine_02_5.addComponentOrReplace(gltfShape_6)
const transform_32 = new Transform({
  position: new Vector3(20, 0, 24),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
treePine_02_5.addComponentOrReplace(transform_32)
engine.addEntity(treePine_02_5)

const treePine_03_3 = new Entity()
treePine_03_3.setParent(scene)
treePine_03_3.addComponentOrReplace(gltfShape_7)
const transform_33 = new Transform({
  position: new Vector3(20.5, 0, 6.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
treePine_03_3.addComponentOrReplace(transform_33)
engine.addEntity(treePine_03_3)

const treeStump_01 = new Entity()
treeStump_01.setParent(scene)
const gltfShape_12 = new GLTFShape('models/TreeStump_01/TreeStump_01.glb')
treeStump_01.addComponentOrReplace(gltfShape_12)
const transform_34 = new Transform({
  position: new Vector3(12.5, 0, 5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
treeStump_01.addComponentOrReplace(transform_34)
engine.addEntity(treeStump_01)

const farmVegetation_01 = new Entity()
farmVegetation_01.setParent(scene)
const gltfShape_13 = new GLTFShape('models/FarmVegetation_01/FarmVegetation_01.glb')
farmVegetation_01.addComponentOrReplace(gltfShape_13)
const transform_35 = new Transform({
  position: new Vector3(25, 0, 12.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
farmVegetation_01.addComponentOrReplace(transform_35)
engine.addEntity(farmVegetation_01)

const farmVegetation_01_2 = new Entity()
farmVegetation_01_2.setParent(scene)
farmVegetation_01_2.addComponentOrReplace(gltfShape_13)
const transform_36 = new Transform({
  position: new Vector3(25, 0, 13.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
farmVegetation_01_2.addComponentOrReplace(transform_36)
engine.addEntity(farmVegetation_01_2)

const farmVegetation_02 = new Entity()
farmVegetation_02.setParent(scene)
const gltfShape_14 = new GLTFShape('models/FarmVegetation_02/FarmVegetation_02.glb')
farmVegetation_02.addComponentOrReplace(gltfShape_14)
const transform_37 = new Transform({
  position: new Vector3(25, 0, 11.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
farmVegetation_02.addComponentOrReplace(transform_37)
engine.addEntity(farmVegetation_02)

const farmVegetation_02_2 = new Entity()
farmVegetation_02_2.setParent(scene)
farmVegetation_02_2.addComponentOrReplace(gltfShape_14)
const transform_38 = new Transform({
  position: new Vector3(25, 0, 10.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
farmVegetation_02_2.addComponentOrReplace(transform_38)
engine.addEntity(farmVegetation_02_2)

const farmVegetation_01_3 = new Entity()
farmVegetation_01_3.setParent(scene)
farmVegetation_01_3.addComponentOrReplace(gltfShape_13)
const transform_39 = new Transform({
  position: new Vector3(25, 0, 9.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
farmVegetation_01_3.addComponentOrReplace(transform_39)
engine.addEntity(farmVegetation_01_3)

const log_01 = new Entity()
log_01.setParent(scene)
const gltfShape_15 = new GLTFShape('models/Log_01/Log_01.glb')
log_01.addComponentOrReplace(gltfShape_15)
const transform_40 = new Transform({
  position: new Vector3(25.5, 0, 24),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
log_01.addComponentOrReplace(transform_40)
engine.addEntity(log_01)

const mushroom_01 = new Entity()
mushroom_01.setParent(scene)
const gltfShape_16 = new GLTFShape('models/Mushroom_01/Mushroom_01.glb')
mushroom_01.addComponentOrReplace(gltfShape_16)
const transform_41 = new Transform({
  position: new Vector3(21, 0, 24),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
mushroom_01.addComponentOrReplace(transform_41)
engine.addEntity(mushroom_01)

const mushroom_02 = new Entity()
mushroom_02.setParent(scene)
const gltfShape_17 = new GLTFShape('models/Mushroom_02/Mushroom_02.glb')
mushroom_02.addComponentOrReplace(gltfShape_17)
const transform_42 = new Transform({
  position: new Vector3(20, 0, 10),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
mushroom_02.addComponentOrReplace(transform_42)
engine.addEntity(mushroom_02)

const plant_02 = new Entity()
plant_02.setParent(scene)
const gltfShape_18 = new GLTFShape('models/Plant_02/Plant_02.glb')
plant_02.addComponentOrReplace(gltfShape_18)
const transform_43 = new Transform({
  position: new Vector3(21.5, 0, 23),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
plant_02.addComponentOrReplace(transform_43)
engine.addEntity(plant_02)

const plant_02_2 = new Entity()
plant_02_2.setParent(scene)
plant_02_2.addComponentOrReplace(gltfShape_18)
const transform_44 = new Transform({
  position: new Vector3(7.5, 0, 16),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
plant_02_2.addComponentOrReplace(transform_44)
engine.addEntity(plant_02_2)

const plant_03 = new Entity()
plant_03.setParent(scene)
const gltfShape_19 = new GLTFShape('models/Plant_03/Plant_03.glb')
plant_03.addComponentOrReplace(gltfShape_19)
const transform_45 = new Transform({
  position: new Vector3(5, 0, 3.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
plant_03.addComponentOrReplace(transform_45)
engine.addEntity(plant_03)

const treeStump_01_2 = new Entity()
treeStump_01_2.setParent(scene)
treeStump_01_2.addComponentOrReplace(gltfShape_12)
const transform_46 = new Transform({
  position: new Vector3(9.5, 0, 29.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
treeStump_01_2.addComponentOrReplace(transform_46)
engine.addEntity(treeStump_01_2)

const rockSmall_02 = new Entity()
rockSmall_02.setParent(scene)
const gltfShape_20 = new GLTFShape('models/RockSmall_02/RockSmall_02.glb')
rockSmall_02.addComponentOrReplace(gltfShape_20)
const transform_47 = new Transform({
  position: new Vector3(11.5, 0, 29),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
rockSmall_02.addComponentOrReplace(transform_47)
engine.addEntity(rockSmall_02)

const mushroom_01_2 = new Entity()
mushroom_01_2.setParent(scene)
mushroom_01_2.addComponentOrReplace(gltfShape_16)
const transform_48 = new Transform({
  position: new Vector3(27.5, 0, 4.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
mushroom_01_2.addComponentOrReplace(transform_48)
engine.addEntity(mushroom_01_2)

const mushroom_01_3 = new Entity()
mushroom_01_3.setParent(scene)
mushroom_01_3.addComponentOrReplace(gltfShape_16)
const transform_49 = new Transform({
  position: new Vector3(7, 0, 4.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
mushroom_01_3.addComponentOrReplace(transform_49)
engine.addEntity(mushroom_01_3)

const mushroom_02_2 = new Entity()
mushroom_02_2.setParent(scene)
mushroom_02_2.addComponentOrReplace(gltfShape_17)
const transform_50 = new Transform({
  position: new Vector3(2.5, 0, 23),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
mushroom_02_2.addComponentOrReplace(transform_50)
engine.addEntity(mushroom_02_2)

const mushroom_01_4 = new Entity()
mushroom_01_4.setParent(scene)
mushroom_01_4.addComponentOrReplace(gltfShape_16)
const transform_51 = new Transform({
  position: new Vector3(6.5, 0, 16),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
mushroom_01_4.addComponentOrReplace(transform_51)
engine.addEntity(mushroom_01_4)

const log_02 = new Entity()
log_02.setParent(scene)
const gltfShape_21 = new GLTFShape('models/Log_02/Log_02.glb')
log_02.addComponentOrReplace(gltfShape_21)
const transform_52 = new Transform({
  position: new Vector3(8, 0, 28.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
log_02.addComponentOrReplace(transform_52)
engine.addEntity(log_02)

const log_02_2 = new Entity()
log_02_2.setParent(scene)
log_02_2.addComponentOrReplace(gltfShape_21)
const transform_53 = new Transform({
  position: new Vector3(3.5, 0, 10),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
log_02_2.addComponentOrReplace(transform_53)
engine.addEntity(log_02_2)

const mushroom_01_5 = new Entity()
mushroom_01_5.setParent(scene)
mushroom_01_5.addComponentOrReplace(gltfShape_16)
const transform_54 = new Transform({
  position: new Vector3(13.5, 0, 12),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
mushroom_01_5.addComponentOrReplace(transform_54)
engine.addEntity(mushroom_01_5)

const plant_02_3 = new Entity()
plant_02_3.setParent(scene)
plant_02_3.addComponentOrReplace(gltfShape_18)
const transform_55 = new Transform({
  position: new Vector3(13, 0, 21),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
plant_02_3.addComponentOrReplace(transform_55)
engine.addEntity(plant_02_3)

const plant_02_4 = new Entity()
plant_02_4.setParent(scene)
plant_02_4.addComponentOrReplace(gltfShape_18)
const transform_56 = new Transform({
  position: new Vector3(8.5, 0, 17.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
plant_02_4.addComponentOrReplace(transform_56)
engine.addEntity(plant_02_4)

const plant_03_2 = new Entity()
plant_03_2.setParent(scene)
plant_03_2.addComponentOrReplace(gltfShape_19)
const transform_57 = new Transform({
  position: new Vector3(22, 0, 22),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
plant_03_2.addComponentOrReplace(transform_57)
engine.addEntity(plant_03_2)

const plant_02_5 = new Entity()
plant_02_5.setParent(scene)
plant_02_5.addComponentOrReplace(gltfShape_18)
const transform_58 = new Transform({
  position: new Vector3(19.5, 0, 10),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
plant_02_5.addComponentOrReplace(transform_58)
engine.addEntity(plant_02_5)

const plant_03_3 = new Entity()
plant_03_3.setParent(scene)
plant_03_3.addComponentOrReplace(gltfShape_19)
const transform_59 = new Transform({
  position: new Vector3(13.5, 0, 5.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
plant_03_3.addComponentOrReplace(transform_59)
engine.addEntity(plant_03_3)

const plant_01 = new Entity()
plant_01.setParent(scene)
const gltfShape_22 = new GLTFShape('models/Plant_01/Plant_01.glb')
plant_01.addComponentOrReplace(gltfShape_22)
const transform_60 = new Transform({
  position: new Vector3(9.5, 0, 9.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
plant_01.addComponentOrReplace(transform_60)
engine.addEntity(plant_01)


const treasure_chest_01 = new Entity()
treasure_chest_01.setParent(scene)
const gltfShape_23 = new GLTFShape('models/TreasureChest/model.gltf')
treasure_chest_01.addComponentOrReplace(gltfShape_23)
const transform_65 = new Transform({
  position: new Vector3(10, 10, 5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(2, 2, 2)
})
treasure_chest_01.addComponentOrReplace(transform_65)
engine.addEntity(treasure_chest_01)


const treePine_03_4 = new Entity()
treePine_03_4.setParent(scene)
treePine_03_4.addComponentOrReplace(gltfShape_7)
const transform_61 = new Transform({
  position: new Vector3(30, 0, 5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
treePine_03_4.addComponentOrReplace(transform_61)
engine.addEntity(treePine_03_4)

const treePine_03_5 = new Entity()
treePine_03_5.setParent(scene)
treePine_03_5.addComponentOrReplace(gltfShape_7)
const transform_62 = new Transform({
  position: new Vector3(30, 0, 9.5),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
treePine_03_5.addComponentOrReplace(transform_62)
engine.addEntity(treePine_03_5)

const treePine_03_6 = new Entity()
treePine_03_6.setParent(scene)
treePine_03_6.addComponentOrReplace(gltfShape_7)
const transform_63 = new Transform({
  position: new Vector3(30, 0, 14),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
treePine_03_6.addComponentOrReplace(transform_63)
engine.addEntity(treePine_03_6)

const treePine_02_6 = new Entity()
treePine_02_6.setParent(scene)
treePine_02_6.addComponentOrReplace(gltfShape_6)
const transform_64 = new Transform({
  position: new Vector3(30, 0, 22),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
treePine_02_6.addComponentOrReplace(transform_64)
engine.addEntity(treePine_02_6)