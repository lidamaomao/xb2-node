/**
 * SQL 查询片段
 */
export const sqlFragment = {
  leftJoinUser: `
    LEFT JOIN user ON user.id = comment.userId
    LEFT JOIN avatar ON user.id = avatar.userId
    `,
  user: `
    JSON_OBJECT(
        'id', user.id,
        'name', user.name,
        'avatar', IF(COUNT(avatar.id), 1, null)
    ) AS user
    `,
  leftJoinPost: `
    LEFT JOIN post on post.id = comment.postId
    `,
  post: `
    JSON_OBJECT(
        'id', post.id,
        'title', post.title
    ) AS post
    `,
  repliedComment: `
    (
        SELECT JSON_OBJECT (
            'id', repliedComment.id,
            'content', repliedComment.content
        )
        FROM comment repliedComment
        WHERE comment.parentId = repliedComment.id
    ) AS repliedComment
    `,
  totalReplies: `
    (
        SELECT COUNT(reply.id) FROM comment reply
        WHERE reply.parentId = comment.id
    ) AS totalReplies
    `,
};
