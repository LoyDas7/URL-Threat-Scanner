module.exports=(parsed)=>{

    let score=0;

    let findings=[];

    const ipRegex=/^(\d{1,3}\.){3}\d{1,3}$/;

    if(ipRegex.test(parsed.hostname)){

        score+=40;

        findings.push("Uses IP Address");

    }

    return{

        score,

        findings

    };

};