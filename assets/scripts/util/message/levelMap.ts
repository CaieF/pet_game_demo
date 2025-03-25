import { find, Prefab, Node } from "cc";
import { getNodePool } from "../resource/getNodePool";
import { load } from "../bundle/load";
import { LevelList } from "../../scenes/LevelMap/Canvas/LevelList";

export async function preloadLevelMap() {
    const nodePool = getNodePool(await load("prefab/HolLevelMap", Prefab))
    const node = nodePool.get()
    nodePool.put(node)
}

export async function levelMap(parent: Node = find('Canvas')) {
    const nodePool = getNodePool(await load("prefab/HolLevelMap", Prefab))
    const node = nodePool.get()
    parent.addChild(node)
    await node.getChildByName('LevelList').getComponent(LevelList).renderAllLevels();
    return node
}