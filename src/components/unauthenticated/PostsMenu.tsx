import React from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import Glider from 'react-glider';
import 'glider-js/glider.min.css';
import Card from 'react-bootstrap/Card';
import Loading from '../shared/Loading';
import Error from '../shared/Error';
import style from '../../styles/unauthenticated.module.css';

const endpoint = 'https://api-us-east-1.graphcms.com/v2/cl12mkshi8t8s01za53ae9b2y/master';
export const POSTS = `
  {
    postCategories {
      name
      id
      posts(last: 1) {
        title
        id
        subHeadline
        fullDescription
        images {
          fileName
          url
        }
        slug
        text {
          markdown
        }
      }
    }
  }
`;

function PostsMenu() {
  const {
    data,
    isLoading,
    isError,
  } = useQuery('posts', () => axios({
    url: endpoint,
    method: 'POST',
    data: {
      query: POSTS,
    },
  }).then((response) => response.data.data));

  if (isLoading) return <Loading />;
  if (isError) return <Error text="We are sorry, an error has occurred." />;

  return (
    <div className={style['post-menu']}>
      <Glider
        draggable
        hasDots
        slidesToShow={1}
        slidesToScroll={3}
        responsive={[
          {
            breakpoint: 1450,
            settings: {
              slidesToShow: 2,
            },
          },
          {
            breakpoint: 891,
            settings: {
              slidesToShow: 1.5,
            },
          },
        ]}
      >
        {data.postCategories.map((category: any, i: any) => {
          if (i === 0) {
            return (
              <div key={category.id}>
                <p className={style['menu-name']}>{category.name.toUpperCase()}</p>
                <Card className={`bg-dark text-white ${style['featured-post']}`}>
                  <Card.Img
                    className={style['featured-post-img']}
                    src={category.posts[0].images[0].url}
                    alt={category.posts[0].images[0].fileName}
                  />
                  <Card.ImgOverlay>
                    <p id={style['featured-post-sub-head']}>{category.posts[0].subHeadline.toUpperCase()}</p>
                    <div className={style['title-box']}>
                      <span>LEARN MORE</span>
                    </div>
                  </Card.ImgOverlay>
                </Card>
                <div className={style['post-description-box']}>
                  <img
                    className={style['featured-post-secondary-img']}
                    src={category.posts[0].images[1].url}
                    alt={category.posts[0].images[1].fileName}
                  />
                  <div className={style['post-description-text']}>
                    <h4><b>{category.posts[0].title.toUpperCase()}</b></h4>
                    <p>{category.posts[0].fullDescription}</p>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={category.id}>
              <p className={style['menu-name']}>{category.name.toUpperCase()}</p>
              <Card className={`bg-dark text-white ${style.posts}`} id={i + 1}>
                <Card.Img
                  className={style['post-img']}
                  src={category.posts[0].images[0].url}
                  alt={category.posts[0].images[0].fileName}
                />
                <Card.ImgOverlay>
                  <p>{category.posts[0].subHeadline.toUpperCase()}</p>
                  <div className={style['title-box']}>
                    <span>LEARN MORE</span>
                  </div>
                </Card.ImgOverlay>
              </Card>
            </div>
          );
        })}
      </Glider>
    </div>
  );
}

export default PostsMenu;
