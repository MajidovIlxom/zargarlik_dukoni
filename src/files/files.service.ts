import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import *as path from 'path'
import *as uuid from 'uuid'
import *as fs from 'fs'


@Injectable()
export class FilesService {
    async createFile(file: any): Promise<string> {
        try {
            if (!file || !file.buffer) {
                throw new HttpException(
                    'Fayl topilmadi yoki buffer xususiyati mavjud emas',
                    HttpStatus.BAD_REQUEST
                );
            }
    
            const fileName = uuid.v4() + '.jpg';
            const filePath = path.resolve(__dirname, '..', 'static');
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, { recursive: true });
            }
            fs.writeFileSync(path.join(filePath, fileName), file.buffer);
            return fileName;
        } catch (error) {
            throw new HttpException(
                'FILENI YOZISHDA XATOLIK',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
    
}