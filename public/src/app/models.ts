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

export class Project {
    constructor(
        public id: number = 0,
        public title: string = "",
        public gitUrl: string = "",
        public vidURL: string = "",
        public description: string = "",
        public teamId: number = 0,
        public hackathonId: number = 0
    ){}
}
