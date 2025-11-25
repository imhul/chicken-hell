export const getLevel = (level: number, points: number) => {
    switch (level) {
        case 0:
            return {
                level: points === 1000 || points > 1000 ? level + 1 : level,
                pointsToNextLvl: 1000 - points,
                lvlName: 'trainee'
            }
        case 1:
            return {
                level: points === 1200 || points > 1200 ? level + 1 : level,
                pointsToNextLvl: 1200 - points,
                lvlName: 'trainee'
            }
        case 2:
            return {
                level: points === 1440 || points > 1440 ? level + 1 : level,
                pointsToNextLvl: 1440 - points,
                lvlName: 'trainee'
            }
        case 3:
            return {
                level: points === 1728 || points > 1728 ? level + 1 : level,
                pointsToNextLvl: 1728 - points,
                lvlName: 'trainee'
            }
        case 4:
            return {
                level: points === 2073 || points > 2073 ? level + 1 : level,
                pointsToNextLvl: 2073 - points,
                lvlName: 'trainee'
            }
        case 5:
            return {
                level: points === 2488 || points > 2488 ? level + 1 : level,
                pointsToNextLvl: 2488 - points,
                lvlName: 'trainee'
            }
        case 6:
            return {
                level: points === 2985 || points > 2985 ? level + 1 : level,
                pointsToNextLvl: 2985 - points,
                lvlName: 'medium'
            }
        case 7:
            return {
                level: points === 3583 || points > 3583 ? level + 1 : level,
                pointsToNextLvl: 3583 - points,
                lvlName: 'medium'
            }
        case 8:
            return {
                level: points === 4299 || points > 4299 ? level + 1 : level,
                pointsToNextLvl: 4299 - points,
                lvlName: 'medium'
            }
        case 9:
            return {
                level: points === 5159 || points > 5159 ? level + 1 : level,
                pointsToNextLvl: 5159 - points,
                lvlName: 'medium'
            }
        case 10:
            return {
                level: points === 6191 || points > 6191 ? level + 1 : level,
                pointsToNextLvl: 6191 - points,
                lvlName: 'medium'
            }
        case 11:
            return {
                level: points === 7430 || points > 7430 ? level + 1 : level,
                pointsToNextLvl: 7430 - points,
                lvlName: 'master'
            }
        case 12:
            return {
                level: points === 8916 || points > 8916 ? level + 1 : level,
                pointsToNextLvl: 8916 - points,
                lvlName: 'master'
            }
        case 13:
            return {
                level: points === 10699 || points > 10699 ? level + 1 : level,
                pointsToNextLvl: 10699 - points,
                lvlName: 'master'
            }
        case 14:
            return {
                level: points === 12839 || points > 12839 ? level + 1 : level,
                pointsToNextLvl: 12839 - points,
                lvlName: 'master'
            }
        case 15:
            return {
                level: points === 15407 || points > 15407 ? level + 1 : level,
                pointsToNextLvl: 15407 - points,
                lvlName: 'master'
            }
        case 16:
            return {
                level: points === 18488 || points > 18488 ? level + 1 : level,
                pointsToNextLvl: 18488 - points,
                lvlName: 'prime'
            }
        case 17:
            return {
                level: points === 22186 || points > 22186 ? level + 1 : level,
                pointsToNextLvl: 22186 - points,
                lvlName: 'prime'
            }
        case 18:
            return {
                level: points === 26623 || points > 26623 ? level + 1 : level,
                pointsToNextLvl: 26623 - points,
                lvlName: 'prime'
            }
        case 19:
            return {
                level: points === 31947 || points > 31947 ? level + 1 : level,
                pointsToNextLvl: 31947 - points,
                lvlName: 'prime'
            }
        case 20:
            return {
                level: 20,
                pointsToNextLvl: 0,
                lvlName: 'prime'
            }
        default:
            break
    }
}
