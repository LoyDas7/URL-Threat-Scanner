const tls = require("tls");

function getCertificate(hostname) {
    return new Promise((resolve) => {

        const socket = tls.connect(
            443,
            hostname,
            {
                servername: hostname,
                rejectUnauthorized: false
            },
            () => {

                const cert = socket.getPeerCertificate();

                resolve({
                    success: true,
                    certificate: cert,
                    protocol: socket.getProtocol()
                });

                socket.end();

            }
        );

        socket.on("error", () => {

            resolve({
                success: false
            });

        });

    });
}

module.exports = {
    getCertificate
};