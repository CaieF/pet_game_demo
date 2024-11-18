import { find, Node, Prefab } from "cc";
import { load } from "../bundle/load";
import { getNodePool } from "../resource/getNodePool";
import { HolIntroduceMessage, HolIntroduceOption } from "../../prefab/HolIntroduceMessage";

export async function preloadIntroduce() {
    const nodePool = getNodePool(await load('prefab/HolIntroduceMessage', Prefab))
    const node = nodePool.get();
    nodePool.put(node);
}

// 弹出消息 
export async function introduce(co: HolIntroduceOption, parent: Node = find('Canvas')): Promise<boolean> {
    const nodePool = getNodePool(await load('prefab/HolIntroduceMessage', Prefab))
    const node = nodePool.get();
    parent.addChild(node);
    const holIntroduceMessage = node.getComponent(HolIntroduceMessage);
    return new Promise(res => {
        holIntroduceMessage.setContent(co);
        holIntroduceMessage.listen('close', () => {
            nodePool.put(node);
        })
    })
}