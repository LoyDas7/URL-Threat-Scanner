const SCORES = require("../config/ruleScores");
module.exports=(parsed)=>{

    let score=0;

    let findings=[];

    if(parsed.hostname.includes("-")){

        score+= SCORES.HYPHEN;

        findings.push("Hyphen in Domain");

    }

    return{

        score,

        findings

    };

};