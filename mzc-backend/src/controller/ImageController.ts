import {Image} from "../entity/Image";
import {getConnection} from "typeorm";

export class ImageController {
  static uploadImage = async (req, res) => {
    let image: Image = new Image();
    image.data = req.file.buffer;
    image.original_name = req.file.originalname;
    image.mimetype = req.file.mimetype;

    const result = await getConnection().createQueryBuilder()
      .insert()
      .into(Image)
      .values(image)
      .execute();

    console.log(result);
    res.send({id: result.raw.insertId});
  }

  static viewImage = async (req, res) => {
    const {id} = req.params;
    const db = getConnection()
      .getRepository(Image)
      .createQueryBuilder('image')
      .where('id = :id', {id})
    const image = await db.getOne();

    res.writeHead(200, {
      'Content-Type': image.mimetype,
      'Content-Length': image.data.length
    });

    res.end(image.data);
  }
}