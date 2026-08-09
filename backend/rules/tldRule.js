const SCORES = require("../config/ruleScores");
const {SUSPICIOUS_TLDS}=require("../config/constants");

module.exports=(parsed)=>{

    let score=0;

    let findings=[];

    const parts=parsed.hostname.split(".");

    const tld=parts[parts.length-1];

    if(SUSPICIOUS_TLDS.includes(tld)){

        score += SCORES.SUSPICIOUS_TLD;

        findings.push(`Suspicious TLD (.${tld})`);

    }

    return{

        score,

        findings,
        metadata: {
    tld: {
        value: tld,
        suspicious: SUSPICIOUS_TLDS.includes(tld)
    }
}

    };

};