import { load } from "./bundle/load"
import { loadDir } from "./bundle/loadDir"
import { confirm, preloadConfirm } from "./message/confirm"
import { preloadPrompt, prompt } from "./message/prompt"
import { error } from "./out/error"
import { log } from "./out/log"
import { getNodePool } from "./resource/getNodePool"
import { load as loadMessage, preloadLoad } from "./message/load"
import { introduce, preloadIntroduce } from "./message/introduce"
import { moveNodeToPosition } from "./subdry/moveNodeToPosition"
import { formateNumber } from "./subdry/formateNumber"
import { sceneDirector } from "./subdry/sceneDirector"
import { levelUpNeedGold, levelStarNeedSoule, getTotalGoldCost, getTotalSoulCost, getDecomposeGoldSoul, levelUpNeedGoldByNum, getMaxLevelByGold, } from "./subdry/resourceCost"
import { dialogBox, preloadDialogBox } from "./message/dialogBox"
import { levelDetail, preloadLevelDetail } from "./message/levelDetail"
import { exchange, preloadExchange } from "./message/exchange"
import { newTip, preloadNewTip } from "./message/newTip"
import { preloadStarMap, starMap } from "./message/starMap"
import { book, preloadBook } from "./message/book"
import { preloadTeam, team } from "./message/team"
import { levelMap, preloadLevelMap } from "./message/levelMap"
import { preloadShop, shop } from "./message/shop"
import { Lever, preloadLever } from "./game/lever"
import { preloadRiver, River } from "./game/river"
import { Fire, preloadFire } from "./game/fire"

export const util = {
    // 输出对象
    out: {
        log, // 输出日志
        error, // 输出错误
    },
    // bundle资源
    bundle: {
        load, // 加载数据
        loadDir, // 加载文件
    },
    // 节点等资源
    resource: {
        getNodePool, // 获取一个节点池
    },
    // 消息提示 弹框等资源
    message: {
        prompt, // 提示框
        preloadPrompt, // 预加载提示框
        confirm, // 确认框
        preloadConfirm, // 预加载确认框
        load: loadMessage, // 加载框
        preloadLoad, // 预加载加载框
        introduce, // 介绍
        preloadIntroduce, // 预加载加载框
        dialogBox, // 对话弹框
        preloadDialogBox, // 预加载对话弹框
        preloadLevelDetail, // 预加载关卡详情弹框
        levelDetail, // 关卡详情弹框
        preloadExchange, // 预加载兑换弹框
        exchange, // 兑换弹框
        preloadNewTip, // 预加载新手提示框
        newTip, // 新手提示框
        preloadStarMap, // 预加载星图弹框
        starMap, // 星图弹框
        preloadBook, // 预加载书籍弹框
        book, // 书籍弹框
        preloadTeam, // 预加载队伍弹框
        team, // 队伍弹框
        preloadLevelMap, // 预加载关卡地图弹框
        levelMap, // 关卡地图弹框
        preloadShop, // 预加载商店弹框
        shop, // 商店弹框
    },
    resourceCost: {
        levelUpNeedGold, // 升级需要的金币
        levelStarNeedSoule, // 升星需要的魂石
        getTotalGoldCost, // 获取总金币消耗
        getTotalSoulCost, // 获取总魂石消耗
        getDecomposeGoldSoul, // 获取分解金币魂石
        levelUpNeedGoldByNum, // 计算升级 num 级所需金币
        getMaxLevelByGold, // 根据金币数计算能升的最大等级
    },
    game: {
        preloadLever, // 预加载 lever 游戏
        Lever, // lever 游戏
        preloadRiver,   // 预加载 river 游戏
        River, //river 游戏
        preloadFire,
        Fire,
    },
    // 杂项功能
    subdry: {
        moveNodeToPosition, // 节点移动函数
        formateNumber, // 格式化数字
        sceneDirector, // 场景跳转管理
    }
}