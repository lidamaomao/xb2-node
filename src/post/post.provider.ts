/**
 * SQL 查询片段
 */
export const sqlFragment = {
  user: `
      JSON_OBJECT(
        'id', user.id,
        'name', user.name,
        'avatar', IF(COUNT(avatar.id), 1, null)
      ) AS user
    `,

  totalComments: `
  (
    SELECT COUNT(comment.id) FROM comment WHERE comment.postId = post.id
  ) as totalComments
  `,

  file: `
  cast (
    if(
      count(file.id),
      group_concat(
        distinct json_object(
          'id', file.id,
          'width', file.width,
          'height', file.height
        )
      ),
      null
    ) as JSON
  ) as file
  `,
  tags: `
  cast(
    if(
      count(tag.id),
      concat('[',
        group_concat(
          distinct json_object(
            'id', tag.id,
            'name', tag.name
          )
        ), ']'
      ), null
    ) as JSON
  ) as tags
  `,
  totalLikes: `
  (
    SELECT COUNT(user_like_post.postId)
    FROM user_like_post
    WHERE user_like_post.postId = post.id
  ) AS totalLikes
  `,
  leftJoinUser: `
  LEFT JOIN user ON user.id = post.userId
  LEFT JOIN avatar ON user.id = avatar.userId
`,
  leftJoinOneFile: `
  left join lateral (
    select * from file
    where file.postId = post.id
    order by file.id desc
    limit 1
  ) as file on post.id = file.postId
  `,
  leftJoinTag: `
  left join post_tag on post_tag.postId = post.id
  left join tag on post_tag.tagId = tag.id
  `,
  innerJoinUserLikePost: `
  INNER JOIN user_like_post on user_like_post.postId = post.id
  `,
};
