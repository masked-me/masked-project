// 获取环境变量
const nodeEnv = process.env["NODE_ENV"];
// 需要 ScpMock数据 接口列表
let ScpMockUrl: any[] = [
	"/ebank/accountmgmt/v1/queryAccountTradeList",
	"/ebank/accountmgmt/v1/queryAccountInfoForBank",
	"/ebank/accountmgmt/v1/queryAccountListByCstNo",
	"/ebank/accountmgmt/v1/bindAccount",
	"/bizmate/approval/v1/getList"
];

if (nodeEnv !== "development") {
	ScpMockUrl = [];
}

export { ScpMockUrl };
