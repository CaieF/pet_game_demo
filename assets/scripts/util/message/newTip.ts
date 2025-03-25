import { find, Prefab, Node } from "cc";
import { load } from "../bundle/load";
import { getNodePool } from "../resource/getNodePool";

export async function preloadNewTip() {
    const nodePool = getNodePool(await load("prefab/HolNewTip", Prefab))
    const node = nodePool.get()
    nodePool.put(node)
}

export async function newTip(parent: Node = find('Canvas')) {
    const nodePool = getNodePool(await load("prefab/HolNewTip", Prefab))
    const node = nodePool.get()
    parent.addChild(node)
    return node
}