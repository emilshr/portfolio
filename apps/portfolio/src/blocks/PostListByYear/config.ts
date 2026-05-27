import type { Block } from 'payload'

export const PostListByYearBlock: Block = {
  slug: 'postListByYear',
  interfaceName: 'PostListByYearBlock',
  labels: {
    singular: 'Post List by Year',
    plural: 'Post Lists by Year',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Posts',
    },
  ],
}
