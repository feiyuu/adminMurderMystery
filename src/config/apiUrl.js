let ipUrl = "http://127.0.0.1:7001/storeMsAdmin/";
// let ipUrl = "https://server.17jbs.cn/storeMsAdmin/";

let servicePath = {
  checkLogin: ipUrl + "checkControllerUserLogin", //检查用户名和密码
  getDMUsers: ipUrl + "getDMUsers", //  获取管理员列表
  getUser: ipUrl + "getUser", //  获取用户信息
  updateUser: ipUrl + "updateUser", //  更新用户信息
  inertUser: ipUrl + "inertUser", //  创建管理员
  autoId: ipUrl + "autoId", //  获取自动工号
  getFilterDramaList: ipUrl + "getFilterDramaList", //  获取筛选剧本列表
  getDramaDetail: ipUrl + "getDramaDetail", //  获取剧本详情
  inertDrama: ipUrl + "inertDrama", //  创建剧本
  updateDrama: ipUrl + "updateDrama", //  更新剧本
  getOrderList: ipUrl + "getOrderList", //  获取订单列表
  updaTeOrder: ipUrl + "updaTeOrder", //  更新订单
  getGoods: ipUrl + "getGoods", //  获取商品列表
  updaTeGoods: ipUrl + "updaTeGoods", //  更新商品
  deleteGoods: ipUrl + "deleteGoods", //  删除商品
  updaTeGoodsState: ipUrl + "updaTeGoodsState", //  更新商品状态
};

export default servicePath;
