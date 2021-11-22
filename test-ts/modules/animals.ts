
export namespace A {
    class Animals {
        public name: string;
        constructor(name: string) {
            this.name = name
        }
        eat(food: string) {
            console.log(`${this.name}吃${food}!`)
        }
    }
    export class Dog extends Animals {
        constructor(name: string) {
            super(name)
        }
    }
}