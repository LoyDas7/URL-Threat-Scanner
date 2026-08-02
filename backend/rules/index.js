const protocolRule=require("./protocolRule");
const ipRule=require("./ipRule");
const lengthRule=require("./lengthRule");
const hyphenRule=require("./hyphenRule");
const subdomainRule=require("./subdomainRule");
const tldRule=require("./tldRule");
const brandRule = require("./brandRule");
const punycodeRule = require("./punycodeRule");
const entropyRule = require("./entropyRule");
const SCORES = require("../config/ruleScores");
const unicodeRule = require("./unicodeRule");
const keywordRule = require("./keywordRule");
const whoisRule=require("./whoisRule");
const dnsRule=require("./dnsRule");
const sslRule = require("./sslRule");

const calculateVerdict=require("../utils/scoreCalculator");

async function analyze(url){

    const parsed=new URL(url);

    const rules=[
        protocolRule,
        ipRule,
        lengthRule,
        hyphenRule,
        subdomainRule,
        tldRule,
        brandRule,
        entropyRule,
        punycodeRule,
        unicodeRule,
        keywordRule,
        whoisRule,
        dnsRule,
        sslRule
    ];

    let score=0;
    let findings=[];

    for(const rule of rules){

        const result=await rule(parsed,url);
         console.log(rule.name, result);

        score+=result.score;

        findings.push(...result.findings);

    }

    return{

        score,

        verdict:calculateVerdict(score),

        findings

    };

}

module.exports={analyze};