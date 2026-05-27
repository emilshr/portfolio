import type { Block } from 'payload'

export const PostListBlock: Block = {
  slug: 'postList',
  interfaceName: 'PostListBlock',
  labels: {
    singular: 'Post List',
    plural: 'Post Lists',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Posts',
    },
    {
      name: 'limit',
      type: 'number',
      defaultValue: 5,
      min: 1,
      max: 50,
    },
    {
      name: 'showViewAll',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show "View all posts" link',
    },
  ],
}
