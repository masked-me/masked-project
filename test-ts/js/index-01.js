"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tree = function (arr) {
    console.log('123');
    return arr;
};
tree([213]);
var List = [[1, '2']];
var Flag;
(function (Flag) {
    Flag[Flag["success"] = 1] = "success";
    Flag[Flag["error"] = -1] = "error";
})(Flag || (Flag = {}));
var flag = Flag.success;
var Color;
(function (Color) {
    Color[Color["red"] = 0] = "red";
    Color[Color["bule"] = 5] = "bule";
    Color[Color["orange"] = 6] = "orange";
})(Color || (Color = {}));
var color = Color.orange;
var color1 = Color[0];
console.log(color);
console.log(color1);
// 定义未赋值 默认值为 undefined
var num;
num = 2;
console.log(num);
var run = function (name, age, tel) {
    if (age === void 0) { age = 6; }
    return name + " --- " + age + " --- " + tel;
};
console.log(run('zhangsan'));
var add = function () {
    var arg = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        arg[_i] = arguments[_i];
    }
    return arg.reduce(function (pre, cur) {
        return pre + cur;
    }, 0);
};
console.log(add(1, 2, 3, 4));
// class Person {
//     public name: string	//属性	前面省略了public关键词
//     constructor(n: string) {
//         this.name = n;
//     }
//     getName(): void {
//         console.log(this.name)
//     }
//     setName(name: string): void {
//         this.name = name;
//     }
//     // static print (){
//     //     console.log(this.name)
//     // }
// }
// var person = new Person('张三');
// person.getName()
// person.setName('李四')
// person.getName()
// class Web extends Person {
//     constructor(name: string) {
//         super(name)
//     }
//     getName(): void {
//         console.log(this.name + '-- 子类')
//     }
// }
// var w = new Web('王五')
// console.log(w.name + '22')
// w.getName()
// function $(element){
//     return new Base(element)
// }
// $.get = function(){
// }
// function Base(element){
//     this.element = element;
//     this.css = function(attr, value){
//         this.element.style.attr = value
//     }
// }
// $('.box').css('color','red')
// $.get('url', function(){})
// class Animal {
//     public name: string;
//     constructor(name: string) {
//         this.name = name;
//     }
//     eat() {
//         console.log('吃饭饭')
//     }
// }
// class Dog extends Animal {
//     constructor(name: string) {
//         super(name)
//     }
//     eat() {
//         console.log(this.name + '吃骨头')
//     }
// }
// var d = new Dog('小狗狗')
// d.eat()
// class Cat extends Animal {
//     constructor(name: string) {
//         super(name)
//     }
//     eat() {
//         console.log(this.name + '吃老鼠')
//     }
// }
// var c = new Cat('小猫猫')
// c.eat()
// abstract class Animal {
//     public name: string;
//     constructor(name: string) {
//         this.name = name
//     }
//     abstract eat(): any
// }
// class Dog extends Animal {
//     constructor(name: string) {
//         super(name)
//     }
//     eat():void{
//         console.log(this.name + '吃骨头')
//     }
// }
// var d = new Dog('小狗狗')
// d.eat()
// interface Config {
//     type: string;
//     url: string;
//     data?: string;
//     dataType: string;
// }
// function ajax(config: Config) {
//     var xhr = new XMLHttpRequest();
//     xhr.open(config.type, config.url, true);
//     xhr.send(config.data);
//     xhr.onreadystatechange = function () {
//         if (xhr.readyState == 4 && xhr.status == 200) {
//             console.log('成功')
//             if (config.dataType == 'json') {
//                 console.log(JSON.parse(xhr.responseText))
//             } else {
//                 console.log(xhr.responseText)
//             }
//         }
//     }
// }
// ajax({
//     type: 'get',
//     url: 'http://a.itying.com/api/productlist',
//     dataType: 'json'
// })
// interface encrypt {
//     (key: string, value: string): string
// }
// var md5: encrypt = (key: string, value: string) => {
//     return key + '--' + value
// }
// interface Animals {
//     name: string;
//     eat(food: string): void;
// }
// class Dogs implements Animals {
//     public name: string;
//     constructor(name: string) {
//         this.name = name;
//     }
//     eat() {
//         console.log(this.name + '吃零食')
//     }
// }
// var ds = new Dogs('小黑')
// ds.eat()
// class Cats implements Animals {
//     public name: string;
//     constructor(name: string) {
//         this.name = name;
//     }
//     eat(food: string) {
//         console.log(this.name + '吃' + food)
//     }
// }
// var cs = new Cats('小毛毛')
// cs.eat('老鼠')
// interface UserArr {
//     [index: number]: string
// }
// var arr: UserArr = ['a', 'b']
// interface UserObj {
//     [key: string]: string
// }
// var arr1: UserObj = { name: 'c' }
// interface Animal {
//     eat(str: string): void;
// }
// interface Person extends Animal {
//     work(str: string): void;
// }
// class Programmer {
//     public name: string;
//     constructor(name: string) {
//         this.name = name
//     }
//     coding(code: string) {
//         console.log(this.name + '--' + code);
//     }
// }
// class Web extends Programmer implements Person {
//     constructor(name: string) {
//         super(name)
//     }
//     eat(food: string) {
//         console.log(this.name + '吃' + food)
//     }
//     work(content: string) {
//         console.log(this.name + '写' + content)
//     }
// }
// let w = new Web('小磊')
// w.eat('馒头');
// w.work('报告');
// w.coding('敲ts');
// var getData = <T>(value: T): T => {
//     return value;
// }
// getData('abc')
// getData(123)
// class Minclass<T> {
//     public List: Array<T> = [];
//     add(item: T) {
//         this.List.push(item)
//     }
//     min(): T {
//         let minNum = this.List[0];
//         this.List.forEach(item => {
//             if (item < minNum) {
//                 minNum = item
//             }
//         })
//         return minNum
//     }
// }
// var m = new Minclass()
// m.add(9)
// m.add(1)
// m.add(3)
// m.add(4)
// console.log(m.min())
// var m1 = new Minclass()
// m1.add('v')
// m1.add('a')
// m1.add('c')
// m1.add('r')
// console.log(m1.min())
// interface Info {
//     <T>(value1: T, value2: T): T
// }
// var getName: Info = <T>(value1: T, value2: T): T => {
//     return value2
// }
// getName<number>(123, 12)
// interface Config<T> {
//     (value: T): T
// }
// function getData<T>(value: T): T {
//     return value
// }
// var myGetData: Config<string> = getData;
// myGetData('a')
// interface DBI<T> {
//     add(info: T): boolean;
//     updata(info: T, id: number): boolean
// }
// class MysqlDb<T> implements DBI<T> {
//     add(info: T): boolean {
//         console.log(info)
//         return true
//     }
//     updata(info: T, id: number): boolean {
//         console.log(info)
//         console.log(id)
//         return true
//     }
// }
var db_1 = require("./modules/db");
var User = /** @class */ (function () {
    function User() {
    }
    return User;
}());
var u = new User();
u.name = '张三';
u.age = 20;
var Db = new db_1.MysqlDb();
Db.add(u);
Db.updata(u, 12);
var ArticleCate = /** @class */ (function () {
    function ArticleCate(params) {
        this.title = params.title;
        this.desc = params.desc;
        this.status = params.status;
    }
    return ArticleCate;
}());
var a = new ArticleCate({
    title: "朽木白哉",
    desc: "动漫",
});
var aDb = new db_1.MysqlDb();
aDb.updata(a, 2);
