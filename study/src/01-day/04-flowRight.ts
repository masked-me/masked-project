export {};
const reverse = (arr: any[]) => arr.reverse();
const first = (arr: any[]) => arr[0];
const toUpper = (s: string) => s.toUpperCase();

const flowRight: any = (...args: any) => {
  let len = args.length;
  const flowRightFn: any = (value: any[]) => {
    len--;
    if (len > -1) {
      return flowRightFn(args[len](value));
    }
    return value;
  };
  return flowRightFn;
};

const lastUpper = flowRight(toUpper, first, reverse);

console.log(lastUpper(["first", "second", "three"]));
