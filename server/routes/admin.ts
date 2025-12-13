import { Router } from 'express'
import * as db from '../db/admin'

const router = Router()

const code = process.env.ADMINCODE

router.put('/:userid', async (req, res) => {
  const id = req.params.userid
  const passcode = req.body.code
  console.log(code)
  if (passcode == code) {
    try {
      const newAdmin = await db.giveAd(id)
      res.sendStatus(200)
      console.log(newAdmin)
    } catch (error) {
      res.status(500).json({ message: 'something went wrong updating admin' })
    }
  } else {
    res.status(500).json({ message: 'code incorrect' })
  }
})

export default router
