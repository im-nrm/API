import fs from "fs";
import path from "path";

class FileUtils {
  constructor() {}

  moveFile = (oldPath: string, newPath: string) => {
    return new Promise<void>((resolve, reject) => {
      fs.rename(oldPath, newPath, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  };

  ensureDirExists = (_path: string) => {
    if (!fs.existsSync(_path)) {
      fs.mkdirSync(_path, { recursive: true }); 
    }
  };
  
  deleteFileIfExists = (filePath: string) => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  };

  deleteFilesIfDontExists = (path: string, filesId: string[]) => {
    try {
      //Obtiene todos los archivos de la carpeta
      const files = fs.readdirSync(path);
      files.forEach((file) => {
        //Por cada archivo, checkea si esta en las ids, o si no es un directorio (los directorios no se borran)
        if (!filesId.includes(file) && !fs.lstatSync(`${path}/${file}`).isDirectory()) {
          fs.unlinkSync(`${path}/${file}`);
        }
      });
    } catch (error) {
      console.log("Error deleting files", error);
      
    }
    
  }

}

export default new FileUtils();


