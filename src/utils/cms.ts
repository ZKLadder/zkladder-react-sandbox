import axios from 'axios';
import config from '../config';

const postsQuery = `query getPosts {
  posts {
    id
    postTitle
    postUrl
    publishedAt
    subTitle
    updatedAt
    secondaryImage {
      url
    }
    imageCaption
    fullDescription
    mainImage {
      url
    }
  }
}`;

const getPosts = async () => {
  try {
    const response = await axios.request({
      url: config.cms.url,
      method: 'post',
      data: {
        query: postsQuery,
      },
    });
    return response.data?.data?.posts;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'API error');
  }
};

export { getPosts };
