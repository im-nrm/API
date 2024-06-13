
import * as bcrypt from 'bcrypt'

export const Encrypt = {
    encryptPassword: (password: string) => {
        //TODO: check this password;
        // const hashedpass = hashSync(password, 10);
        //https://www.youtube.com/watch?v=c7mFi209gPg
        return bcrypt.hashSync(password, 10);
    },
    comparePassword: (password: string, BBDDpass: string) =>{
        return bcrypt.compare(password, BBDDpass);
    }
}