// 获取环境变量
const nodeEnv = process.env["NODE_ENV"];
// 需要 ScpMock数据 接口列表
let ScpMockUrl: any[] = [
	"/ebank/accountmgmt/v1/queryAccountTradeList",
	"/bizmate/approval/v1/getList111"
];

if (nodeEnv !== "development") {
	ScpMockUrl = [];
}

export { ScpMockUrl };
