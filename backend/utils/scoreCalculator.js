function calculateVerdict(score){

    if(score>=60)
        return "High Risk";

    if(score>=30)
        return "Medium Risk";

    return "Safe";

}

module.exports = calculateVerdict;