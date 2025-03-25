import { find, Prefab, Node } from "cc";
import { getNodePool } from "../resource/getNodePool";
import { load } from "../bundle/load";
import { CharacterBagpack } from "../../scenes/Team/Canvas/CharacterBagpack";
import { CharacterTeamQueue } from "../../scenes/Team/Canvas/CharacterTeamQueue";

export async function preloadTeam() {
    const nodePool = getNodePool(await load("prefab/HolTeam", Prefab))
    const node = nodePool.get()
    nodePool.put(node)
}

export async function team(parent: Node = find('Canvas')) {
    const nodePool = getNodePool(await load("prefab/HolTeam", Prefab))
    const node = nodePool.get()
    parent.addChild(node)
    await node.getChildByName('CharacterBagpack').getComponent(CharacterBagpack).renderAllCharacter();
    await node.getChildByName('CharacterTeamQueue').getComponent(CharacterTeamQueue).renderAllCharacter();
    return node
}