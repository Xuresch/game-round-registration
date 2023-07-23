import prisma from '@/lib/prisma'
import Joi from 'joi'
import bcrypt from 'bcryptjs'

const schema = Joi.object({
  username: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().min(8),
  role: Joi.string().valid('temporary', 'normal', 'organizer', 'admin')
})

export default async function handler(req, res) {
  const userId = req.query.id

  if (req.method === 'GET') {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    })
    if (!user) res.status(404).json({ message: 'User not found' })
    else res.json(user)
  } else if (req.method === 'PUT') {
    const result = schema.validate(req.body)
    if (result.error) {
      res.status(400).json({ message: result.error.details[0].message })
      return
    }

    let data = {...req.body}

    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      data.password = hashedPassword
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data,
    })

    res.json(updatedUser)
  } else if (req.method === 'DELETE') {
    const deletedUser = await prisma.user.delete({
      where: { id: Number(userId) },
    })
    res.json(deletedUser)
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}
