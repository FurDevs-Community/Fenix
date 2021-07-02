// Imports
import express from 'express';
import { __prod__ } from './../settings';
import { baseURLHTTP, port } from './../settings';
import apiRouter from './routes/api';
import cors from 'cors';
import HozolClient from '../lib/HozolClient';
import fs from 'fs';
import path from 'path';

/**
 * This function will start the API which is called when the bot starts
 *
 * @param client {HozolClient}
 */
export const api = (client: HozolClient) => {
    const app = express();
    app.use(
        cors({
            origin: __prod__ ? 'https://hozol.xyz' : 'http://localhost:3000',
            credentials: true,
        })
    );
    app.use((req, res, next) => {
        req.client = client;
        next();
    });
    app.use('/api', apiRouter);
    app.get(`/api/totalGuilds`, (req, res) => {
        res.json({ guilds: client.guilds.cache.size });
    });

    // Starts the API On the port specified on the config and an incremented one version for the http
    if (process.env.NODE_ENV === 'production') {
        const privateKey = fs.readFileSync(
            path.join(__dirname, 'cert', 'key.pem'),
            'utf-8'
        );
        const certificate = fs.readFileSync(
            path.join(__dirname, 'cert', 'cert.pem'),
            'utf-8'
        );
        const ca = fs.readFileSync(
            path.join(__dirname, 'cert', 'ca.pem'),
            'utf-8'
        );
        const credentials = {
            key: privateKey,
            cert: certificate,
            ca: ca,
        };
        const https = require('https').createServer(credentials, app);
        https.listen(port, () => {
            console.log('Listening to https://api.hozol.xyz');
        });
    } else {
        app.listen(port);
        client.log(`Listening on ${baseURLHTTP}:${port}`);
    }
};
