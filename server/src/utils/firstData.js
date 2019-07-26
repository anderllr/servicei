//Função modelo para trazer carga padrão

import {db} from '../models';
import {ADMIN_PASSWORD, ADMIN_EMAIL} from './utils';

const {User, Frota, GrupoItem} = db;
import dbFrota from './dbFrota';

const adminUser = {
  name: 'Administrador do Sistema',
  userName: 'admin',
  app: true,
  web: true,
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
};

const existUser = async () => {
  const user = await User.find ({userName: 'admin'});
  return user.length > 0;
};

export const verifyAdmin = async () => {
  // console.log ('Admin User: ', adminUser);
  const exist = await existUser ();
  if (!exist) {
    User (adminUser).save ();
  }
};

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
/*
const existFrotaItens = async () => {
	const result = await Frota.aggregate([
		{ $project: { totalGrupos: { $size: "$grupos" } } },
		{ $group: { _id: null, count: { $sum: "$totalGrupos" } } }
	]);
	return result[0].count > 0;
};
*/
