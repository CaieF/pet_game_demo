import { find, Prefab, Node } from "cc";
import { getNodePool } from "../resource/getNodePool";
import { load } from "../bundle/load";
import { HolDrawResource } from "../../prefab/HolDrawResource";

export async function preloadStarMap() {
    const nodePool = getNodePool(await load("prefab/HolStarMap", Prefab))
    const node = nodePool.get()
    nodePool.put(node)
}

export async function starMap(parent: Node = find('Canvas')) {
    const nodePool = getNodePool(await load("prefab/HolStarMap", Prefab))
    const node = nodePool.get()
    node.getChildByName('HolDrawResource').getComponent(HolDrawResource).render()
    parent.addChild(node)
    return node
}