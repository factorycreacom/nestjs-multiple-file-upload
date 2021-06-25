import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import * as path from 'path';
import { diskStorage } from 'multer';

const fileExtensionFilter = (req, file, callback) => {
  const ext = path.extname(file.originalname);

  if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
    req.fileValidationError = 'Invalid file type';
    return callback(new Error('Invalid file type'), false);
  } else {
    return callback(null, true);
  }
};

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseInterceptors(
    FilesInterceptor('files', 20, {
      fileFilter: fileExtensionFilter,
      storage: diskStorage({
        destination: './../uploads',
        filename: function (req, file, cb) {
          cb(null, Date.now() + path.extname(file.originalname));
        },
      }),
    }),
  )
  @Post()
  logFiles(@UploadedFiles() images: Array<Express.Multer.File>) {
    console.log(images);
    return;
  }
}
