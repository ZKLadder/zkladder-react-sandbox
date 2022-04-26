import React from 'react';
import { useQuery, gql } from '@apollo/client';
import Glider from 'react-glider';
import 'glider-js/glider.min.css';
import Card from 'react-bootstrap/Card';
import Loading from '../shared/Loading';
import Error from '../shared/Error';
import style from '../../styles/unauthenticated.module.css';

export const POSTS = gql`
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
  const { loading, error, data } = useQuery(POSTS);

  if (loading) return <Loading />;
  if (error) return <Error text={error.message} />;

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
                    className={style['featured-dao-img']}
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
