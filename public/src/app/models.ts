export class Team {
    constructor(
        public name: string = "",
        public password: string = "",
        public confirmPassword: string = "",
        public location: number = 0
    ){}
}


export class Hackathon {
    constructor(
        public id: number = 0,
        public name: string = "",
        public deadline: Date = new Date(),
        public winner: number = 0,
        public submitted: boolean = false
    ){}
}

export class Project {
    constructor(
        public id: number = 0,
        public title: string = "",
        public gitUrl: string = "",
        public vidUrl: string = "",
        public description: string = ""

    ){}
}
