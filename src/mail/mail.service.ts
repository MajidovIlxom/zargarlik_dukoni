import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService ) {}

    async sendUserConfirmation(user: any): Promise<void>{
        const url = `${process.env.API_HOST}/api/user/activate/${user.activation_link}`
        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Here your confirmation mail',
            template: './confirmation',
            context: {
                name: user.first_name,
                url,
            }
        });
    }
    async sendAdminConfirmation(user: any): Promise<void>{
        const url = `${process.env.API_HOST}/api/admin/activate/${user.activation_link}`
        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Here your confirmation mail',
            template: './confirmation',
            context: {
                name: user.fullname,
                url,
            }
        });
    }
}