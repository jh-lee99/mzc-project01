import { Board } from "../entity/Board";
import { getConnection } from "typeorm";
import { User } from "../entity/User";
import { hashSync, compareSync } from 'bcryptjs';
import { Role } from "../entity/Role";
import jwt from 'jsonwebtoken';

export class AuthController {
  static signIn = async (req, res) => {
    const { email, password } = req.body;

    const user = await getConnection().getRepository(User)
      .findOne({ relations: ["roles"], where: { email } });

    if (!user) {
      return res.status(400).send({ message: "User Not found." });
    }

    if (!compareSync(password, user.password)) {
      return res.status(400).send({ message: "Invalid password" });
    }

    // token 생성
    const token = jwt.sign({ jti: user.id, email: user.email, roles: user.roles.map(role => role.name) },
      process.env.secret, {
      subject: user.username,
      algorithm: 'HS512',
      expiresIn: process.env.expirationSecondMs
    });

    res.send({ jwt: token });
  }

  static signUp = async (req, res) => {
    const { email, password, username, roles } = req.body;

    const user = new User();
    user.email = email;
    user.password = hashSync(password, 8);
    user.username = username;

    // 이메일 중복 체크
    const existUser = await getConnection().getRepository(User)
      .findOne({ where: { email } });

    if (existUser) {
      return res.status(400).send({ message: "User Not found." });
    }

    // roels 설정
    user.roles = [];

    if (roles && roles.length > 0) {
      // where a 혹은 b or 조건 [{ name: 'a'}, {name: 'b'}]
      const res = await getConnection().getRepository(Role).find({
        where: roles.map(name => ({ name }))
      })
      user.roles = res;
    } else {
      // 기본 role은 USER
      const res = await getConnection().getRepository(Role).find({
        where: { name: 'ROLE_USER' }
      })
      user.roles = res;
    }

    const result = await getConnection().getRepository(User).save(user);

    res.send(result);
  }
}