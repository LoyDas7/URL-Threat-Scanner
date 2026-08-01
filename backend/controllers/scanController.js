const { analyze } = require("../rules");

const scanURL = (req, res) => {

    const { url } = req.body;

    if (!url) {

        return res.status(400).json({

            success:false,

            message:"URL is required"

        });

    }

    try{

        const result=analyze(url);

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