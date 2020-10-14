import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';

import { Support } from 'src/entities/Support';

import { getConnection } from 'typeorm';

import * as AWS from 'aws-sdk';

import * as camelCaseKeys from 'camelcase-keys';

import * as userAgent from 'useragent';

import { User } from 'src/entities/User';

import * as nodemailer from 'nodemailer';

import { SupportFile } from '../entities/SupportFile';

import { SupportDto } from './dto/sensSupport.dto';
const transporter = nodemailer.createTransport({
  SES: new AWS.SES({ apiVersion: '2010-12-01' }),
});

@Injectable()
export class SupportService {
  logger = new Logger('Support');
  async addSupport(req: any, support: SupportDto, user: User, files) {
    const browser = req.headers['user-agent'];
    const supportId = await this.saveSupport(support, files, browser);
    return await this.sendSupport(
      supportId,
      support.concerned_module,
      support.comment,
      files,
      browser,
      user.email,
      user.id,
      support.contact,
      support.phone_num,
    );
  }
  sendSupport(
    ticketNbr,
    concernedModule,
    comment,
    files,
    browser,
    userEmail,
    userId,
    contact,
    phoneNum,
  ) {
    return Promise.resolve().then(async () => {
      console.log(process.env.MAIL_SOURCE);
      const agent = userAgent.parse(browser);

      return transporter.sendMail(
        {
          from: process.env.MAIL_SOURCE,
          replyTo: userEmail,
          to: process.env.MAIL_TO_ADDRESSES,
          bcc: process.env.MAIL_BCC_ADDRESSES,
          subject: 'Demande Support Health Group',
          text: `
            N° Ticket: ${ticketNbr}
            ID utilisateur: ${userId}
            Email utilisateur: ${userEmail}
            Personne à contacter: ${contact}
            Téléphone: ${phoneNum}
            
            Module concerné: ${concernedModule}
            Message: ${comment}

            Système d'exploitation: ${agent.os.toString()}
            Navigateur :${agent.toAgent()}
          `,
          attachments: files.map(item => ({
            filename: item.originalname,
            path: item.path,
          })),
        },
        (err, info) => {
          if (err) throw new InternalServerErrorException(err);
          console.log(info);
          return info;
        },
      );
    });
  }
  async saveSupport(support: SupportDto, files, browser) {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    console.log('start transaction');
    let supportId: any;
    try {
      const newSupport = {
        ...camelCaseKeys(support),
        browser,
      };
      const supp = await queryRunner.manager.save(Support, newSupport);
      supportId = supp['id'];
      // console.log(newSupport);
      // console.log(test);
      if (files && Array.isArray(files)) {
        const supportFiles = files.map(element => {
          const file = new SupportFile();
          file.supportId = supportId;
          file.urlFile = element.key;
          return file;
        });
        await queryRunner.manager.save(supportFiles);
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      // since we have errors lets rollback the changes we made
      console.log(err);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        'failed to save support details' + err,
      );
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
      return supportId;
    }
  }
}
