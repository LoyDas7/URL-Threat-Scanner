const { analyze } = require("../rules");

async function scanURL(req, res) {

    const { url } = req.body;

    if (!url) {

        return res.status(400).json({

            success:false,

            message:"URL is required"

        });

    }

    try{

        const result=await analyze(url);
        console.log("RESULT =", result);

        res.json({

            success:true,

            scannedURL:url,

            ...result

        });

    }

    catch{

        res.status(400).json({

            success:false,

            message:"Invalid URL"

        });

    }

};

module.exports={scanURL};