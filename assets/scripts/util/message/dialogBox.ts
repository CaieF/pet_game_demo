import { find, Prefab, Node } from "cc";
import { getNodePool } from "../resource/getNodePool";
import { load } from "../bundle/load";
import { HolDialogBox, HolDialogBoxOption } from "../../prefab/HolDialogBox";

export async function preloadDialogBox() {
  const nodePool = getNodePool(await load("prefab/HolDialogBox", Prefab));
  const node = nodePool.get();
  nodePool.put(node);
}

export async function dialogBox(co: HolDialogBoxOption, parent: Node = find('Canvas')) {
  const nodePool = getNodePool(await load("prefab/HolDialogBox", Prefab));
  const node = nodePool.get();
  const holDialogBox = node.getComponent(HolDialogBox)
  await holDialogBox.initDialogBox(co.dialog)
  parent.addChild(node);
  holDialogBox.listen('close', () => {
    nodePool.put(node);
  })
  return node
}