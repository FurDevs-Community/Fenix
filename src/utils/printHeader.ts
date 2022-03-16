import FenixClient from '../lib/FenixClient';
import { __production__ } from './constants';

export const printHeader = async (client: FenixClient) => {
    console.log(`######################################################`);
    
    console.log('######################################################');
    console.log(`🚀 Running Version: ${require('../../package.json').version}`);
    console.log(`🧰 Enviroment: ${__production__ ? 'Production' : 'Development'}`);
    console.log(`######################################################`);
};
