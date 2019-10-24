import {
 post, get, put, _delete 
} from '@/lin/plugins/axios'

class BannerItem {
  // 获取banner-item
  async getBannerItemById(id) {
    const res = await get(`cms/banner/item/${id}`)
    return res
  }

  // 新增 banner-item
  async addBannerItem(params) {
    const res = await post('cms/banner/item/', params)
    return res
  }

  // 更新 banner-item
  async updateBannerItem(id, params) {
    const res = await put(`cms/banner/item/${id}`, params)
    return res
  }

  // 删除 banner-item
  async delBannerItem(id) {
    const res = await _delete(`cms/banner/item/${id}`)
    return res
  }
}

export default new BannerItem()
