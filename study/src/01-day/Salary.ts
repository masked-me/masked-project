export {};
const makeSalary = (base: number) => {
  return function (plus: number) {
    console.log(`本月工资${plus + base}.00元`);
  };
};
const e: void = undefined;
const h: symbol = Symbol();
