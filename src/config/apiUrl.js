let ipUrl = "http://127.0.0.1:7001/storeMsAdmin/";
// let ipUrl = "https://server.17jbs.cn/storeMsAdmin/";

let servicePath = {
  checkLogin: ipUrl + "checkControllerUserLogin", //检查用户名和密码
  checkUserPsw: ipUrl + "checkUserPsw", //校验用户密码
  getDMUsers: ipUrl + "getDMUsers", //  获取管理员列表
  getUser: ipUrl + "getUser", //  获取用户信息
  updateUser: ipUrl + "updateUser", //  更新用户信息
  inertUser: ipUrl + "inertUser", //  创建管理员
  autoId: ipUrl + "autoId", //  获取自动工号
  getFilterDramaList: ipUrl + "getFilterDramaList", //  获取筛选剧本列表
  getDramaDetail: ipUrl + "getDramaDetail", //  获取剧本详情
  getLikeDramaDetail: ipUrl + "getLikeDramaDetail", //  获取剧本详情模糊查询
  inertDrama: ipUrl + "inertDrama", //  创建剧本
  updateDrama: ipUrl + "updateDrama", //  更新剧本
  getOrderList: ipUrl + "getOrderList", //  获取订单列表
  updaTeOrder: ipUrl + "updaTeOrder", //  更新订单

  getRooms: ipUrl + "getRooms", //  获取房间列表
  getRoomDetail: ipUrl + "getRoomDetail", //  获取房间详情
  deleteRoom: ipUrl + "deleteRoom", //  删除房间
  updaTeRoom: ipUrl + "updaTeRoom", //  修改房间信息


  getGoods: ipUrl + "getGoods", //  获取商品列表
  updaTeGoods: ipUrl + "updaTeGoods", //  更新商品
  deleteGoods: ipUrl + "deleteGoods", //  删除商品
  updaTeGoodsState: ipUrl + "updaTeGoodsState", //  更新商品状态

  getTeamList: ipUrl + "getTeamList", //  获取组局列表
  updateTeamState: ipUrl + "updateTeamState", //  修改组局
  insertTeam: ipUrl + "insertTeam", //  新增组局
  updateTeam: ipUrl + "updateTeam", //  修改组局
  getTeamDetail: ipUrl + "getTeamDetail", //  查询组局详情
};

export default servicePath;
