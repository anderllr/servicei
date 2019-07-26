import fs from 'fs';
import promisesAll from 'promises-all';
import mkdirp from 'mkdirp';
//import shortid from "shortid";
//import lowdb from "lowdb";
import FileSync from 'lowdb/adapters/FileSync';
import {GraphQLUpload} from 'apollo-upload-server';

const uploadDir = './imgs';
//const db = lowdb(new FileSync("../../db.json"));

// Seed an empty DB
//db.defaults({ uploads: [] }).write();

// Ensure upload directory exists
mkdirp.sync (uploadDir);

const storeFS = ({createReadStream, filename}) => {
  const path = `${uploadDir}/${filename}`;
  return new Promise ((resolve, reject) => {
    var fh = createReadStream (path);
    fh
      .on ('error', error => {
        if (stream.truncated)
          // Delete the truncated file
          fs.unlinkSync (path);
        reject (error);
      })
      .pipe (fs.createWriteStream (path))
      .on ('error', error => reject (error))
      .on ('finish', () => resolve ({path, filename}));
  });
};
/*
const storeDB = file =>
	db
		.get("uploads")
		.push(file)
		.last()
		.write();
*/
const processUpload = async upload => {
  const {createReadStream, filename} = upload;
  const {path} = await storeFS ({
    createReadStream,
    filename,
  });
  //	const sdb = storeDB({ id, filename, mimetype, encoding, path });

  if (path) return {filename, path};
  return null;
};

export default {
  Upload: GraphQLUpload,
  Query: {
    uploads: () => [],
  },
  Mutation: {
    uploadFile: async (
      parent,
      {file, screen, id, fileName},
      {db: {GrupoItem}}
    ) => {
      const {createReadStream, mimetype} = await file;
      const extension = mimetype.split ('/').pop ();

      const filename = fileName ? fileName : `${screen}-${id}.${extension}`;

      const result = processUpload ({createReadStream, filename});
      if (result) {
        if (id) {
          //pois o upload pode ter vindo do app
          //Se o resultado não está nulo vai gravar no banco o nome da imagem
          const grupoItem = await GrupoItem.findById (id);
          await grupoItem.set ({imagem: filename}).save ();
        }
        return result;
      }
      return null;
    },
    multipleUpload: async (obj, {files}) => {
      console.log ('Files Server: ', files);
      const {resolve, reject} = await promisesAll.all (
        files.map (async file => {
          const {createReadStream, filename} = await file;
          return await processUpload ({createReadStream, filename});
        })
      );
      console.log ('Resolve Server: ', resolve);
      console.log ('Reject Server: ', reject);
      if (reject.length)
        reject.forEach (({name, message}) =>
          // eslint-disable-next-line no-console
          console.error (`${name}: ${message}`)
        );

      return resolve;
    },
  },
};
