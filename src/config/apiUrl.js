let ipUrl = "http://127.0.0.1:7001/storeMsAdmin/";
// let ipUrl = "https://server.17jbs.cn/storeMsAdmin/";

let servicePath = {
  checkLogin: ipUrl + "checkControllerUserLogin", //检查用户名和密码
  getDMUsers: ipUrl + "getDMUsers", //  获取管理员列表
  getUser: ipUrl + "getUser", //  获取用户信息
  updateUser: ipUrl + "updateUser", //  获取用户信息
  inertUser: ipUrl + "inertUser", //  获取用户信息
  autoId: ipUrl + "autoId", //  获取用户信息
  getFilterDramaList: ipUrl + "getFilterDramaList", //  获取用户信息
  getDramaDetail: ipUrl + "getDramaDetail", //  获取用户信息
  inertDrama: ipUrl + "inertDrama", //  获取用户信息
  updateDrama: ipUrl + "updateDrama", //  获取用户信息
};

export default servicePath;
