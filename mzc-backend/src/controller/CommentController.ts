import { Comment } from "../entity/Comment";
import { getConnection } from "typeorm";
import { Board } from "../entity/Board";
import { User } from "../entity/User";

export class CommentController {
  static addComment = async (req, res) => {
    const { board_id, content, user_id } = req.body;

    const board = await getConnection().getRepository(Board).findOne({ where: { id: board_id } });
    const user = await getConnection().getRepository(User).findOne({ where: { id: user_id } });

    const comment = new Comment();
    comment.content = content;
    comment.board = board;
    comment.user = user;
    await getConnection().getRepository(Comment).save(comment);

    res.send(comment);
  }

  static findAllComment = async (req, res) => {
    const { board_id } = req.query;

    const result = await getConnection().getRepository(Comment).createQueryBuilder('comment')
      .innerJoinAndSelect('comment.board', 'board')
      .innerJoinAndSelect('comment.user', 'user')
      .where('board.id=:board_id', { board_id })
      .getMany()
    console.log(result);
    res.send(result);
  }

  static findOneComment = async (req, res) => {
    const { id } = req.query;

    const comment = await getConnection().getRepository(Comment).findOne({ where: { id } });
    console.log(comment);
    res.send(comment);
  }

  static modifyComment = async (req, res) => {
    const { id, content } = req.body;

    const result = await getConnection().createQueryBuilder().update(Comment)
      .set({ content })
      .where("id = :id", { id })
      .execute();

    res.send(result);
  }

  static removeComment = async (req, res) => {
    const { id } = req.query;

    const result = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(Comment)
      .where("id = :id", { id })
      .execute();

    res.send(result);
  }
}
