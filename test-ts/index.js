let obj = [
    { id: 2, parent: 1 },
    { id: 1, parent: null },
    { id: 3, parent: 2 },
]

// let obj = [
//     {id:1,parent:null},
//     {id:2,parent:1},
//     {id:3,parent:2},
// ]

// let res = {
//     id:1,
//     children:{
//         id:2,
//         children:{
//             id:3,
//             children:null
//         }
//     }
// }

const treeList = obj.reduce((pre, cur) => {
    pre[cur['id']] = cur;
    return pre
}, [])

let treeObj = arr => {
    return arr.sort((a, b) => b.parent - a.parent).reduce((pre, cur) => {
        Object.keys(pre).length ? cur.children = pre : cur.children = null
        return cur
    }, {})
}

console.log(JSON.stringify(treeObj(obj)))


let Arr = [
    {
        id: '1',
        menu_name: '设置',
        menu_url: 'setting',
        parent_id: 0
    }, {
        id: '1-1',
        menu_name: '权限设置',
        menu_url: 'setting.permission',
        parent_id: '1'
    }, {
        id: '1-1-1',
        menu_name: '用户管理列表',
        menu_url: 'setting.permission.user_list',
        parent_id: '1-1'
    }, {
        id: '1-1-2',
        menu_name: '用户管理新增',
        menu_url: 'setting.permission.user_add',
        parent_id: '1-1'
    }, {
        id: '1-1-3',
        menu_name: '角色管理列表',
        menu_url: 'setting.permission.role_list',
        parent_id: '1-1'
    }, {
        id: '1-2',
        menu_name: '菜单设置',
        menu_url: 'setting.menu',
        parent_id: '1'
    }, {
        id: '1-2-1',
        menu_name: '菜单列表',
        menu_url: 'setting.menu.menu_list',
        parent_id: '1-2'
    }, {
        id: '1-2-2',
        menu_name: '菜单添加',
        menu_url: 'setting.menu.menu_add',
        parent_id: '1-2'
    }, {
        id: '2',
        menu_name: '订单',
        menu_url: 'order',
        parent_id: 0
    }, {
        id: '2-1',
        menu_name: '报单审核',
        menu_url: 'order.orderreview',
        parent_id: '2'
    }, {
        id: '2-2',
        menu_name: '退款管理',
        menu_url: 'order.refundmanagement',
        parent_id: '2'
    }
]


// let treeList = Arr.reduce((prev,cur)=>{
//     prev[cur['id']] = cur;
//     return prev
//   },{})
//   console.log(treeList)
//   let result = Arr.reduce((prev,cur)=>{
//     let pid = cur.parent_id;
//     // pid为0的就找不到父对象，找到当前cur的父对象
//     // 对象的浅拷贝，引用关系存在，在后面处理parent的时候也会导致cur的改变，达到递归的效果
//     let parent = treeList[pid]
//     console.log(parent,1,pid)
//     // 如果父对象存在，就将cur压到父对象的children属性中
//     if(parent){
//       // parent和cur存在引用关系
//       parent.children? parent.children.push(cur) : parent.children = [cur]
//     } else if(pid === 0){
//       // 没有父对象，则此cur为树的根元素
//       prev.push(cur)
//     }
//     return prev
//   },[])

//   console.log('result',result)