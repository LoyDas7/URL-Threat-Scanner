const SCORES = require("../config/ruleScores");
module.exports=(parsed)=>{

    let score=0;

    let findings=[];

    if(parsed.protocol!=="https:"){

        score += SCORES.HTTP;

        findings.push("Uses HTTP instead of HTTPS");

    }

    return{

        score,

        findings,
        metadata: {
    protocol: {
        protocol: parsed.protocol,
        secure: parsed.protocol === "https:"
    }
}

    };

};