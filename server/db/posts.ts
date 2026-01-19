import { PostData } from '../../models/post.ts'
import connection from './connection.ts'

const db = connection

// table.increments('id')
// table.string('user_id').references('users.authId')
// table.string('content')
// table.string('title')
// table.string('image')
// table.timestamp('date_added').notNullable().defaultTo(knex.fn.now())
// table.string('title_font')
// table.string('title_size')
// table.string('content_font')
// table.string('content_size')

const postProps = [
  'id',
  'user_id as userId',
  'content',
  'title',
  'image',
  'date_added as dateAdded',
  'title_font as titleFont',
  'title_size as titleSize',
  'content_font as contentFont',
  'content_size as contentSize',
]

export async function getPostsByUserId(userId: string) {
  const result = await db('posts')
    .where('user_id', userId)
    .select(...postProps)
  return result
}

export async function addPost(postData: PostData) {
  const {
    userId,
    content,
    title,
    image,
    dateAdded,
    titleFont,
    titleSize,
    contentFont,
    contentSize,
  } = postData
  const [result] = await db('posts').insert({
    user_id: userId,
    content,
    title,
    image,
    date_added: dateAdded,
    title_font: titleFont,
    title_size: titleSize,
    content_font: contentFont,
    content_size: contentSize,
  })

  return result
}

export async function getPostById(postId: number) {
  const result = await db('posts')
    .where('id', postId)
    .select(...postProps)
    .first()
  return result
}

export async function updatePost(postId: number, postData: PostData) {
  const {
    content,
    title,
    image,
    dateAdded,
    titleFont,
    titleSize,
    contentFont,
    contentSize,
  } = postData
  await db('posts').where('id', postId).update({
    content,
    title,
    image,
    date_added: dateAdded,
    title_font: titleFont,
    title_size: titleSize,
    content_font: contentFont,
    content_size: contentSize,
  })
}

export async function deletePostById(postId: number) {
  return await db('posts').where('id', postId).delete()
}
