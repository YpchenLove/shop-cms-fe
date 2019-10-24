import {
 post, get, put, _delete 
} from '@/lin/plugins/axios'

class Banner {
  // 获取所有banner
  async getBanners(page, count) {
    const res = await get(`cms/banner?count=${count}&page=${page}`)
    return res
  }

  // 获取所有banner
  async getBannerById(id) {
    const res = await get(`cms/banner/${id}`)
    return res
  }

  // 新增 banner
  async addBanner(params) {
    const res = await post('cms/banner/', params)
    return res
  }

  // 更新 banner
  async updateBanner(id, params) {
    const res = await put(`cms/banner/${id}`, params)
    return res
  }

  // 删除 banner
  async delBanner(id) {
    const res = await _delete(`cms/banner/${id}`)
    return res
  }
}

export default new Banner()
