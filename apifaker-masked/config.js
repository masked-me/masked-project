var config = {
  staticVersion: "201405211040",
  //server's run port
  port: 80,
  //once you have gaven a project key,then you should never change it,however value is editable.
  projects: {
    p1: "account",
    p2: "approval",
    p3: "notice",
  },
  //url of this site.don't add last '/'
  siteUrl: "http://10.2.30.231",
  //assets(files under public dir) url of api faker,usually same as siteUrl.Unless you expect to use cdn.don't add last '/'
  staticUrl: "http://10.2.30.231",
  //api manager's default path.
  managerPath: "/~scpmock/",
  //use to auto return query's value
  returnPlaceholder: "$return$",
  //override the callback function name in a jsonp request
  jsonpName: "callback",
  //if we don't match any query,should we play as proxy server?
  //set true to enable,false to disable.
  //notice: you shouldn't enable this feature
  // when the domain of this query is actually host on this server
  proxy: true,

  enableEdit: true,
};

module.exports = config;
