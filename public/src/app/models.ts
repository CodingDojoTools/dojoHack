export class Team {
    constructor(
        public id: number = 0,
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
        public description: string = "",
        public hackathonId: number = 0

    ){}
}

export class Session {
    constructor(
        public team: Team = null,
        public isLoggedIn: boolean = false,
        public loggedTeam: Team = null,
        public postedHackathons: Hackathon[] = [],
        public pastHackathons: Hackathon[] = [],
        public joinedHackathons: Hackathon[] = [],
        public allHackathons = {},
        public selectedHackathon: Hackathon = null,
        public submissionFlashMessage: string = "",
        public loggedMembers: Member[] = []
    ){}
}

export class Member {
    constructor(
        public firstName: string = "",
        public lastName: string = ""
    ){}
}