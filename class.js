class Shape {
    constructor(type) {
        this.type = type;
    }
    getArea() {
        return 0;
    }
    getInfo() {
        return "객체의 정보를 추가해주세요";
    }
}

class Square extends Shape {
    constructor(sideLength) {
        super();
        this.sideLength = sideLength;
    }

    getArea() {
        return this.sideLength ** 2;
    }
    getInfo() {
        return `정사각형, 변수의 길이는: ${this.sideLength}`
    }
}

class Triangle extends Square {
    constructor(lowLine, sideLine) {
        super();
        this.sideLength = sideLength;
    }
    getArea() {
        return this.sideLength * 3;
    }
}
// class Trapezium extends Shape {
//     constructor(sideLength) {
//         super();
//         this.sideLength = sideLength;
//     }
//     getArea() {
//         return this.sideLength * 3;
//     }
// }

class Circle extends Shape {
    constructor(radius) {
        super();
        this.radius = radius;
    }
    getArea() {
        return Math.PI * this.radius ** 2;
    }
}

// 객체 생성 및 활용
const square = new Square(5);
const triangle = new Triangle(4, 3);
// const Trapezium = new Trapezium(4, 6, 5);
const circle = new Circle(1);
console.log('Square Area:', square.getArea());
console.log('Square Info:', square.getInfo());
console.log('Triangle Area:', triangle.getArea());
console.log('Triangle Info:', triangle.getInfo());