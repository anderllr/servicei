//Função modelo para trazer carga padrão

import {db} from '../models';
import {ADMIN_USER, ADMIN_PASSWORD, ADMIN_EMAIL} from './utils';

import {parse as parseOFX} from './ofx';
import fs from 'mz/fs';

export const verifyOfx = () => {

    const ofxString = fs.readFileSync('./src/data/01a09-10-Caixa.ofx','utf8');

    parseOFX(ofxString).then(ofxData => {
        const statementResponse = ofxData.OFX.BANKMSGSRSV1.STMTTRNRS.STMTRS;
        const accountId = statementResponse.BANKACCTFROM.ACCTID;
        const currencyCode = statementResponse.CURDEF;
        const transactionStatement = statementResponse.BANKTRANLIST.STMTTRN;
        console.log('statementResponse: ', statementResponse);
        console.log('accountId: ', accountId);
        console.log('currencyCode: ', currencyCode);
        console.log('transactionStatement: ', transactionStatement);

        // do something...
    });
}

/*
const {User, Frota, GrupoItem} = db;
import dbFrota from './dbFrota';
*/

const {User} = db;

const adminUser = {
  name: 'Administrador do Sistema',
  userName: ADMIN_USER,
  contador: true,
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
};

const existUser = async () => {
  const user = await User.find ({userName: ADMIN_USER });
  return user.length > 0;
};

export const verifyAdmin = async () => {
  // console.log ('Admin User: ', adminUser);
  const exist = await existUser ();
  if (!exist) {
    User (adminUser).save ();
  }
};
/*
const existFrota = async () => {
  const frota = await Frota.find ();
  return frota.length > 0;
};

export const verifyFrota = async () => {
  const exist = await existFrota ();
  if (!exist) {
    dbFrota.map (async frota => {
      await Frota (frota).save ();
    });
  }
};
*/
