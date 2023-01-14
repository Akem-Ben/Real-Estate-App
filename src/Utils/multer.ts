import multer from 'multer'

import {CloudinaryStorage} from 'multer-storage-cloudinary'

const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: "dirr9d0ox",
    api_key: 591515841429849,
    api_secret: "poaA3qnFSUxpsmxFmPwtclhaFfQ"
})

const storage = new CloudinaryStorage ({
    cloudinary,
    params: async(res,file)=>{
        return {
            folder: `ROYALSPRINGESTATE`
        }
    }
})

export const upload = multer({storage:storage})