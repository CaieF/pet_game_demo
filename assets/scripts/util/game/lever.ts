import { find, Prefab, Node } from "cc";
import { getNodePool } from "../resource/getNodePool";
import { load } from "../bundle/load";
import { LeverGame } from "../../scenes/Game/Lever/LeverGame";

export async function preloadLever() {
    const nodePool = getNodePool(await load("prefab/GameLever", Prefab))
    const node = nodePool.get()
    nodePool.put(node)
}

export async function Lever(parent: Node = find('Canvas/GameNode')) {
    const nodePool = getNodePool(await load("prefab/GameLever", Prefab))
    const node = nodePool.get()
    parent.addChild(node)
    await node.getComponent(LeverGame).initGame()
    return node
}