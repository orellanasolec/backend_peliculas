import { Injectable } from '@nestjs/common';

@Injectable()
export class LoginService {
 

  login(usuario: string, password: string) {
    if (usuario=="admin" && password=="clave123"){
        return "hola";
    }else{
        return null
    }
  
  }

  
}
