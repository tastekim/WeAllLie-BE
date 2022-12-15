const OpenVidu = require('openvidu-node-client').OpenVidu;
const express = require('express');
const router = express.Router();
require('dotenv').config();

const openvidu = new OpenVidu(process.env.OPENVIDU_URL, process.env.OPENVIDU_SECRET);

console.warn('Application server connecting to OpenVidu at ' + process.env.OPENVIDU_URL);

router.post('/openvidu/api/sessions', async (req, res) => {
    const session = await openvidu.createSession(req.body);
    res.send(session.sessionId);
});

router.post('/openvidu/api/sessions/:sessionId/connections', async (req, res) => {
    const session = openvidu.activeSessions.find((s) => s.sessionId === req.params.sessionId);
    if (!session) {
        res.status(404).send();
    } else {
        const connection = await session.createConnection(req.body);
        res.send(connection.token);
    }
});

process.on('uncaughtException', (err) => console.error(err));

module.exports = router;
