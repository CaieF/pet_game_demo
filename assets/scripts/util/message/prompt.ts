import { find, Prefab, Node } from "cc";
import { load } from "../bundle/load";
import { getNodePool } from "../resource/getNodePool";
import { HolPromptMessage, PromptMessageOption } from "../../prefab/HolPromptMessage";


// 预加载框
export async function preloadPrompt() {
    const nodePool = getNodePool(await load("prefab/HolPromptMessage", Prefab))
    const node = nodePool.get();
    nodePool.put(node);
}

// 弹出消息 返回一个Promise 确认的话返回true 否则返回false
export async function prompt(co: PromptMessageOption, parent: Node = find("Canvas")): Promise<void> {
    const nodePool = getNodePool(await load("prefab/HolPromptMessage", Prefab));
    const node = nodePool.get();
    parent.addChild(node);
    const holPromptMessage = node.getComponent(HolPromptMessage);
    holPromptMessage.setContent(co);
    return new Promise(res => {
        holPromptMessage.listen("close", () => {
            nodePool.put(node);
            res();
        })
        return;
    })
}