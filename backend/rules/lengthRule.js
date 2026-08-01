const SCORES = require("../config/ruleScores");
module.exports=(parsed,url)=>{

    let score=0;

    let findings=[];

    if(url.length>75){

        score += SCORES.LONG_URL;

        findings.push("Very Long URL");

    }

    return{

        score,

        findings

    };

};