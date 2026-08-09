const SCORES = require("../config/ruleScores");
module.exports=(parsed)=>{

    let score=0;

    let findings=[];

    const count=parsed.hostname.split(".").length-2;

    if(count>2){

        score += SCORES.SUBDOMAIN;

        findings.push("Too Many Subdomains");

    }

    return{

        score,

        findings,
        metadata: {
    subdomain: {
        count: count
    }
}

    };

};