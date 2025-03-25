import { find, Prefab, Node } from "cc";
import { getNodePool } from "../resource/getNodePool";
import { load } from "../bundle/load";
import { HolExchange } from "../../prefab/HolExchange";

export async function preloadExchange() {
    const nodePool = getNodePool(await load("prefab/HolExchange", Prefab))
    const node = nodePool.get()
    nodePool.put(node)
}

export async function exchange(parent: Node = find('Canvas')) {
    const nodePool = getNodePool(await load("prefab/HolExchange", Prefab))
    const node = nodePool.get()
    const holExchange = node.getComponent(HolExchange)
    await holExchange.initEditBox()
    parent.addChild(node)
    holExchange.listen('close', () => nodePool.put(node))
    return node
}