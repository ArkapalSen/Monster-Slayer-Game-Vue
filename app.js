function getRandomValue(min,max) {
    return Math.floor(Math.random() * (max-min)) + min;
}

const app = Vue.createApp({
    data(){
        return{
            playerHealth : 100,
            monsterHealth : 100,
            currentRound : 0,
            heal : 0,
            winner : null,
            logMessages : [],
        }
    },
    watch:{                                                     //using for watching the health meter for win/loss/draw
        playerHealth(value){
            if(value <= 0 && this.monsterHealth <= 0 ){
                this.winner = 'draw'
            }
            else if(value <= 0){
                this.winner = 'monster'
            }
        },
        monsterHealth(value){
            if(value <= 0 && this.playerHealth <= 0 ){
                this.winner = 'draw'
            }
            else if(value <= 0){
                this.winner = 'player'
            }
        }
    },
    methods: {
        startGame(){
            // resetting all values
            this.playerHealth = 100
            this.monsterHealth = 100
            this.currentRound = 0
            this.heal = 0
            this.winner = null
            this.logMessages = []
        },
        attackMonster(){
            this.currentRound++;
            const attackValue = getRandomValue(5,12)
            this.monsterHealth -= attackValue;
            this.addLogMessage('player','attack',attackValue)
            this.attackPlayer();                    //this will execute attackPlayer right after attackMonster()
        },
        attackPlayer(){
            const attackValue = getRandomValue(8,12)
            this.playerHealth -= attackValue;
            this.addLogMessage('monster','attack',attackValue)
        },
        specialAttackMonster(){
            this.currentRound++;
            const attackValue = getRandomValue(10,25);
            this.monsterHealth -= attackValue;
            this.addLogMessage('player','special-attack',attackValue)
            this.attackPlayer();
        },
        healPlayer(){
                this.heal++;
                this.currentRound++;                            //even though we heal ourselves..it is counted as one round
                const healValue = getRandomValue(8,20);
                if(this.playerHealth + healValue > 100){        //if with heal..heal value of player is above 100..
                    this.playerHealth = 100;                    //stick it to max that is 100
                }
                else{
                    this.playerHealth += healValue;             //increasing heal value
                }
                this.addLogMessage('monster','heals',healValue)
                this.attackPlayer();                            //and as we heal..monster will also attack the player..
        },
        surrender(){
            this.winner = 'monster'
        },
        addLogMessage(who,what,value){
            this.logMessages.unshift({
                actionBy : who,
                actionType : what,
                actionValue : value,
            })
        }

    },
    computed:{
        monsterBarStyles(){
            if(this.monsterHealth < 0){
                return {width : '0%'}
            }
            return {width : this.monsterHealth + '%'}
        },
        playerBarStyles(){
            if(this.playerHealth < 0){
                return {width : '0%'}
            }
            return {width : this.playerHealth + '%'}
        },
        mayUseSpecialAttack(){
            if(this.currentRound > 0){
                return this.currentRound % 3 !== 0
            }
            if(this.currentRound === 0){
                return true
            }
        },
        mayHealPlayer(){
            if(this.currentRound !== 0){
                if(this.heal < 3){
                    return false
                }
                else{
                    return true
                }
            }
            else{
                return true
            }
            
        }
    }

});

app.mount('#game');