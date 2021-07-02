import HozolClient from '../../lib/HozolClient';

declare global {
    // eslint-disable-next-line no-unused-vars
    namespace Express {
        export interface Request {
            client: HozolClient;
        }
    }
}
