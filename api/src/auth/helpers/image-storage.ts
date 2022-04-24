import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

import path = require('path');
import { S3 } from 'aws-sdk';

type ValidFileExtension = 'png' | 'jpg';
type ValidMimeType = 'image/png' | 'image/jpeg';

const ValidFileExtensions: ValidFileExtension[] = ['png', 'jpg'];
const ValidMimeTypes: ValidMimeType[] = ['image/png', 'image/jpeg'];

// export const saveImageToStorage = {
//   s3 : new S3(),
//   uploadResult = await s3.upload({
//       Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
//       Body: dataBuffer,
//       Key: `${uuid()}-${filename}`
//     })
//       .promise(),
// storage: diskStorage({
//   destination: './images',
//   filename: (req, file, cb) => {
//     const fileExtension: string = path.extname(file.originalname);
//     const fileName: string = uuidv4() + fileExtension;

//     cb(null, fileName);
//   },
// }),
// fileFilter: (req, file, cb) => {
//   const allowedMineTypes: ValidMimeType[] = ValidMimeTypes;
//   allowedMineTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
// },
// };
// export const saveImageToStorage = {
//   storage: diskStorage({
//     destination: './images',
//     filename: (req, file, cb) => {
//       const fileExtension: string = path.extname(file.originalname);
//       const fileName: string = uuidv4() + fileExtension;

//       cb(null, fileName);
//     },
//   }),
//   fileFilter: (req, file, cb) => {
//     const allowedMineTypes: ValidMimeType[] = ValidMimeTypes;
//     allowedMineTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
//   },
// };

export const savePostImageToStorage = {
  storage: diskStorage({
    destination: './post_images',
    filename: (req, file, cb) => {
      const fileExtension: string = path.extname(file.originalname);
      const fileName: string = uuidv4() + fileExtension;

      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedMineTypes: ValidMimeType[] = ValidMimeTypes;
    allowedMineTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
  },
};
