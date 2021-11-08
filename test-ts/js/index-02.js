"use strict";
// import { A } from './modules/animals'
// import { A } from "./modules/animals";
// const d = new A.Dog('小黑')
// d.eat('骨头')
// function logClass(params: any) {
//     console.log(params)
//     params.prototype.realUrl = 'http://www.sinosun.com/bizmate'
// }
// @logClass
// class HttpClient {
//     public url: string;
//     constructor(url: string) {
//         this.url = url
//     }
//     getData(): void {
//         console.log(this.url);
//     }
// }
// var H = new HttpClient('aaa')
// console.log(H.realUrl)
// function logClass(target: any) {
//     return class extends target {
//         url: string = 'sss';
//         getData() {
//             this.url = this.url + '='
//             console.log(`${this.url}------`)
//         }
//     }
// }
// function attrClass(params: any) {
//     return function (target: any, attr: any) {
//         console.log('params',params)
//         console.log('target',target)
//         console.log('attr',attr)
//         target[attr] = params
//     }
// }
// // @logClass
// class HttpClient {
//     @attrClass('http://sinosun.com')
//     public url: string | undefined;
//     constructor(url: string) {
//     }
//     getData(): void {
//         console.log(this.url);
//     }
// }
// var H = new HttpClient('aaa')
// H.getData()
// var logClass = (params: any) => {
//     console.log(params)
//     params.prototype.realUrl = 'http://baidu.com'
//     params.prototype.run = function(){
//         console.log('run')
//     }
// }
// @logClass
// class httpClient {
//     public url: string;
//     constructor(url: string) {
//         this.url = url
//     }
//     getData() {
//         console.log(this.url + 'cc')
//     }
// }
// var h = new httpClient('xx')
// console.log(h.realUrl)
// h.run()
// var logClass = (params: any) => {
//     return (target: any) => {
//         console.log(params)
//         console.log(target)
//         target.prototype.realUrl = params+'22'
//     }
// }
// @logClass('http://www.sinosun.com/bizmate')
// class httpClient {
//     public url: string;
//     constructor(url: string) {
//         this.url = url
//     }
//     getData() {
//         console.log(this.url + 'cc')
//     }
// }
// var h = new httpClient('xx')
// console.log(h.realUrl)
// var logClass = (target: any) => {
//     return class extends target{
//         url:string = '我是修改后的数据'
//         getData(){
//             console.log(this.url+'ee')
//         }
//     }
// }
// @logClass
// class httpClient {
//     public url: string;
//     constructor(url: string) {
//         this.url = url
//     }
//     getData() {
//         console.log(this.url + 'cc')
//     }
// }
// var h = new httpClient('xx')
// h.getData()
// function attrProto(params?:any){
//     console.log(params)
//     return function(target:any, attr:any){
//         console.log(target)
//         console.log(attr)
//         target[attr] = params
//     }
// }
// class httpClient {
//     @attrProto()
//     public url: string |undefined;
//     public uuid: string |undefined;
//     constructor() {
//     }
//     getData() {
//         console.log(this.url + 'cc')
//     }
// }
// var h = new httpClient()
// h.getData()
// function logMethod(params: any) {
//     console.log(params)
//     return function (target: any, methodName: any, desc: any): void {
//         console.log(target)         // 原型对象
//         console.log(methodName)     //方法名称
//         console.log(desc)           //方法描述
//         target.apiUrl = 'realUrl.com'
//         target.run = () => { console.log('run') }
//     }
// }
// class httpClient {
//     public url: string | undefined;
//     constructor() {
//     }
//     @logMethod('www.sinosun.com')
//     getData() {
//         console.log(this.url + 'cc')
//     }
// }
// var h:any = new httpClient()
// console.log(h.apiUrl)
// h.run()
// function logMethod(params: any) {
//     console.log(params)
//     return function (target: any, methodName: any, desc: any): void {
//         console.log(target)         // 原型对象
//         console.log(methodName)     // 方法名称
//         console.log(desc)           // 方法描述
//         let oMethod = desc.value
//         desc.value = function (...args: any[]) {
//             args = args.map(value => String(value))
//             console.log('args', args)
//             oMethod.apply(this, args)
//         }
//     }
// }
// class httpClient {
//     public url: string | undefined;
//     constructor() {
//     }
//     @logMethod('www.sinosun.com')
//     getData(...args: any[]) {
//         console.log('getData --> args', args)
//     }
// }
// var h = new httpClient()
// h.getData(123, 'xxx')
// function logParams(params: string) {
//     return function (target: any, methodName: any, paramsIndex: any) {
//         console.log('params', params)
//         console.log('target', target)
//         target.uuid = 'newUuid'
//         console.log('methodName', methodName)
//         console.log('paramsIndex', paramsIndex)
//     }
// }
// class httpClient {
//     public url: string | undefined;
//     public uuid: string | undefined;
//     constructor() {
//     }
//     getData(@logParams('baidu.com') uuid: string) {
//         console.log('getData --> uuid', uuid, this.uuid)
//     }
// }
// var h = new httpClient()
// h.getData('xxx')
// function logClass1(params?: string) {
//     return function (target: any) {
//         console.log('类装饰器1')
//     }
// }
// function logClass2(params?: string) {
//     return function (target: any) {
//         console.log('类装饰器2')
//     }
// }
// function logAttribute1(params?: string) {
//     return function (target: any, attr: any) {
//         console.log('属性装饰器1')
//     }
// }
// function logAttribute2(params?: string) {
//     return function (target: any, attr: any) {
//         console.log('属性装饰器2')
//     }
// }
// function logMethod1(params?: string) {
//     return function (target: any, methodName: any, paramsIndex: any) {
//         console.log('方法装饰器1')
//     }
// }
// function logMethod2(params?: string) {
//     return function (target: any, methodName: any, paramsIndex: any) {
//         console.log('方法装饰器2')
//     }
// }
// function logParams1(params?: string) {
//     return function (target: any, methodName: any, paramsIndex: any) {
//         console.log('方法参数装饰器1')
//     }
// }
// function logParams2(params?: string) {
//     return function (target: any, methodName: any, paramsIndex: any) {
//         console.log('方法参数装饰器2')
//     }
// }
// @logClass1()
// @logClass2()
// class httpClient {
//     @logAttribute1()
//     public url: string | undefined;
//     @logAttribute2()
//     public uuid: string | undefined;
//     constructor() {
//     }
//     @logMethod1()
//     setData() {
//         return true
//     }
//     @logMethod2()
//     putData() {
//         return true
//     }
//     getData(@logParams1() attr1: string, @logParams2() attr2: string) {
//         return true
//     }
// }
