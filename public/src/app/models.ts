export class Team {
    constructor(
        public name: String = "",
        public password: String = "",
        public confirmPassword: String = "",
        public location: Number = 0
    ){}
}


export class Hackathon {
    constructor(
        public id: Number = 0,
        public name: String = "",
        public deadline: Date = new Date(),
        public winner: Number = 0
    ){}
}
