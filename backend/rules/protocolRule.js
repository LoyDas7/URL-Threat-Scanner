module.exports=(parsed)=>{

    let score=0;

    let findings=[];

    if(parsed.protocol!=="https:"){

        score+=20;

        findings.push("Uses HTTP instead of HTTPS");

    }

    return{

        score,

        findings

    };

};