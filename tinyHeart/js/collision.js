//判断大鱼与果实的碰撞
function momFruitsCollision() {
    if (!data.gameOver) {
        for (let i = 0; i < fruit.num; i++) {
            if (fruit.alive[i]) {
                let l = calLength2(fruit.x[i], fruit.y[i], mom.x, mom.y);
                if (l < 900) {
                    fruit.dead(i);
                    data.fruitNum++;
                    mom.momBodyCount++;
                    if (mom.momBodyCount > 7) {
                        mom.momBodyCount = 7;
                    }
                    if (fruit.fruitType[i] == "blue") {
                        data.double = 2;
                    }
                    wave.born();
                }
            }
        }
    }
}
//判断大鱼与小鱼的碰撞
function momBabyCollision() {
    if (!data.gameOver) {
        let l = calLength2(mom.x, mom.y, baby.x, baby.y);
        if (l < 900 && mom.momBodyCount != 0) {
            //baby recover
            baby.babyBodyCount = 0;
            //mom recover
            mom.momBodyCount = 0;
            //score updata
            data.addScore();
            //draw halo
            halo.born();
        }
    }
}