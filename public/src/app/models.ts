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

export class Session {
    constructor(
        public loggedInId: number = null,
        public isLoggedIn: boolean = false,
        public loggedTeamName: string = "",
        public postedHackathons: Hackathon[] = [],
        public pastHackathons: Hackathon[] = [],
        public joinedHackathons: Hackathon[] = [],
        public allHackathons: Hackathon[] = []
    ){}
}

export class Member {
    constructor(
        public firstName: string = "",
        public lastName: string = ""
    ){}
}