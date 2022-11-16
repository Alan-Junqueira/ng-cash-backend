import { User } from "../models"


export const getUserByUsername = async (username: string) => {
  const user = await User.findOne({
    where: {
      username
    }
  })

  return user
}