interface POST {
  [props: string]: string;
}

abstract class base {
  name;
  constructor(name: any) {
    this.name = name + 3;
  }
  eat(name: string) {
    console.log(name + 1);
  }
  run(name: string) {
    console.log(name);
  }
}

class bismatePost extends base {
  name: any;
  readonly post;
  private bis;
  protected base;
  constructor(post: POST, bis: string, base: any, name: any) {
    super(name);
    this.post = post;
    this.base = base;
    this.bis = bis;
  }
  eat() {
    console.log(this.name + 2);
  }
  run() {}
}

const bismate = new bismatePost({ s: "s" }, "2", 3, 4);
bismate.eat();
