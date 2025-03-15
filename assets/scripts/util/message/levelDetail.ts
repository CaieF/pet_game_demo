import { find, Prefab, Node } from "cc";
import { getNodePool } from "../resource/getNodePool";
import { load } from "../bundle/load";
import { HolLevelDetailOption,  HolLevelDetail } from "../../prefab/HolLevelDetail";

export async function preloadLevelDetail() {
    const nodePool = getNodePool(await load("prefab/HolLevelDetail", Prefab))
    const node = nodePool.get()
    nodePool.put(node)
}

export async function levelDetail(co: HolLevelDetailOption, parent: Node = find('Canvas')) {
    const nodePool = getNodePool(await load("prefab/HolLevelDetail", Prefab))
    const node = nodePool.get()
    const holLevelDetail = node.getComponent(HolLevelDetail)
    parent.addChild(node)
    return new Promise(res => {
        holLevelDetail.initLevelDetail(co)
        holLevelDetail.listen("sure", () => {
            res(true)
            holLevelDetail.closeConfirm();
        });
        holLevelDetail.listen('cancel', () => {
            res(false)
            holLevelDetail.closeConfirm();
        })
        holLevelDetail.listen('close', () => {
            nodePool.put(node)
        })
    })
    
    
    return node
}