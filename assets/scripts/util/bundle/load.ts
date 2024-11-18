import { AssetManager, resources } from "cc";
import { error } from "../out/error";

// 缓存
const cachMap = new Map<AssetManager.Bundle, Map<string, any>>();

// 加载资源
export async function load<T>(path: string, type?: new (...a: any[]) => T, assetsBundle?: AssetManager.Bundle): Promise<T> {
  // 默认使用 resources 作为资产包
  assetsBundle = assetsBundle || resources

  // 检查缓存
  let bundleCacheMap = cachMap.get(assetsBundle);
  if (!bundleCacheMap) cachMap.set(assetsBundle, bundleCacheMap = new Map);

  // 查找已缓存的资源
  let result = bundleCacheMap.get(path);
  if (result) return result;

  // 如果资源未缓存，开始加载
  return new Promise<T>(res => {
    assetsBundle.load(path, type as any, (err, data) => {
      if (err) {
        error(err);
        return res(null);
      }
      // 将加载的资源缓存
      bundleCacheMap.set(path, data);
      return res(data as any);
    })
  })
}