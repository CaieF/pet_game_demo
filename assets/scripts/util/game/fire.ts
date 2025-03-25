import { find, Prefab, Node } from "cc";
import { getNodePool } from "../resource/getNodePool";
import { load } from "../bundle/load";

export async function preloadFire() {
    const nodePool = getNodePool(await load("prefab/GameFire", Prefab))
    const node = nodePool.get()
    nodePool.put(node)
}

export async function Fire(parent: Node = find('Canvas/GameNode')) {
    const nodePool = getNodePool(await load("prefab/GameFire", Prefab))
    const node = nodePool.get()
    parent.addChild(node)
    return node
}