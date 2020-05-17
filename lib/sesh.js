module.exports = {
    test: function () {
        console.log('in sesh.js test function');
    },
    
    //Consider taking out of exports since it is only used locally
    //Used for comparing 2 scores and returns the higher of them
    //Used for scenario scores of format 'targets_hit (percent%)'

    targetsPercentage: function (current_high, current_score) {
        //Regex for getting a percentage within parens
        //For scenarios: 1wall6targets TE, Tile Frenzy 180 Strafing, 1wall 6targets small, 1wall5targets_pasu
        var regex_num_tar = /\d+/;
        var regex_percent = /\(.+\)/;

        //var testStr = "503 (88.9%)";

        var matched_per = regex_percent.exec(current_score);
        var matched_tar = regex_num_tar.exec(current_score);

        //These values used to compare as numbers
        var val_percent = matched_per[0].replace(/\(|\%|\)/g, '');
        var val_tar = matched_tar[0];

        //Object to hold result of compare
        var highScore = {
            "targets" : "",
            "percentage" : ""
        }

        //Used for first case when comparing high scores
        if (current_high == null){
            highScore.targets = val_tar;
            highScore.percentage = val_percent;
        }
        //Set the highScore object based on the current score being compared
        else{
            if (current_high.targets < val_tar){
                highScore.targets = val_tar;
            }
            else{
                highScore.targets =current_high.targets;
            }
            if (current_high.percentage < val_percent){
                highScore.percentage = val_percent;
            }
            else{
                highScore.percentage = current_high.percentage;
            }
        }

        return highScore;
    },

    /** 
     * Used for comparing 2 scores and returns the higher of them
     * Used for scenario scores of format 'percent%' only.
     * Ex: "Accuracy 93.2%                 "
    */
    percentOnly: function(current_high, current_score) {
        var regex_percent = /\d+.+%/;
        var matched_per = regex_percent.exec(current_score);

        //This value to be used numerically for comparison
        var val_percent = matched_per[0].replace(/%/, '');

        //Object to hold result of compare
        var highScore = {
            "percentage" : ""
        };

        //Used for first case when comparing high scores
        if (current_high == null){
            highScore.percentage = val_percent;
        }
        //Set the highScore object based on the current score being compared
        else{
            if (current_high.percentage < val_percent){
                highScore.percentage = val_percent;
            }
            else{
                highScore.percentage = current_high.percentage;
            }
        }

        //console.log(val_percent);
        
        return highScore;
    },

    ttkAndPercent: function (current_high, current_score){
        //NEED TO IMPLEMENT THIS
        //These two vars are for testing parsing data without a decimal point in the percentage
        var regex_secs = /\d+.\d+s/g;
        var regex_percentage = /,.+%/g;

        var regex = /\d+.\d+/g;
        var testStr = 'Average TTK: 2.139s , 42.4%';
        var testStr_2 = 'Average TTK: 44.2%';

        var matched = current_score.match(regex);
        var matched_secs = current_score.match();
        var matched_percentage = current_score.match();
     
        var ttk_val = matched[0];
        var val_percent = matched[1];
        console.log('ttk: ' +  ttk_val);
        console.log('high_percent: ' + val_percent);

        //Object to hold result of compare
        var highScore = {
            "percentage" : "",
            "ttk" : ""
        };

        //Used for first case when comparing high scores
        if (current_high == null){
            highScore.percentage = val_percent;
            highScore.ttk = ttk_val;
        }
        //Set the highScore object based on the current score being compared
        else{
            if (current_high.ttk > ttk_val){
                highScore.ttk = ttk_val;
            }
            else{
                highScore.ttk = current_high.ttk;
            }
            if (current_high.percentage < val_percent){
                highScore.percentage = val_percent;
            }
            else{
                highScore.percentage = current_high.percentage;
            }
        }

        return highScore; 

       
    },

    /*
    Takes a scenario name and returns the high score for that particular scenario
    given a list of workSessions.
    */
    calculateHigh: function(scen_name, list_of_sessions){
        let tempHigh = null;

        //Check all sessions for occurence of scen_name and run the appropriate method to handle it
        list_of_sessions.map(session => {
           
           for (i=0; i < session.scenarioList.length; i++){
               if (scen_name == session.scenarioList[i].scenario_name){
                   if (scen_name == '1wall6targets TE'){
                       tempHigh = this.targetsPercentage(tempHigh, session.scenarioList[i].score);
                   }
                   if (scen_name == '1wall5targets_pasu'){
                    tempHigh = this.targetsPercentage(tempHigh, session.scenarioList[i].score);
                   }
                   if (scen_name == 'Tile Frenzy 180 Strafing'){
                    tempHigh = this.targetsPercentage(tempHigh, session.scenarioList[i].score);
                   }
                   if (scen_name == '1wall 6targets small'){
                    tempHigh = this.targetsPercentage(tempHigh, session.scenarioList[i].score);
                   }
                   if (scen_name == 'RexStrafesCata'){
                    tempHigh = this.percentOnly(tempHigh, session.scenarioList[i].score);
                   }
                   if (scen_name == 'Close Long Strafes Invincible'){
                    tempHigh = this.percentOnly(tempHigh, session.scenarioList[i].score);
                   }
                   if (scen_name == 'Vertical Long Strafes'){
                    tempHigh = this.percentOnly(tempHigh, session.scenarioList[i].score);
                   }
                   if (scen_name == 'LG Pin Practice 360'){
                    tempHigh = this.ttkAndPercent(tempHigh, session.scenarioList[i].score);
                   }
               }
           }
        })

        if (tempHigh != null){
            tempHigh.name = scen_name;
        }
       
        return tempHigh;
    }
}