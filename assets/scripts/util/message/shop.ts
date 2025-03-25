import { find, Prefab, Node } from "cc";
import { getNodePool } from "../resource/getNodePool";
import { load } from "../bundle/load";
import { ShopAllGoods } from "../../scenes/Shop/Canvas/ShopAllGoods";
import { HolUserResource } from "../../prefab/HolUserResource";

export async function preloadShop() {
    const nodePool = getNodePool(await load("prefab/HolShop", Prefab))
    const node = nodePool.get()
    nodePool.put(node)
}

export async function shop(parent: Node = find('Canvas')) {
    const nodePool = getNodePool(await load("prefab/HolShop", Prefab))
    const node = nodePool.get()
    parent.addChild(node)
    await node.getChildByName('AllGoods').getComponent(ShopAllGoods).renderAllGoods();
    await node.getChildByName('HolUserResource').getComponent(HolUserResource).render();
    return node
}