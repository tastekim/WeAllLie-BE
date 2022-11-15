const { Game } = require('../schemas/game')
const { Room } = require('../schemas/room')
const { User } = require('../schemas/room')
 
class GameRepo{


//스파이 선택
    selectSpy = async (nickname) => {

       const nickname = await User.findAll(nickname)
       return nickname
    
    }

//스파이 저장 -> db room에 저장
    isSpy = (spyUser) => {
        
    }  

//정답 단어 보여주기 //if스파이면 단어랑 카테고리 안보여주기 
    giveWord = async (word) => {
       const giveWord = await Game.findAll(word)
       return giveWord     
    }


//카테고리 & 단어 막무가내로 보여주기 
    giveExample = async (category , word) => {
       const giveExample = await Game.findAll(category, word)
       return giveExample
    }
          
//발언권 지목 
    micToss = async (nickname) => {
        const  micToss = await User.findAll(nickname)
        return  micToss
    }

}

module.exports = GameRepo

 