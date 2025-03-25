import { find, Prefab, Node } from "cc";
import { getNodePool } from "../resource/getNodePool";
import { util } from "../util";


export async function preloadBook() {
    const nodePool = getNodePool(await util.bundle.load("prefab/HolBook", Prefab))
    const node = nodePool.get()
    nodePool.put(node)
}

export async function book(parent: Node = find('Canvas')) {
    const nodePool = getNodePool(await util.bundle.load("prefab/HolBook", Prefab))
    const node = nodePool.get()
    parent.addChild(node)
    return node
}