const reverse = (arr: any[]) => arr.reverse();
const first = (arr: any[]) => arr[0];
const toUpper = (s: string) => s.toUpperCase();

const compose: any = (...args: any[]) => {
  return (value: any[]) => {
    return args.reverse().reduce((pre, cur) => {
      return cur(pre);
    }, value);
  };
};

const lastUpper = compose(compose(toUpper, first), reverse);

console.log(lastUpper(["first", "second", "three"]));
